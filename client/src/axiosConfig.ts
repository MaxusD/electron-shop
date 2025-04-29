import axios from 'axios'


axios.defaults.baseURL = process.env.REACT_APP_API_URL
axios.defaults.withCredentials = true

const token = localStorage.getItem('token')
if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

axios.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config

        if (originalRequest.url.includes('/user/refresh')) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                const res = await axios.post('/api/user/refresh', {}, { withCredentials: true })
                const newToken = res.data.token

                localStorage.setItem('token', newToken)
                axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`

                return axios(originalRequest)
            } catch (refreshError) {
                localStorage.removeItem('token')
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    }
)