import { PlusCircledIcon } from '@radix-ui/react-icons'
import debounce from 'lodash.debounce'
import { Button } from '@/components/ui/button'
import { Command, CommandInput } from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

 
export function DataTableFacetedFilterSearchOnly ({
  title,
  onValueChange,
} : {
  title:string
  onValueChange: (v: string) => void
}) {
  const debounceFn = debounce(onValueChange, 500)
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm' className='h-8 border-dashed'>
          <PlusCircledIcon className='h-4 w-4' />
          {title}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0' align='start'>
        <Command>
          <CommandInput
            placeholder={title}
            onValueChange={async (v) => await debounceFn(v)}
          />
        </Command>
      </PopoverContent>
    </Popover>
  )
}
