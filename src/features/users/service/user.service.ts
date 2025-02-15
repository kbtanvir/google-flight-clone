import protectedAxios from '@/lib/protectedAxios'
import { UserUpdateForm } from '../components/users-action-dialog'
import { UserInviteForm } from '../components/users-invite-dialog'
import { User, UserRoles } from '../data/schema'

class UserService {
  async deleteUser(id: string) {
    const res = await protectedAxios.delete(`/admin/users/${id}`)
    return res.data
  }
  async update(dto: UserUpdateForm & { id?: string }) {
    const { id, ...data } = dto

    if (!id) throw new Error('Id is required')

    const res = await protectedAxios.put(`/admin/users/${id}`, data)
    return res.data
  }

  async invite(dto: UserInviteForm) {
    const res = await protectedAxios.post(`/admin/users/invite`, dto)
    return res.data
  }

  async getAnalytics() {
    const res = await protectedAxios.get(`/admin/stats`)
    return res.data
  }

  async listUser(query: URLSearchParams): Promise<User[] | undefined> {
    const res = await protectedAxios.get(`/admin/users?${query}`)
    return res.data
  }

  async getRoles(): Promise<UserRoles[] | undefined> {
    const res = await protectedAxios.get(`/roles`)
    return res.data
  }
}

export const userService = new UserService()
