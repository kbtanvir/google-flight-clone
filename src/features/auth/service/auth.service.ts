// auth.service.ts
import Cookies from 'js-cookie'
import { authStore } from '@/stores/authStore'
import protectedAxios from '@/lib/protectedAxios'
import publicAxios from '@/lib/publicAxios'

interface AuthResponse {
  token: string
}

class AuthService {
  async getMe() {
    const response = await protectedAxios.get(`/users/me`)

    authStore.setUser(response.data)
  }

  public async login(email: string, password: string): Promise<AuthResponse> {
    const response = await protectedAxios.post('/v1/auth/login', {
      email,
      password,
    })

    const { accessToken, refreshToken } = response.data
    this.setTokens(accessToken, refreshToken)
    await this.getMe()
    return response.data
  }

  private setTokens(accessToken: string, refreshToken: string) {
    Cookies.set(import.meta.env.VITE_SESSION_COOKIE_NAME, accessToken, {
      expires: 7,
    }) // Set access token to expire in 1 week
    Cookies.set('refreshToken', refreshToken, { expires: 7 }) // Set refresh token to expire in 1 week
  }

  public clearSession() {
    Cookies.remove(import.meta.env.VITE_SESSION_COOKIE_NAME)
    Cookies.remove('refreshToken')
    authStore.setUser(null)
  }

  public async getAccessToken(): Promise<string> {
    const token = Cookies.get(import.meta.env.VITE_SESSION_COOKIE_NAME)
    if (!token) {
      throw new Error('No access token available')
    }
    await this.checkAccessTokenExpiration()
    return token
  }

  public async findOrCreateSocialUser(dto: {
    provider: string
    // token: string;
    fullname: string
    email: string
    avatarURL: string
    providerAccountId: string
  }): Promise<
    | {
        accessToken: string
        refreshToken: string
      }
    | undefined
  > {
    try {
      const response = await publicAxios.post(`/v1/auth/admin/login`, dto)

      const { accessToken, refreshToken } = response.data

      this.setTokens(accessToken, refreshToken)
      await this.getMe()
      return { accessToken, refreshToken }
    } catch (error: any) {
      console.log(error)
      return
    }
  }
  private async checkAccessTokenExpiration() {
    try {
      await protectedAxios.get('/api/users/me', {
        headers: { Authorization: `Bearer ${this.getAccessToken()}` },
      })
    } catch (error: any) {
      if (error.response.status === 401) {
        // Access token has expired, refresh it
        const refreshToken = Cookies.get('refreshToken')
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }
        const newAccessToken = await this.refreshAccessToken(refreshToken)
        this.setTokens(newAccessToken, refreshToken)
      } else {
        // Handle other error types as needed
      }
    }
  }

  private async refreshAccessToken(token: string): Promise<string> {
    const response = await protectedAxios.post('/v1/auth/refresh/jwt-token', {
      token,
    })
    const { accessToken } = response.data
    return accessToken
  }

  public async logout(): Promise<void> {
    Cookies.remove('token')
    Cookies.remove('refreshToken')
  }
}

export const authService = new AuthService()
