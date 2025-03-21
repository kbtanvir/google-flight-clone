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
import FlightList from './components/flights-list'
import OriginField from './components/flights-origin-field'
import FlightsPriceCalanderField from './components/flights-price-calander-field'
import useFeatureQuery from './hooks/useFeatureQuery'
import { flightService } from './service/flights.service'

export default function Flights() {
  const { searchFlightsQuery, onSubmit, form } = useFeatureQuery()
  
  return (
    <div className='mt-8 space-y-4 max-w-4xl mx-auto p-4'>
      <Card>
        <CardHeader>
          <CardTitle>Search Flights</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <div className='flex gap-4 w-full flex-wrap'>
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
                  name='cabinClass'
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
                          <SelectItem value='premium_economy'>
                            Premium
                          </SelectItem>
                          <SelectItem value='business'>Business</SelectItem>
                          <SelectItem value='first'>First Class</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='adults'
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
                  label={'Origin'}
                />
                <OriginField
                  mkey={'airports.search'}
                  mfunc={flightService.searchAirports}
                  formKey={'destination'}
                  label={'Destination'}
                />
              </div>

              <div className=''>
                <FlightsPriceCalanderField />
              </div>

              <Button
                type='submit'
                className='w-full'
                // disabled={searchFlightsQuery.isPending}
              >
                {searchFlightsQuery.isPending
                  ? 'Searching...'
                  : 'Search Flights'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <FlightList />
    </div>
  )
}
