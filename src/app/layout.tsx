import type { Metadata } from 'next'
import '../styles/styles.scss'
import { FONT_INTER } from '@/shared/constants/fonts.constant'
import MainThemeProvider from '@/components/providers/MainThemeProvider/MainThemeProvider'
import Header from '@/components/layouts/Header/Header'

export const metadata: Metadata = {
  title: 'Vitality Job',
  description: '',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="ru"
      className={FONT_INTER.variable}
      suppressHydrationWarning={true}
    >
      <body>
        <MainThemeProvider>
          <Header />
          {children}
        </MainThemeProvider>
      </body>
    </html>
  )
}
