import axios from "axios"
const $host = axios.create({
    //baseURL: process.env.REACT_APP_API_URL
    baseURL: import.meta.env.VITE_API_URL
})

const $authHost = axios.create({
    //baseURL: process.env.REACT_APP_API_URL
    baseURL: import.meta.env.VITE_API_URL

})

const authInterceptor = config => {
    config.headers.authorization = `Bearer ${localStorage.getItem('token')}`
    return config
}

$authHost.interceptors.request.use(authInterceptor)
console.log(import.meta.env)


export {
    $host,
    $authHost
}