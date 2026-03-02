export const GAMES = [
  {
    id: 41,
    name: 'Ultra Music Mix#41: Зарубежная Музыка',
    shortName: 'Ultra Music Mix#41: Зарубежная Музыка',
    date: '5 марта 2026, 19:30',
    venue: 'Avenue',
    address: ' ул. Мынбаева 53'
  },
  {
    id: 42,
    name: 'Ultra Music Mix#42: Все эпохи и жанры',
    shortName: 'Ultra Music Mix#42',
    date: '12 марта 2026, 19:30',
    venue: 'Avenue',
    address: ' ул. Мынбаева 53'
  },
  {
    id: 3,
    name: 'Кино и Музыка#3',
    shortName: 'Кино и Музыка#3',
    date: '14 марта 2026, 17:00',
    venue: 'Avenue',
    address: ' ул. Мынбаева 53'
  },
  {
    id: 43,
    name: 'Ultra Music Mix#43: KZ и Зарубежка',
    shortName: 'Ultra Music Mix#43: KZ и Зарубежка',
    date: '19 марта 2026, 19:30',
    venue: 'Avenue',
    address: ' ул. Мынбаева 53'
  },
  {
    id: 44,
    name: 'Ultra Music Mix#44: Rap & RnB',
    shortName: 'Ultra Music Mix#44: Rap & RnB',
    date: '25 марта 2026, 19:30',
    venue: 'Avenue',
    address: ' ул. Мынбаева 53'
  },
  {
    id: 45,
    name: 'Ultra Music Mix#45: Все эпохи и жанры',
    shortName: 'Ultra Music Mix#45: Все эпохи и жанры',
    date: '26 марта 2026, 19:30',
    venue: 'Avenue',
    address: ' ул. Мынбаева 53'
  },
  {
    id: 46,
    name: 'Ultra Music Mix#46: Rock',
    shortName: 'Ultra Music Mix#46: Rock',
    date: '28 марта 2026, 17:00',
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
