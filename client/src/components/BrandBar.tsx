import React, {useContext} from 'react'
import {observer} from "mobx-react-lite"
import {Context} from "../main"
import {Card} from "react-bootstrap";

const BrandBar = observer(() => {
    const {device} = useContext(Context)
    return (
        <div className="d-flex justify-content-start">
            {device.brands.map(brand =>
                <Card
                    style={{cursor: "pointer"}}
                    active={brand.id === device.selectedBrand.id}
                    onClick={() => device.setSelectedBrand(brand)}
                    key={brand.id}
                    border={brand.id === device.selectedBrand.id ? 'danger' : 'light'}
                    className="p-3"
                >
                    {brand.name}
                </Card>
            )}
        </div>
    )
})

export default BrandBar
