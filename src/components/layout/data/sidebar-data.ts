import { IconLayoutDashboard, IconUsers } from '@tabler/icons-react'
import { Command } from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'tanvir',
    email: 'tanvirdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Staticrun Admin',
      logo: Command,
      plan: ' ',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: IconLayoutDashboard,
        },

        {
          title: 'Users',
          url: '/users',
          icon: IconUsers,
        },
        {
          title: 'Sites',
          url: '/sites',
          icon: IconUsers,
        },
      ],
    },
  ],
}
