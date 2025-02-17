import { useState } from 'react'
import { z } from 'zod'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useSearch } from '@tanstack/react-router'
import debounce from 'lodash.debounce'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Main } from '@/components/layout/main'
import OriginField from './components/flights-origin-field'
import FlightsPriceField from './components/flights-price-field'
import { flightService } from './service/flights.service'

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
    passengers: z.number().min(1).max(9),
    tripType: z.enum(['oneWay', 'roundTrip']),
    airClass: z.enum(['economy', 'premium', 'business', 'firstClass']),
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

export const debouncedSearch = debounce((func, value) => func(value), 700)

export default function Flights() {
  const [destHistory, setdestHistory] = useState<Option[]>([])

  const searchParams = useSearch({
    from: '/(public)/flights',
  })

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tripType: 'oneWay',
      airClass: 'economy',
      passengers: 1,
      origin: {
        label: 'Morocco',
        skyId: 'MA',
        entityId: '29475370',
      },
      destination: {
        label: 'Dubai',
        skyId: 'DXB',
        entityId: '95673506',
      },
    },
  })

  const searchMutation = useMutation({
    mutationKey: ['flights.search'],
    mutationFn: (values: FormSchema) => flightService.searchFlights(''),
  })

  const popularRoutes = useQuery({
    queryKey: ['flights.popular'],
    queryFn: flightService.getPopularRoutes,
  })

  const onSubmit = async (values: FormSchema) => {
    searchMutation.mutate(values)
  }

  return (
    <Main>
      <div className='max-w-4xl mx-auto p-6'>
        <Card>
          <CardHeader>
            <CardTitle>Search Flights</CardTitle>
            <pre>{JSON.stringify(form.getValues(), null, 2)}</pre>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4'
              >
                <div className='flex gap-4 w-full'>
                  <FormField
                    control={form.control}
                    name='tripType'
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <FormLabel>Trip type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='oneWay'>One way</SelectItem>
                            <SelectItem value='roundTrip'>Roundrip</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='airClass'
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <FormLabel>Trip type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={'economy'}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='economy'>Economy</SelectItem>
                            <SelectItem value='premium'>Premium</SelectItem>
                            <SelectItem value='business'>Business</SelectItem>
                            <SelectItem value='firstClass'>
                              First Class
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='passengers'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Passengers</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            min={1}
                            max={9}
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <OriginField
                    mkey={'airports.search'}
                    mfunc={flightService.searchAirports}
                    formKey={'origin'}
                  />
                  <OriginField
                    mkey={'airports.search'}
                    mfunc={flightService.searchAirports}
                    formKey={'destination'}
                  />
                </div>

                <div className=''>
                  <FlightsPriceField />
                </div>

                <Button
                  type='submit'
                  className='w-full'
                  disabled={searchMutation.isPending}
                >
                  {searchMutation.isPending ? 'Searching...' : 'Search Flights'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className='mt-8'>
          {searchMutation.isSuccess && searchMutation.data && (
            <div className='space-y-4'>
              <h2 className='text-2xl font-bold'>Search Results</h2>
              {searchMutation.data.map((flight) => (
                <Card key={flight.id}>
                  <CardContent className='p-4'>
                    <div className='flex justify-between items-center'>
                      <div>
                        <p className='font-bold'>{flight.airline}</p>
                        <p>
                          {format(new Date(flight.departureTime), 'PPP p')} -{' '}
                          {format(new Date(flight.arrivalTime), 'PPP p')}
                        </p>
                        <p>
                          {flight.departureAirport.skyId} →{' '}
                          {flight.arrivalAirport.skyId}
                        </p>
                      </div>
                      <div>
                        <p className='text-2xl font-bold'>${flight.price}</p>
                        <Button variant='outline' className='mt-2'>
                          Select
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!searchMutation.data && popularRoutes.isSuccess && (
            <div className='space-y-4'>
              <h2 className='text-2xl font-bold'>Popular Destinations</h2>
              <div className='grid grid-cols-3 gap-4'>
                {popularRoutes.data.map((route, index) => (
                  <Card
                    key={index}
                    className='cursor-pointer hover:shadow-lg transition-shadow'
                  >
                    <CardContent className='p-4'>
                      <p className='font-bold'>
                        {route.destination.presentation.title}
                      </p>
                      <p className='text-sm text-gray-500'>
                        {route.origin.skyId} → {route.destination.skyId}
                      </p>
                      <p className='mt-2 text-lg font-bold'>
                        From ${route.price}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Main>
  )
}
