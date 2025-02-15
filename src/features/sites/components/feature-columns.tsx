import { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import LongText from '@/components/long-text'
import { callTypes } from '../data/data'
import { SiteI } from '../data/schema'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

export const columns: ColumnDef<SiteI>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    meta: {
      className: cn(
        'sticky md:table-cell left-0 z-10 rounded-tl',
        'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'
      ),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    id: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={`name`} />
    ),
    cell: ({ row }) => {
      return <LongText className='max-w-36'>{row.original.name}</LongText>
    },
    meta: { className: 'w-36' },
  },

  {
    accessorKey: 'bucketKey',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={`bucketKey`} />
    ),
    cell: ({ row }) => (
      <Badge variant='outline'>
        {row.original.bucketKey}
      </Badge>
    ),
    enableSorting: false,
    enableHiding: true,
  },

  {
    accessorKey: 'subdomain',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={`subdomain`} />
    ),
    cell: ({ row }) => (
      <Badge variant='outline'>
        {row.original.subdomain}
      </Badge>
    ),
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={`Email`} />
    ),
    cell: ({ row }) => (
      <Badge variant='outline'>
        {row.original.email}
      </Badge>
    ),
    enableSorting: false,
    enableHiding: true,
  },

  {
    accessorKey: 'customDomainId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={`customDomainId`} />
    ),
    cell: ({ row }) => (
      <Badge variant='outline'>
        {row.original.customDomainId ?? 'N/A'}
      </Badge>
    ),
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: 'customDomainUrl',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={`customDomainUrl`} />
    ),
    cell: ({ row }) => (
      <Badge variant='outline'>
        {row.original.customDomainUrl ?? 'N/A'}
      </Badge>
    ),
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      if (row.original.isBanned) {
        const badgeColor = callTypes.get('suspended')
        return (
          <div className='flex space-x-2'>
            <Badge variant='outline' className={cn('capitalize', badgeColor)}>
              Banned
            </Badge>
          </div>
        )
      }
      if (!row.original.isDomainVerified) {
        const badgeColor = callTypes.get(
          !row.original.customDomainUrl ? 'active' : 'suspended'
        )
        return (
          <div className='flex space-x-2'>
            <Badge variant='outline' className={cn('capitalize', badgeColor)}>
              {!row.original.customDomainUrl ? 'Active' : 'Not Verified'}
            </Badge>
          </div>
        )
      }

      const badgeColor = callTypes.get('active')
      return (
        <div className='flex space-x-2'>
          <Badge variant='outline' className={cn('capitalize', badgeColor)}>
            Active
          </Badge>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableHiding: true,
    enableSorting: false,
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
