<script lang="ts">
    import { fly } from "svelte/transition";

    import Charbox from "$lib/Charbox.svelte";

    const blank = "ƀ";
    const positionOffset = 6;
    type Direction = "L" | "R";

    let string = "jdfosjkfghtrtrhrthrthruf";
    let position = 0;
    let directionSign: number;

    let modifiedString = string;
    let padded = 0;

    $: if (position > string.length - positionOffset - 1) {
        modifiedString = string.padEnd(positionOffset + position + 1, blank);
    } else if (position < positionOffset) {
        padded = positionOffset - position;
        modifiedString = string.padStart(string.length + padded, blank);
    } else {
        modifiedString = string;
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
    console.log(
        +getComputedStyle(document.documentElement)
            .getPropertyValue("--charbox-size")
            .slice(0, -2)
    );
</script>

<h1>Maquina de Turing</h1>

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
    <button on:click={() => move("R")}>Mover a la derecha</button>
    <button on:click={() => move("L")}>Mover a la izquierda</button>
</div>

<style>
    :root {
        --charbox-size: 66px;
    }
    :global(body) {
        background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
            url(https://images.newscientist.com/wp-content/uploads/2016/06/29180000/crmt0d.jpg);
        margin: auto;
    }
    .hidden {
        display: none;
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
        margin-bottom: 2em;
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
    h1 {
        text-align: center;
        color: #ffffff;
        font-size: 50px;
        padding: 5px;
        margin: 3%;
    }
    .current {
        background-color: rgb(90, 225, 232);
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
        background-color: #6294d6;
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
</style>
