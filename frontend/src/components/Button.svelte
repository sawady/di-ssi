<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  
  const click = () => dispatch("click");

  export let alternative = false;
</script>

<style>
  button {
    background-color: orange;
    border: none;
    color: white;
    padding: 4px 10px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    border-radius: 4px;
  }

  button:hover {
    cursor: pointer;
  }

  .alternative {
    background-color: white;
    border: 1px solid orange;
    color: orange;
  }
</style>

<button class:alternative on:click={click}><slot /></button>
