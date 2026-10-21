export interface Reminder {
  id: string
  title: string
  detail: string
  time: string
  enabled: boolean
}

/** Local demo preferences; no push notification service is connected. */
export const MOCK_REMINDERS: Reminder[] = [
  { id: 'food', title: 'Revisar alimentación', detail: 'Anota la ración de la mañana', time: '08:00', enabled: true },
  { id: 'water', title: 'Revisar agua', detail: 'Comprueba el bebedero', time: '12:00', enabled: true },
  { id: 'evening', title: 'Resumen del día', detail: 'Completa las observaciones pendientes', time: '19:00', enabled: false },
]
