import React, { useState } from "react"
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa"

interface StarRatingProps {
    rating: number
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
    /*const [rating, setRating] = useState(0)
    const [hover, setHover] = useState(0)*/
    const stars = []

    /*const handleClick = (value: number) => {
        setRating(value)
        if (onRatingChange) {
            onRatingChange(value)
        }
    }*/

    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            stars.push(<FaStar key={i} color="#ffc107" />)
        } else if (i - 0.5 === rating) {
            stars.push(<FaStarHalfAlt key={i} color="#ffc107" />)
        } else {
            stars.push(<FaRegStar key={i} color="#ffc107" />)
        }
    }

    return (
        <div style={{gap: "2px"}}>
            {/*{[1, 2, 3, 4, 5].map((star) => (*/}
            {/*    <FaStar*/}
            {/*        key={star}*/}
            {/*        size={30}*/}
            {/*        className="cursor-pointer"*/}
            {/*        color={(hover || rating) >= star ? "#ffc107" : "#e4e5e9"}*/}
            {/*        onMouseEnter={() => setHover(star)}*/}
            {/*        onMouseLeave={() => setHover(0)}*/}
            {/*        onClick={() => handleClick(star)}*/}
            {/*    />*/}
            {/*))}*/}
            {stars}
        </div>
    )
}

export default StarRating
