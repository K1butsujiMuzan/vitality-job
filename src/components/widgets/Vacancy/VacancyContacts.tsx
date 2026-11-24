import Icon from '@/components/ui/Icon/Icon'
import type { Vacancy } from '@/shared/types/vacancy.type'
import styles from './Vacancy.module.scss'

export default function VacancyContacts({ vacancy }: { vacancy: Vacancy }) {
  return (
    <section className={styles.card}>
      <h2 className={styles.sectionTitle}>Контакты</h2>
      {!vacancy.contactPerson && !vacancy.contacts.length ? (
        <p>Работодатель не указал контакты.</p>
      ) : (
        <dl className={styles.contacts}>
          {vacancy.contactPerson && (
            <div className={styles.fact}>
              <Icon name="person" />
              <div>
                <dt>Контактное лицо</dt>
                <dd>{vacancy.contactPerson}</dd>
              </div>
            </div>
          )}
          {vacancy.contacts.map(({ label, value }, index) => {
            const isPhone = /телефон/i.test(label)
            const isEmail = /почта|e-?mail/i.test(label)
            const phone = value.replace(/[^+\d]/g, '')
            const href =
              isPhone && /^\+?\d{5,15}$/.test(phone)
                ? `tel:${phone}`
                : isEmail && /^[^\s@?&:]+@[^\s@?&:]+\.[^\s@?&:]+$/.test(value)
                  ? `mailto:${encodeURI(value)}`
                  : null

            return (
              <div className={styles.fact} key={`${label}-${index}`}>
                <Icon name={isPhone ? 'phone' : isEmail ? 'mail' : 'person'} />
                <div>
                  <dt>{label}</dt>
                  <dd>{href ? <a href={href}>{value}</a> : value}</dd>
                </div>
              </div>
            )
          })}
        </dl>
      )}
    </section>
  )
}
