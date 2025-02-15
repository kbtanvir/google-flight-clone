import { useQuery } from '@tanstack/react-query'
import { useSearch } from '@tanstack/react-router'
import { Main } from '@/components/layout/main'
import { columns } from './components/users-columns'
import { UsersTable } from './components/users-table'
import { FlightService } from './service/flights.service'

export default function Flights() {
  const location = useSearch({
    from: '/(public)/flights',
  })

  // Parse user list
  const userQuery = useQuery({
    queryKey: ['flights', location],
    queryFn: async () => {
      return await new FlightService().searchAirports(
        new URLSearchParams(location).toString()
      )
    },
    enabled: !!location,
  })

  if (userQuery.isLoading) {
    return <>loading</>
  }
  if (userQuery.error) {
    return <>{userQuery.error.message}</>
  }

  return (
    <>
      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2 flex-wrap'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Flights</h2>
            <p className='text-muted-foreground'>
              Manage your users and their roles here.
            </p>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
           {/* Popular destinations */}
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
           {/* Popular destinations */}
        </div>
      </Main>
    </>
  )
}
