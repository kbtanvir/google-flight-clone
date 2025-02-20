import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMatch, useNavigate, useSearch } from '@tanstack/react-router'
import { flightService } from '../service/flights.service'

export const flightSearchSchema = z.object({
  origin: z.object({
    label: z.string().default('New York'),
    skyId: z.string().min(3).default('JFK'),
    entityId: z.string().min(8).default('NYC-123456'),
  }),
  destination: z.object({
    label: z.string().default('Los Angeles'),
    skyId: z.string().min(3).default('LAX'),
    entityId: z.string().min(8).default('LAX-123456'),
  }),
  departureDate: z
    .date({
      required_error: 'Departure date is required',
    })
    .or(z.string()),
  returnDate: z.date().or(z.string()).optional(),
  adults: z.number().min(1).max(9).default(1),
  tripType: z.enum(['oneWay', 'roundTrip']).default('oneWay'),
  cabinClass: z
    .enum(['economy', 'premium_economy', 'business', 'first'])
    .default('economy'),
})

export type FormSchema = z.infer<typeof flightSearchSchema>
export type Option = { label: string; skyId: string; entityId: string }

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
      ...searchParams,
      tripType: searchParams.tripType ?? 'oneWay',
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
      adults: searchParams.adults ?? 1,
    },
  })

  const onSubmit = async (values: FormSchema) => {
    navigate({
      to: '/flights',
      search: () => values,
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
