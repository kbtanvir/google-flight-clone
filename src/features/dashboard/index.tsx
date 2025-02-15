import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import useFeatureQuery from './hooks/useFeatureQuery'

export default function Dashboard() {
  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        {/* <TopNav links={topNav} /> */}
        <div className='ml-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <Tabs
          orientation='vertical'
          defaultValue='overview'
          className='space-y-4'
        >
          <TabsContent value='overview' className='space-y-4'>
            <StatsCards />

            {/* <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
              <Card className='col-span-1 lg:col-span-4'>
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className='pl-2'>
                  <Overview />
                </CardContent>
              </Card>
              <Card className='col-span-1 lg:col-span-3'>
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>
                    You made 265 sales this month.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Card>
            </div> */}
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}

// const topNav = [
//   {
//     title: 'Overview',
//     href: 'dashboard/overview',
//     isActive: true,
//     disabled: false,
//   },
//   {
//     title: 'Customers',
//     href: 'dashboard/customers',
//     isActive: false,
//     disabled: true,
//   },
//   {
//     title: 'Products',
//     href: 'dashboard/products',
//     isActive: false,
//     disabled: true,
//   },
//   {
//     title: 'Settings',
//     href: 'dashboard/settings',
//     isActive: false,
//     disabled: true,
//   },
// ]

function StatsCards() {
  const { getAnalytics } = useFeatureQuery()

  if (getAnalytics.isLoading) return <>Loading</>

  if (getAnalytics.isError || !getAnalytics.data) return <>Error loading data</>

  return (
    <div className='space-y-10'>
      <div className='mb-2 flex items-center justify-between space-y-2'>
        <h2 className='text-2xl font-bold tracking-tight'>Users Analytics</h2>
      </div>
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {getAnalytics.data.users.map((item: any) => (
          <Card key={item.label}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <div className='text-2xl font-bold'>{item.value}</div>
            </CardHeader>

            <CardContent>
              <p className='text-xs text-muted-foreground'>
                {item.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className='mb-2 flex items-center justify-between space-y-2'>
        <h2 className='text-2xl font-bold tracking-tight'>Users Analytics</h2>
      </div>
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {getAnalytics.data.sites.map((item: any) => (
          <Card key={item.label}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <div className='text-2xl font-bold'>{item.value}</div>
            </CardHeader>
            <CardContent>
              <p className='text-xs text-muted-foreground'>
                {item.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
