import React from 'react'

interface QuestionPillProps {
    question: string
    color: string
    sendMessage: (message: string) => void
}

function QuestionPill(props: QuestionPillProps) {
    return (
        <button 
            className={`rounded-full bg-${props.color}-400 p-1 m-2 px-2 md:p-2 outline-white`}
            onClick={() => props.sendMessage(props.question)}
        >{props.question}</button>
    )
}

export default QuestionPill
