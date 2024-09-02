
import gsap from 'gsap'
import React, { useEffect, useRef } from 'react'

const FloatingShape = ({ size, color, top, left, y, x, delay, duration }) => {
    const reference = useRef(null)
    useEffect(() => {
        gsap.to(reference.current, {
            y,
            x,
            opacity:1,
            duration,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
            delay,
            skewY: 5,
     

        })
    }, [])
    return (
        <div
            ref={reference}
            className={`absolute ${size} ${color} blur-xl rounded-full opacity-20 `}
            style={{ top, left }}
            aria-hidden='true'
        >
        </div>
    )
}

export default FloatingShape