import { print } from "../print";
import { EButtonUsage } from "../../common/enum";

const main = () => {
  let expression: string = "0";
  let isResultDisplayed = false;

  const updateDisplay = () => {
    print(expression || "0");
  };

  const handleKeyboardInput = (event: KeyboardEvent) => {
    const validKeys = /[0-9+\-*/.=]|Backspace|Enter/;

    if (!validKeys.test(event.key)) {
      return;
    }

    if (event.key === "Enter" || event.key === "=") {
      event.preventDefault();
      try {
        const result = eval(expression.replace("X", "*"));
        expression = String(result);
        isResultDisplayed = true;
      } catch {
        expression = "Ошибка";
      }
      updateDisplay();
      return;
    }

    if (event.key === "Backspace") {
      if (isResultDisplayed || expression === "Ошибка") {
        expression = "0";
        isResultDisplayed = false;
      } else if (expression.length > 1) {
        expression = expression.slice(0, -1); 
      } else {
        expression = "0";
      }
      updateDisplay();
      return;
    }

    if (/[0-9+\-*/.]/.test(event.key)) {
      if (isResultDisplayed || expression === "0" || expression === "Ошибка") {
        expression = "";
        isResultDisplayed = false;
      }
      expression += event.key;
      updateDisplay();
    }
  };

  document.addEventListener("keydown", handleKeyboardInput);

  return (state: EButtonUsage | string) => {
    if (state === EButtonUsage.OPERATOR_EQUAL) {
      try {
        const result = eval(expression.replace("X", "*"));
        expression = String(result);
        isResultDisplayed = true;
      } catch {
        expression = "Ошибка";
      }
      updateDisplay();
      return;
    }

    if (state === EButtonUsage.OPERATOR_C) {
      expression = "0";
      isResultDisplayed = false;
      updateDisplay();
      return;
    }

    if (state === EButtonUsage.OPERATOR_AC) {
      expression = "0";
      isResultDisplayed = false;
      updateDisplay();
      return;
    }

    if (typeof state === "string") {
      if (isResultDisplayed || expression === "0" || expression === "Ошибка") {
        expression = "";
        isResultDisplayed = false;
      }
      expression += state;
      updateDisplay();
    }
  };
};

export { main };
