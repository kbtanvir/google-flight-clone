import { createFileRoute } from '@tanstack/react-router'
import Flights from '@/features/flights'

export const Route = createFileRoute('/(public)/flights')({
  component: Flights,
})
