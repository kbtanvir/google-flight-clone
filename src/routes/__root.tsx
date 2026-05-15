import { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Toaster } from '@/components/ui/toaster'
import GeneralError from '@/features/errors/general-error'
import NotFoundError from '@/features/errors/not-found-error'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: () => {
    return (
      <div className='flex min-h-screen flex-col'>
        <header className='border-b bg-background/80 backdrop-blur sticky top-0 z-50'>
          <div className='mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3'>
            <a href='/' className='flex items-center gap-2 font-semibold'>
              <span className='inline-block h-6 w-6 rounded bg-primary' aria-hidden />
              <span>Flight Search</span>
              <span className='text-xs font-normal text-muted-foreground hidden sm:inline'>
                · Google Flights clone
              </span>
            </a>
            <nav className='flex items-center gap-4 text-sm'>
              <a
                href='https://github.com/kbtanvir/google-flight-clone'
                target='_blank'
                rel='noreferrer'
                className='text-muted-foreground hover:text-foreground'
              >
                GitHub
              </a>
              <a
                href='https://www.kbtanvir.dev'
                target='_blank'
                rel='noreferrer'
                className='text-muted-foreground hover:text-foreground'
              >
                kbtanvir.dev
              </a>
            </nav>
          </div>
        </header>

        <main className='flex-1'>
          <Outlet />
        </main>

        <footer className='border-t mt-12'>
          <div className='mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs text-muted-foreground'>
            <span>
              Built by{' '}
              <a href='https://www.kbtanvir.dev' target='_blank' rel='noreferrer' className='underline'>
                @kbtanvir
              </a>{' '}
              · senior full-stack engineer
            </span>
            <span>
              <a
                href='https://github.com/kbtanvir/google-flight-clone'
                target='_blank'
                rel='noreferrer'
                className='underline'
              >
                Source on GitHub
              </a>
            </span>
          </div>
        </footer>

        <Toaster />
        {import.meta.env.MODE === 'development' && (
          <>
            <ReactQueryDevtools buttonPosition='bottom-left' />
            <TanStackRouterDevtools position='bottom-right' />
          </>
        )}
      </div>
    )
  },
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
})
