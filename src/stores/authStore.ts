import Cookies from 'js-cookie'
import { createStore } from '@poly-state/poly-state'
import { useStore } from '@poly-state/react'

const ACCESS_TOKEN = 'token'

interface AuthUser {
  id: string
  email: string
  fullname: string
  firstName: null
  lastName: null
  customerId: null
  emailVerified: boolean
  isBanned: boolean
  role: string
  subscriptions: null
  provider: string
}

const cookieState = Cookies.get(ACCESS_TOKEN)
const initToken = cookieState ? JSON.parse(cookieState) : ''

export const initialState = {
  user: null as AuthUser | null,
  accessToken: initToken,
}

export type IStore = typeof initialState

export const authStore = createStore<IStore>(initialState)

// if (process.env.NODE_ENV === "development") withDevTools(provider, model);

// ------

export const useAuthStore = () => useStore<IStore>(authStore)
