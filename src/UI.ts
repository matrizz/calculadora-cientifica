import type { Calculator } from "./Calculator.js";

export class UI {
    private calc: Calculator;
    private container: HTMLElement;
    private extras: HTMLElement;
    private extraCommands: Array<string> = []


    constructor(calc: Calculator, containerId: string, extrasId: string) {
        this.calc = calc;
        this.container = document.getElementById(containerId)!;
        this.extras = document.getElementById(extrasId)!;
        this.render();
        this.renderExtras();
    }

    private render() {
        const buttons = [
            "7", "8", "9", "/",
            "4", "5", "6", "*",
            "1", "2", "3", "-",
            "0", ".",",", "=", "+",
            "C", "(", ")","⌫"
        ];

        buttons.forEach(btn => {
            const el = document.createElement("button");
            el.textContent = btn;
            el.className = "bg-gray-700 text-white p-2 rounded hover:bg-gray-600";

            el.onclick = () => this.handleClick(btn);
            this.container.appendChild(el);
        });
    }

    private renderExtras() {
        const extras = [
            { label: "√x", format: "√(" },
            { label: "∛x", format: "∛(" },
            { label: "ⁿ√x", format: "ⁿ√(" },
            { label: "xⁿ", format: "^(" },
            { label: "sen x", format: "sin(" },
            { label: "cos x", format: "cos(" },
            { label: "tg x", format: "tan(" },
            { label: "sec x", format: "sec(" },
            { label: "cotg x", format: "cot(" },
            { label: "cosec x", format: "cosc(" },
            { label: "eˣ", format: "e^(" },
            { label: "ln x", format: "ln(" },
            { label: "rad x", format: "rad(" },
        ];


        extras.forEach(btn => {
            this.extraCommands.push(btn.label);
            const el = document.createElement("button");
            el.textContent = btn.label;
            el.className = "bg-purple-700 text-white p-2 rounded hover:bg-purple-600";

            el.onclick = () => this.calc.set(btn.format);
            this.extras.appendChild(el);
        });
    }

    private handleClick(value: string) {
        this.calc.checkNonMultOperators(value)
        
        if (value === "=") return this.calc.calculate();
        if (value === "C") return this.calc.clear();
        if (value === "⌫") return this.calc.backspace();
        
        if (value === "(") this.calc.handleParentheses();

        this.calc.lastCommand = value;
        this.calc.append(value);
    }

    
}
