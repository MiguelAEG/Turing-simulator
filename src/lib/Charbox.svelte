<script lang="ts">
    export let char: string;
</script>

<div>
    {char}
</div>

<style>
    div {
        width: 100%;
        aspect-ratio: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 3em;
        border: 1px solid black;
    }

    @media screen and (max-width: 768px) {
        div {
            font-size: 2.6em;
        }
    }
</style>
