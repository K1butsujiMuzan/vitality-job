import type { Evidence } from '@/shared/types/analysis.type'
import { formatExperience } from '@/utils/formatVacancy'

const FIELD_LABELS = new Map([
  ['job-name', 'Название должности'],
  ['title', 'Название должности'],
  ['duty', 'Обязанности'],
  ['responsibilities', 'Обязанности'],
  ['requirements', 'Требования к кандидату'],
  ['qualification', 'Квалификация'],
  ['requirement.education', 'Образование'],
  ['requirement.qualification', 'Квалификация'],
  ['requirement.experience', 'Опыт работы'],
  ['medicalDocuments', 'Медицинские документы'],
  ['skills', 'Навыки'],
  ['salary', 'Зарплата'],
  ['salary_min', 'Минимальная зарплата'],
  ['salary_max', 'Максимальная зарплата'],
  ['currency', 'Валюта'],
  ['term.text', 'Премия'],
  ['schedule', 'График работы'],
  ['shift', 'Смены'],
  ['region.name', 'Регион'],
  ['region', 'Регион'],
  ['addresses.address', 'Адрес работы'],
  ['address', 'Адрес работы'],
  ['workplace', 'Место работы'],
  ['employment', 'Занятость'],
  ['employment_type', 'Тип занятости'],
  ['contract_type', 'Вид договора'],
  ['description', 'Описание вакансии'],
  ['conditions', 'Условия труда'],
  ['benefitDetails', 'Льготы и компенсации'],
])

export function formatEvidence({ field, quote }: Evidence) {
  const path = field.replace(/\[\d+]/g, '')
  const label =
    FIELD_LABELS.get(path) ??
    [...FIELD_LABELS].find(([key]) => path.startsWith(key + '.'))?.[1] ??
    'Сведения из вакансии'

  if (path === 'requirement.experience' && /^\d+$/.test(quote)) {
    const years = Number(quote)
    if (Number.isSafeInteger(years)) {
      return { label, value: formatExperience(years), quoted: false }
    }
  }

  return {
    label,
    value: quote || 'Сведения отсутствуют',
    quoted: Boolean(quote),
  }
}
