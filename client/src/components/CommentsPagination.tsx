import React from 'react'
import {Pagination} from 'react-bootstrap'

interface CommentsPaginationProps {
    totalPages: number
    currentPage: number
    onPageChange: (page: number) => void
}

const CommentsPagination: React.FC<CommentsPaginationProps> = ({ totalPages, currentPage, onPageChange }) => {
    if (totalPages <= 1) return null

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

    return (
        <Pagination className="mt-4 justify-content-center">
            {pages.map((page) => (
                <Pagination.Item
                    key={page}
                    active={currentPage === page}
                    onClick={() => onPageChange(page)}
                >
                    {page}
                </Pagination.Item>
            ))}
        </Pagination>
    )
}

export default CommentsPagination
