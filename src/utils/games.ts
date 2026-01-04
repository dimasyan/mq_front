export const GAMES = [
  {
    id: 31,
    name: 'Ultra Music Mix#31: Все эпохи и жанры',
    shortName: 'Ultra Music Mix#31',
    date: '8 января 2026, 19:30',
    venue: 'Avenue',
    address: ' ул. Мынбаева 53'
  },
  {
    id: 32,
    name: 'Ultra Music Mix#32: Зарубежная музыка',
    shortName: 'Ultra Music Mix#32',
    date: '15 января 2026, 19:30',
    venue: 'Avenue',
    address: ' ул. Мынбаева 53'
  },
  {
    id: 33,
    name: 'Ultra Music Mix#33: Все эпохи и жанры',
    shortName: 'Ultra Music Mix#33',
    date: '22 января 2026, 19:30',
    venue: 'Avenue',
    address: ' ул. Мынбаева 53'
  },
  {
    id: 34,
    name: 'Ultra Music Mix#34: Rock',
    shortName: 'Ultra Music Mix#34: Rock',
    date: '28 января 2026, 19:30',
    venue: 'Avenue',
    address: ' ул. Мынбаева 53'
  },
  {
    id: 35,
    name: 'Кино и Музыка: KZ и Зарубежное',
    shortName: 'Кино и Музыка: KZ и Зарубежное',
    date: '29 января 2026, 19:30',
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
