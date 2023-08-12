import React from "react";
import Pill from "./Pill";
import { PRODUCT_NAME } from "../../helpers/variables";

interface PillConfig {
  text: string;
  hyperlink?: string;
  hightlight?: boolean;
}

interface PillManagerProps {
  color: string;
  sendMessage: (message: string) => void;
}

const defaultPills: PillConfig[] = [
    { text: `What is ${PRODUCT_NAME}?` },
    { text: "How does it work?" },
    { text: "Who are you?" },
    { text: `How is it different?`},
    { text: `What does it cost?`},
    { text: `Show me a demo?`},
    { text: `Is it customizable?`},
    // { text: `Any discounts?`},
    { text: `Can I trust ${PRODUCT_NAME}?`},
]


const COUNT_PILLS = 3

function PillManager(props: PillManagerProps) {
  const [pills, setPills] = React.useState<PillConfig[]>(defaultPills);

  const onClick = (text: string) => {
    // remove pill from pills that has matching text
    props.sendMessage(text);
    const newPills = pills.filter((pill) => pill.text !== text);
    setPills(newPills);
  }

  const renderedPills = pills?.map((pill, index) => {
    if (index >= COUNT_PILLS) {
        return <></>
    }
    return (
      <Pill
        key={index}
        text={pill.text}
        color={props.color}
        onClick={onClick}
        className={index > COUNT_PILLS - 1 ? 'hidden md:inline' : ''}
      />
    );
  });

  return <>{renderedPills}</>;
}

export default PillManager;
