import { format } from 'date-fns'
import { useFormContext } from 'react-hook-form'
import { useQuery } from '@tanstack/react-query'
import { CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CalendarPrice } from '@/components/ui/calander-price'
import { FormLabel } from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { FormSchema } from '..'
import { flightService } from '../service/flights.service'

function FlightsPriceField() {
  const form = useFormContext<FormSchema>()

  const flightPrices = useQuery({
    queryKey: [
      'flights.prices',
      form.watch('origin.skyId'),
      form.watch('destination.skyId'),
    ],
    queryFn: () =>
      flightService.getPriceCalendar(
        form.watch('origin.skyId'),
        form.watch('destination.skyId'),
        form.watch('departureDate') ?? new Date()
      ),
    enabled: !!form.watch('origin.skyId') && !!form.watch('destination.skyId'),
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: true, // Refetch on component mount
    refetchOnReconnect: true, // Refetch when internet reconnects
  })

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className='grid grid-cols-2 gap-4'>
          <div className='flex flex-col gap-1'>
            <FormLabel className='pb-2'>Departure Date</FormLabel>
            <Button
              type='button'
              variant='outline'
              className='w-full justify-start text-left'
            >
              <CalendarIcon className='mr-2 h-4 w-4' />
              {form.watch('departureDate')
                ? format(form.watch('departureDate'), 'PPP')
                : 'Select departure date'}
            </Button>
          </div>
          {form.watch('tripType') === 'roundTrip' && (
            <div className='flex flex-col gap-1'>
              <FormLabel className='pb-2'>Return Date</FormLabel>
              <Button
                type='button'
                variant='outline'
                className='w-full justify-start text-left'
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {form.watch('returnDate')
                  ? format(form.watch('returnDate')!, 'PPP')
                  : 'Select return Date'}
              </Button>
            </div>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0'>
        {form.watch('tripType') === 'oneWay' ? (
          <CalendarPrice
            prices={flightPrices.isSuccess ? flightPrices.data.days : []}
            mode='single'
            selected={form.watch('departureDate')}
            onSelect={(date) => form.setValue('departureDate', date!)}
            disabled={(date) => date < new Date()}
          />
        ) : (
          <CalendarPrice
            prices={flightPrices.isSuccess ? flightPrices.data.days : []}
            initialFocus
            mode={'range'}
            defaultMonth={form.watch('departureDate')}
            selected={{
              from: form.watch('departureDate'),
              to: form.watch('returnDate'),
            }}
            onSelect={(values) => {
              form.setValue('departureDate', values?.from!)
              form.setValue('returnDate', values?.to!)
            }}
            disabled={(date) => date < new Date()}
            numberOfMonths={2}
          />
        )}
      </PopoverContent>
    </Popover>
  )
}

export default FlightsPriceField
