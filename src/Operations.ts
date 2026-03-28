export class Operations {
    constructor() {

    }

    sqrt(n: number) {
        if (n < 0) return "Erro: número negativo";
        if (n === 0) return 0;

        let x = n;
        let y = (x + 1) / 2;

        while (y < x) {
            x = y;
            y = (x + n / x) / 2;
        }

        return x;
    }

    cbrt(n: number) {
        if (n === 0) return 0;

        let x = n;
        let precision = 0.000001;
        let erro = 1;

        while (erro > precision) {
            let nextX = (2 * x + n / (x * x)) / 3;
            erro = Math.abs(x - nextX);
            x = nextX;
        }
        return x;
    }

    sqrtN(x: number, n: number) {
        return this.pow(x, (1 / n));
    }

    pow(x: number, n: number,) {
        return x ** n
    }

    sin(x: number, terms: number = 10) {
        let result = 0;

        for (let n = 0; n < terms; n++) {
            const sign = (n % 2 === 0) ? 1 : -1;
            const power = 2 * n + 1;

            let factorial = 1;
            for (let i = 1; i <= power; i++) {
                factorial *= i;
            }

            result += sign * (this.pow(x, power) / factorial);
        }

        return result;
    }

    cos(x: number, terms: number = 10) {
        let result = 1;
        let term = 1;

        for (let n = 1; n < terms; n++) {
            term *= - (x * x) / ((2 * n - 1) * (2 * n));
            result += term;
        }

        return result;
    }

    tan(x: number, terms: number = 10) {
        const sin = this.sin(x, terms);
        const cos = this.cos(x, terms);

        if (Math.abs(cos) < 1e-10) {
            throw new Error("Tangente indefinida (coseno é zero)");
        }

        return sin / cos;
    }

    ln(x: number, terms: number = 20) {
        if (x <= 0) {
            throw new Error("ln só é definido para x > 0");
        }

        let k = 0;

        while (x > 2) {
            x /= Math.E;
            k++;
        }
        while (x < 0.5) {
            x *= Math.E;
            k--;
        }

        const y = (x - 1) / (x + 1);
        let result = 0;

        for (let n = 0; n < terms; n++) {
            const i = 2 * n + 1;
            result += (1 / i) * this.pow(y, i);
        }

        return 2 * result + k;
    }

    exp(x: number, n: number = 100000) {
        return this.pow(1 + x / n, n);
    }

    toRad(degrees: number) {
        return degrees * (Math.PI / 180);
    }
}
