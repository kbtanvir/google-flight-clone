import { useState } from 'react'
import { z } from 'zod'
import { format } from 'date-fns'
import { useForm, useFormContext } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useSearch } from '@tanstack/react-router'
import debounce from 'lodash.debounce'
import { Calendar as CalendarIcon, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { CalendarPrice } from '@/components/ui/calander-price'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Main } from '@/components/layout/main'
import { FlightService } from './service/flights.service'

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

type FormSchema = z.infer<typeof formSchema>
type Option = { label: string; skyId: string; entityId: string }

const flightService = new FlightService()
const debouncedSearch = debounce((func, value) => func(value), 700)

function OriginField() {
  const [showOption, setshowOption] = useState(false)
  const form = useFormContext<FormSchema>()
  const [searchResults, setSearchResults] = useState<Option[]>([
    {
      label: 'Malaga',
      skyId: 'AGP',
      entityId: '95565095',
    },
    {
      label: 'Malaysia',
      skyId: 'MY',
      entityId: '29475325',
    },
    {
      label: 'Malatya',
      skyId: 'MLX',
      entityId: '128667482',
    },
    {
      label: 'Malacca',
      skyId: 'MKZ',
      entityId: '95673457',
    },
    {
      label: 'Malang',
      skyId: 'MLG',
      entityId: '95673406',
    },
    {
      label: 'Mala Mala',
      skyId: 'AAM',
      entityId: '129055248',
    },
    {
      label: 'Malabo',
      skyId: 'SSG',
      entityId: '99539630',
    },
    {
      label: 'Malawi',
      skyId: 'MW',
      entityId: '29475265',
    },
  ])

  const searchOriginMutation = useMutation({
    mutationKey: ['flights.search'],
    mutationFn: flightService.searchAirports,
    onSuccess(data) {
      const options = data.map((item) => ({
        label: item.presentation.title,
        skyId: item.skyId,
        entityId: item.entityId,
      }))
      setSearchResults(options)
    },
  })

  const handleSearchChange = (value: string) => {
    form.setValue('origin', { ...form.getValues('origin'), label: value })

    if (value.trim()) {
      debouncedSearch(() => {
        setshowOption(true)
        return searchOriginMutation.mutate(value)
      }, value)
    } else {
      setshowOption(false)
    }
  }

  const handleSelect = (option: Option) => {
    form.setValue('origin', option)
    setshowOption(false)
  }

  return (
    <FormField
      control={form.control}
      name='origin'
      render={({ field }) => (
        <FormItem className=' '>
          <FormLabel>Origin</FormLabel>
          <Popover open={showOption}>
            <FormControl>
              <PopoverTrigger>
                <Input onFocus={() => setshowOption(false)} onChange={(e) => handleSearchChange(e.target.value)} value={form.watch('origin')?.label} placeholder='origin' />
              </PopoverTrigger>
            </FormControl>
            {
              <PopoverContent onInteractOutside={() => setshowOption(false)} className='z-1 p-0   h-auto'>
                <Command className='w-full'>
                  <CommandList>
                    <CommandGroup className=''>
                      {searchResults.map((option) => (
                        <CommandItem key={option.entityId} value={option.entityId} onSelect={() => handleSelect(option)}>
                          {option.label}
                          <Check className={cn('ml-auto', option.entityId === field.value?.entityId ? 'opacity-100' : 'opacity-0')} />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    <CommandEmpty>No origin found.</CommandEmpty>
                  </CommandList>
                </Command>
              </PopoverContent>
            }
          </Popover>
        </FormItem>
      )}
    />
  )
}

export default function Flights() {
  const [destHistory, setdestHistory] = useState<Option[]>([])

  const searchParams = useSearch({
    from: '/(public)/flights',
  })

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tripType: 'oneWay',
      passengers: 1,
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
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                <div className='flex gap-4 w-full'>
                  <FormField
                    control={form.control}
                    name='tripType'
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <FormLabel>Trip type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                        <Select onValueChange={field.onChange} defaultValue={'economy'}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='economy'>Economy</SelectItem>
                            <SelectItem value='premium'>Premium</SelectItem>
                            <SelectItem value='business'>Business</SelectItem>
                            <SelectItem value='firstClass'>First Class</SelectItem>
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
                          <Input type='number' min={1} max={9} {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <OriginField />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='departureDate'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Departure Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant='outline' className='w-full justify-start text-left'>
                              <CalendarIcon className='mr-2 h-4 w-4' />
                              {field.value ? format(field.value, 'PPP') : 'Select date'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className='w-auto p-0'>
                            <CalendarPrice mode='single' selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date()} />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch('tripType') === 'roundTrip' && (
                    <FormField
                      control={form.control}
                      name='returnDate'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Return Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant='outline' className='w-full justify-start text-left'>
                                <CalendarIcon className='mr-2 h-4 w-4' />
                                {field.value ? format(field.value, 'PPP') : 'Select date'}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className='w-auto p-0'>
                              <CalendarPrice mode='single' selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date() || date < form.getValues('departureDate')} />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                <Button type='submit' className='w-full' disabled={searchMutation.isPending}>
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
                          {format(new Date(flight.departureTime), 'PPP p')} - {format(new Date(flight.arrivalTime), 'PPP p')}
                        </p>
                        <p>
                          {flight.departureAirport.skyId} → {flight.arrivalAirport.skyId}
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
                  <Card key={index} className='cursor-pointer hover:shadow-lg transition-shadow'>
                    <CardContent className='p-4'>
                      <p className='font-bold'>{route.destination.presentation.title}</p>
                      <p className='text-sm text-gray-500'>
                        {route.origin.skyId} → {route.destination.skyId}
                      </p>
                      <p className='mt-2 text-lg font-bold'>From ${route.price}</p>
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
