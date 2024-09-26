import { deepCopy } from '@utils'

type TParams = {
  classroomInfo: TTimeTable.ClassroomInfo
  isActive: boolean
  setClassrooms: React.Dispatch<
    React.SetStateAction<TTimeTable.ClassroomInfo[]>
  >
  isApplyToAll: boolean
}

const messages = {
  0: '시작시간은 종료시간보다 늦을 수 없습니다.',
  1: '시작시간은 이전 교시의 종료시간보다 이를 수 없습니다.',
  2: '종료시간은 시작시간보다 이를 수 없습니다.',
  3: '종료시간은 다음 교시의 시작시간보다 늦을 수 없습니다.',
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
      const currPart = parts[partIdx]
      if (currPart.periods.length >= 5) {
        return alert('최대 5개까지 등록 가능합니다.')
      }
      let setTime = { start: '00:00', end: '00:00' }
      for (let i = partIdx; i >= 0; i--) {
        if (parts[i].periods.length > 0) {
          const lastPeriod = [...parts[i].periods].pop()
          const { end } = lastPeriod as { end: string }
          setTime = { start: end, end }
          break
        }
      }
      currPart.periods.push(setTime)
    })
  }

  const flattenPeriods = () => {
    if (!classroomInfo.data?.parts) return []
    const periods = classroomInfo.data.parts.map((part) => part.periods)
    return periods.flat()
  }

  const updatePeriod = (
    e: React.ChangeEvent<HTMLInputElement>,
    partIdx: number,
    periodIdx: number,
  ) => {
    const value = e.target.value
    const timeType = e.target.dataset.type as 'start' | 'end'
    updateParts((parts) => {
      const currPart = parts[partIdx]
      const currPeriod = currPart.periods[periodIdx]
      const allPeriods = flattenPeriods()
      const currPeriodIdx = allPeriods.findIndex(
        ({ number }) => number === currPeriod.number,
      )
      const prevPeriod = allPeriods[currPeriodIdx - 1]
      const nextPeriod = allPeriods[currPeriodIdx + 1]
      const startAfterEnd = value > currPeriod.end
      const startBeforePrevEnd = prevPeriod && value < prevPeriod.end
      const endBeforeStart = value < currPeriod.start
      const endAfterNextStart = nextPeriod && value > nextPeriod.start
      switch (timeType) {
        case 'start': {
          if (startAfterEnd) return alert(messages['0'])
          if (startBeforePrevEnd) return alert(messages['1'])
          break
        }
        case 'end': {
          if (endBeforeStart) return alert(messages['2'])
          if (endAfterNextStart) return alert(messages['3'])
          break
        }
      }
      currPeriod[timeType] = value
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
