import { connection } from 'next/server'
import Vacancy from '@/components/widgets/Vacancy/Vacancy'
import { getVacancy } from '@/services/vacancies/readCatalog'

export async function generateMetadata({
  params,
}: PageProps<'/vacancies/[id]'>) {
  await connection()
  const { id } = await params
  const data = await getVacancy(id).catch(() => null)
  return {
    title: data
      ? `${data.vacancy.title} | VitalityJob`
      : 'Вакансия | VitalityJob',
  }
}

export default Vacancy
