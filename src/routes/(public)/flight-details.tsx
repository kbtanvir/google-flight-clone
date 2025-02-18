import { createFileRoute } from '@tanstack/react-router'
import FlightDetails from '@/features/flights/components/flight-details'

export const Route = createFileRoute('/(public)/flight-details')({
  component: FlightDetails,
})
