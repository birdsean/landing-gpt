import React from 'react'

interface PillProps {
    text: string
    color: string
    className?: string
    onClick: (message: string) => void
}

function Pill(props: PillProps) {
    return (
        <button 
            className={`${props.className || ''} rounded-full bg-${props.color}-400 p-1 m-2 px-2 md:p-2 outline-white h-[36px]`}
            onClick={() => props.onClick(props.text)}
        >{props.text}</button>
    )
}

export default Pill
