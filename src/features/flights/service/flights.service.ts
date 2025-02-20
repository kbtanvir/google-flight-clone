import axios from 'axios'
import { addMonths, format } from 'date-fns'
import { getFlightsData } from '../data/data'

export interface Airport {
  skyId: string
  entityId: string
  presentation: Presentation
  navigation: Navigation
}

export interface Navigation {
  entityId: string
  entityType: string
  localizedName: string
  relevantFlightParams: RelevantFlightParams
  relevantHotelParams: RelevantHotelParams
}

export interface RelevantFlightParams {
  skyId: string
  entityId: string
  flightPlaceType: string
  localizedName: string
}

export interface RelevantHotelParams {
  entityId: string
  entityType: string
  localizedName: string
}

export interface Presentation {
  title: string
  suggestionTitle: string
  subtitle: string
}

interface PriceAlert {
  id: string
  route: {
    origin: string
    destination: string
  }
  targetPrice: number
  email: string
}

export interface PriceCalanderData {
  flights: {
    noPriceLabel: string
    groups: PCGroup[]
    days: PCDay[]
    currency: string
  }
}

export interface PCDay {
  day: Date
  group: PCGroupEnum
  price: number
}

export enum PCGroupEnum {
  High = 'high',
  Low = 'low',
  Medium = 'medium',
}

export interface PCGroup {
  id: PCGroupEnum
  label: string
}

export interface FlightData {
  sessionId: string
  itineraries: FlightItineraries[]
}

export interface FlightItineraries {
  id: string
  price: {
    raw: number
    formatted: string
    pricingOptionId: string
  }
  legs: FlightLeg[]
}

export interface FlightItineraryDetails {
  legs: {
    id: string
    origin: {
      id: string
      name: string
      displayCode: string
      city: string
    }
    destination: {
      id: string
      name: string
      displayCode: string
      city: string
    }
    segments: FlightSegment[]
    duration: number
    stopCount: number
    departure: Date
    arrival: Date
    dayChange: number
  }[]
  pricingOptions: FlightItinerariesPricingOption[]
  isTransferRequired: boolean
  destinationImage: string
}

export interface FlightItinerariesPricingOption {
  agents: FlightItenaryAgent[]
  totalPrice: number
}

export interface FlightItenaryAgent {
  id: string
  name: string
  isCarrier: boolean
  bookingProposition: string
  url: string
  price: number
  rating: Rating
  updateStatus: string
  segments: FlightSegment[]
  isDirectDBookUrl: boolean
  quoteAge: number
}

export interface Rating {
  value: number
  count: number
}

export interface FlightLeg {
  id: string
  origin: FlightLocation
  destination: FlightLocation
  durationInMinutes: number
  stopCount: number
  isSmallestStops: boolean
  departure: Date
  arrival: Date
  timeDeltaInDays: number
  carriers: FlightCarriers
  segments: FlightSegment[]
}

export interface FlightCarriers {
  marketing: {
    id: number
    alternateId: string
    logoUrl: string
    name: string
  }[]
  operationType: string
}

export interface FlightLocation {
  id: string
  entityId: string
  name: string
  displayCode: string
  city: string
  country: string
  isHighlighted: boolean
}

export interface FlightSegment {
  duration: number
  id: string
  origin: SegmentDestination
  destination: SegmentDestination
  departure: Date
  arrival: Date
  durationInMinutes: number
  flightNumber: string
  marketingCarrier: FlightTingCarrier
  operatingCarrier: FlightTingCarrier
}

export interface SegmentDestination {
  flightPlaceId: string
  displayCode: string
  parent: FlightSegmentParent
  name: string
  type: string
  country: string
}

export interface FlightSegmentParent {
  flightPlaceId: string
  displayCode: string
  name: string
  type: string
}

export interface FlightTingCarrier {
  logo: string | undefined
  id: number
  name: string
  alternateId: string
  allianceId: number
  displayCode: string
}

export interface DetailsParams {
  legs: {
    destination: string
    origin: string
    date: string
  }
  sessionId: string
  itineraryId: string
}

const httpService = axios.create({
  baseURL: `https://sky-scrapper.p.rapidapi.com/api`,
  headers: {
    'x-rapidapi-key': import.meta.env.VITE_RAPID_API_KEY,
    'x-rapidapi-host': import.meta.env.VITE_RAPID_API_HOST,
  },
})

httpService.interceptors.response.use(
  (response) => {
    if (!response.data.status) {
      throw new Error('Nothing found')
    }
    response.data = response.data.data

    return response
  },
  (error) => {
    return Promise.reject(error.response.data)
  }
)

class SearchService {
  async searchFlights(params: string) {
    // const res = await httpService.get(`/v2/flights/searchFlights?${params}`)
    // const { itineraries, flightsSessionId } = res.data
    // return { itineraries, sessionId: flightsSessionId }

    const { itineraries, flightsSessionId } = getFlightsData.data
    return await Promise.resolve({ itineraries, sessionId: flightsSessionId })
  }

  async getPopularRoutes() {
    return await httpService.get('/flights/popular')
  }
}

class PricingService {
  async getPriceHistory(origin: string, destination: string) {
    return await httpService.get(`/flights/price-history`, {
      params: { origin, destination },
    })
  }

  async createPriceAlert(alert: PriceAlert) {
    return await httpService.post('/api/price-alerts', alert)
  }

  async getPriceCalendar(
    origin: string,
    destination: string,
    month: number | Date
  ) {
    const fromMonth = format(month, 'yyyy-MM-dd')
    const toDate = format(addMonths(month, 1), 'yyyy-MM-dd')

    const res = await httpService.get<PriceCalanderData>(
      `/v1/flights/getPriceCalendar`,
      {
        params: {
          originSkyId: origin,
          destinationSkyId: destination,
          fromDate: fromMonth,
          toDate,
          currency: 'USD',
        },
      }
    )

    return res.data.flights
    // return await Promise.resolve(getPriceCalendarData.data.flights)
  }
}

class BookingService {
  async getFlightDetails(
    params: DetailsParams
  ): Promise<FlightItineraryDetails> {
    // Create the exact string format needed with escaped quotes
    const legsString = `"[{\\"destination\\":\\"${params.legs.destination}\\",\\"origin\\":\\"${params.legs.origin}\\",\\"date\\":\\"${params.legs.date}\\"}]"`

    // Split itineraryId into array if it contains multiple ids
    const itineraryIds = params.itineraryId.split('|')
    let lastError = null

    // Try each itinerary sequentially
    for (const itineraryId of itineraryIds) {
      try {
        const response = await httpService.get(`/v1/flights/getFlightDetails`, {
          params: {
            legs: legsString,
            sessionId: params.sessionId,
            itineraryId: itineraryId.trim(),
            locale: 'en-US',
          },
        })

        return response.data.itinerary
      } catch (error) {
        lastError = error
        console.log(
          `Failed to fetch details for itinerary ${itineraryId}:`,
          error
        )
        continue
      }
    }

    // If we get here, all itineraries failed
    throw new Error(`Failed to fetch flight details for all itineraries.`)
  }

  async reserveSeat(
    flightId: string,
    seatDetails: { passenger: string; seatNumber: string }
  ) {
    return await httpService.post(`/flights/${flightId}/reserve`, seatDetails)
  }

  async getBookingHistory(userId: string) {
    return await httpService.get(`/api/bookings/${userId}`)
  }
}

class AirportService {
  async searchAirports(query: string): Promise<any> {
    const res = await httpService.get<Airport[]>(`/v1/flights/searchAirport`, {
      params: { query, locale: 'en-US' },
    })

    return res.data
    // return await Promise.resolve(getAirportData.data)
  }

  async getNearbyAirports(latitude: number, longitude: number) {
    return await httpService.get(`/api/airports/nearby`, {
      params: { lat: latitude, lng: longitude },
    })
  }
}

// Main FlightService class that combines all the services
export class FlightService {
  private searchService: SearchService
  private pricingService: PricingService
  private bookingService: BookingService
  private airportService: AirportService

  constructor() {
    this.searchService = new SearchService()
    this.pricingService = new PricingService()
    this.bookingService = new BookingService()
    this.airportService = new AirportService()
  }

  // Search related methods
  searchFlights = (query: string) => this.searchService.searchFlights(query)
  getPopularRoutes = () => this.searchService.getPopularRoutes()

  // Pricing related methods
  getPriceHistory = (origin: string, destination: string) =>
    this.pricingService.getPriceHistory(origin, destination)
  createPriceAlert = (alert: PriceAlert) =>
    this.pricingService.createPriceAlert(alert)
  getPriceCalendar = (origin: string, destination: string, month: Date) =>
    this.pricingService.getPriceCalendar(origin, destination, month)

  // Booking related methods
  getFlightDetails = (query: DetailsParams) =>
    this.bookingService.getFlightDetails(query)
  reserveSeat = (
    flightId: string,
    seatDetails: { passenger: string; seatNumber: string }
  ) => this.bookingService.reserveSeat(flightId, seatDetails)
  getBookingHistory = (userId: string) =>
    this.bookingService.getBookingHistory(userId)

  // Airport related methods
  searchAirports = (query: string) => this.airportService.searchAirports(query)
  getNearbyAirports = (latitude: number, longitude: number) =>
    this.airportService.getNearbyAirports(latitude, longitude)
}

export const flightService = new FlightService()
