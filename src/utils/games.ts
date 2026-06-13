export const GAMES = [
  {
    id: 62,
    name: 'Ultra Music Mix#62 \n KZ и Зарубежка',
    shortName: 'Ultra Music Mix#62 \n KZ и Зарубежка',
    date: '18 июня 2026, 19:30',
    venue: 'Avenue',
    address: ' ул. Мынбаева 53'
  },
  {
    id: 1,
    name: 'Izzy Mix#1: Зарубежный Рок',
    shortName: 'Izzy Mix#1: Зарубежный Рок',
    date: '19 июня 2026, 19:30',
    venue: 'Avenue',
    address: ' ул. Мынбаева 53'
  },
  {
    id: 63,
    name: 'Ultra Music Mix#63: Rap & RnB Зарубежка',
    shortName: 'Ultra Music Mix#63: Rap & RnB Зарубежка',
    date: '21 июня 2026, 17:00',
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
