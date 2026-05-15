import { z } from 'zod'
import { addDays } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMatch, useNavigate, useSearch } from '@tanstack/react-router'
import { flightService } from '../service/flights.service'

// Schema used by the form layer. Dates are real Date objects here; URL strings
// are coerced via z.coerce when this schema parses search params.
export const flightSearchSchema = z.object({
  origin: z.object({
    label: z.string().default('Austin-Bergstrom (AUS)'),
    skyId: z.string().min(3).default('AUS'),
    entityId: z.string().min(2).default('95673643'),
  }),
  destination: z.object({
    label: z.string().default('New York John F. Kennedy (JFK)'),
    skyId: z.string().min(3).default('JFK'),
    entityId: z.string().min(2).default('95565058'),
  }),
  departureDate: z.coerce.date({ required_error: 'Departure date is required' }),
  returnDate: z.coerce.date().optional(),
  adults: z.coerce.number().min(1).max(9).default(1),
  tripType: z.enum(['oneWay', 'roundTrip']).default('oneWay'),
  cabinClass: z
    .enum(['economy', 'premium_economy', 'business', 'first'])
    .default('economy'),
})

export type FormSchema = z.infer<typeof flightSearchSchema>
export type Option = { label: string; skyId: string; entityId: string }

// Convert form values (Date objects) to URL-safe search params (ISO strings).
const toUrlSearch = (v: FormSchema) => ({
  ...v,
  departureDate:
    v.departureDate instanceof Date ? v.departureDate.toISOString() : v.departureDate,
  returnDate:
    v.returnDate instanceof Date ? v.returnDate.toISOString() : v.returnDate,
})

function useFeatureQuery() {
  const navigate = useNavigate({
    from: '/flights',
  })
  const searchParams = useSearch({
    from: '/(public)/flights',
  })

  const flightsMatch = useMatch({
    from: '/(public)/flights',
    shouldThrow: false,
  })

  const searchFlightsQuery = useQuery({
    queryKey: ['flights.search', searchParams],
    queryFn: () => flightService.searchFlights(searchParams as FormSchema),
    enabled: !!flightsMatch,
  })

  const getFlightDetails = useMutation({
    mutationKey: ['flights.search'],
    mutationFn: flightService.getFlightDetails,
  })

  const form = useForm<FormSchema>({
    resolver: zodResolver(
      flightSearchSchema.refine(
        (data) => {
          if (data.tripType === 'roundTrip' && !data.returnDate) {
            return false
          }
          if (data.returnDate && data.returnDate < data.departureDate) {
            return false
          }
          return true
        },
        {
          message: 'Return date must be after departure date',
          path: ['returnDate'],
        }
      )
    ),
    defaultValues: {
      tripType: searchParams.tripType ?? 'oneWay',
      cabinClass: searchParams.cabinClass ?? 'economy',
      adults:
        typeof searchParams.adults === 'string'
          ? Number(searchParams.adults)
          : (searchParams.adults ?? 1),
      departureDate: searchParams.departureDate
        ? new Date(searchParams.departureDate as unknown as string)
        : addDays(new Date(), 1),
      returnDate: searchParams.returnDate
        ? new Date(searchParams.returnDate as unknown as string)
        : undefined,
      origin: searchParams.origin ?? {
        label: 'Austin-Bergstrom (AUS)',
        skyId: 'AUS',
        entityId: '95673643',
      },
      destination: searchParams.destination ?? {
        label: 'New York John F. Kennedy (JFK)',
        skyId: 'JFK',
        entityId: '95565058',
      },
    },
  })

  const onSubmit = async (values: FormSchema) => {
    navigate({
      to: '/flights',
      // Router types want Date, but we serialize to ISO strings for clean URLs.
      // validateSearch on the route re-coerces strings back to Date on read.
      search: (() => toUrlSearch(values)) as never,
    })

    searchFlightsQuery.refetch()
  }

  return {
    searchFlightsQuery,
    getFlightDetails,
    form,
    onSubmit,
    navigate,
  }
}

export default useFeatureQuery
