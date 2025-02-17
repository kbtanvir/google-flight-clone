import { z } from 'zod'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
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
import useFeatureQuery from './hooks/useFeatureQuery'
import { flightService } from './service/flights.service'
import FlightList from './components/flights-list'

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
  const navigate = useNavigate({
    from: '/flights',
  })

  const { searchFlights } = useFeatureQuery()

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tripType: 'oneWay',
      airClass: 'economy',
      passengers: 1,
      origin: {
        label: 'Agadir (AGA)',
        skyId: 'AGA',
        entityId: '95673640',
      },
      destination: {
        label: 'London Heathrow (LHR)',
        skyId: 'LHR',
        entityId: '95565050',
      },
      departureDate: new Date(
        format(new Date('2025-02-17T18:00:00.000Z'), 'yyyy-MM-dd')
      ),
    },
  })

  const onSubmit = async (values: FormSchema) => {
    navigate({
      to: '/flights',
      search: (params) => ({
        ...params,
        originSkyId: values.origin.skyId,
        destinationSkyId: values.destination.skyId,
        originEntityId: values.origin.entityId,
        destinationEntityId: values.destination.entityId,
        cabinClass: values.airClass,
        adults: values.passengers,
        date: format(values.departureDate, 'yyyy-MM-dd'),
        // returnDate:
        //   values.returnDate ?? format(values.returnDate!, 'yyyy-MM-dd'),
        sortBy: 'best',
        currency: 'USD',
        market: 'en-US',
        countryCode: 'US',
      }),
    })
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
                  disabled={searchFlights.isPending}
                >
                  {searchFlights.isPending ? 'Searching...' : 'Search Flights'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <FlightList />
      </div>
    </Main>
  )
}
