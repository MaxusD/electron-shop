import React, {useContext, useEffect} from 'react'
import {Col, Container, Row} from "react-bootstrap"
import TypeBar from "../components/TypeBar"
import BrandBar from "../components/BrandBar"
import DeviceList from "../components/DeviceList"
import {observer} from "mobx-react-lite"
import {Context} from "../main"
import {fetchBrands, fetchTypes} from "../http/deviceAPI"
import Pages from "../components/Pages"
import {$host} from "../http"

const Shop = observer(() => {
    const {device} = useContext(Context)


    const fetchDevices = async () => {
        try {
            const {data} = await $host.get('api/device', {
                params: {
                    brandId: device.selectedBrand.id,
                    typeId: device.selectedType.id,
                    limit: device.limit,
                    page: device.page
                }
            });

            device.setDevices(data.rows);
            device.setTotalCount(data.count);


            if (data.pagination) {
                device.setPageCount(data.pagination.pageCount);
            }
        } catch (e) {
            console.error('Error fetching devices:', e);
        }
    }

    useEffect(() => {
        fetchTypes().then(data => device.setTypes(data))
        fetchBrands().then(data => device.setBrands(data))
        fetchDevices(/*null, null, 1, 5*/)/*.then(data => {
            device.setDevices(data.rows)
            device.setTotalCount(data.count)*/
        //})
    }, [device.page, device.selectedType, device.selectedBrand])

    /*useEffect(() => {
        fetchDevices(device.selectedType.id, device.selectedBrand.id, device.page, 10).then(data => {
            device.setDevices(data.rows)
            device.setTotalCount(data.count)
        })
    }, [device.page, device.selectedType, device.selectedBrand])*/


    return (
        <Container>
            <Row className="mt-2">
                <Col md={3}>
                    <TypeBar />
                </Col>
                <Col md={9}>
                    <BrandBar />
                    <DeviceList />
                    <Pages />
                </Col>
            </Row>
        </Container>
    )
})

export default Shop
