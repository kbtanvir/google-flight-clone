import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { debouncedSearch, FormSchema, Option } from '..'
import { Airport } from '../service/flights.service'

export default function OriginField({
  mkey,
  mfunc,
  formKey,
}: {
  mkey: string
  mfunc: (v: string) => Promise<Airport[]>
  formKey: any
}) {
  const [showOption, setshowOption] = useState(false)
  const form = useFormContext<FormSchema>()
  const [searchResults, setSearchResults] = useState<Option[]>([])

  const searchOriginMutation = useMutation({
    mutationKey: [mkey],
    mutationFn: mfunc,
    onSuccess(data) {
      const options = data.map((item) => ({
        label: item.presentation.suggestionTitle,
        skyId: item.skyId,
        entityId: item.entityId,
      }))
      setSearchResults(options)
    },
  })

  const handleSearchChange = (value: string) => {
    form.setValue(formKey, { ...form.getValues(formKey), label: value })

    if (value.trim()) {
      debouncedSearch(() => {
        setshowOption(true)
        return searchOriginMutation.mutate(value)
      }, value)
    } else {
      setshowOption(false)
    }
  }

  const handleSelect = (option: Option) => {
    form.setValue(formKey, option)
    setshowOption(false)
  }

  return (
    <FormField
      control={form.control}
      name={formKey}
      render={({ field }) => (
        <FormItem className=' flex flex-col gap-1'>
          <FormLabel>Origin</FormLabel>
          <Popover open={showOption}>
            <FormControl>
              <PopoverTrigger>
                <Input
                  onFocus={() => setshowOption(false)}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  value={form.watch(formKey)?.label}
                  placeholder={formKey}
                />
              </PopoverTrigger>
            </FormControl>
            {
              <PopoverContent
                onInteractOutside={() => setshowOption(false)}
                className='z-1 p-0   h-auto'
              >
                <Command className='w-full'>
                  <CommandList>
                    <CommandGroup className=''>
                      {searchResults.map((option) => (
                        <CommandItem
                          key={option.entityId}
                          value={option.entityId}
                          onSelect={() => handleSelect(option)}
                        >
                          {option.label}
                          <Check
                            className={cn(
                              'ml-auto',
                              option.entityId === field.value?.entityId
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    <CommandEmpty>No origin found.</CommandEmpty>
                  </CommandList>
                </Command>
              </PopoverContent>
            }
          </Popover>
        </FormItem>
      )}
    />
  )
}
