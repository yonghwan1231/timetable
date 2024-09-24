declare namespace TTimeTable {
  type ClassroomInfo = {
    location: string
    data?: {
      breakTimes: BreakTime[]
      parts: Part[]
    }
  }

  type BreakTime = {
    name: string
    type: 'lunch' | 'dinner'
    time: {
      start: string
      end: string
    }
  }

  type Part = {
    name: string
    range: string
    type: 'morning' | 'afternoon' | 'evening'
    periods: Period[]
  }

  type Period = {
    start: string
    end: string
    number?: number
  }
}
