import localFont from 'next/font/local'

export const FONT_INTER = localFont({
  variable: '--font-inter',
  src: [
    {
      path: '../../../public/fonts/inter-regular.woff2',
      style: 'normal',
      weight: '400',
    },
    {
      path: '../../../public/fonts/inter-medium.woff2',
      style: 'normal',
      weight: '500',
    },
    {
      path: '../../../public/fonts/font-semibold.woff2',
      style: 'normal',
      weight: '600',
    },
    {
      path: '../../../public/fonts/inter-bold.woff2',
      style: 'normal',
      weight: '700',
    },
  ],
  display: 'swap',
})
