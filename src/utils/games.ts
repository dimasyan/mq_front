export const GAMES = [
  {
    id: 55,
    name: 'Ultra Music Mix#55: Все эпохи и жанры',
    shortName: 'Ultra Music Mix#55: Все эпохи и жанры',
    date: '7 мая 2026, 19:30',
    venue: 'Avenue',
    address: ' ул. Мынбаева 53'
  },
  {
    id: 56,
    name: 'Ultra Music Mix#56: 2000e и 2010е',
    shortName: 'Ultra Music Mix#56: 2000e и 2010е',
    date: '14 мая 2026, 19:30',
    venue: 'Avenue',
    address: ' ул. Мынбаева 53'
  },
  {
    id: 57,
    name: 'Ultra Music Mix#57: Rap & RnB',
    shortName: 'Ultra Music Mix#57: Rap & RnB',
    date: '17 мая 2026, 17:00',
    venue: 'Avenue',
    address: ' ул. Мынбаева 53'
  },
  {
    id: 58,
    name: 'Ultra Music Mix#58: Все эпохи и жанры',
    shortName: 'Ultra Music Mix#58: Все эпохи и жанры',
    date: '21 мая 2026, 19:30',
    venue: 'Avenue',
    address: ' ул. Мынбаева 53'
  },
  {
    id: 1,
    name: 'LINKIN PARK',
    shortName: 'LINKIN PARK ',
    date: '23 мая 2026, 17:00',
    venue: 'Avenue',
    address: ' ул. Мынбаева 53'
  },
  {
    id: 59,
    name: 'Ultra Music Mix#59: Rock',
    shortName: 'Ultra Music Mix#59: Rock',
    date: '27 мая 2026, 17:00',
    venue: 'Avenue',
    address: ' ул. Мынбаева 53'
  },
  {
    id: 5,
    name: 'Кино и Музыка#5',
    shortName: 'Кино и Музыка#5',
    date: '31 мая 2026, 17:00',
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
