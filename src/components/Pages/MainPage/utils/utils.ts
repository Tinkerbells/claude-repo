import { DEFAULT_STATE } from '../../../../consts/globalConsts'

export function formatDate(dateStr: unknown) {
  if (typeof dateStr !== 'string') {
    return DEFAULT_STATE.STRING
  }

  const date = new Date(dateStr)

  const formattedDate = date
    .toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
    .replace(/,/g, '')

  return formattedDate
}

export function getCurrentTimeISO() {
  const now = new Date()
  return now.toISOString().replace('Z', '')
}
