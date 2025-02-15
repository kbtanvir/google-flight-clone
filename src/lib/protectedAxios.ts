import axios from 'axios'
import Cookies from 'js-cookie'

const protectedAxios = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
})

// Add a request interceptor to inject the accessToken into the headers
protectedAxios.interceptors.request.use(async (config) => {
  const cookieState =
    Cookies.get(import.meta.env.VITE_SESSION_COOKIE_NAME) || ''

  const initToken = cookieState.toString()

  config.headers.Authorization = `Bearer ${initToken}`
  // await authService.getMe()
  return config
})

protectedAxios.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    // console.log(error.response.data)

    return Promise.reject(error)
  }
)

export default protectedAxios
