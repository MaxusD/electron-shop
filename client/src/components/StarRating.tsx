import React, { useState } from "react"
import { FaStar, FaStarHalfAlt } from "react-icons/fa"

interface StarRatingProps {
    rating: number
    onRatingChange?: (newRating: number) => void
    disabled?: boolean //voting
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange, disabled = false }) => {

    const [hover, setHover] = useState<number | null>(null)
    //const stars = []

    return (
        <div style={{ display: "flex", gap: "4px" }}>
            {[1, 2, 3, 4, 5].map((star) => {
                const full = (hover ?? rating) >= star
                const half = !full && (hover ?? rating) + 0.5 >= star

                return (
                    <span key={star} style={{ cursor: disabled ? "default" : "pointer" }}
                          onMouseEnter={() => !disabled && setHover(star)}
                          onMouseLeave={() => setHover(null)}
                          onClick={() => !disabled && onRatingChange?.(star)}>
                        {full ? <FaStar size={20} color="#ffc107" />
                            : half ? <FaStarHalfAlt size={20} color="#ffc107" />
                                : <FaStar size={20} color="#e4e5e9" />}
                    </span>
                )
            })}
        </div>
    )
}

export default StarRating
