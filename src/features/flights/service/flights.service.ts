// flightService.ts

interface Airport {
  code: string
  name: string
  city: string
  country: string
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
  async searchFlights(params: SearchParams): Promise<Flight[]> {
    try {
      const response = await fetch('/api/flights/search', {
        method: 'POST',
        body: JSON.stringify(params),
      })
      return await response.json()
    } catch (error) {
      console.error('Error searching flights:', error)
      throw error
    }
  }

  async getPopularRoutes(): Promise<
    { origin: Airport; destination: Airport; price: number }[]
  > {
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
  async getPriceHistory(
    origin: string,
    destination: string
  ): Promise<{ date: Date; price: number }[]> {
    try {
      const response = await fetch(
        `/api/flights/price-history?origin=${origin}&destination=${destination}`
      )
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

  async getPriceCalendar(
    origin: string,
    destination: string,
    month: Date
  ): Promise<{ date: Date; price: number }[]> {
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

  async reserveSeat(
    flightId: string,
    seatDetails: { passenger: string; seatNumber: string }
  ): Promise<boolean> {
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
    try {
      const response = await fetch(`/api/airports/search?q=${query}`)
      return await response.json()
    } catch (error) {
      console.error('Error searching airports:', error)
      throw error
    }
  }

  async getNearbyAirports(
    latitude: number,
    longitude: number
  ): Promise<Airport[]> {
    try {
      const response = await fetch(
        `/api/airports/nearby?lat=${latitude}&lng=${longitude}`
      )
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
  searchFlights = (params: SearchParams) =>
    this.searchService.searchFlights(params)
  getPopularRoutes = () => this.searchService.getPopularRoutes()

  // Pricing related methods
  getPriceHistory = (origin: string, destination: string) =>
    this.pricingService.getPriceHistory(origin, destination)
  createPriceAlert = (alert: PriceAlert) =>
    this.pricingService.createPriceAlert(alert)
  getPriceCalendar = (origin: string, destination: string, month: Date) =>
    this.pricingService.getPriceCalendar(origin, destination, month)

  // Booking related methods
  getFlightDetails = (flightId: string) =>
    this.bookingService.getFlightDetails(flightId)
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
