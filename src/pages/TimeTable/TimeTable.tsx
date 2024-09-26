import { useEffect, useState } from 'react'
import { ToggleButton } from '@components'
import { TimetableItem } from './TimetableItem'

export const Timetable = () => {
  const [classrooms, setClassrooms] = useState<TTimeTable.ClassroomInfo[]>([
    { location: '2A-1 (201~)' },
    { location: '3B-1 (301~)' },
    { location: '2A-2 (401~)' },
  ])
  const [selected, setSelected] = useState<number>(0)
  const [isApplyToAll, setIsApplyToAll] = useState<boolean>(false)

  const applyToAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setClassrooms((prev) =>
        prev.map((el) => ({
          ...el,
          data: prev[selected].data,
        })),
      )
      alert('모든 교실에 동일한 시간표가 적용됩니다.')
    }
    setIsApplyToAll(e.target.checked)
  }

  useEffect(() => {
    setClassrooms((prev) =>
      prev.map((el) => ({
        ...el,
        data: {
          breakTimes: [
            { name: '점심식사', type: 'lunch', time: { start: '', end: '' } },
            { name: '저녁식사', type: 'dinner', time: { start: '', end: '' } },
          ],
          parts: [
            { name: '오전', range: '~12:00', type: 'morning', periods: [] },
            { name: '오후', range: '13:00~', type: 'afternoon', periods: [] },
            { name: '저녁', range: '19:00~', type: 'evening', periods: [] },
          ],
        },
      })),
    )
  }, [])

  return (
    <main id="timetable" className="container">
      <header>
        <nav>
          <ul>
            {classrooms.map((schedule, idx) => (
              <li
                key={idx}
                className={selected === idx ? 'active' : ''}
                onClick={() => setSelected(idx)}
              >
                {schedule.location}
              </li>
            ))}
          </ul>
        </nav>
        <div className="btn_apply_to_all_wrap">
          <ToggleButton checked={isApplyToAll} onChange={applyToAll} />
          모든 교실 동일 시간표 적용
        </div>
      </header>

      <section className="timetable_wrap mt_12">
        {classrooms.map((classroomInfo, idx) => (
          <TimetableItem
            key={idx}
            isActive={selected === idx}
            classroomInfo={classroomInfo}
            setClassrooms={setClassrooms}
            isApplyToAll={isApplyToAll}
          />
        ))}
      </section>
    </main>
  )
}
