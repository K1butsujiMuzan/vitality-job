import type { Metadata } from 'next'
import Analyze from '@/components/widgets/Analyze/Analyze'

export const metadata: Metadata = { title: 'Проверка JSON | VitalityJob' }

export default function AnalyzePage() {
  return <Analyze />
}
