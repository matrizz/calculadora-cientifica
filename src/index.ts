import { Calculator } from "./Calculator.js";
import { UI } from "./UI.js";

const enableKeyboard = document.querySelector<HTMLInputElement>("#enable-keyboard")
const enableAutoConvert = document.querySelector<HTMLInputElement>("#enable-auto-convert")

const calc = new Calculator("display");
new UI(calc, "buttons", "extras");

enableKeyboard?.addEventListener('change', () => {
    enableKeyboard.checked? calc.enableKeyboard() : calc.disableKeyboard()
})

enableAutoConvert?.addEventListener('change', () => {
    enableAutoConvert.checked? calc.enableAutoConvert() : calc.disableAutoConvert()
})

document.querySelectorAll('.extra').forEach(btn => {
    btn.classList.add('bg-purple-700', 'text-white', 'p-2', 'rounded', 'hover:bg-purple-600');
});

