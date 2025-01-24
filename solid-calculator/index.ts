import { print } from "../print";
import { EButtonUsage } from "../../common/enum";

const main = () => {
  let expression: string = "0";
  let isResultDisplayed = false; 

  const updateDisplay = () => {
    print(expression || "0");
  };


  const evaluateExpression = (expr: string): string => {
    try {
      const sanitizedExpression = expr.replace(/[^0-9+\-*/.]/g, "").replace(/X/g, "*");
      const result = new Function(`return ${sanitizedExpression}`)();
      return isFinite(result) ? String(result) : "Ошибка";
    } catch {
      return "Ошибка";
    }
  };

  const isValidExpression = (expr: string): boolean => {
    return /^[0-9]+(\.[0-9]*)?([+\-*/][0-9]*(\.[0-9]*)?)*$/.test(expr);
  };

  const handleKeyboardInput = (event: KeyboardEvent) => {
    const validKeys = /[0-9+\-*/.=]|Backspace|Enter/;

    if (!validKeys.test(event.key)) {
      return;
    }

    if (event.key === "Enter" || event.key === "=") {
      event.preventDefault();
      expression = evaluateExpression(expression);
      isResultDisplayed = true;
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
      const newExpression = expression + event.key;

      if (isValidExpression(newExpression)) {
        expression = newExpression;
      }
      updateDisplay();
    }
  };

  document.addEventListener("keydown", handleKeyboardInput);

  return (state: EButtonUsage | string) => {
    if (state === EButtonUsage.OPERATOR_EQUAL) {
      expression = evaluateExpression(expression);
      isResultDisplayed = true;
      updateDisplay();
      return;
    }

    if (state === EButtonUsage.OPERATOR_C) {
      if (expression.length > 1) {
        expression = expression.slice(0, -1);
      } else {
        expression = "0";
      }
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

      const input = state === "X" ? "*" : state;
      const newExpression = expression + input;

      if (isValidExpression(newExpression)) {
        expression = newExpression;
      }
      updateDisplay();
    }
  };
};

export { main };
