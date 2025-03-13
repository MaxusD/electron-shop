import {createContext} from 'react'
import UserStore from './store/UserStore'
import {createRoot} from "react-dom/client"
import App from "./App"
import DeviceStore from "./store/DeviceStore"

interface ContextType {
    user: UserStore
    device: DeviceStore
}

export const Context = createContext<ContextType | null>(null)
console.log(process.env.REACT_APP_API_URL)

createRoot(document.getElementById('root')!).render(
  <Context.Provider value={{
      user: new UserStore(),
      device: new DeviceStore()
  }}>
    <App />
  </Context.Provider>
)