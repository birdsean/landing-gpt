import React from "react";
import Pill from "./Pill";
import { PRODUCT_NAME } from "../../helpers/variables";

interface PillConfig {
  text: string;
  route?: string;
  hightlight?: boolean;
  onClick?: () => void;
}

interface PillManagerProps {
  color: string;
  disabled?: boolean;
  sendMessage: (message: string) => void;
  onClickJoinWaitlist: () => void;
}

const COUNT_PILLS = 3;

function PillManager(props: PillManagerProps) {
  const defaultPills: PillConfig[] = [
    { text: `What is ${PRODUCT_NAME}?` },
    { text: "How does it work?" },
    { text: "Who are you?" },
    { text: "Who is it for?" },
    { text: "Join waitlist", hightlight: true, onClick: props.onClickJoinWaitlist },
    { text: `What does it cost?` },
    { text: `Can I trust ${PRODUCT_NAME}?` },
  ];
  const [pills, setPills] = React.useState<PillConfig[]>(defaultPills);

  const onClick = (text: string) => {
    if (props.disabled) return;

    // remove pill from pills that has matching text
    props.sendMessage(text);
    const newPills = pills.filter((pill) => pill.text !== text);
    setPills(newPills);
  };

  // if "who are you?" pill is ever at position 0, remove it
  React.useEffect(() => {
    if (pills[0]?.text === "Who are you?") {
      const newPills = pills.filter((pill) => pill.text !== "Who are you?");
      setPills(newPills);
    }
  }, [pills]);

  const renderedPills = pills?.map((pill, index) => {
    if (index > COUNT_PILLS) {
      return <></>;
    }

    const pillOnClick = () => {
      if (pill.onClick) {
        pill.onClick();
      }
      onClick(pill.text);
    }

    return (
      <Pill
        key={pill.text}
        text={pill.text}
        color={pill.hightlight ? "white" : `${props.color}-400`}
        onClick={pillOnClick}
        path={pill.route}
        className={index > COUNT_PILLS - 1 ? "hidden sm:inline" : ""}
      />
    );
  });

  return (
    <div className={`flex flex-row ${pills.length < 4 ? '' : 'justify-between'} leading-none mb-1 text-sm`}>
      {renderedPills}
    </div>
  );
}

export default PillManager;
