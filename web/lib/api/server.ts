import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { HabitRecord, PaginatedResponse, Rabbit } from '@/types'

const baseUrl = process.env.COCO_API_URL?.replace(/\/+$/, '')

export async function getAuthenticated<T>(path: string): Promise<T> {
  const token = (await cookies()).get('coco_session')?.value
  if (!token) throw new Error('Sesión no disponible')
  if (!baseUrl) throw new Error('COCO_API_URL no está configurada')
  const response = await fetch(`${baseUrl}/api/${path}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }, cache: 'no-store',
  })
  if (response.status === 401) redirect('/login')
  if (!response.ok) throw new Error(`La API respondió ${response.status}`)
  return response.json() as Promise<T>
}

export async function getDashboardData(): Promise<{ rabbit: Rabbit | null; rabbits: Rabbit[]; records: HabitRecord[] }> {
  const rabbits = await getAuthenticated<Rabbit[]>('rabbits')
  const page = await getAuthenticated<PaginatedResponse<HabitRecord>>('habits?page=0&size=100&sort=recordedAt,desc')
  return { rabbit: rabbits[0] ?? null, rabbits, records: page.content }
}
