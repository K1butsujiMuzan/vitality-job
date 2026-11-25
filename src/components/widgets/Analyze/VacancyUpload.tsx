'use client'

import { useMutation } from '@tanstack/react-query'
import { useId, useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button/Button'
import Icon from '@/components/ui/Icon/Icon'
import { analyzeUpload } from '@/services/analysis/uploadAnalysisApi'
import { UPLOAD_CONFIG } from '@/shared/configs/upload.config'
import UploadResult from './UploadResult'
import styles from './Analyze.module.scss'

export default function VacancyUpload() {
  const inputId = useId()
  const hintId = useId()
  const [file, setFile] = useState<File | null>(null)
  const { mutate, reset, data, isPending, error } = useMutation({
    mutationFn: analyzeUpload,
  })

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (file && !isPending) mutate(file)
  }

  return (
    <>
      <form className={styles.form} onSubmit={submit} aria-busy={isPending}>
        <label htmlFor={inputId}>Файл с вакансией</label>
        <p className={styles.hint} id={hintId}>
          Подойдёт исходный JSON одной вакансии или сохранённый отчёт
          VitalityJob по вакансии. До {UPLOAD_CONFIG.MAX_FILE_KIB} КБ.
        </p>
        <div className={styles.controls}>
          <input
            className={styles.file}
            id={inputId}
            type="file"
            accept=".json,application/json"
            aria-describedby={hintId}
            required
            disabled={isPending}
            onChange={(event) => {
              setFile(event.currentTarget.files?.[0] ?? null)
              reset()
            }}
          />
          <Button type="submit" disabled={!file || isPending}>
            <Icon name="upload" size={18} /> Проанализировать
          </Button>
        </div>
      </form>
      {isPending && (
        <p role="status" className={styles.status}>
          Анализируем вакансию…
        </p>
      )}
      {error && (
        <p role="alert" className={styles.status}>
          {error.message}
        </p>
      )}
      {data && <UploadResult data={data} />}
    </>
  )
}
