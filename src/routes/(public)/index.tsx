import { useEffect } from 'react'
import { addDays, format } from 'date-fns'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/(public)/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate({
    from: '/',
  })
  useEffect(() => {
    navigate({
      to: '/flights',
      // Router types want Date; we pass an ISO string. validateSearch coerces it.
      search: (() => ({
        departureDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
      })) as never,
    })
  }, [])
}
