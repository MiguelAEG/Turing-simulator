<script lang="ts">
    import { fly, fade } from "svelte/transition";

    import Charbox from "$lib/Charbox.svelte";

    const blank = "ƀ";
    const positionOffset = 5;
    type Direction = "L" | "R";

    let string = "jdfosjkfguf";
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
</script>

<h1>Maquina de Turing</h1>

<section class="strip">
    <div class="strip_string">
        {#each modifiedString as char, i}
            {#key position}
                <div
                    class:hidden={i < position - positionOffset ||
                        i > position + positionOffset + padded}
                    class:current={i - padded === position ? true : false}
                    in:fly={{
                        x: 66 * directionSign,
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
</section>

<div class="center">
<button on:click={() => move("R")}>Mover a la derecha</button>
<button on:click={() => move("L")}>Mover a la izquierda</button>
</div>

<style>

 :global(body) {
		 background:
        linear-gradient(
          rgba(0, 0, 0, 0.5), 
          rgba(0, 0, 0, 0.5)
        ),
        url(https://images.newscientist.com/wp-content/uploads/2016/06/29180000/crmt0d.jpg);
    margin: auto;
	}

    h1{
        text-align: center;
        color: #FFFFFF;
        font-size: 50px;
        padding: 5px;
        margin: 3%;
        
    }
    .center{
        text-align: center;
    }
    .current {
        background-color: rgb(90, 225, 232);
    }
    .hidden {
        display: none;
    }
    .strip {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 2em;
        height: 80px;
        overflow: hidden;
    }
    .strip_string {
         border: 3px solid;
        border-color: cyan;
        background: white;
        display: grid;
        grid-template-columns: repeat(11, 66px);
        grid-template-rows: 66px;
        overflow: hidden;

    }

   
button {
  background-color: #0844a5;
  border-radius: 8px;
  display: inline-block;
  border-style: none;
  box-sizing: border-box;
  color: white;
  cursor: pointer;
  font-size: 14px;
  height: 40px;
  list-style: none;
  margin:  10px;
  padding: 12px 16px;
  position: relative;
  text-align: center;
  text-decoration: none;
  transition: color 100ms;
  vertical-align: baseline;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  align-items: center;
}
button:hover
 {
  background-color: #6294d6;
}

</style>
