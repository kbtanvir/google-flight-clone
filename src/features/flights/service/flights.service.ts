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

interface Flight {
  id: string
  departureAirport: Airport
  arrivalAirport: Airport
  departureTime: Date
  arrivalTime: Date
  airline: string
  price: number
  available_seats: number
  class: string
}

interface SearchParams {
  origin?: string
  destination?: string
  departureDate?: Date
  returnDate?: Date
  passengers?: number
  cabinClass?: string
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

class SearchService {
  async searchFlights(params: string): Promise<Flight[]> {
    try {
      const response = await fetch(`https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlights?${params}`, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': import.meta.env.VITE_RAPID_API_KEY,
          'x-rapidapi-host': import.meta.env.VITE_RAPID_API_HOST,
        },
      })
      const results = await response.json()

      if (!results.status) {
        throw new Error('Nothing found')
      }
      return results.data
    } catch (error) {
      console.error('Error searching flights:', error)
      throw error
    }
  }

  async getPopularRoutes(): Promise<{ origin: Airport; destination: Airport; price: number }[]> {
    try {
      const response = await fetch('/api/flights/popular')
      return await response.json()
    } catch (error) {
      console.error('Error fetching popular routes:', error)
      throw error
    }
  }
}

class PricingService {
  async getPriceHistory(origin: string, destination: string): Promise<{ date: Date; price: number }[]> {
    try {
      const response = await fetch(`/api/flights/price-history?origin=${origin}&destination=${destination}`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching price history:', error)
      throw error
    }
  }

  async createPriceAlert(alert: PriceAlert): Promise<void> {
    try {
      await fetch('/api/price-alerts', {
        method: 'POST',
        body: JSON.stringify(alert),
      })
    } catch (error) {
      console.error('Error creating price alert:', error)
      throw error
    }
  }

  async getPriceCalendar(origin: string, destination: string, month: Date): Promise<{ date: Date; price: number }[]> {
    try {
      const response = await fetch(`/api/flights/price-calendar`, {
        method: 'POST',
        body: JSON.stringify({ origin, destination, month }),
      })
      return await response.json()
    } catch (error) {
      console.error('Error fetching price calendar:', error)
      throw error
    }
  }
}

class BookingService {
  async getFlightDetails(flightId: string): Promise<Flight> {
    try {
      const response = await fetch(`/api/flights/${flightId}`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching flight details:', error)
      throw error
    }
  }

  async reserveSeat(flightId: string, seatDetails: { passenger: string; seatNumber: string }): Promise<boolean> {
    try {
      const response = await fetch(`/api/flights/${flightId}/reserve`, {
        method: 'POST',
        body: JSON.stringify(seatDetails),
      })
      return await response.json()
    } catch (error) {
      console.error('Error reserving seat:', error)
      throw error
    }
  }

  async getBookingHistory(userId: string): Promise<Flight[]> {
    try {
      const response = await fetch(`/api/bookings/${userId}`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching booking history:', error)
      throw error
    }
  }
}

class AirportService {
  async searchAirports(query: string): Promise<Airport[]> {
    // return [];
    try {
      const response = await fetch(`https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport?query=${query}&locale=en-US`, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': import.meta.env.VITE_RAPID_API_KEY,
          'x-rapidapi-host': import.meta.env.VITE_RAPID_API_HOST,
        },
      })
      const results = await response.json()

      if (!results.status) {
        throw new Error('No airport found')
      }
      return results.data
    } catch (error) {
      console.error('Error searching airports:', error)
      throw error
    }
  }

  async getNearbyAirports(latitude: number, longitude: number): Promise<Airport[]> {
    try {
      const response = await fetch(`/api/airports/nearby?lat=${latitude}&lng=${longitude}`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching nearby airports:', error)
      throw error
    }
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
  getPriceHistory = (origin: string, destination: string) => this.pricingService.getPriceHistory(origin, destination)
  createPriceAlert = (alert: PriceAlert) => this.pricingService.createPriceAlert(alert)
  getPriceCalendar = (origin: string, destination: string, month: Date) => this.pricingService.getPriceCalendar(origin, destination, month)

  // Booking related methods
  getFlightDetails = (flightId: string) => this.bookingService.getFlightDetails(flightId)
  reserveSeat = (flightId: string, seatDetails: { passenger: string; seatNumber: string }) => this.bookingService.reserveSeat(flightId, seatDetails)
  getBookingHistory = (userId: string) => this.bookingService.getBookingHistory(userId)

  // Airport related methods
  searchAirports = (query: string) => this.airportService.searchAirports(query)
  getNearbyAirports = (latitude: number, longitude: number) => this.airportService.getNearbyAirports(latitude, longitude)
}
