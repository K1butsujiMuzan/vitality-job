export const PAGES_CONFIG = {
  MAIN: '/',
  VACANCY: (id: string) => `/vacancies/${encodeURIComponent(id)}`,
}
