import { objectValue } from '@/services/trudvsem/sourceFields'

export function uploadVacancyFields(raw: Record<string, unknown>) {
  const requirement = objectValue(raw.requirement)
  const education = requirement.education ?? raw.education
  const experience = requirement.experience ?? raw.experience
  const aliases = {
    id: raw.id ?? raw.vacancyId,
    'job-name':
      raw['job-name'] ??
      raw.title ??
      raw.jobName ??
      raw.vacancyName ??
      raw.name,
    description: raw.description ?? raw.vacancyDescription,
    duty: raw.duty ?? raw.duties,
    salary_min: raw.salary_min ?? raw.salaryMin ?? raw.salaryFrom,
    salary_max: raw.salary_max ?? raw.salaryMax ?? raw.salaryTo,
    salary: raw.salary ?? raw.salaryText,
    schedule: raw.schedule ?? raw.workSchedule,
    employment: raw.employment ?? raw.employmentType,
    employer:
      raw.employer ??
      raw.companyName ??
      (typeof raw.company === 'string' ? raw.company : undefined),
    addresses: Array.isArray(raw.addresses)
      ? { address: raw.addresses }
      : raw.addresses,
    requirement:
      education != null || experience != null
        ? { ...requirement, education, experience }
        : raw.requirement,
  }
  return {
    ...raw,
    ...Object.fromEntries(
      Object.entries(aliases).filter(([, value]) => value != null),
    ),
  }
}
