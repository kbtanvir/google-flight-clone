import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function LoadingScreen() {
  return (
    <div className='max-full mx-auto'>
      <Card>
        <CardContent>
          <div className='flex items-center gap-4 mt-4'>
            <Skeleton className='w-8 h-8' />
            <Skeleton className='w-32 h-8' />
          </div>
          <div className='flex justify-between items-center mt-4'>
            <Skeleton className='w-32 h-8' />
            <Skeleton className='w-32 h-8' />
            <Skeleton className='w-32 h-8' />
          </div>
          <div className='flex justify-between items-center mt-4'>
            <Skeleton className='w-32 h-8' />
            <Skeleton className='w-32 h-8' />
            <Skeleton className='w-32 h-8' />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
