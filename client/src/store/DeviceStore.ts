import {makeAutoObservable, runInAction} from "mobx"
import {$host} from "../http";

interface IType {
    id: number
    name: string
}

interface IBrand {
    id: number
    name: string
}

interface IDevice {
    id: number
    name: string
    price: number
    rating: number
    img: string
}

export default class DeviceStore {
    private _types: IType[]
    private _brands: IBrand[]
    private _devices: IDevice[]
    private _selectedType: IType | {}
    private _selectedBrand: IBrand | {}
    private _page: number
    private _totalCount: number
    private _limit: number
    private _pageCount: number
    constructor() {
        this._types = []
        this._brands = []
        this._devices = []
        this._selectedType = {}
        this._selectedBrand = {}
        this._page = 1
        this._totalCount = 0
        this._limit = 10
        this._pageCount = 0
        makeAutoObservable(this)
    }

    async loadConfig() {
        try {
            const {data} = await $host.get('api/device/config')
            runInAction(() => {
                this._limit = data.pagination.defaultLimit
            })
        } catch (e) {
            console.error('Failed to load config:', e)
        }
    }

    setPageCount(count: number): void {
        this._pageCount = count
    }

    get pageCount(): number {
        return this._pageCount
    }

    setTypes(types: IType[]): void {
        this._types = types
    }

    setSelectedType(type: IType | {}):void {
        this.setPage(1)
        this._selectedType = type
    }

    setSelectedBrand(brand: IBrand | {}):void {
        this.setPage(1)
        this._selectedBrand = brand
    }

    setPage(page: number): void {
        this._page = page
    }

    setTotalCount(count: number): void {
        this._totalCount = count
    }

    setBrands(brands: IBrand[]): void {
        this._brands = brands
    }

    setDevices(devices: IDevice[]): void {
        this._devices = devices
    }

    removeDevice(id: number) {
        this._devices = this._devices.filter((device) => device.id !== id)
    }

    get types() {
        return this._types
    }

    get brands() {
        return this._brands
    }

    get devices() {
        return this._devices
    }

    get selectedType() {
        return this._selectedType
    }

    get selectedBrand() {
        return this._selectedBrand
    }

    get totalCount() {
        return this._totalCount
    }

    get page() {
        return this._page
    }

    get limit() {
        return this._limit
    }

    updateDeviceRating(deviceId: number, newRating: number): void {
        const device = this.devices.find(d => d.id === deviceId)
        if (device) {
            device.rating = newRating
        }
    }

}