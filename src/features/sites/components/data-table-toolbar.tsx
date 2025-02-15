import { Cross2Icon } from '@radix-ui/react-icons'
import { useNavigate } from '@tanstack/react-router'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { DataTableFacetedFilterSearchOnly } from './data-table-faceted-filter-search-only'
import { DataTableViewOptions } from './data-table-view-options'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const navigate = useNavigate({
    from: '/sites',
  })
  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        <div className='flex gap-x-2'>
          <DataTableFacetedFilterSearchOnly
            title='Subdomain'
            onValueChange={(v: string): void => {
              navigate({
                to: '/sites',
                search: (params) => ({ ...params, fsubdomain: v }),
              })
            }}
          />

          <DataTableFacetedFilterSearchOnly
            title='Search By Email'
            onValueChange={async (v: string): Promise<void> => {
              navigate({
                to: '/sites',
                search: (params) => ({ ...params, email: v }),
                replace: true,
              })
            }}
          />

          <DataTableFacetedFilterSearchOnly
            title='Search By custom domain'
            onValueChange={(v: string): void => {
              navigate({
                to: '/sites',
                search: (params) => ({ ...params, fcustomDomainUrl: v }),
              })
            }}
          />
        </div>

        <Button
          variant='ghost'
          onClick={() => {
            navigate({
              to: '/sites',
              search: {},
            })
          }}
          className='h-8 px-2 lg:px-3'
        >
          Reset
          <Cross2Icon className='ml-2 h-4 w-4' />
        </Button>
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
