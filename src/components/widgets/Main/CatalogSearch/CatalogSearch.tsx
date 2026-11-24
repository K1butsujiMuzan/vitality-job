import { useId, useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button/Button'
import Icon from '@/components/ui/Icon/Icon'
import Select from '@/components/ui/Select/Select'
import {
  ISSUE_FILTERS,
  readCatalogQuery,
  type CatalogQuery,
} from '@/services/vacancies/catalogQuery'
import { VACANCIES_CONFIG } from '@/shared/configs/vacancies.config'
import styles from './CatalogSearch.module.scss'

export default function CatalogSearch({
  query,
  onSearch,
}: {
  query: CatalogQuery
  onSearch: (query: CatalogQuery) => void
}) {
  const [isOpen, setIsOpen] = useState(
    Boolean(query.minSalary || query.issues !== 'all'),
  )
  const filterId = useId()
  const inputId = useId()

  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const { q } = readCatalogQuery(
      new URLSearchParams({ q: String(form.get('q') ?? '') }),
    )
    onSearch({ ...query, q, page: 1 })
  }

  function applyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    onSearch(
      readCatalogQuery(
        new URLSearchParams([
          ['q', query.q],
          ['minSalary', String(form.get('minSalary') ?? '')],
          ['issues', String(form.get('issues') ?? '')],
        ]),
      ),
    )
  }

  return (
    <>
      <form role="search" className={styles.bar} onSubmit={search}>
        <label className={styles.field} htmlFor={inputId}>
          <Icon name="search" />
          <span className="visually-hidden">Поиск вакансий</span>
          <input
            key={query.q}
            id={inputId}
            type="search"
            name="q"
            defaultValue={query.q}
            maxLength={VACANCIES_CONFIG.QUERY_LENGTH}
            placeholder="Должность, компания или ключевые слова"
          />
        </label>
        <Button
          type="button"
          variant={
            query.minSalary || query.issues !== 'all' ? 'outline' : 'neutral'
          }
          aria-expanded={isOpen}
          aria-controls={filterId}
          onClick={() => setIsOpen((open) => !open)}
        >
          <Icon name="filter" size={18} /> Фильтры
        </Button>
        <Button type="submit" className={styles.submit}>
          Найти
        </Button>
      </form>

      <form
        className={styles.filters}
        id={filterId}
        hidden={!isOpen}
        onSubmit={applyFilters}
      >
        <label className={styles.filter}>
          Зарплата от, ₽
          <input
            key={query.minSalary}
            type="number"
            name="minSalary"
            min={0}
            max={VACANCIES_CONFIG.MIN_SALARY_LIMIT}
            defaultValue={query.minSalary ?? ''}
            inputMode="numeric"
            placeholder="Любая"
          />
        </label>
        <label className={styles.filter}>
          Замечания
          <Select key={query.issues} name="issues" defaultValue={query.issues}>
            {Object.entries(ISSUE_FILTERS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </label>
        <div className={styles.filterActions}>
          <Button type="submit">Применить фильтры</Button>
          <Button
            variant="neutral"
            type="button"
            onClick={(event) => {
              event.currentTarget.form?.reset()
              onSearch({ ...query, page: 1, minSalary: null, issues: 'all' })
            }}
          >
            Сбросить
          </Button>
        </div>
      </form>
    </>
  )
}
