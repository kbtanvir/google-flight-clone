import { useQuery } from '@tanstack/react-query'
import { useSearch } from '@tanstack/react-router'
import { sitesService } from '@/features/sites/service/feature.service'

function useFeatureQuery() {
  const location = useSearch({
    from: '/_authenticated/sites/',
  })

  const getSites = useQuery({
    queryKey: ['sites', location.toString(), location],
    queryFn: async () => {
      console.log(location)
      return await sitesService.list(new URLSearchParams(location))
    },
    enabled: !!location,
  })

  return {
    getSites,
  }
}

export default useFeatureQuery
