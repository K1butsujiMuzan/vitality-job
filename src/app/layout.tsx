import type { Metadata } from 'next'
import '../styles/styles.scss'
import { FONT_INTER } from '@/shared/constants/fonts.constant'
import MainThemeProvider from '@/components/providers/MainThemeProvider/MainThemeProvider'
import QueryProvider from '@/components/providers/QueryProvider/QueryProvider'
import Header from '@/components/layouts/Header/Header'

export const metadata: Metadata = {
  title: 'VitalityJob',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="ru"
      className={FONT_INTER.variable}
      data-scroll-behavior="smooth"
      suppressHydrationWarning={true}
    >
      <body>
        <MainThemeProvider>
          <Header />
          <QueryProvider>{children}</QueryProvider>
        </MainThemeProvider>
      </body>
    </html>
  )
}
