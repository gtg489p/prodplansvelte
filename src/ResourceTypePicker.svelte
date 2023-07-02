<script>
    import { Card} from "flowbite-svelte";
    import { newOrEditResourceStore, resourceOptionsPageStore, resourceOptionsForm } from './store.js';

    $resourceOptionsForm.selectedCategory = null;

    function goToResourceOptions(categoryPicked)
    {
        $newOrEditResourceStore = 'new';
        $resourceOptionsForm.selectedCategory = categoryPicked;
        $resourceOptionsPageStore = 'options';
    }

</script>
<!-- svelte-ignore a11y-missing-attribute a11y-click-events-have-key-events-->

<div class='flex'>
    
    <Card class='mx-4 hover:drop-shadow-2xl cursor-pointer'>
        <div class='inset-0'  on:click={()=>goToResourceOptions('Mix')}>
            <img class="image" src="/mixing_tank.jpg" alt='island display'>
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Mixing Tank</h5>
            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
                Add a new mixing tank to your factory to schedule the compounding phase of your jobs.
            </p>
        </div>
    </Card>
    
    <Card class='mx-4 hover:drop-shadow-2xl cursor-pointer'>
        <div class='inset-0'  on:click={()=>goToResourceOptions('Hold')}>
            <img class="image" src="/holding_tank.jpg"/>
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Holding Tank</h5>
            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
                Add a new holding tank to your factory to hold and transfer the finished batches from mixing tanks to filling lines.
            </p>
        </div>
    </Card>

    <Card class='mx-4 hover:drop-shadow-2xl cursor-pointer'>
        <div class='inset-0'  on:click={()=>goToResourceOptions('Fill')}>
            <img class="image" src="/filling_line.jpg"/>
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Filling Line</h5>
            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
                Add a new filling line to your factory to schedule the bottling phase of your jobs.
            </p>
        </div>
    </Card>

</div>


<style>
    .image {
      width: 100%;
      height: 200px; 
    }


</style>