import {createContext} from 'react'
import UserStore from './store/UserStore'
import {createRoot} from "react-dom/client"
import App from "./App"
import DeviceStore from "./store/DeviceStore"
import axios from "axios"

interface ContextType {
    user: UserStore
    device: DeviceStore
}

export const Context = createContext<ContextType | null>(null)

axios.defaults.baseURL = process.env.REACT_APP_API_URL
axios.defaults.withCredentials = true

createRoot(document.getElementById('root')!).render(
  <Context.Provider value={{
      user: new UserStore(),
      device: new DeviceStore()
  }}>
    <App />
  </Context.Provider>
)