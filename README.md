# Documentação da Calculadora

## Classe Calculator

Classe principal responsável por controlar a lógica da calculadora, interpretar expressões e executar operações.

### Instância

```ts id="p2k4jd"
const calc = new Calculator("display-id");
```

* `displayId`: id do input onde o resultado é exibido

---

### Estado interno

* `current`: expressão atual
* `lastCommand`: último botão pressionado
* `useKeyboard`: habilita input manual
* `autoConvert`: converte graus → radianos automaticamente
* `op`: instância de `Operations`

---

### Métodos principais

#### `append(value: string)`

Adiciona valor na expressão.

```ts
calc.append("1+2")
```

---

#### `set(value: string)`

Adiciona comandos prontos (ex: `sin(`, `√(`)

```ts
calc.set("sin(")
```

---

#### `backspace()`

Remove último caractere.

---

#### `clear()`

Limpa toda a expressão.

---

#### `calculate()`

Resolve e calcula a expressão atual.

Fluxo:

1. Sanitiza operadores finais
2. Resolve funções (`sin`, `√`, etc.)
3. Executa com `eval`

```ts
calc.calculate()
```

---

### Resolução de expressões

#### `resolve(expr: string)`

Responsável por interpretar funções personalizadas:

Suporta:

* `√(x)`
* `∛(x)`
* `ⁿ√(x)`
* `sin(x)`
* `cos(x)`
* `tan(x)`
* `ln(x)`
* `e^(x)`
* `x^(n)`

Funciona de dentro pra fora (parênteses mais internos primeiro).

---

### Funções suportadas

Mapeadas em:

```ts
fns: Record<string, fn>
```

Exemplo:

```ts
"sin(": x => this.op.sin(x)
```

---

### Métodos auxiliares

#### `sanitize()`

Remove operadores inválidos no final da expressão.

---

#### `checkNonMultOperators(command: string)`

Evita operadores duplicados:

```plain
++, --, **, //
```

---

#### `handleParentheses()`

Adiciona `*` automaticamente:

```plain
2(3+4) → 2*(3+4)
```

---

### Teclado

#### `enableKeyboard()`

* Ativa input manual
* Foca no display
* Escuta eventos

---

#### `disableKeyboard()`

* Desativa input manual

---

#### `handleKeyboard()`

Eventos:

* `change` → atualiza expressão
* `Enter` → executa cálculo

---

### Configurações

#### `enableAutoConvert()`

Converte graus → radianos automaticamente nas funções trigonométricas.

---

#### `disableAutoConvert()`

Desativa conversão automática.

---

### Observações

* Usa `eval` → cuidado com input externo
* Funções são resolvidas manualmente antes do cálculo
* Suporte a expressões aninhadas
* Dependência direta de `Operations`

---

## Classe UI

Classe responsável por renderizar a interface da calculadora e conectar os botões com a lógica do `Calculator`.

### Instância - UI

```ts
const ui = new UI(calc, "container-id", "extras-id");
```

* `calc`: instância da calculadora
* `containerId`: id onde ficam os botões principais
* `extrasId`: id dos botões avançados

---

### Comportamento

Ao instanciar:

* Renderiza automaticamente os botões básicos
* Renderiza os botões extras
* Vincula eventos de clique

---

### Botões principais

Inclui:

```literals
0-9, ., +, -, *, /, =, C, ⌫, (, )
```

Cada botão:

* Cria um `<button>`
* Aplica estilo padrão
* Chama `handleClick`

---

### Botões extras

Funções matemáticas adicionais:

* √x → `√(`
* ∛x → `∛(`
* ⁿ√x → `ⁿ√(`
* xⁿ → `^(`
* sen → `sin(`
* cos → `cos(`
* tg → `tan(`
* sec → `sec(`
* cotg → `cot(`
* eˣ → `e^(`
* ln → `ln(`
* rad → `rad(`

Ao clicar:

```ts id="j7e3wd"
this.calc.set(format);
```

---

### Métodos internos

#### `render()`

Cria os botões básicos e adiciona no container.

---

#### `renderExtras()`

Cria os botões avançados e armazena os labels em:

```ts id="t7l8v1"
extraCommands: string[]
```

---

#### `handleClick(value: string)`

Controla as ações dos botões:

* `=` → calcula resultado
* `C` → limpa tudo
* `⌫` → apaga último caractere
* `(` → trata abertura de parênteses
* outros → adiciona na expressão

Também:

```ts id="l9q2as"
this.calc.checkNonMultOperators(value)
this.calc.lastCommand = value;
```

---

### Observações classe Calculator

* A UI não faz cálculo direto, tudo é delegado para `Calculator`
* Os botões extras usam formatação pronta (ex: `sin(`)
* Depende de métodos da calculadora:

  * `append`
  * `set`
  * `calculate`
  * `clear`
  * `backspace`
  * `handleParentheses`
  * `checkNonMultOperators`

---

## Classe Operations

Classe utilitária com funções matemáticas básicas implementadas manualmente, sem uso direto de `Math` (em alguns casos).

### Instância - Operations

```ts
const op = new Operations();
```

---

### Métodos

#### `sqrt(n: number)`

Calcula a raiz quadrada usando método de Newton.

* Retorna número ou mensagem de erro se negativo

```ts
op.sqrt(9) // 3
```

---

#### `cbrt(n: number)`

Calcula a raiz cúbica por aproximação iterativa.

```ts
op.cbrt(27) // 3
```

---

#### `sqrtN(x: number, n: number)`

Calcula a raiz n-ésima.

```ts
op.sqrtN(16, 4) // 2
```

---

#### `pow(x: number, n: number)`

Potência simples.

```ts
op.pow(2, 3) // 8
```

---

#### `sin(x: number, terms?: number)`

Seno usando série de Taylor.

* `x` deve estar em radianos
* `terms` controla precisão (default: 10)

```ts
op.sin(op.toRad(90)) // ~1
```

---

#### `cos(x: number, terms?: number)`

Cosseno usando série de Taylor.

```ts
op.cos(op.toRad(60)) // ~0.5
```

---

#### `tan(x: number, terms?: number)`

Tangente baseada em seno/cosseno.

* Pode lançar erro se o cosseno for muito próximo de 0

```ts
op.tan(op.toRad(45)) // ~1
```

---

#### `ln(x: number, terms?: number)`

Logaritmo natural.

* Apenas para `x > 0`

```ts
op.ln(Math.E) // ~1
```

---

#### `exp(x: number, n?: number)`

Exponencial (e^x) por aproximação.

* `n` controla precisão (default: 100000)

```ts
op.exp(1) // ~2.718
```

---

#### `toRad(degrees: number)`

Converte graus para radianos.

```ts
op.toRad(180) // π
```

---

### Observações

* Funções trigonométricas usam **radianos**
* Precisão depende da quantidade de iterações (`terms` / `n`)
* Implementação focada em estudo, não performance

---
