'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import { SiteI, siteSchema } from '../data/schema'
import useFeatureQuery from '../hooks/useFeatureQuery'
import { sitesService } from '../service/feature.service'

const formSchema = siteSchema
  .pick({
    isBanned: true,
    homePage: true,
  })
  .extend({
    isEdit: z.boolean(),
  })
  .partial()

export type UserUpdateForm = z.infer<typeof formSchema>

interface Props {
  currentRow?: SiteI
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsersActionDialog({ currentRow, open, onOpenChange }: Props) {
  const isEdit = !!currentRow
  const { getSites } = useFeatureQuery()

  const updateMutation = useMutation({
    mutationKey: ['site', 'single'],
    mutationFn: sitesService.updateBanStatus,
    onSuccess() {
      getSites.refetch()
    },
    onError(_error, _variables, context) {
      toast({
        title: 'Error updating ban status',
        description: (
          <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
            <code className='text-white'>
              {JSON.stringify(context, null, 2)}
            </code>
          </pre>
        ),
      })
    },
  })

  const form = useForm<UserUpdateForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          ...currentRow,
          isEdit,
        }
      : {
          isBanned: false,
          isEdit,
        },
  })

  const onSubmit = async (values: UserUpdateForm) => {
    updateMutation.mutate({ ...values, id: currentRow!.id })

    form.reset()

    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-left'>
          <DialogTitle>{isEdit ? 'Edit Item' : 'Add New'}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <ScrollArea className='h-[26.25rem] w-full pr-4 -mr-4 py-1'>
          <Form {...form}>
            <form
              id='user-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 p-0.5'
            >
              <FormField
                control={form.control}
                name='isBanned'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-sm'>Is Banned</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <Card className='p-4 text-sm overflow-auto w-full mt-4 hover:bg-gray-800 bg-gray-800'>
            <pre>{JSON.stringify(currentRow, null, 2)}</pre>
          </Card>
        </ScrollArea>
        <DialogFooter>
          <Button type='submit' form='user-form'>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
