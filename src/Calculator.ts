import { Operations } from "./Operations.js";

export class Calculator {
    private display: HTMLInputElement;
    private current: string = "";
    private useKeyboard: boolean = false
    private autoConvert: boolean = false
    private op: Operations = new Operations()
    private basicOperators = ['+', '-', '*', '/']
    private fns: Record<string, (...args: number[]) => number | any> = {
        "√(": x => this.op.sqrt(x),
        "∛(": x => this.op.cbrt(x),
        "rad(": x => this.op.toRad(x),
        "sin(": x => this.autoConvert ? this.op.sin(this.op.toRad(x)) : this.op.sin(x),
        "cos(": x => this.autoConvert ? this.op.cos(this.op.toRad(x)) : this.op.cos(x),
        "tan(": x => this.autoConvert ? this.op.tan(this.op.toRad(x)) : this.op.tan(x),
        "ln(": x => this.op.ln(x),
        "e^(": x => this.op.exp(x),
        "ⁿ√(": (n, x) => this.op.sqrtN(x, n),
        "^(": (x, n) => this.op.pow(x, n),
        "cot(": (x) => null,
        "sec(": (x) => null,
        "cosc(": (x) => null,
    };

    public lastCommand: string = "";

    constructor(displayId: string) {
        this.display = document.getElementById(displayId) as HTMLInputElement;
        this.display.disabled = !this.useKeyboard
    }

    append(value: string) {
        this.current += value;
        this.update();
    }

    backspace() {
        this.current = this.current.slice(0, -1)
        this.update();
    }

    set(value: string) {
        this.current += value;
        this.update();
    }

    clear() {
        this.current = "";
        this.update();
    }

    calculate() {

        try {
            this.sanitize();
            console.log(this.current)
            this.current = this.resolve(this.current);
            console.log(this.current)
            this.current = eval(this.current).toString();
        } catch (err) {
            this.current = "Erro";
            console.log(err)
        }
        this.update();
    }

    private update() {
        this.display.value = this.current;
    }

    private sanitize() {
        if (this.basicOperators.includes(this.current.charAt(this.current.length - 1))) this.backspace()

    }

    resolve(expr: string): string {
        const patterns = Object.keys(this.fns)
            .sort((a, b) => b.length - a.length);

        while (true) {
            let found = false;

            for (const p of patterns) {
                const idx = expr.lastIndexOf(p);
                if (idx === -1) continue;

                const start = idx + p.length;
                let i = start;
                let count = 1;

                while (i < expr.length) {
                    if (expr[i] === "(") count++;
                    else if (expr[i] === ")") count--;

                    if (count === 0) break;
                    i++;
                }

                if (count !== 0) throw new Error("Parênteses não fechado");

                const inside = expr.slice(start, i);
                const value = this.resolve(inside);

                let result;
                const fn = this.fns[p];

                if (p === "^(") {
                    let left = "";
                    let j = idx - 1;

                    while (j >= 0 && /[0-9.]/.test(expr[j]!)) {
                        left = expr[j] + left;
                        j--;
                    }

                    if (!left) throw new Error("Base inválida");

                    const base = Number(left);
                    const exponent = Number(value);

                    result = this.op.pow(base, exponent);
                    expr =
                        expr.slice(0, j + 1) +
                        result +
                        expr.slice(i + 1);

                    found = true;
                    break;
                }

                if (fn) {
                    const args = value.split(',').map(v => Number(v.trim()));
                    result = fn(...args);
                }

                expr =
                    expr.slice(0, idx) +
                    result +
                    expr.slice(i + 1);

                found = true;
                break;
            }

            if (!found) break;
        }

        return expr;
    }



    checkNonMultOperators(currentCommand: string) {

        this.basicOperators.includes(currentCommand)
            && this.basicOperators.includes(this.lastCommand)
            ? (this.backspace())
            : null
    }

    handleParentheses() {
        if (parseInt(this.lastCommand)) {
            this.append('*')
        }
    }

    enableKeyboard(): void {
        this.useKeyboard = true
        this.display.disabled = !this.useKeyboard
        this.display.focus();

        this.handleKeyboard()
    }

    disableKeyboard(): void {
        this.useKeyboard = false
        this.display.disabled = !this.useKeyboard
        this.display.removeEventListener('change', () => {})
        this.display.removeEventListener('keypress', () => {})
    }

    enableAutoConvert() {
        return this.autoConvert = true
    }

    disableAutoConvert() {
        return this.autoConvert = false
    }

    handleKeyboard() {
        this.display.addEventListener('change', e => {
            console.log(this.current)
            //@ts-ignore
            this.current = e?.target?.value
            console.log(this.current)
            this.update()
        })

        this.display.addEventListener('keypress', e => {
            if (e.key == 'Enter') return this.calculate()
        })
    }


}