import { deepCopy } from '@utils'

type TParams = {
  classroomInfo: TTimeTable.ClassroomInfo
  isActive: boolean
  setClassrooms: React.Dispatch<
    React.SetStateAction<TTimeTable.ClassroomInfo[]>
  >
  isApplyToAll: boolean
}

export const useTimeTable = ({
  classroomInfo,
  setClassrooms,
  isApplyToAll,
}: TParams) => {
  const assignPeriodNumbers = (parts: TTimeTable.Part[]) => {
    let startPeriod = 0
    return parts.map((part) => {
      const updatedPeriods = part.periods.map((period, idx) => ({
        ...period,
        number: startPeriod + (idx + 1),
      }))
      startPeriod += part.periods.length
      return { ...part, periods: updatedPeriods }
    })
  }

  const updateClassrooms = (updatedData: TTimeTable.ClassroomInfo['data']) => {
    setClassrooms((prev) =>
      prev.map((scheduleItem) => {
        if (isApplyToAll || scheduleItem.location === classroomInfo.location) {
          scheduleItem.data = updatedData
        }
        return scheduleItem
      }),
    )
  }

  const updateParts = (modifyFn: (parts: TTimeTable.Part[]) => void) => {
    const copy = deepCopy(classroomInfo.data)
    modifyFn(copy.parts)
    copy.parts = assignPeriodNumbers(copy.parts)
    updateClassrooms(copy)
  }

  const addPeriod = (partIdx: number) => {
    updateParts((parts) => {
      const target = parts[partIdx]
      if (target.periods.length >= 5) {
        return alert('최대 5개까지 등록 가능합니다.')
      }
      target.periods.push({ start: '', end: '' })
    })
  }

  const updatePeriod = (
    e: React.ChangeEvent<HTMLInputElement>,
    partIdx: number,
    periodIdx: number,
  ) => {
    const value = e.target.value
    const timeType = e.target.dataset.type as 'start' | 'end'
    updateParts((parts) => {
      const target = parts[partIdx]
      target.periods[periodIdx][timeType] = value
    })
  }

  const removePeriod = (partIdx: number, periodIdx: number) => {
    if (!confirm('삭제하시겠습니까?')) return
    updateParts((parts) => {
      const target = parts[partIdx]
      target.periods.splice(periodIdx, 1)
      const nextPart = parts[partIdx + 1]
      const count = target.periods.length
      if (count !== 4 || nextPart?.type !== 'afternoon') return
      const shiftPeriod = nextPart.periods.shift()
      if (shiftPeriod) target.periods.push(shiftPeriod)
    })
  }

  const updateBreakTime = (
    e: React.ChangeEvent<HTMLInputElement>,
    breakTimeIdx: number,
  ) => {
    const value = e.target.value
    const timeType = e.target.dataset.type as 'start' | 'end'
    const copy = deepCopy(classroomInfo.data)
    copy.breakTimes[breakTimeIdx].time[timeType] = value
    updateClassrooms(copy)
  }

  return { addPeriod, updatePeriod, removePeriod, updateBreakTime }
}
