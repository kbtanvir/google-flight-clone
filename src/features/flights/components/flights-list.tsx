import { Info, Usb, Video, Wifi } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import useFeatureQuery from '../hooks/useFeatureQuery'

const FlightList = () => {
  const { searchFlights } = useFeatureQuery()

  const formatTime = (dateString: string | number | Date) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours} hrs ${mins} min`
  }

  const getCarrierLogo = (carrier: {
    id?: number
    alternateId?: string
    logoUrl: any
    name?: string
  }) => {
    return carrier.logoUrl || '/api/placeholder/24/24'
  }

  if (searchFlights.isLoading) return <div>Loading...</div>

  return (
    <div className='mt-8'>
      {searchFlights.isSuccess && searchFlights.data && (
        <div className='space-y-4'>
          <h2 className='text-2xl font-bold'>Search Results</h2>
          {searchFlights.data.map((flight) => (
            <Card key={flight.id} className='hover:shadow-lg transition-shadow'>
              <CardContent className='p-4'>
                <div className='flex items-start justify-between'>
                  <div className='flex items-center space-x-4'>
                    <img
                      src={getCarrierLogo(flight.carriers.marketing[0])}
                      alt={flight.carriers.marketing[0].name}
                      className='w-8 h-8 object-contain'
                    />
                    <div className='space-y-4'>
                      {/* Flight times and route */}
                      <div className='flex items-center space-x-6'>
                        <div>
                          <span className='text-lg font-semibold'>
                            {formatTime(flight.departure)}
                          </span>
                          <span className='block text-sm text-gray-600'>
                            {flight.origin.displayCode}
                          </span>
                        </div>
                        <div className='flex flex-col items-center'>
                          <span className='text-sm text-gray-500'>
                            {formatDuration(flight.durationInMinutes)}
                          </span>
                          <div className='w-24 h-px bg-gray-300 my-1' />
                          <span className='text-xs text-gray-500'>
                            {flight.stopCount === 0
                              ? 'Direct'
                              : `${flight.stopCount} stops`}
                          </span>
                        </div>
                        <div>
                          <span className='text-lg font-semibold'>
                            {formatTime(flight.arrival)}
                          </span>
                          <span className='block text-sm text-gray-600'>
                            {flight.destination.displayCode}
                          </span>
                        </div>
                      </div>

                      {/* Airline info and amenities */}
                      <div className='flex items-center space-x-4 text-sm text-gray-600'>
                        <span>{flight.carriers.marketing[0].name}</span>
                        <span>•</span>
                        <span>Flight {flight.segments[0].flightNumber}</span>
                        <div className='flex items-center space-x-3 ml-4'>
                          <div className='flex items-center space-x-1'>
                            <Wifi className='w-4 h-4' />
                            <span className='text-xs'>Wi-Fi</span>
                          </div>
                          <div className='flex items-center space-x-1'>
                            <Usb className='w-4 h-4' />
                            <span className='text-xs'>USB</span>
                          </div>
                          <div className='flex items-center space-x-1'>
                            <Video className='w-4 h-4' />
                            <span className='text-xs'>Entertainment</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Price and select button */}
                  <div className='text-right'>
                    <button className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors'>
                      Select flight
                    </button>
                    <div className='flex items-center justify-end mt-2'>
                      <Info className='w-4 h-4 text-gray-400 mr-1' />
                      <span className='text-sm text-gray-600'>
                        CO2: {(flight.durationInMinutes * 0.12).toFixed(0)} kg
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default FlightList
