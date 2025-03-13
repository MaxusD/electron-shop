import React, {useEffect} from "react"
import {Modal} from "react-bootstrap"

interface SuccessAlertProps {
    message: string
    show: boolean
    onClose: () => void
}

const SuccessAlert: React.FC<SuccessAlertProps> = ({message, show, onClose}) => {
    useEffect(() => {
        if (show) {
            setTimeout(() => {
                onClose()
            }, 2000)
        }
    }, [show, onClose])

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Body className="text-center">
                <h4>{message}</h4>
            </Modal.Body>
        </Modal>
    )
}

export default SuccessAlert