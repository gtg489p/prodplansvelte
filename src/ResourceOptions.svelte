<script>
    import { Toast, Checkbox, Badge, Label, Input, FloatingLabelInput, NumberInput, Select, Button,GradientButton, Alert, Radio, ButtonGroup, InputAddon, MultiSelect, Helper  } from 'flowbite-svelte'
    import { resourceOptionsForm, resourceOptionsModalStore, resourceOptionsPageStore, newOrEditResourceStore } from './store.js';
    import Icon from '@iconify/svelte';
    import toast, { Toaster } from 'svelte-french-toast';
    import { ulid } from 'ulid'

    export let resources;

    let productRateRows = [];
    if($newOrEditResourceStore === 'new'){
      productRateRows = [{product: 'Default', mixTime: '360', pumpRate: '20', fillRate: '200'}]; // Initialize with one row
    }
    else if($newOrEditResourceStore === 'edit'){
      let resource = resources.find(resource => resource.id === $resourceOptionsForm.id);
      console.log('resources',resources)
      console.log('resource in',resource,'$resourceOptionsForm.id',$resourceOptionsForm.id)
      let mixTimesObj = {};
      let pumpRatesObj = {};
      let fillRatesObj = {};

      resource.mixTimes.forEach(el => mixTimesObj[el.product] = el.mixTime);
      resource.pumpRates.forEach(el => pumpRatesObj[el.product] = el.pumpRate);
      resource.fillRates.forEach(el => fillRatesObj[el.product] = el.fillRate);

      let allProducts = new Set([...resource.mixTimes, ...resource.pumpRates, ...resource.fillRates].map(el => el.product));

      allProducts.forEach(product => {
          productRateRows.push({
              product: product,
              mixTime: mixTimesObj[product] || "",
              pumpRate: pumpRatesObj[product] || "",
              fillRate: fillRatesObj[product] || ""
          });
      });

    }
   
    let formValid = true;
    let uniqueName = true;
    let pumpTo='Hold';
    let lines = resources.filter(resource => resource.category === 'Fill');

    // If creating a new resource, initialize form with null values
    if($newOrEditResourceStore === 'new'){
      Object.keys($resourceOptionsForm).forEach(key => {
          if (key.startsWith('selected') && key !== 'selectedCategory') {
              $resourceOptionsForm[key] = null;
          }
      });
    }else if($newOrEditResourceStore === 'edit'){
      // If editing a resource, initialize form with existing values
      Object.keys($resourceOptionsForm).forEach(selectedKey => {
        let key = selectedKey.replace('selected', '');
        key = key.charAt(0).toLowerCase() + key.slice(1);
        let resource = resources.find(resource => resource.id === $resourceOptionsForm.id);
        if (resource && resource.hasOwnProperty(key)) {
            $resourceOptionsForm[selectedKey] = resource[key];
        }
      });
    }


    async function validateOptions(){
      // Check common properties first
      if ($resourceOptionsForm.selectedName == null || $resourceOptionsForm.selectedLabel == null) {
          formValid = false;
          return;
      }

      // Check category-specific properties
      switch($resourceOptionsForm.selectedCategory) {
          case 'Mix':
              if ($resourceOptionsForm.selectedGallons == null || $resourceOptionsForm.selectedManpower == null) {
                  formValid = false;
                  return;
              }

              // Check if selectedMixTimes contains at least one valid object
              $resourceOptionsForm.selectedMixTimes = $resourceOptionsForm.selectedMixTimes.filter(obj => obj.product && obj.mixTime);
              if ($resourceOptionsForm.selectedMixTimes.length === 0) {
                  formValid = false;
                  return;
              }
              break;

          case 'Hold':
              if ($resourceOptionsForm.selectedGallons == null) {
                  formValid = false;
                  return;
              }

              // Check if selectedPumpRates contains at least one valid object
              $resourceOptionsForm.selectedPumpRates = $resourceOptionsForm.selectedPumpRates.filter(obj => obj.product && obj.pumpRate);
              if ($resourceOptionsForm.selectedPumpRates.length === 0) {
                  formValid = false;
                  return;
              }
              break;

          case 'Fill':
              if ($resourceOptionsForm.selectedManpower == null) {
                  formValid = false;
                  return;
              }

              // Check if selectedFillRates contains at least one valid object
              $resourceOptionsForm.selectedFillRates = $resourceOptionsForm.selectedFillRates.filter(obj => obj.product && obj.fillRate);
              if ($resourceOptionsForm.selectedFillRates.length === 0) {
                  formValid = false;
                  return;
              }
              break;

          default:
              formValid = false;
              return;
      }

      formValid = true;
      if ($newOrEditResourceStore === 'new') {

        // Create a new unique id for the resource
        $resourceOptionsForm.id = $resourceOptionsForm.selectedCategory.toLowerCase().charAt(0) + ulid();

        // Api POST call to add new row
        const response = await fetch('/api/SupabaseInsertResource', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify($resourceOptionsForm),
        });

        if (!response.ok) {
          const { error } = await response.json();
          console.error('Error occurred:', error);
          // Do something with error...
        } else {
          const data = await response.json();

          // Reset the form now that we have successfully sent it to the database
          Object.keys($resourceOptionsForm).forEach(key => {$resourceOptionsForm[key] = null;});

          toast.success(`Successfully Added`, {position: "bottom-center", style: "border-radius: 200px; background: #333; color: #fff;"})
        }
                
        $resourceOptionsPageStore = 'type'

      } else if ($newOrEditResourceStore === 'edit') {

        // Api PUT call to update row
        const response = await fetch('/api/SupabaseUpdateResource', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify($resourceOptionsForm),
        });

        if (!response.ok) {
          const { error } = await response.json();
          console.error('Error occurred:', error);
          // Do something with error...
        } else {
          const data = await response.json();
          toast.success(`Successfully Updated`, {position: "bottom-center", style: "border-radius: 200px; background: #333; color: #fff;"})
        }
                    
        $resourceOptionsPageStore = 'type'
      }
      $resourceOptionsModalStore = false;
    }


    function cancelModal(){
        $resourceOptionsPageStore = 'type'
        $resourceOptionsModalStore = false;
    }

    async function cloneResource(){
        const response = await fetch(`/api/SupabaseCloneResource/${$resourceOptionsForm.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const { error } = await response.json();
            console.error('Error occurred:', error);
            // Do something with error...
        } else {
            const data = await response.json();
            toast.success(`Asset Cloned`, {position: "bottom-center", style: "border-radius: 200px; background: #333; color: #fff;"})
            $resourceOptionsPageStore = 'type'
            $resourceOptionsModalStore = false;
        }
    }


    async function deleteResource(){
    // Api DELETE call to remove a row
    const response = await fetch(`/api/SupabaseDeleteResource/${$resourceOptionsForm.id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const { error } = await response.json();
        console.error('Error occurred:', error);
        // Do something with error...
    } else {
        const data = await response.json();

        // Reset the form now that we have successfully deleted it from the database
        Object.keys($resourceOptionsForm).forEach(key => {$resourceOptionsForm[key] = null;});

        toast.success(`Asset Removed`, {position: "bottom-center", style: "border-radius: 200px; background: #333; color: #fff;"})
        $resourceOptionsPageStore = 'type'
        $resourceOptionsModalStore = false;
    }
}






    function addRow() {
        productRateRows = [...productRateRows, {product: '', mixTime: '', pumpRate:'', fillRate: ''}];
    }

    function removeRow(index) {
      productRateRows = productRateRows.filter((_, i) => i !== index);
    }


    $: {
        // Map each row to the respective store
        $resourceOptionsForm.selectedMixTimes = productRateRows.map(row => ({product: row.product, mixTime: row.mixTime}));
        $resourceOptionsForm.selectedPumpRates = productRateRows.map(row => ({product: row.product, pumpRate: row.pumpRate}));
        $resourceOptionsForm.selectedFillRates = productRateRows.map(row => ({product: row.product, fillRate: row.fillRate}));
        if ($resourceOptionsForm.selectedName !== null){
          $resourceOptionsForm.selectedHeaderHtml = `<button type="button" id="${($resourceOptionsForm.selectedName ?? '').replaceAll(" ", "")}">${$resourceOptionsForm.selectedName}: ${$resourceOptionsForm.selectedLabel}</button>`;    
        }
        if ($resourceOptionsForm.selectedCategory !== null) {
          $resourceOptionsForm.selectedClasses = 'factory-resource ' + $resourceOptionsForm.selectedCategory + '-row';
        }
    }

    $: {
        if (resources.some(resource => resource.name === $resourceOptionsForm.selectedName)) {
            uniqueName = false;
        } else {
            uniqueName = true;
        }
    }

    $: console.log('$resourceOptionsForm',$resourceOptionsForm)

</script>


<form>
  
  {#if formValid == false}
  <Alert color="red" class="border mb-6" >
      <span slot="icon"><svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
      </span>
      <span class="font-medium">You missed an option!</span>
  </Alert>
  {/if}
  {#if uniqueName == false && $newOrEditResourceStore == 'new'}
  <Alert color="red" class="border mb-6" >
      <span slot="icon"><svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
      </span>
      <span class="font-medium">Name must be unique</span>
  </Alert>
  {/if}
    <div class="grid gap-6 md:grid-cols-4">
      <div class="mb-6">
        <FloatingLabelInput style="outlined" type="text" label="Name" bind:value={$resourceOptionsForm.selectedName}/>
        {#if uniqueName == false && $newOrEditResourceStore == 'new'}
        <Helper class="mt-2" color="red">Name must be unique.</Helper>
        {/if}
      </div>

      <div class="mb-6">
        <FloatingLabelInput style="outlined" type="text" label="Description" bind:value={$resourceOptionsForm.selectedLabel}/>
        <Helper class="ml-2" color="dark">A description</Helper>
      </div>
      
      {#if ($resourceOptionsForm.selectedCategory == 'Mix' || $resourceOptionsForm.selectedCategory == 'Hold')}
      <div class="mb-6"> 
          <FloatingLabelInput style="outlined" type="text" label="Gallons" bind:value={$resourceOptionsForm.selectedGallons}/>
          <Helper class="ml-2" color="dark">Gallons of product can it hold</Helper>
      </div>
      {/if}
      {#if ($resourceOptionsForm.selectedCategory != 'Hold')}
      <div class="mb-6">  
        <FloatingLabelInput style="outlined" type="number" label="Manpower" bind:value={$resourceOptionsForm.selectedManpower}/>
        <Helper class="ml-2" color="dark">Min req staff to run</Helper>
      </div>
      {/if}
    </div>
    <div class="border-t border-gray-300"/>
    {#if $resourceOptionsForm.selectedCategory == 'Fill'}
      <span class="text-sm">Enter fill rates by product (PC/Hour). Removing the Default will restrict this line to specific products.</span>
    {:else if $resourceOptionsForm.selectedCategory == 'Hold'}
      <span class="text-sm">Enter the time (mins) it take to pump a full holding tank.  Removing the Default will restrict this to specific products.</span>
    {:else if $resourceOptionsForm.selectedCategory == 'Mix'}
      <span class="text-sm">Enter the time (mins) it takes to compound the product.  Removing the Default will restrict this tank to specific products.</span>
    {/if}
    <div class="mb-6"/>
    {#each productRateRows as row, i}
      <div class="grid gap-6 md:grid-cols-2">
        <div class="mb-3">
          <div style="display: flex; align-items: center;">
            <Button pill={true} class="!p-2" on:click={() => removeRow(i)} >
              <Icon icon="gg:remove" color="red" width="24" height="24" />
            </Button>
            <div style="flex-grow: 1;">
                <FloatingLabelInput style="outlined" type="text" label="Product" bind:value={row.product} />
            </div>
          </div>
        </div>
        <div class="mb-3">
          {#if $resourceOptionsForm.selectedCategory == 'Fill'}
            <FloatingLabelInput style="outlined" type="number" label="Bottling Rate (PC/Hour)" bind:value={row.fillRate}/>
          {:else if $resourceOptionsForm.selectedCategory == 'Hold'}
            <FloatingLabelInput style="outlined" type="number" label="Pump Rate (Gal/Min)" bind:value={row.pumpRate}/>
          {:else if $resourceOptionsForm.selectedCategory == 'Mix'}
            <FloatingLabelInput style="outlined" type="number" label="Process Time (Mins)" bind:value={row.mixTime}/>
          {/if}
        </div>
      </div>
    {/each}

    <div class="mb-4">
      <Button pill={true} class="!p-2" on:click={addRow} >
        <Icon icon="gg:add" color="red" width="24" height="24" />
      </Button>
    </div>
    
    {#if $resourceOptionsForm.selectedCategory == 'Mix'}
      <div class="border-t border-gray-300 mb-2"></div>
      <div class="mb-3">
        <div class="flex gap-3 items-center">
          <Label>Pump to:</Label>
          <Radio bind:group={pumpTo} value="Hold">Holding Tank</Radio>
          <Radio bind:group={pumpTo} value="Fill">Line(s)</Radio>
          {#if pumpTo == 'Fill'}
            <div class='flex-grow'>
              <MultiSelect items={lines} bind:value={$resourceOptionsForm.pumpToLines} style='z-index: 1000' autoclose/>
            </div>
          {/if}
        </div>
        {#if pumpTo == 'Fill'}
          <div style="min-height: 50px;"></div>
        {/if}
      </div>
    {/if}

    <div class="border-t border-gray-300 mb-2"></div>
    <div class="mb-6"/>


    

  {#if $newOrEditResourceStore == 'new'}
      <Button shadow="red" gradient color="red" on:click={()=>cancelModal()}>Cancel</Button>
      <Button shadow="purple" gradient color="purple" on:click={()=>$resourceOptionsPageStore='type'}>Back</Button>
      <Button shadow="blue" gradient color="blue" on:click={()=>validateOptions()}>Done <svg aria-hidden="true" class="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg></Button>

  {:else if $newOrEditResourceStore == 'edit'}
      <Button shadow="yellow" outline color="alternative" on:click={()=>cancelModal()}>Cancel</Button>
      <Button shadow="red" outline color="red" on:click={()=>deleteResource()}><span class='mr-1'>Delete</span><Icon icon="material-symbols:skull" width="22" height="22" /> </Button>
      <Button shadow="blue" outline color="blue" on:click={()=>cloneResource()}><span class='mr-1'>Clone</span><Icon icon="clarity:clone-solid" width="22" height="22" /> </Button>
      <Button shadow="blue" outline color="blue" on:click={()=>validateOptions()}>Save <svg aria-hidden="true" class="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg></Button>
  {/if}

</form>
