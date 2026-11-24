import Icon from '@/components/ui/Icon/Icon'
import type { Vacancy } from '@/shared/types/vacancy.type'
import styles from './Vacancy.module.scss'

export default function VacancyDescription({ vacancy }: { vacancy: Vacancy }) {
  const sections = [
    ['Ключевые навыки', vacancy.skills],
    ['Обязанности', vacancy.duty],
    ['Требования', vacancy.requirements],
    ['Описание', vacancy.description],
  ]

  return (
    <>
      {sections
        .filter(([, text]) => text)
        .map(([title, text]) => (
          <section className={styles.card} key={title}>
            <h2 className={styles.sectionTitle}>{title}</h2>
            <p className={styles.verbatim}>{text}</p>
          </section>
        ))}
      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>Адрес работы</h2>
        {vacancy.addresses.length > 0 ? (
          <ul className={styles.addresses}>
            {vacancy.addresses.map((address) => (
              <li key={address}>
                <Icon name="location" /> {address}
              </li>
            ))}
          </ul>
        ) : (
          <p>Адрес не указан.</p>
        )}
      </section>
    </>
  )
}
