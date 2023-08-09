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

/**'1. What makes [Product Name] special?\n' +
    '2. Why choose [Product Name]?\n' +
    '3. How is [Product Name] different?\n' +
    '4. Can [Product Name] help me?\n' +
    '5. Show me a [Product Name] demo?\n' +
    '6. Is [Product Name] customizable?\n' +
    '7. How secure is [Product Name]?\n' +
    '8. Does [Product Name] save time?\n' +
    '9. Who uses [Product Name]?\n' +
    "10. What's the cost of [Product Name]?\n" +
    '11. Any discounts or offers?\n' +
    '12. Can I trust [Product Name]?\n' +
    '13. Is [Product Name] user-friendly?\n' +
    '14. Where is [Product Name] used?\n' +
    '15. Does [Product Name] have support?\n' +
    '16. Are updates included?\n' +
    '17. What if I need help?\n' +
    '18. Can anyone use [Product Name]?\n' +
    '19. Are there [Product Name] tutorials?\n' +
    '20. What have others said?' */

const defaultPills: PillConfig[] = [
    { text: `What is ${PRODUCT_NAME}?` },
    { text: "How does it work?" },
    { text: "Who are you?" },
    { text: `How is it different?`},
    { text: `Show me a demo?`},
    { text: `Is it customizable?`},
    { text: `What does it cost?`},
    { text: `Any discounts?`},
    { text: `Can I trust ${PRODUCT_NAME}?`},
]

function PillManager(props: PillManagerProps) {
  const [pills, setPills] = React.useState<PillConfig[]>(defaultPills);

  const onClick = (text: string) => {
    // remove pill from pills that has matching text
    props.sendMessage(text);
    const newPills = pills.filter((pill) => pill.text !== text);
    setPills(newPills);
  }

  const renderedPills = pills?.map((pill, index) => {
    if (index > 4) {
        return <></>
    }
    return (
      <Pill
        key={index}
        text={pill.text}
        color={props.color}
        onClick={onClick}
        className={index > 2 ? 'hidden md:inline' : ''}
      />
    );
  });

  return <>{renderedPills}</>;
}

export default PillManager;
