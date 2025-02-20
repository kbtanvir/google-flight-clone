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
import { FormSchema } from '../hooks/useFeatureQuery'
import { flightService } from '../service/flights.service'

function FlightsPriceCalanderField() {
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
        (form.watch('departureDate') as Date) ?? new Date()
      ),
    enabled: !!form.watch('origin.skyId') && !!form.watch('destination.skyId'),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
  })

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className='flex gap-4 w-full max-sm:flex-col'>
          <div className='flex flex-col gap-1 flex-1'>
            <FormLabel className='pb-2'>Departure Date</FormLabel>
            <Button
              type='button'
              variant='outline'
              className='w-full justify-start text-left'
            >
              <CalendarIcon className='mr-2 h-4 w-4' />
              {form.watch('departureDate')
                ? format(form.watch('departureDate') as Date, 'PPP')
                : 'Select departure date'}
            </Button>
          </div>
          {form.watch('tripType') === 'roundTrip' && (
            <div className='flex flex-col gap-1 flex-1'>
              <FormLabel className='pb-2'>Return Date</FormLabel>
              <Button
                type='button'
                variant='outline'
                className='w-full justify-start text-left'
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {form.watch('returnDate')
                  ? format(form.watch('returnDate')! as Date, 'PPP')
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
            selected={form.watch('departureDate') as Date}
            onSelect={(date) => form.setValue('departureDate', date!)}
            disabled={(date) => date < new Date()}
          />
        ) : (
          <CalendarPrice
            prices={flightPrices.isSuccess ? flightPrices.data.days : []}
            initialFocus
            mode={'range'}
            defaultMonth={form.watch('departureDate') as Date}
            selected={{
              from: form.watch('departureDate') as Date,
              to: form.watch('returnDate') as Date,
            }}
            onSelect={(values) => {
              if (values?.from) form.setValue('departureDate', values?.from)
              if (values?.to) form.setValue('returnDate', values?.to)
            }}
            disabled={(date) => date < new Date()}
            numberOfMonths={2}
          />
        )}
      </PopoverContent>
    </Popover>
  )
}

export default FlightsPriceCalanderField
