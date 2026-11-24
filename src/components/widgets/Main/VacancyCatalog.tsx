'use client'

import { Button } from '@/components/ui/Button/Button'
import Icon from '@/components/ui/Icon/Icon'
import { formatDate, formatNumber, inflect } from '@/utils/formatVacancy'
import CatalogCards from './CatalogCards/CatalogCards'
import CatalogPagination from './CatalogPagination/CatalogPagination'
import CatalogPending from './CatalogPending'
import CatalogSearch from './CatalogSearch/CatalogSearch'
import { useVacancyCatalog } from './useVacancyCatalog'
import styles from './Main.module.scss'

export default function VacancyCatalog() {
  const { query, applyQuery, data, isPending, isError, refetch } =
    useVacancyCatalog()

  return (
    <>
      <CatalogSearch query={query} onSearch={applyQuery} />
      <div
        id="catalog-results"
        className={styles.results}
        aria-busy={isPending}
      >
        {isPending && <CatalogPending />}
        {isError && !data && (
          <div className={styles.empty} role="alert">
            <p>Не удалось загрузить каталог.</p>
            <Button variant="neutral" onClick={() => void refetch()}>
              Повторить
            </Button>
          </div>
        )}
        {data && (
          <>
            {data.status.mode === 'demo' && (
              <p className={styles.note}>
                Демонстрационный каталог на учебных данных
              </p>
            )}
            {data.status.failedAt && (
              <p className={styles.note} role="status">
                {data.status.updatedAt
                  ? 'Последнее обновление не удалось. Показан сохранённый отчёт.'
                  : 'Вакансии пока не удалось загрузить.'}
              </p>
            )}
            {isError && (
              <p className={styles.note} role="status">
                Не удалось обновить данные каталога.
              </p>
            )}
            <p className={styles.count} role="status">
              Найдено {formatNumber(data.total)}{' '}
              {inflect(data.total, ['вакансия', 'вакансии', 'вакансий'])}
            </p>
            {data.vacancies.length > 0 ? (
              <CatalogCards vacancies={data.vacancies} />
            ) : (
              <div className={styles.empty}>
                <p>
                  {data.status.mode === 'unconfigured'
                    ? 'Источник вакансий ещё не подключён.'
                    : data.status.updatedAt
                      ? 'По заданным условиям вакансии не найдены.'
                      : 'Первый отчёт ещё не сформирован.'}
                </p>
                {data.status.updatedAt &&
                  (query.q || query.minSalary || query.issues !== 'all') && (
                    <Button
                      variant="neutral"
                      onClick={() =>
                        applyQuery({
                          q: '',
                          page: 1,
                          minSalary: null,
                          issues: 'all',
                        })
                      }
                    >
                      Сбросить поиск
                    </Button>
                  )}
              </div>
            )}
            {data.pageCount > 1 && (
              <CatalogPagination
                page={data.page}
                pageCount={data.pageCount}
                query={query}
                onPage={applyQuery}
              />
            )}
            {data.status.updatedAt && (
              <div className={styles.footer}>
                {data.status.mode === 'live' && (
                  <span>
                    Источник{' '}
                    <a href="https://trudvsem.ru/">«Работа в России»</a> ·{' '}
                    {formatDate(data.status.updatedAt)}
                  </span>
                )}
                <a href="/api/reports" download>
                  <Icon name="download" size={17} /> Скачать отчёт JSON
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
