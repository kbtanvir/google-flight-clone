import { useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/(public)/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  useEffect(() => {
    navigate({
      to: '/flights',
    })
  }, [])
}
