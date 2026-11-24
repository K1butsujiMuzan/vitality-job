import Icon, { type IconName } from '@/components/ui/Icon/Icon'
import type { Vacancy } from '@/shared/types/vacancy.type'
import {
  formatDate,
  formatExperience,
  formatNumber,
  formatSalary,
} from '@/utils/formatVacancy'
import styles from './Vacancy.module.scss'

export default function VacancyFacts({ vacancy }: { vacancy: Vacancy }) {
  const { experience, workPlaces } = vacancy
  const facts: [IconName, string, string | null][] = [
    ['location', 'Регион', vacancy.region],
    ['education', 'Образование', vacancy.education],
    ['salary', 'Зарплата', formatSalary(vacancy)],
    [
      'experience',
      'Опыт работы',
      experience === null ? null : formatExperience(experience),
    ],
    ['person', 'Занятость', vacancy.employment],
    [
      'people',
      'Рабочие места',
      workPlaces === null ? null : formatNumber(workPlaces),
    ],
    ['calendar', 'График работы', vacancy.schedule],
    ['shield', 'Условия труда', vacancy.conditions],
    ['category', 'Категория', vacancy.category],
    ['bonus', 'Премия', vacancy.bonus],
    [
      'clock',
      'Обновлено',
      vacancy.updatedAt ? formatDate(vacancy.updatedAt) : null,
    ],
  ]

  return (
    <dl className={styles.facts} aria-label="Основные условия">
      {facts
        .filter(
          ([, label, value]) =>
            value || ['Регион', 'Занятость', 'График работы'].includes(label),
        )
        .map(([icon, label, value]) => (
          <div key={label} className={styles.fact}>
            <Icon name={icon} />
            <div>
              <dt>{label}</dt>
              <dd>{value ?? 'Не указано'}</dd>
            </div>
          </div>
        ))}
    </dl>
  )
}
