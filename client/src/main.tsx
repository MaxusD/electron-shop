import {createContext} from 'react'
import UserStore from './store/UserStore'
import {createRoot} from "react-dom/client"
import App from "./App"
import DeviceStore from "./store/DeviceStore"
import './axiosConfig'

interface ContextType {
    user: UserStore
    device: DeviceStore
}

export const Context = createContext<ContextType | null>(null)


createRoot(document.getElementById('root')!).render(
  <Context.Provider value={{
      user: new UserStore(),
      device: new DeviceStore()
  }}>
    <App />
  </Context.Provider>
)