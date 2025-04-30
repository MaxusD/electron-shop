import axios from 'axios'

axios.defaults.baseURL = process.env.REACT_APP_API_URL
axios.defaults.withCredentials = true

const token = localStorage.getItem('token')
if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) prom.reject(error)
        else prom.resolve(token)
    })
    failedQueue = []
}

axios.interceptors.response.use(
    res => res,
    async err => {
        const originalRequest = err.config

        if (originalRequest.url.includes('/user/refresh')) {
            return Promise.reject(err)
        }

        if (err.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token: string) => {
                            originalRequest.headers['Authorization'] = `Bearer ${token}`
                            resolve(axios(originalRequest))
                        },
                        reject: (err: any) => reject(err)
                    })
                })
            }

            isRefreshing = true

            try {
                const res = await axios.post('/api/user/refresh', {}, { withCredentials: true })
                const newToken = res.data.token

                localStorage.setItem('token', newToken)
                axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`
                processQueue(null, newToken)

                return axios(originalRequest)
            } catch (refreshError) {
                processQueue(refreshError, null)
                localStorage.removeItem('token')
                return Promise.reject(refreshError)
            } finally {
                isRefreshing = false
            }
        }

        return Promise.reject(err)
    }
)