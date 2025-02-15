import { useQuery } from '@tanstack/react-query'
import { userService } from '@/features/users/service/user.service'

function useFeatureQuery() {
  const getAnalytics = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => await userService.getAnalytics(),
  })

  return {
    getAnalytics,
  }
}

export default useFeatureQuery
