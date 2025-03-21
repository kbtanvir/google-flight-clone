import { useState } from 'react'
import { format } from 'date-fns'
import { ChevronDown, ChevronUp, Usb, Video, Wifi } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import useFeatureQuery from '../hooks/useFeatureQuery'
import { FlightLeg } from '../service/flights.service'
import LoadingScreen from './loading-skeleton'

const FlightList = () => {
  const { searchFlightsQuery, navigate } = useFeatureQuery()
  const [expandedFlights, setExpandedFlights] = useState<string[]>([])

  const toggleExpand = (flightId: string) => {
    setExpandedFlights((prev) =>
      prev.includes(flightId)
        ? prev.filter((id) => id !== flightId)
        : [...prev, flightId]
    )
  }

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

  function handleSelectFlight(item: FlightLeg, flightId: string): void {
    navigate({
      to: '/flight-details',
      search: () => ({
        legs: item.segments.map((item) => ({
          destination: item.destination.displayCode,
          origin: item.origin.displayCode,
          date: format(item.departure, 'yyyy-MM-dd'),
        })),
        sessionId: searchFlightsQuery.data?.sessionId,
        itineraryId: flightId,
      }),
    })
  }

  const getCarrierLogo = (carrier: {
    id?: number
    alternateId?: string
    logoUrl: any
    name?: string
  }) => {
    return carrier.logoUrl || '/api/placeholder/24/24'
  }

  if (searchFlightsQuery.isLoading) return [...Array(5)].map((_, index) => <LoadingScreen key={index} />)

  return (
    <div className='mt-8'>
      {searchFlightsQuery.isSuccess && searchFlightsQuery.data && (
        <div className='space-y-4'>
          <h2 className='text-2xl font-bold'>Search Results</h2>
          {searchFlightsQuery.data.itineraries.map((flight) => {
            const isExpanded = expandedFlights.includes(flight.legs[0].id)

            return (
              <Card
                key={flight.id}
                className='hover:shadow-lg transition-shadow'
              >
                <CardContent className='p-4'>
                  <div className='flex  justify-between flex-wrap'>
                    <div className='flex items-center gap-4 flex-wrap max-sm:flex-col max-sm:items-start'>
                      <img
                        src={getCarrierLogo(
                          flight.legs[0].carriers.marketing[0]
                        )}
                        alt={flight.legs[0].carriers.marketing[0].name}
                        className='w-8 h-8 object-contain'
                      />
                      <div className='space-y-4'>
                        {/* Flight times and route */}
                        <div className='flex items-center gap-4 flex-wrap'>
                          <div>
                            <span className='text-lg font-semibold'>
                              {formatTime(flight.legs[0].departure)}
                            </span>
                            <span className='block text-sm text-gray-600'>
                              {flight.legs[0].origin.displayCode}
                            </span>
                          </div>
                          <div className='flex flex-col items-center'>
                            <span className='text-sm text-gray-500'>
                              {formatDuration(flight.legs[0].durationInMinutes)}
                            </span>
                            <div className='w-24 h-px bg-gray-300 my-1' />
                            <button
                              onClick={() => toggleExpand(flight.legs[0].id)}
                              className='flex items-center text-xs text-blue-600 hover:text-blue-800'
                            >
                              {flight.legs[0].stopCount === 0
                                ? 'Direct'
                                : `${flight.legs[0].stopCount} stops`}
                              {flight.legs[0].stopCount > 0 &&
                                (isExpanded ? (
                                  <ChevronUp className='w-4 h-4 ml-1' />
                                ) : (
                                  <ChevronDown className='w-4 h-4 ml-1' />
                                ))}
                            </button>
                          </div>
                          <div>
                            <span className='text-lg font-semibold'>
                              {formatTime(flight.legs[0].arrival)}
                            </span>
                            <span className='block text-sm text-gray-600'>
                              {flight.legs[0].destination.displayCode}
                            </span>
                          </div>

                          <div>
                            <span className='text-lg font-semibold'>
                              {(
                                flight.legs[0].durationInMinutes * 0.12
                              ).toFixed(0)}{' '}
                              kg
                            </span>
                            <span className='block text-sm text-gray-600'>
                              CO2e
                            </span>
                          </div>
                        </div>

                        {/* Airline info and amenities */}
                        <div className='flex items-center flex-wrap gap-4  text-sm text-gray-600'>
                          <span>
                            {flight.legs[0].carriers.marketing[0].name}
                          </span>
                          <span>•</span>
                          <span>
                            Flight {flight.legs[0].segments[0].flightNumber}
                          </span>
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

                    {/* Price and select button */}
                    <div className='text-right max-sm:mt-4 flex flex-col max-sm:flex-row max-sm:w-full  items-between justify-between '>
                      <span className='text-lg font-semibold'>
                        USD {flight.price.raw}
                      </span>

                      <button
                        onClick={() =>
                          handleSelectFlight(flight.legs[0], flight.id)
                        }
                        className='bg-blue-400 h-8 text-white px-4 rounded-md hover:bg-blue-500 transition-colors'
                      >
                        Select flight
                      </button>
                    </div>
                  </div>

                  {/* Expandable Stop Details */}
                  {isExpanded && flight.legs[0].stopCount > 0 && (
                    <div className='mt-4 pl-12 max-sm:pl-0 border-t pt-4 space-y-3'>
                      {flight.legs[0].segments.map((segment, index) => (
                        <div
                          key={index}
                          className='flex items-center space-x-6'
                        >
                          <div>
                            <span className='text-sm font-semibold'>
                              {formatTime(segment.departure)}
                            </span>
                            <span className='block text-xs text-gray-600'>
                              {segment.origin.displayCode}
                            </span>
                          </div>
                          <div className='flex flex-col items-center'>
                            <span className='text-xs text-gray-500'>
                              {formatDuration(segment.durationInMinutes)}
                            </span>
                            <div className='w-16 h-px bg-gray-300 my-1' />
                            <span className='text-xs text-gray-500'>
                              Flight {segment.flightNumber}
                            </span>
                          </div>
                          <div>
                            <span className='text-sm font-semibold'>
                              {formatTime(segment.arrival)}
                            </span>
                            <span className='block text-xs text-gray-600'>
                              {segment.destination.displayCode}
                            </span>
                          </div>
                          <div>
                            <span className='text-sm font-semibold'>
                              {segment.operatingCarrier.name}
                            </span>
                            <span className='block text-xs text-gray-600'>
                              {segment.operatingCarrier.alternateId} -{' '}
                              {segment.flightNumber}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default FlightList
