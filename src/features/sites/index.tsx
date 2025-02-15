import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/feature-columns'
import { UsersDialogs } from './components/feature-dialogs'
import { UsersPrimaryButtons } from './components/feature-primary-buttons'
import { FeatureTable } from './components/feature-table'
import UsersProvider from './context/feature-context'
import useFeatureQuery from './hooks/useFeatureQuery'

export default function Sites() {
  // Parse user list
  const { getSites } = useFeatureQuery()

  if (getSites.isLoading) {
    return <>loading</>
  }
  if (getSites.error) {
    return <>{getSites.error.message}</>
  }

  return (
    <UsersProvider>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2 flex-wrap'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Sites</h2>
            <p className='text-muted-foreground'>Manage your sites here.</p>
          </div>
          <UsersPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <FeatureTable data={getSites.data as any} columns={columns} />
        </div>
      </Main>

      <UsersDialogs />
    </UsersProvider>
  )
}
