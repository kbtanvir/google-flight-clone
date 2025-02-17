import { useQuery } from '@tanstack/react-query'
import { useSearch } from '@tanstack/react-router'
import { flightService } from '../service/flights.service'

function useFeatureQuery() {
  const location = useSearch({
    from: '/(public)/flights',
  })

  const searchFlights = useQuery({
    queryKey: ['flights.search', location],
    queryFn: () =>
      flightService.searchFlights(new URLSearchParams(location).toString()),
    enabled: !!location,
  })

  return {
    searchFlights,
  }
}

export default useFeatureQuery
