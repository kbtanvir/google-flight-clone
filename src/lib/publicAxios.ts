import axios from 'axios'

const publicAxios = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}`, // Adjust your API base URL accordingly
})

// Add a request interceptor to inject the accessToken into the headers
// publicAxios.interceptors.request.use(async (config) => {
//   const session: any = await getSession();

//   if (session?.user.accessToken) {
//     config.headers.Authorization = `Bearer ${session?.user.accessToken}`;
//   }

//   return config;
// });

publicAxios.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    return Promise.reject(error.response.data)
  }
)

export default publicAxios
