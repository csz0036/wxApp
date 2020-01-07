
// 格式化时间
export const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  const weekday = date.getDay()

  return {
    year,
    month,
    day,
    hour,
    minute,
    second,
    weekday,
  }
}
// 格式化 YYYY/MM/DD
export const formatYMDLocal = date => {
  const time = formatTime(date)
  return [time.year, time.month, time.day].map(formatNumber).join('/')
}
// 格式化 YYYY-MM-DD
export const formatYMD = date => {
  const time = formatTime(date)
  return [time.year, time.month, time.day].map(formatNumber).join('-')
}
// 格式化 hh:mm:ss
export const formatHMS = date => {
  const time = formatTime(date)
  return [time.hour, time.minute, time.second].map(formatNumber).join(':')
}
// 格式化 hh:mm
export const formatHM = date => {
  const time = formatTime(date)
  return [time.hour, time.minute].map(formatNumber).join(':')
}

// 格式化 YYYY-MM-DD hh:mm
export const formatWithoutSecond = date => {
  const time = formatTime(date)
  return [time.year, time.month, time.day].map(formatNumber).join('-') + ' ' + [time.hour, time.minute].map(formatNumber).join(':')
}

// 格式化 YYYY-MM-DD hh:mm:ss
export const formatFull = date => {
  const time = formatTime(date)
  return [time.year, time.month, time.day].map(formatNumber).join('-') + ' ' + [time.hour, time.minute, time.second].map(formatNumber).join(':')
}
// 格式化 MM-DD hh:mm
export const formatMDhm = date => {
  const time = formatTime(date)
  return [time.month, time.day].map(formatNumber).join('-') + ' ' + [time.hour, time.minute].map(formatNumber).join(':')
}
// 格式化 MM月DD日
export const formatMD = date => {
  const time = formatTime(date)
  return [time.month].map(formatNumber) + '月' + [time.day].map(formatNumber) + '日'
}
// 格式化 MM-DD
export const formatMD2 = date => {
  const time = formatTime(date)
  return [time.month].map(formatNumber) + '-' + [time.day].map(formatNumber)
}
// 格式化 YYYY.MM.DD
export const formatYMDPoint = date => {
  const time = formatTime(date)
  return [time.year, time.month, time.day].map(formatNumber).join('.')
}
// 格式化 YYYY.MM.DD hh:mm
export const formatYMDHMPoint = date => {
  const time = formatTime(date)
  return [time.year, time.month, time.day].map(formatNumber).join('.') + ' ' + [time.hour, time.minute].map(formatNumber).join(':')
}
// 格式化 MM.DD hh:mm
export const formatMDHM = date => {
  const time = formatTime(date)
  return [time.month].map(formatNumber) + '.' + [time.day].map(formatNumber) + ' ' + [time.hour, time.minute].map(formatNumber).join(':')
}
export const formatWeekday = date => {
  const time = formatTime(date)
  let weekday = ''
  switch (time.weekday) {
    case 0: weekday = '周日'
      break
    case 1: weekday = '周一'
      break
    case 2: weekday = '周二'
      break
    case 3: weekday = '周三'
      break
    case 4: weekday = '周四'
      break
    case 5: weekday = '周五'
      break
    case 6: weekday = '周六'
      break
    default:
      break
  }
  time.weekday = weekday
  return time
}
export const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 获取开始时间
export const getBeginTime = (date, serverTime) => {
  let tomorrow = new Date(new Date(serverTime * 1).getTime() + 86400000)
  tomorrow.setHours(0)
  tomorrow.setMinutes(0)
  tomorrow.setSeconds(0)
  let dayTime = tomorrow.getTime()
  let msg = ''
  let time = formatTime(new Date(date * 1))
  if(dayTime > date){
    msg = '今日' + [time.hour, time.minute].map(formatNumber).join(':') + '开启'
  }else if(dayTime < date && dayTime + 86400000 > date){
    msg = '明日' + [time.hour, time.minute].map(formatNumber).join(':') + '开启'
  }else{
    msg = '即将开启'
  }
  return msg
}
