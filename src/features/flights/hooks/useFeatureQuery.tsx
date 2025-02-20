import { z } from 'zod'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { useMatch, useNavigate, useSearch } from '@tanstack/react-router'
import { FlightData, flightService } from '../service/flights.service'

const formSchema = z
  .object({
    origin: z.object({
      label: z.string(),
      skyId: z.string().min(3),
      entityId: z.string().min(8),
    }),
    destination: z.object({
      label: z.string(),
      skyId: z.string().min(3),
      entityId: z.string().min(8),
    }),
    departureDate: z.date({
      required_error: 'Departure date is required',
    }),
    returnDate: z.date().optional(),
    adults: z.number().min(1).max(9),
    tripType: z.enum(['oneWay', 'roundTrip']),
    cabinClass: z.enum(['economy', 'premium_economy', 'business', 'first']),
  })
  .refine(
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

export type FormSchema = z.infer<typeof formSchema>
export type Option = { label: string; skyId: string; entityId: string }

function useFeatureQuery() {
  const navigate = useNavigate({
    from: '/flights',
  })
  const searchParams: any = useSearch({
    from: '/(public)/flights',
  })

  const flightsMatch = useMatch({
    from: '/(public)/flights',
    shouldThrow: false,
  })

  const searchFlightsQuery = useQuery({
    queryKey: ['flights.search', searchParams],
    queryFn: () =>
      flightService.searchFlights(new URLSearchParams(searchParams).toString()),
    enabled: !!flightsMatch,
  })

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tripType: searchParams.tripType ?? 'oneWay',
      cabinClass: searchParams.cabinClass ?? 'economy',
      adults: searchParams.adults ?? 1,
      origin: {
        label: searchParams.originLabel ?? 'Agadir (AGA)',
        skyId: searchParams.origin?.skyId ?? 'AGA',
        entityId: searchParams.origin?.entityId ?? '95673640',
      },
      destination: {
        label: searchParams.destinationLabel ?? 'London Heathrow (LHR)',
        skyId: searchParams.destination?.skyId ?? 'LHR',
        entityId: searchParams.destination?.entityId ?? '95565050',
      },
      departureDate: searchParams.date
        ? new Date(format(searchParams.date, 'yyyy-MM-dd'))
        : new Date(format(new Date(), 'yyyy-MM-dd')),
      returnDate: searchParams.returnDate
        ? new Date(format(searchParams.returnDate, 'yyyy-MM-dd'))
        : new Date(format(new Date(), 'yyyy-MM-dd')),
    },
  })

  const onSubmit = async (values: FormSchema) => {
    navigate({
      to: '/flights',
      search: (params) => {
        const newParams: any = {
          // ...params,
          tripType: values.tripType,
          originLabel: values.origin.label,
          originSkyId: values.origin.skyId,
          destinationSkyId: values.destination.skyId,
          destinationLabel: values.destination.label,
          originEntityId: values.origin.entityId,
          destinationEntityId: values.destination.entityId,
          cabinClass: values.cabinClass,
          adults: values.adults,
          date: format(new Date(values.departureDate), 'yyyy-MM-dd'),
          sortBy: 'best',
          currency: 'USD',
          market: 'en-US',
          countryCode: 'US',
        }

        if (values.tripType === 'roundTrip') {
          newParams.returnDate = format(
            new Date(values.returnDate!),
            'yyyy-MM-dd'
          )
        }
        return newParams
      },
    })

    searchFlightsQuery.refetch()
  }

  return {
    searchFlightsQuery,
    form,
    onSubmit,
    navigate,
  }
}

export default useFeatureQuery
