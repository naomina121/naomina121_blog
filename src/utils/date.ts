import moment from 'moment'

const dateToTime = (date: string, format: string = 'YYYY/MM/DD') => {
  const result = moment(date).format(format)
  return result
}

export default dateToTime
