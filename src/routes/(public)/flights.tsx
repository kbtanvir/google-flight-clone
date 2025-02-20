import { createFileRoute } from '@tanstack/react-router'
import Flights from '@/features/flights'
import { flightSearchSchema } from '@/features/flights/hooks/useFeatureQuery'

export const Route = createFileRoute('/(public)/flights')({
  component: Flights,
  validateSearch: (search) => flightSearchSchema.partial().parse(search),
})
