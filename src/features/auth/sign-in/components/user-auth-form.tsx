import { HTMLAttributes } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/authStore'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { authService } from '../../service/auth.service'

type UserAuthFormProps = HTMLAttributes<HTMLDivElement>

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const store = useAuthStore()

  const navigate = useNavigate({
    from: '/sign-in',
  })

  function handleLogout() {
    authService.clearSession()
    navigate({
      to: '/',
    })
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      {store.user ? (
        <>
          <pre>{JSON.stringify(store.user, null, 2)}</pre>
          <Link to='/'>
            <Button>Dashboard</Button>
          </Link>
          <Button onClick={handleLogout}>Logout</Button>
        </>
      ) : (
        <>You must login from static.run</>
      )}
    </div>
  )
}
