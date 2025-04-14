import {useContext} from 'react'
import {observer} from "mobx-react-lite"
import {Context} from "../main"
import {Pagination} from "react-bootstrap"

const Pages = observer(() => {
    const {device} = useContext(Context)
    const pageCount = device.pageCount || Math.ceil(device.totalCount / (device.limit || 1))
    const pages =[]

    const validPageCount = pageCount > 0 ? pageCount : 1

    for (let i = 0; i < validPageCount; i++) {
        pages.push(i + 1)
    }
    return (
        <Pagination className="mt-5" style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center'
        }}>
            {pages.map(page =>
                <Pagination.Item
                    key={page}
                    active={device.page === page}
                    onClick={() => device.setPage(page)}
                >
                    {page}
                </Pagination.Item>
            )}
        </Pagination>
    )
})

export default Pages
