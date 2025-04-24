import {observer} from "mobx-react-lite"
import {useContext, useState} from "react"
import {Context} from "../../main"
import {Alert, Button, Form} from "react-bootstrap"
import {changePassword} from "../../http/userAPI";

const ChangePasswordForm = observer(() => {
    const context = useContext(Context)
    if (!context) {
        throw new Error('Context must be used within ContextProvider');
    }
    const { user } = context
    //const {user} = useContext(Context)
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (newPassword !== confirmPassword) {
            setError('New passwords do not match')
            return
        }
        try {
            await changePassword(user.user.email, currentPassword, newPassword)

            setSuccess('Password changed successfully')
            setError('')
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to change password')
            setSuccess('')
        }
    }

    return (
        <Form onSubmit={handleSubmit}>
            <h3>Change Password</h3>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form.Group controlId="currentPassword">
                <Form.Label>Current Password</Form.Label>
                <Form.Control
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                />
            </Form.Group>
            <Form.Group controlId="newPassword">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
            </Form.Group>
            <Form.Group controlId="confirmPassword">
                <Form.Label>Confirm New Password</Form.Label>
                <Form.Control
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
            </Form.Group>
            <Button type="submit" variant="primary" className="mt-3">
                Change Password
            </Button>
        </Form>
    )
})

export default ChangePasswordForm