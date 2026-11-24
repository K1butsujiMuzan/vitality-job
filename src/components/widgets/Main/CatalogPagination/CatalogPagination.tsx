import Link from 'next/link'
import type { MouseEvent } from 'react'
import { PAGES_CONFIG } from '@/shared/configs/pages.config'
import {
  getCatalogUrl,
  type CatalogQuery,
} from '@/services/vacancies/catalogQuery'
import styles from './CatalogPagination.module.scss'

export default function CatalogPagination({
  query,
  page,
  pageCount,
  onPage,
}: {
  query: CatalogQuery
  page: number
  pageCount: number
  onPage: (query: CatalogQuery) => void
}) {
  const pages = [
    ...new Set([1, page - 2, page - 1, page, page + 1, page + 2, pageCount]),
  ]
    .filter((number) => number >= 1 && number <= pageCount)
    .sort((a, b) => a - b)

  function select(event: MouseEvent<HTMLAnchorElement>, number: number) {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return
    event.preventDefault()
    onPage({ ...query, page: number })
    document
      .getElementById('catalog-results')
      ?.scrollIntoView({ block: 'start' })
  }

  return (
    <nav className={styles.nav} aria-label="Страницы вакансий">
      <ul className={styles.list}>
        {pages.map((number, index) => (
          <li key={number} className={styles.item}>
            {index > 0 && number - pages[index - 1] > 1 && (
              <span className={styles.gap} aria-hidden="true">
                …
              </span>
            )}
            {number === page ? (
              <span
                className={styles.current}
                aria-current="page"
                aria-label={`Страница ${page}`}
              >
                {page}
              </span>
            ) : (
              <Link
                className={styles.link}
                prefetch={false}
                href={getCatalogUrl(PAGES_CONFIG.MAIN, {
                  ...query,
                  page: number,
                })}
                aria-label={`Страница ${number}`}
                onClick={(event) => select(event, number)}
              >
                {number}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}
