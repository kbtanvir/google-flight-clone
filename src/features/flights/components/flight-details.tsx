import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useMatch, useSearch } from '@tanstack/react-router'
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Star,
  Usb,
  Video,
  Wifi,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { flightService } from '../service/flights.service'
import LoadingScreen from './loading-skeleton'

function FlightDetails() {
  const searchParams: any = useSearch({
    from: '/(public)/flight-details',
  })

  const detailsMatch = useMatch({
    from: '/(public)/flight-details',
    shouldThrow: false,
  })

  const flightDetailsQuery = useQuery({
    queryKey: ['flights.details', searchParams],
    queryFn: () => flightService.getFlightDetails(searchParams),
    enabled: !!detailsMatch,
    refetchOnMount: false,
  })

  const [isStopsExpanded, setIsStopsExpanded] = useState(false)

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

  if (flightDetailsQuery.isLoading) {
    return (
      <div className='mt-8 space-y-4 max-w-4xl mx-auto p-4'>
        <LoadingScreen />
      </div>
    )
  }

  if (!flightDetailsQuery.data?.legs[0]) {
    return <div>No flight details available</div>
  }

  const flight = flightDetailsQuery.data.legs[0]
  const pricingOptions = flightDetailsQuery.data.pricingOptions

  return (
    <div className='mt-8 space-y-4 max-w-4xl mx-auto p-4'>
      <h2 className='text-2xl font-bold'>Flight Details</h2>

      {/* Flight Details Card */}
      <Card className='hover:shadow-lg transition-shadow'>
        <CardContent className='p-6'>
          <div className='flex justify-between flex-wrap'>
            <div className='flex items-center gap-4 flex-wrap'>
              <img
                src={flight.segments[0].marketingCarrier.logo}
                alt={flight.segments[0].operatingCarrier.name}
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
                      {formatDuration(flight.duration)}
                    </span>
                    <div className='w-24 h-px bg-gray-300 my-1' />
                    <button
                      onClick={() => setIsStopsExpanded(!isStopsExpanded)}
                      className='flex items-center text-xs text-blue-600 hover:text-blue-800'
                    >
                      {flight.stopCount === 0
                        ? 'Direct'
                        : `${flight.stopCount} ${
                            flight.stopCount === 1 ? 'stop' : 'stops'
                          }`}
                      {flight.stopCount > 0 &&
                        (isStopsExpanded ? (
                          <ChevronUp className='w-4 h-4 ml-1' />
                        ) : (
                          <ChevronDown className='w-4 h-4 ml-1' />
                        ))}
                    </button>
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
                <div className='flex items-center gap-4 text-sm text-gray-600 flex-wrap'>
                  <span>{flight.segments[0].operatingCarrier.name}</span>
                  <span>•</span>
                  <span>
                    Flight {flight.segments[0].operatingCarrier.displayCode}
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
          </div>

          {/* Expandable Stop Details */}
          {isStopsExpanded && flight.stopCount > 0 && (
            <div className='mt-4 pl-12 max-sm:pl-0 border-t pt-4 space-y-3'>
              {flight.segments.map((segment) => (
                <div key={segment.id} className='flex items-center space-x-6'>
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
                      {formatDuration(segment.duration)}
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
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pricing Options */}
      <div className='mt-6'>
        <h3 className='text-lg font-semibold mb-4'>Booking Options</h3>
        <div className='space-y-3'>
          {pricingOptions.map((option, optionIndex) => (
            <div key={optionIndex} className='space-y-3'>
              {option.agents.map((agent) => (
                <Card
                  key={agent.id}
                  className='hover:shadow-md transition-shadow'
                >
                  <CardContent className='p-4'>
                    <div className='flex justify-between flex-wrap gap-4 items-center'>
                      <div className='flex items-center space-x-4'>
                        <img
                          src={agent.segments[0].marketingCarrier.logo}
                          alt={agent.name}
                          className='w-10 h-10 object-contain'
                        />
                        <div>
                          <h4 className='font-semibold'>{agent.name}</h4>
                          <div className='flex items-center space-x-2 text-sm text-gray-600'>
                            {agent.rating && (
                              <div className='flex items-center'>
                                <Star className='w-4 h-4 text-yellow-400 mr-1' />
                                <span>{agent.rating.value}/10</span>
                                <span className='text-gray-400 ml-1'>
                                  ({agent.rating.count})
                                </span>
                              </div>
                            )}
                            {agent.bookingProposition && (
                              <span>• {agent.bookingProposition}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className='flex items-center gap-4 flex-wrap max-sm:justify-between max-sm:w-full'>
                        <div className='text-right max-sm:text-left'>
                          <span className='text-2xl font-bold'>
                            USD {agent.price}
                          </span>
                          <span className='block text-sm text-gray-500 max-sm:text-left'>
                            Updated {agent.quoteAge} mins ago
                          </span>
                        </div>
                        <a
                          href={agent.url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors'
                        >
                          Book
                          <ExternalLink className='w-4 h-4 ml-2' />
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FlightDetails
