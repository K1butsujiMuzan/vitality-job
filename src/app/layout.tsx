import type { Metadata } from 'next'
import '../styles/styles.scss'
import { FONT_INTER } from '@/shared/constants/fonts.constant'

export const metadata: Metadata = {
  title: 'Vitality Job',
  description: '',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="ru" className={FONT_INTER.variable}>
      <body>{children}</body>
    </html>
  )
}
