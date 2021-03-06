import moment, { Moment } from 'moment'

import { IWeekSchedule, IAppointmentHour } from '../types'

const getAppointmentHours = (date: Moment, schedule: IWeekSchedule, appointedDates: Date[]) => {
  const weekday = date.weekday()
  const today = date.isSame(new Date(), 'day')

  const formatDate = (date: Date | Moment) => moment(date).format('DD.MM.YYYY')
  const formatTime = (date?: Date | Moment) => parseInt(moment(date).format('HHmm'))

  const getCurrentDaySchedule = (weekday: number, schedule: IWeekSchedule) => {
    switch(weekday) {
      case 0:
        return schedule.monday!
      case 1:
        return schedule.tuesday!
      case 2:
        return schedule.wednesday!
      case 3:
        return schedule.thursday!
      case 4:
        return schedule.friday!
      case 5:
        return schedule.saturday!
      case 6:
        return schedule.sunday!
      default:
        return {
          start: '00:00',
          end: '23:30'
        }
    }
  }

  const currentDaySchedule = getCurrentDaySchedule(weekday, schedule)
  const appointedTimes = appointedDates
    .filter(appointedDate => formatDate(appointedDate) === formatDate(date))
    .map(time => formatTime(time))

  return Array(24)
    .fill(0)
    .map((_, index) => index)
    .reduce((acc: IAppointmentHour[], hour) => {
      const create = (hour: number, minutes: number) => {
        const time = moment({ hour, minutes })
        return {
          label: time.format('HH:mm'),
          appointed: appointedTimes.includes(formatTime(time))
        }
      }

      const check = (label: string) => {
        const current = Number(`${label.replace(':', '')}`)
        const getValue = (str: 'start' | 'end') => Number(currentDaySchedule[str].replace(':', ''))
        const min = getValue('start')
        const max = getValue('end')
        const now = formatTime()
        return current >= min && (current < max || !max) && !(today && current <= now)
      }

      const whole = create(hour, 0)
      const half = create(hour, 30)

      const result = []
      check(whole.label) && result.push(whole)
      check(half.label) && result.push(half)

      return [...acc, ...result]
    }, [])
}

export default getAppointmentHours