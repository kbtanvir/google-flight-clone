import { createLazyFileRoute } from '@tanstack/react-router'
import Sites from '@/features/sites'

export const Route = createLazyFileRoute('/_authenticated/sites/')({
  component: Sites,
})
