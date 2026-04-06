export const GAMES = [
  {
    id: 48,
    name: 'Ultra Music Mix#48: Зарубежная музыка',
    shortName: 'Ultra Music Mix#48: Зарубежная музыка',
    date: '9 апреля 2026, 19:30',
    venue: 'Avenue',
    address: ' ул. Мынбаева 53'
  },
  {
    id: 49,
    name: 'Ultra Music Mix#49: Rap vs Rock',
    shortName: 'Ultra Music Mix#49: Rap vs Rock',
    date: '11 апреля 2026, 17:00',
    venue: 'Avenue',
    address: ' ул. Мынбаева 53'
  },
  {
    id: 50,
    name: 'Ultra Music Mix#50: Все эпохи и жанры',
    shortName: 'Ultra Music Mix#50: Все эпохи и жанры',
    date: '16 апреля 2026, 19:30',
    venue: 'Avenue',
    address: ' ул. Мынбаева 53'
  },
  {
    id: 51,
    name: 'Ultra Music Mix#51: Rap и RnB',
    shortName: 'Ultra Music Mix#51: Rap и RnB',
    date: '18 апреля 2026, 17:00',
    venue: 'Avenue',
    address: ' ул. Мынбаева 53'
  },
  {
    id: 52,
    name: 'Кино и Музыка #4',
    shortName: 'Кино и Музыка #4',
    date: '23 апреля 2026, 19:30',
    venue: 'Avenue',
    address: ' ул. Мынбаева 53'
  },
  {
    id: 53,
    name: 'Ultra Music Mix#52: Rock',
    shortName: 'Ultra Music Mix#52: Rock',
    date: '26 апреля 2026, 16:30',
    venue: 'Avenue',
    address: ' ул. Мынбаева 53'
  },
  {
    id: 54,
    name: 'Ultra Music Mix#53: Все эпохи и жанры',
    shortName: 'Ultra Music Mix#53: Все эпохи и жанры',
    date: '30 апреля 2026, 19:30',
    venue: 'Avenue',
    address: ' ул. Мынбаева 53'
  },
  {
    id: 55,
    name: 'Ultra Music Mix#54: KZ и Зарубежка',
    shortName: 'Ultra Music Mix#54: KZ и Зарубежка',
    date: '2 мая 2026, 17:00',
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
