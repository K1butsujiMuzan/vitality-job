import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { connection } from 'next/server'
import { getVacancy } from '@/services/vacancies/readCatalog'
import VacancyPage from './VacancyPage'
import VacancySkeleton from './VacancySkeleton'

type Props = { params: Promise<{ id: string }> }

async function VacancyContent({ params }: Props) {
  await connection()
  const { id } = await params
  const data = await getVacancy(id)
  if (!data) notFound()
  return <VacancyPage data={data} />
}

export default function Vacancy({ params }: Props) {
  return (
    <Suspense fallback={<VacancySkeleton />}>
      <VacancyContent params={params} />
    </Suspense>
  )
}
