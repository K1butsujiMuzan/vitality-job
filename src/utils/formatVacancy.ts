import type { Vacancy } from '@/shared/types/vacancy.type'

const numberFormatter = new Intl.NumberFormat('ru-RU')
const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  dateStyle: 'short',
  timeZone: 'Europe/Kaliningrad',
})
const pluralRules = new Intl.PluralRules('ru-RU')

export const formatNumber = (number: number) => numberFormatter.format(number)
export const formatDate = (date: string) => dateFormatter.format(new Date(date))

export function inflect(number: number, forms: [string, string, string]) {
  const rule = pluralRules.select(number)
  return forms[rule === 'one' ? 0 : rule === 'few' ? 1 : 2]
}

export function formatExperience(years: number) {
  if (years === 0) return 'Без опыта'
  return `${formatNumber(years)} ${inflect(years, ['год', 'года', 'лет'])}`
}

export function formatSalary({
  salaryMin,
  salaryMax,
  salaryText,
  currency,
}: Pick<Vacancy, 'salaryMin' | 'salaryMax' | 'salaryText' | 'currency'>) {
  if (salaryMin === null && salaryMax === null)
    return salaryText || 'Не указана'

  const unit = !currency || /руб|rub|rur/i.test(currency) ? '₽' : currency
  if (salaryMin !== null && salaryMax !== null) {
    if (salaryMin === salaryMax) return `${formatNumber(salaryMin)} ${unit}`
    return `${formatNumber(salaryMin)} – ${formatNumber(salaryMax)} ${unit}`
  }
  return salaryMin !== null
    ? `от ${formatNumber(salaryMin)} ${unit}`
    : `до ${formatNumber(salaryMax!)} ${unit}`
}
