import React, {useEffect, useState} from "react"
import axios from "axios"
import Form from "react-bootstrap/Form"
import {Button} from "react-bootstrap"
import Card from "react-bootstrap/Card"
import StarRating from "./StarRating.tsx"
import CommentsPagination from "./CommentsPagination.tsx";

interface Comment {
    [x: string]: any
    id: number
    text: string
    userId: number
    deviceId: number
}

interface CommentsProps {
    deviceId: number
    userId: number
}

const Comments: React.FC<CommentsProps> = ({deviceId, userId}) => {
    const [comments, setComments] = useState<Comment[]>([])
    const [newComment, setNewComment] = useState<string>('')

    const [totalPages, setTotalPages] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)

    const token = localStorage.getItem("token")
    const headers = {Authorization: `Bearer ${token}`}

    // useEffect(() => {
    //     axios.get(`${process.env.REACT_APP_API_URL}api/comment/${deviceId}`)
    //         .then(res => setComments(res.data))
    //         .catch(err => console.error("Can't load comments:", err))
    // }, [deviceId])

    const fetchComments = async (page = 1) => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}api/comment/${deviceId}?page=${page}&limit=5`)
            setComments(res.data.comments)
            setTotalPages(res.data.totalPages)
            setCurrentPage(res.data.currentPage)
        } catch (e) {
            console.error("Can't load comments:", e)
        }
    }

    useEffect(() => {
        fetchComments(1)
    }, [deviceId])


    const handleAddComment = async () => {
        if (!newComment.trim()) {
            return
        }

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}api/comment/add`, {
                deviceId,
                text: newComment
            }, {headers, withCredentials: true})
            setComments([...comments, res.data])
            setNewComment('')
        } catch (e) {
            console.error("Can't add comment:", e)
        }
    }

    const formatDateTime = (dateStr: string) => {
        const date = new Date(dateStr)
        const optionsDate: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }

        const optionsTime: Intl.DateTimeFormatOptions = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }

        const formattedDate = date.toLocaleDateString('uk-UA', optionsDate)
        const formattedTime = date.toLocaleTimeString('uk-UA', optionsTime)

        return `${formattedDate} | ${formattedTime}`
    }

    return (
        <div>
            <h3>Comments</h3>
            <CommentsPagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={fetchComments}
            />

            {comments.map(comment => (
                <div>
                    <Card
                        bg={'primary'}
                        key={comment.id}
                        text={'white'}
                        className="mb-2 w-100"
                    >
                        <Card.Header className='d-flex justify-content-between'>
                            <div>{comment.user.firstName}</div>
                            {comment.rating && (
                                <div>
                                    <StarRating rating={comment.rating.name} disabled={true} />
                                    <div>{comment.rating.name.toFixed(1)}</div>
                                </div>
                            )}
                            <div>{formatDateTime(comment.createdAt)}</div>
                        </Card.Header>
                        <Card.Body>
                            <Card.Text className='text-start'>
                                {comment.text}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </div>
            ))
            }
            {userId && (
                <div>
                    <Form.Control
                        as="textarea"
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        placeholder="Leave a comment here"
                        style={{height: '100px'}}
                    />

                    <div className='d-flex pt-2 flex-row justify-content-end'>
                        <Button className='ps-3 pe-3' variant="success"
                                onClick={handleAddComment}>Submit</Button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Comments