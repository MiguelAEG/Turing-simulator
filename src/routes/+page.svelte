<script lang="ts">
    import { fly } from "svelte/transition";
    import Charbox from "$lib/Charbox.svelte";
    import {
        TuringMachine,
        type Rule,
        type Direction,
        type State,
    } from "$lib/TuringMachine";

    import storedRules from "$lib/rules.json";

    const blank = "ƀ";
    const positionOffset = 6;

    const rules: Rule[] = storedRules.map((rule) => {
        return {
            currentState: rule.currentState as State,
            currentChar:
                rule.currentChar === "BLANK" ? blank : rule.currentChar,
            newState: rule.newState as State,
            newChar: rule.newChar === "BLANK" ? blank : rule.newChar,
            move: rule.move as Direction,
        };
    });

    let rawString = "abababba";
    let string =
        blank + rawString.padEnd(rawString.length + positionOffset, blank);
    $: {
        string =
            blank + rawString.padEnd(rawString.length + positionOffset, blank);
        reset();
    }
    let position = 0;
    let directionSign: number;
    let accepted = false;
    let state = "q0";
    let stopped = false;
    let active = -1;

    let modifiedString = string;
    let padded = 0;

    $: {
        if (position < positionOffset) {
            padded = positionOffset - position;
            modifiedString = string.padStart(string.length + padded, blank);
        } else {
            modifiedString = string;
        }
    }

    function move(direction: Direction) {
        if (direction === "L") {
            directionSign = -1;
            position--;
        } else if (direction === "R") {
            padded = 0;
            directionSign = 1;
            position++;
        }
    }

    function step() {
        const ret = turingMachine.step();
        move(ret[0]);
        accepted = turingMachine.accept();
        state = ret[1];
        string = ret[2];
        active = ret[3];
        stopped = ret[0] === "S";
    }

    let turingMachine = new TuringMachine(rules, "q9", string, "PIA");

    let intervalSeconds = 0.43;
    let hyperSpeed = false;

    $: if (hyperSpeed) {
        intervalSeconds = 0.91;
    } else if (intervalSeconds > 0.85) {
        intervalSeconds = 0.43;
    }
    let paused = true;

    let interval: NodeJS.Timer;
    function toggle() {
        if (stopped) {
            reset();
            return;
        }
        paused = !paused;
        if (paused) {
            clearInterval(interval);
        }
    }

    $: if (!paused) {
        clearInterval(interval);
        interval = setInterval(
            step,
            (1.5 * (0.91 - intervalSeconds)) ** 2.4 * 1000
        );

        if (accepted || stopped) {
            clearInterval(interval);
            paused = true;
        }
    }

    function reset() {
        string =
            blank + rawString.padEnd(rawString.length + positionOffset, blank);
        position = 0;
        directionSign = 1;
        accepted = false;
        state = "q0";
        stopped = false;
        turingMachine = new TuringMachine(rules, "q9", string, "PIA");
        paused = true;
        active = -1;
        clearInterval(interval);
    }
</script>

<h1>Maquina de Turing</h1>
<h2>{stopped ? (accepted ? "Aceptado" : "Rechazado") : ""}</h2>
<h2>{state}</h2>

<section id="strip-flex">
    <div id="strip">
        <div id="strip-string">
            {#each modifiedString as char, i}
                {#key position}
                    <div
                        class:hidden={i < position - positionOffset ||
                            i > position + positionOffset + padded}
                        class:current={i - padded === position ? true : false}
                        in:fly={{
                            x:
                                +getComputedStyle(document.documentElement)
                                    .getPropertyValue("--charbox-size")
                                    .slice(0, -2) * directionSign,
                            y: 0,
                            duration: 500,
                            opacity: 1,
                        }}
                    >
                        <Charbox {char} />
                    </div>
                {/key}
            {/each}
        </div>
    </div>
</section>

<div class="center">
    <button on:click={toggle}>Iniciar / Parar</button>
    <button on:click={() => reset()}>Reiniciar</button>
    <label for="velocidad">Velocidad:</label>
    <input
        disabled={hyperSpeed}
        type="range"
        id="velocidad"
        min="0.01"
        max="0.85"
        step="0.03"
        bind:value={intervalSeconds}
    />
    <label for="hipervelocidad">Hipervelocidad?</label>
    <input type="checkbox" id="hipervelocidad" bind:checked={hyperSpeed} />
</div>

<div class="center">
    <label for="string">Cadena:</label>
    <input type="text" id="string" bind:value={rawString} />
</div>

<div>
    <h3>Reglas</h3>
    <ol id="rules-list">
        {#each rules as rule, i}
            <li class:active={active === i && !stopped}>
                δ({rule.currentState}, {rule.currentChar}) = ({rule.newState}, {rule.newChar},
                {rule.move})
            </li>
        {/each}
    </ol>
</div>

<style>
    :root {
        --charbox-size: 66px;
    }
    :global(body) {
        background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
            url(https://images.newscientist.com/wp-content/uploads/2016/06/29180000/crmt0d.jpg);
        margin: auto;
        background-size: cover;
    }
    .hidden {
        display: none;
    }
    .active {
        background-color: rgb(25, 143, 19);
        color: white;
    }
    .center {
        text-align: center;
    }
    #strip-flex {
        display: flex;
        justify-content: center;
        max-width: 100%;
        padding: 0 2em;
    }
    #strip {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 0.5em;
        height: 80px;
        max-width: 710px;
        overflow: hidden;
    }
    #strip-string {
        border: 3px solid;
        background: white;
        display: grid;
        grid-template-columns: repeat(13, var(--charbox-size));
        grid-template-rows: var(--charbox-size);
        align-items: center;
    }

    #rules-list {
        margin-top: 40px;
        display: flex;
        align-items: center;
        flex-flow: wrap column;
        max-height: 200px;
        font-weight: bold;
        font-size: large;
        color: white;
    }
    #string{
        width: 200px;
        height: 30px;
        font-size: 20px;
        border-radius: 5px;
        
    }
    li {
        background: rgba(179, 16, 16, 0.448);
        color: white;
        padding: 0.5em;
    }
    label {
        margin: 0 1em;
        color: white;
        font-size: 1.3em;
    }
    h1 {
        color: #fff;
  text-shadow:
    0 0 7px #fff,
    0 0 10px #fff,
    0 0 21px #fff,
    0 0 42px rgb(22, 143, 218),
    0 0 82px rgb(22, 143, 218),
    0 0 92px rgb(22, 143, 218),
    0 0 102px rgb(22, 143, 218),
    0 0 151px rgb(22, 143, 218);
        text-align: center;
        color: #ffffff;
        font-size: 55px;
        padding: 5px;
        margin: 3%;
    }
    h2 {
        text-align: center;
        color: white;
        font-size: 25px;
    }
    h3 {
        margin-top:  35px;
        text-align: center;
        color: rgb(166, 255, 252);
        font-size: 25px;
    }
    .current {
        background-color: rgb(119, 237, 244);
    }
    .hidden {
        display: none;
    }
    button {
        background-color: #0844a5;
        border-radius: 8px;
        border-style: none;
        color: white;
        cursor: pointer;
        font-size: 14px;
        height: 40px;
        margin: 10px;
        padding: 12px 16px;
        text-align: center;
        transition: color 100ms;
        touch-action: manipulation;
        align-items: center;
    }
    button:hover {
        background-color: #02142b;
    }

    @media screen and (max-width: 768px) {
        :root {
            --charbox-size: 57px;
        }
        #strip-flex {
            padding: 0 1em;
        }
        #strip {
            max-width: 613px;
        }
    }

    @media screen and (max-width: 600px) {
        #rules-list {
            max-height: 250px;
        }
    }
    @media screen and (max-width: 400px) {
        #rules-list {
            max-height: initial;
        }
    }
</style>
