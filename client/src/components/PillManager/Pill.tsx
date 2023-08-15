import React from 'react'
import { useNavigate } from 'react-router-dom'

interface PillProps {
    text: string
    color: string
    className?: string
    path?: string
    onClick: (message: string) => void
}

function Pill(props: PillProps) {
    const navigate = useNavigate()

    return (
        <button 
            className={`${props.className || ''} rounded-full bg-${props.color} p-1 m-2 px-2 sm:p-2 outline-white`}
            onClick={props.path ? () => navigate(props.path || '') : () => props.onClick(props.text)}
        >{props.text}</button>
    )
}

export default Pill
