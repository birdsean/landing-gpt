import React from 'react'
import Pill from './Pill';

interface PillConfig {
    text: string;
    hyperlink?: string;
    hightlight?: boolean;
}

interface PillManagerProps {
    color: string;
    sendMessage: (message: string) => void;
}

function PillManager(props: PillManagerProps) {
    const [pills, setPills] = React.useState<PillConfig[]>()

    const renderedPills = pills?.map((pill, index) => {
        return (
            <Pill key={index} text={pill.text} color={props.color} onClick={props.sendMessage} />
        )
    })

    return (
        <>{renderedPills}</>
    )
}

export default PillManager
