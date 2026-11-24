'use client'

import CatalogMessage from '@/components/widgets/Vacancy/CatalogMessage'

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <CatalogMessage title="Не удалось загрузить вакансию" retry={reset} />
}
