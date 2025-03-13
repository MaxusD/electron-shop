import {makeAutoObservable} from "mobx"

export default class DeviceStore {
    private _types: Array<{id: number, name: string}>
    private _brands: Array<{id: number, name: string}>
    private _devices: Array<{id: number, name: string, price: number, rating: number, img: string}>
    private _selectedType: object
    private _selectedBrand: object
    private _page: number
    private _totalCount: number
    private readonly _limit: number
    constructor() {
        this._types = []
        this._brands = []
        this._devices = []
        this._selectedType = {}
        this._selectedBrand = {}
        this._page = 1
        this._totalCount = 0
        this._limit = 5
        makeAutoObservable(this)
    }

    setTypes(types) {
        this._types = types
    }

    setSelectedType(type) {
        this.setPage(1)
        this._selectedType = type
    }

    setSelectedBrand(brand) {
        this.setPage(1)
        this._selectedBrand = brand
    }

    setPage(page) {
        this._page = page
    }

    setTotalCount(count) {
        this._totalCount = count
    }

    setBrands(brands) {
        this._brands = brands
    }

    setDevices(devices) {
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
}