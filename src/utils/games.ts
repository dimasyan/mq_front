export const GAMES = [
  {
    id: 36,
    name: 'Ultra Music Mix#36: Все эпохи и жанры',
    shortName: 'Ultra Music Mix#36',
    date: '5 февраля 2026, 19:30',
    venue: 'Avenue',
    address: ' ул. Мынбаева 53'
  },
  {
    id: 37,
    name: 'Ultra Music Mix#37: Rap & RnB',
    shortName: 'Ultra Music Mix#37: Rap & RnB',
    date: '12 февраля 2026, 19:30',
    venue: 'Avenue',
    address: ' ул. Мынбаева 53'
  },
  {
    id: 38,
    name: 'Ultra Music Mix#38: 90е и 00е',
    shortName: 'Ultra Music Mix#38: 90е и 00е',
    date: '19 февраля 2026, 19:30',
    venue: 'Avenue',
    address: ' ул. Мынбаева 53'
  },
  {
    id: 39,
    name: 'Ultra Music Mix#39: Happy Birthday',
    shortName: 'Ultra Music Mix#39: Happy Birthday',
    date: '26 февраля 2026, 19:30',
    venue: 'Avenue',
    address: ' ул. Мынбаева 53'
  },
  {
    id: 40,
    name: 'Ultra Music Mix#40: Rock',
    shortName: 'Ultra Music Mix#40: Rock',
    date: '28 февраля 2026, 17:00',
    venue: 'Avenue',
    address: ' ул. Мынбаева 53'
  },
]

const monthMap: Record<string, number> = {
  января: 0,
  февраля: 1,
  марта: 2,
  апреля: 3,
  мая: 4,
  июня: 5,
  июля: 6,
  августа: 7,
  сентября: 8,
  октября: 9,
  ноября: 10,
  декабря: 11,
}

export function parseRuDate(dateStr: string): Date {
  const [datePart, timePart] = dateStr.split(', ')
  const [day, monthRu, year] = datePart.split(' ')
  const [hours, minutes] = timePart.split(':')

  return new Date(
    Number(year),
    monthMap[monthRu],
    Number(day),
    Number(hours),
    Number(minutes)
  )
}

export function getNearestThursday(from = new Date()): Date {
  const result = new Date(from)
  const day = result.getDay() // Sun=0 ... Thu=4

  const diff = (4 - day + 7) % 7
  result.setDate(result.getDate() + diff)
  result.setHours(23, 59, 59, 999) // include whole day

  return result
}
