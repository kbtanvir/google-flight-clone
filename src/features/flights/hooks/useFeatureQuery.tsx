import { useQuery } from '@tanstack/react-query'
import { useMatch, useSearch } from '@tanstack/react-router'
import { flightService } from '../service/flights.service'

function useFeatureQuery() {
  const flightsLocation = useSearch({
    from: '/(public)/flights',
  })

  const flightsMatch = useMatch({
    from: '/(public)/flights',
    shouldThrow: false,
  })

  const searchFlights = useQuery({
    queryKey: ['flights.search', flightsLocation],
    queryFn: () =>
      flightService.searchFlights(
        new URLSearchParams(flightsLocation).toString()
      ),
    enabled: !!flightsMatch,
  })

  return {
    searchFlights,
  }
}

export default useFeatureQuery
