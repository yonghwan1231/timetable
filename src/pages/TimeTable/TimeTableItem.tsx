import { useTimeTable } from '@hooks'

type OwnProps = {
  classroomInfo: TTimeTable.ClassroomInfo
  isActive: boolean
  setClassrooms: React.Dispatch<
    React.SetStateAction<TTimeTable.ClassroomInfo[]>
  >
  isApplyToAll: boolean
}

export const TimeTableItem = (props: OwnProps) => {
  const { addPeriod, updatePeriod, removePeriod, updateBreakTime } =
    useTimeTable(props)
  const { classroomInfo, isActive } = props

  if (isActive)
    return (
      <>
        <div className="breaktime_wrap">
          {classroomInfo?.data?.breakTimes.map((breakTime, breakTimeIdx) => (
            <dl key={breakTimeIdx}>
              <dt>{breakTime.name}</dt>
              <dd>
                {['start', 'end'].map((type, idx) => (
                  <>
                    {idx ? ' - ' : ''}
                    <input
                      type="time"
                      value={
                        breakTime.time[type as keyof typeof breakTime.time]
                      }
                      onChange={(e) => updateBreakTime(e, breakTimeIdx)}
                      data-type={type}
                    />
                  </>
                ))}
              </dd>
            </dl>
          ))}
        </div>

        {classroomInfo?.data?.parts.map((part, partIdx) => (
          <div key={partIdx} className="part_wrap">
            <h3>
              {part.name}({part.range})
            </h3>
            <ul>
              {part.periods.map((period, periodIdx) => (
                <li key={periodIdx}>
                  <dl>
                    <dt>{period.number}교시 </dt>
                    <dd>
                      {['start', 'end'].map((type, idx) => (
                        <>
                          {idx ? ' - ' : ''}
                          <input
                            type="time"
                            data-type={type}
                            value={period[type as keyof typeof period]}
                            onChange={(e) =>
                              updatePeriod(e, partIdx, periodIdx)
                            }
                          />
                        </>
                      ))}
                    </dd>
                    <dd>
                      <button
                        className="btn_del"
                        onClick={() => removePeriod(partIdx, periodIdx)}
                      >
                        삭제
                      </button>
                    </dd>
                  </dl>
                </li>
              ))}
            </ul>
            <button className="btn_add" onClick={() => addPeriod(partIdx)}>
              + {part.name} 교시 추가
            </button>
          </div>
        ))}
      </>
    )
}
