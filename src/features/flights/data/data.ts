import {
  IconShield,
  IconUser,
  IconUsersGroup,
  IconUserShield,
} from '@tabler/icons-react'
// import { UserStatus } from './schema'

export const callTypes = new Map<any, string>([
  ['active', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['inactive', 'bg-neutral-300/40 border-neutral-300'],
  ['invited', 'bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300'],
  [
    'suspended',
    'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10',
  ],
])

export const userTypes = [
  {
    label: 'Superadmin',
    value: 'SUPER_ADMIN',
    icon: IconShield,
  },
  {
    label: 'Admin',
    value: 'ADMIN',
    icon: IconUserShield,
  },
  {
    label: 'Manager',
    value: 'MANAGER',
    icon: IconUsersGroup,
  },
  {
    label: 'User',
    value: 'USER',
    icon: IconUser,
  },
] as const
