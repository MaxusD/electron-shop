import { v4 as uuidv4 } from 'uuid'
import { Row, Col, Form, Button } from "react-bootstrap"
import React from "react"

interface InfoItem {
    number: string
    title: string
    description: string
}

interface DeviceInfoFormProps {
    info: InfoItem[]
    setInfo: React.Dispatch<React.SetStateAction<InfoItem[]>>
}

const DeviceInfoForm = ({ info, setInfo }: DeviceInfoFormProps) => {

    const addInfo = () => {
        setInfo(prevInfo => [
            ...prevInfo,
            { number: uuidv4(), title: '', description: '' }
        ])
    }

    const removeInfo = (number: string) => {
        setInfo(prevInfo => {
            const updatedInfo = prevInfo.filter(item => item.number !== number)
            return updatedInfo
        })
    }


    const changeInfo = (
        key: keyof InfoItem,
        value: string,
        number: string
    ) => {
        setInfo(prevInfo =>
            prevInfo.map(item =>
                item.number === number ? { ...item, [key]: value } : item
            )
        )
    }
    return (
        <>
            <Button className="mt-3" variant="outline-dark" onClick={addInfo}>
                Add new param
            </Button>

            {info.map((i) => (
                <Row key={i.number || uuidv4()} className="mt-3">
                    <Col md={4}>
                        <Form.Control
                            value={i.title}
                            onChange={(e) => changeInfo("title", e.target.value, i.number)}
                            placeholder="Type name of param"
                        />
                    </Col>
                    <Col md={6}>
                        <Form.Control
                            value={i.description}
                            as='textarea'
                            onChange={(e) => changeInfo("description", e.target.value, i.number)}
                            placeholder="Type description of param"
                        />
                    </Col>
                    <Col md={2}>
                        <Button onClick={() => removeInfo(i.number)} variant="outline-danger">
                            Delete
                        </Button>
                    </Col>
                </Row>
            ))}
        </>
    )
}

export default DeviceInfoForm
