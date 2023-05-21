<script>
    import { getContext } from "svelte";
    
    import { createEventDispatcher } from "svelte";
    import DateTime from './DateTime.svelte';


    export let options;

    $: {
        dispatch('change', options);
    }

    const dispatch = createEventDispatcher();

    const offsetOptions = [5, 10, 15, 30];

    const toggle = true;
</script>
    
    <style>

        .form-label {
            display: block;
        }
    
        .form-group {
            display: flex;
            flex-direction: column;
            margin-bottom: 0.5rem;
        }
    
        input, select {
            border: 0;
            border-bottom: 1px solid #cc595e;
            background: #cc595e36;
        }
    
    </style>
    
    
    {#if toggle}
    
<div class="form-group">
    <label class="form-label" for="columnOffset"> columnOffset </label>
    <select id="columnOffset" bind:value={options.columnOffset}>
        {#each offsetOptions as offset}
            <option value={offset}>{offset}</option>
        {/each}
    </select>
</div>

<div class="form-group">
    <label class="form-label" for="magnetOffset"> magnetOffset </label>
    <select id="magnetOffset" bind:value={options.magnetOffset}>
        {#each offsetOptions as offset}
            <option value={offset}>{offset}</option>
        {/each}
    </select>
</div>

<div class="form-group">
    <label class="form-label" for="rowHeight"> rowHeight ({options.rowHeight}) </label>
    <input id="rowHeight" type="range" bind:value={options.rowHeight} min="20" max="100">
</div>

<div class="form-group">
    <label class="form-label" for="rowPadding"> rowPadding ({options.rowPadding}) </label>
    <input id="rowPadding" type="range" bind:value={options.rowPadding} min="0" max="20" step="2">
</div>

<div class="form-group">
    <label class="form-label" for="fitWidth"> fitWidth </label>
    <input id="fitWidth" type=checkbox bind:checked={options.fitWidth}>
</div>

<div class="form-group">
    <label class="form-label" for="minWidth"> minWidth </label>
    <input id="minWidth" type="number" bind:value={options.minWidth} min="800">
</div>

<div class="form-group">
    <label class="form-label" for="from"> from </label>
    <DateTime id="from" bind:value={options.from}/>
</div>

<div class="form-group">
    <label class="form-label" for="to"> to </label>
    <DateTime id="to" bind:value={options.to}/>
</div>

<div class="form-group">
    <label class="form-label" for="header0Format"> headers[0].format </label>
    <input id="header0Format" type="text" bind:value={options.headers[0].format}>
</div>

<div class="form-group">
    <label class="form-label" for="header1Format"> headers[1].format </label>
    <input id="header1Format" type="text" bind:value={options.headers[1].format}>
</div>
    {/if}