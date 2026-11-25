export const PAGES_CONFIG = {
  MAIN: '/',
  ANALYZE: '/analyze',
  VACANCY: (id: string) => `/vacancies/${encodeURIComponent(id)}`,
}
