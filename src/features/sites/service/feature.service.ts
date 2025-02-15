import protectedAxios from '@/lib/protectedAxios'
import { UserUpdateForm } from '../components/feature-action-dialog'
import { UserInviteForm } from '../components/feature-invite-dialog'
import { SiteI, SiteRolesI } from '../data/schema'

class APIService {
  async remove(id: string) {
    const res = await protectedAxios.delete(`/admin/users/${id}`)
    return res.data
  }
  async updateBanStatus(dto: UserUpdateForm & { id?: string }) {
    const res = await protectedAxios.post(`/admin/site/apply-ban`, dto)
    return res.data
  }

  async invite(dto: UserInviteForm) {
    const res = await protectedAxios.post(
      `/admin/users/${dto.email}/password/reset`,
      dto
    )
    return res.data
  }

  async list(query: URLSearchParams): Promise<SiteI[] | undefined> {
    const res = await protectedAxios.get(`/admin/site/list?${query}`)
    return res.data
  }
  async getRoles(): Promise<SiteRolesI[] | undefined> {
    const res = await protectedAxios.get(`/roles`)
    return res.data
  }
}

export const sitesService = new APIService()
