import { authenticate } from '@/lib/auth/proxy'
export const POST = (request: Request) => authenticate(request, 'register')
