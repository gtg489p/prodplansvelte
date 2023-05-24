<script>
    import { SvelteGantt, SvelteGanttDependencies, SvelteGanttExternal, SvelteGanttTable, MomentSvelteGanttDateAdapter } from 'svelte-gantt';
    import { onMount, getContext } from 'svelte';
    import { time } from '../../utils';
    import moment from 'moment';
    import Icon from '@iconify/svelte';
    import { Tooltip } from 'flowbite-svelte'
    import getDummyGanttData from '../../SpinUpSomeGantt';
	import { construct_svelte_component } from 'svelte/internal';

    export let data;


    const currentDate = new Date();
    const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const currentStart = time('06:00');
    const currentEnd = time('18:00');

    
    // Create a map to store the original state of tasks
    let originalTaskState = {};
    
    let start = moment().startOf('week');
    let end = moment().add(3, 'weeks').endOf('week'); // add 3 weeks to the current week
    let timeRanges = [];

    for (let day = start; day.isBefore(end); day.add(1, 'days')) {
        timeRanges.push({
            id: timeRanges.length,
            from: moment(day).hour(12).minute(0).toDate(),  // set to 12:00
            to: moment(day).hour(13).minute(0).toDate(),   // set to 1:00
            classes: null,
            label: 'Lunch'
        });
    }

    let ganttData;
    ganttData = (data.ganttData && Object.keys(data.ganttData).length !== 0) ? data.ganttData : getDummyGanttData();

    // Reactive statement to post-process ganttData whenever it changes
    $: ganttData = postProcessGanttData(ganttData);

    function postProcessGanttData(ganttData) {
        for(let row of ganttData.rows) {
            if(row.category === "mix") {
                row.classes = "mix-row";
            } else if(row.category === "holding") {
                row.classes = "holding-row";
            } else if(row.category === "fill") {
                row.classes = "filling-row";
            }
        }
        console.log(ganttData.rows)
        return ganttData;
    }

    let options = {
        dateAdapter: new MomentSvelteGanttDateAdapter(moment),
        rows: ganttData.rows,
        tasks: ganttData.tasks,
        dependencies: ganttData.dependencies,
        timeRanges: timeRanges,
        columnOffset: 15,
        magnetOffset: 15,
        rowHeight: 40,
        rowPadding: 6,
        headers: [{ unit: 'day', format: 'MMMM Do' }, { unit: 'hour', format: 'H:mm' }],
        fitWidth: true,
        minWidth: 1000,
        from: currentStart,
        to: currentEnd,
        tableHeaders: [{ title: 'Label', property: 'label', width: 140, type: 'tree' }],
        tableWidth: 140,
        ganttTableModules: [SvelteGanttTable],
        ganttBodyModules: [SvelteGanttDependencies],
        taskElementHook: (node, task) => {
            let popup;
            function onHover() {
                //console.log('task',task)
                popup = createPopup(task, node);
            }
            function onLeave() {
                if(popup) {
                    popup.remove();
                }
            }

            const mouseMoveHandler = () => {
                console.log('Dragging task:', task);
            };

            addMouseDownEventListener(node, task);
            node.addEventListener('mouseenter', onHover);
            node.addEventListener('mouseleave', onLeave);
            //node.addEventListener('mousemove', mouseMoveHandler);
            return {
                destroy() {
                    node.removeEventListener('mouseenter', onHover);
                    node.removeEventListener('mouseleave', onLeave);
                    node.removeEventListener('mousemove', mouseMoveHandler);
                }
            }
        },

    }
    
    
    function refreshGanttData() {

        let start = moment().startOf('week');
        let end = moment().add(3, 'weeks').endOf('week'); // add 3 weeks to the current week
        let timeRanges = [];

        for (let day = start; day.isBefore(end); day.add(1, 'days')) {
            timeRanges.push({
                id: timeRanges.length,
                from: moment(day).hour(12).minute(0).toDate(),  // set to 12:00
                to: moment(day).hour(13).minute(0).toDate(),   // set to 1:00
                classes: null,
                label: 'Lunch'
            });
        }

        let ganttData = (data.ganttData && Object.keys(data.ganttData).length !== 0) ? data.ganttData : getDummyGanttData();

        let options = {
            dateAdapter: new MomentSvelteGanttDateAdapter(moment),
            rows: ganttData.rows,
            tasks: ganttData.tasks,
            dependencies: ganttData.dependencies,
            timeRanges: timeRanges,
            columnOffset: 15,
            magnetOffset: 15,
            rowHeight: 40,
            rowPadding: 6,
            headers: [{ unit: 'day', format: 'MMMM Do' }, { unit: 'hour', format: 'H:mm' }],
            fitWidth: true,
            minWidth: 1000,
            from: currentStart,
            to: currentEnd,
            tableHeaders: [{ title: 'Label', property: 'label', width: 140, type: 'tree' }],
            tableWidth: 140,
            ganttTableModules: [SvelteGanttTable],
            ganttBodyModules: [SvelteGanttDependencies],
            taskElementHook: (node, task) => {
                let popup;
                function onHover() {
                    //console.log('task',task)
                    popup = createPopup(task, node);
                }
                function onLeave() {
                    if(popup) {
                        popup.remove();
                    }
                }
    
                const mouseMoveHandler = () => {
                    console.log('Dragging task:', task);
                };

                addMouseDownEventListener(node, task);
                node.addEventListener('mouseenter', onHover);
                node.addEventListener('mouseleave', onLeave);
                //node.addEventListener('mousemove', mouseMoveHandler);
                return {
                    destroy() {
                        node.removeEventListener('mouseenter', onHover);
                        node.removeEventListener('mouseleave', onLeave);
                        node.removeEventListener('mousemove', mouseMoveHandler);
                    }
                }
            },

        }
        gantt.$set(options);

    }

    function addMouseDownEventListener(node, task) {
        node.addEventListener('mousedown', () => {

            // Store the original state of the task
            originalTaskState = JSON.parse(JSON.stringify(gantt.getTask(task.id))).model;
            
        });
    }

    function checkTaskOverlap(movingTask) {
        let otherTasks = gantt.getTasks(movingTask.resourceId);
        if (!otherTasks) {
            return null;
        }
        for (let otherTask of otherTasks) {
            if (otherTask.model.id === movingTask.id || otherTask.model.category === "buffer") continue;

            let rangeStart = otherTask.model.from - (otherTask.model.product === movingTask.product ? otherTask.model.setupTime : otherTask.model.changeoverTime);
            let rangeEnd = otherTask.model.to + (otherTask.model.product === movingTask.product ? movingTask.setupTime : movingTask.changeoverTime);

            if ((movingTask.from < rangeEnd && movingTask.from >= rangeStart) ||
                (movingTask.to <= rangeEnd && movingTask.to > rangeStart) ||
                (movingTask.from <= rangeStart && movingTask.to >= rangeEnd)) {

                let overlapPct = (movingTask.from - otherTask.model.from) / (otherTask.model.to - otherTask.model.from);
                console.log(`Task ${movingTask.id} overlapped with Task ${otherTask.model.id} on resource ${movingTask.resourceId} at ${overlapPct * 100}%`);

                return {
                    bumpedTask: otherTask.model,
                    overlapPct: overlapPct
                };
            }
        }
        return {
            bumpedTask: null,
            overlapPct: null
        };
    }


    function bumpAndGrind(movingTask) {
    let {bumpedTask, overlapPct} = checkTaskOverlap(movingTask);
    if (bumpedTask) {
        // If bumpedTask is a setup task
        // if (bumpedTask.category === "buffer") {
        //     // Delete the setup task
        //     removeTask(bumpedTask);
        // } 
        // Update the bumpedTask
        let bumpedRuntime = (bumpedTask.to-bumpedTask.from);
        let setupTimeOrChangeoverTime = bumpedTask.product === movingTask.product ? bumpedTask.setupTime : bumpedTask.changeoverTime;
        
        if (overlapPct < 0.5) {
            // If overlapPct < 50%
            bumpedTask.from = movingTask.to + setupTimeOrChangeoverTime;
            bumpedTask.to = bumpedTask.from + bumpedRuntime;

            let setupTask = {
                id: "setup_" + bumpedTask.id,  
                from: movingTask.to,
                to: bumpedTask.from,
                resourceId: bumpedTask.resourceId,
                label: " ",
                runTime: setupTimeOrChangeoverTime,
                setupTime: 0,
                changeoverTime: 0,
                classes: "setup-task",
                enableDragging: false,
                category: "buffer"
            };
            
            gantt.updateTask(setupTask);
        } else {
            // If overlapPct >= 50%
            bumpedTask.to = movingTask.from - setupTimeOrChangeoverTime;
            bumpedTask.from = bumpedTask.to - bumpedRuntime;

            let setupTask = {
                id: "setup_" + movingTask.id, 
                from: bumpedTask.to,
                to: movingTask.from,
                resourceId: movingTask.resourceId,
                label: " ",
                runTime: setupTimeOrChangeoverTime,
                setupTime: 0,
                changeoverTime: 0,
                classes: "setup-task",
                enableDragging: false,
                category: "buffer"
            };
            console.log('making buffer',setupTask)
            gantt.updateTask(setupTask);
        }

        // Use the updateTask method from Svelte Gantt to redraw the bumped task
        gantt.updateTask(bumpedTask);
        updateGanttData(ganttData, bumpedTask);
        
    }
    else{
        let setupTask = gantt.getTask("setup_" + movingTask.id);
        console.log('movingTask', movingTask, 'setupTask', setupTask)
        if (setupTask) {
            removeTask(setupTask.model);
        }
    }
}


    function doesTaskStartInBreak(movingTask, timeRanges) {
        // convert task start time to Date object for comparison
        const taskFrom = movingTask.from;

        for (let i = 0; i < timeRanges.length; i++) {
            // convert time range times to Date object
            const rangeFrom = new Date(timeRanges[i].from).getTime();
            const rangeTo = new Date(timeRanges[i].to).getTime();

            // check if task starts within this time range or exactly at the same time
            if (taskFrom >= rangeFrom && taskFrom <= rangeTo) {
                return true;
            }
        }

        // if task doesn't start in any of the time ranges, return false
        return false;
    }

    function getBreakOverlapTimeAndDuration(movingTask, timeRanges) {
        // convert task times to Date object for comparison
        const taskFrom = movingTask.from;
        const taskTo = movingTask.to;
        let totalOverlap = 0;

        for (let i = 0; i < timeRanges.length; i++) {
            // convert time range times to Date object
            const rangeFrom = new Date(timeRanges[i].from).getTime();
            const rangeTo = new Date(timeRanges[i].to).getTime();

            // find overlapping time
            if (rangeFrom < taskTo && taskFrom < rangeTo) {
                // max(start times) and min(end times)
                const overlapStart = Math.max(taskFrom, rangeFrom);
                const overlapEnd = Math.min(taskTo, rangeTo);
                const overlap = overlapEnd - overlapStart;
                totalOverlap += overlap;
            }
        }

        // Additional code to find the duration of the overlapping timeRange
        let overlappingTimeRange = timeRanges.find(range => taskFrom <= range.to && taskTo >= range.from);
        let timeRangeDuration = overlappingTimeRange ? overlappingTimeRange.to - overlappingTimeRange.from : 0;

        return { breakOverlapTime: totalOverlap, timeRangeDuration };
    }


    let gantt;
    onMount(() => {
        window.gantt = gantt = new SvelteGantt({ target: document.getElementById('example-gantt'), props: options });
        const external = new SvelteGanttExternal(document.getElementById('new-task'), {
            gantt,
            onsuccess: (row, date, gantt) => {
                console.log(row.model.id, new Date(date).toISOString())
                const id = 5000 + Math.floor(Math.random() * 1000);
                gantt.updateTask({
                    id,
                    label: `Task #${id}`,
                    from: date,
                    to: date + 3 * 60 * 60 * 1000,
                    resourceId: row.model.id
                });
            },
            elementContent: () => {
                const element = document.createElement('div');
                element.innerHTML = 'New Task';
                element.className = 'sg-external-indicator';
                return element;
            }
        });

        // Listen for the task drop event

 
        gantt.api.tasks.on.changed((event) => {
            let movingTask = event[0].task.model
            console.log('movingTask', movingTask)
            // Anytime we move a task, lets remove the setup task just to clean things up, it can return if needed
            let setupTask = gantt.getTask("setup_" + movingTask.id);
            console.log('movingTask', movingTask, 'setupTask', setupTask)
            // if (setupTask) {
            //     removeTask(setupTask.model);
            // }
                    
            // Check if task starts in break
            let startInBreak = doesTaskStartInBreak(movingTask, timeRanges);
            if (startInBreak){
                console.log('task would start IN break',startInBreak)
                updateGanttData(ganttData, originalTaskState)
                gantt.$set(options);
                return;
            }
    
            // check if task is resized
            if ((movingTask.to - movingTask.from) !== (originalTaskState.to - originalTaskState.from)) {
                console.log('The task has been resized');
                            
                // calculate new runTime and update the task object
                movingTask.runTime = movingTask.to - movingTask.from;

                console.log('New runTime: ', movingTask.runTime);
            }

            // check if task overlaps a break
            let { breakOverlapTime, timeRangeDuration } = getBreakOverlapTimeAndDuration(movingTask, timeRanges);
            if (breakOverlapTime > 0){
                console.log('breakOverlapTime', breakOverlapTime / 60000);
                // Create a clone of the movingTask
                let movingTaskClone = {...movingTask};

                // Extend the end date of the task by the full duration of the overlapping timeRange
                movingTaskClone.to += timeRangeDuration;

                // Send the updated task to the function
                updateGanttData(ganttData, movingTaskClone);
                gantt.$set(options);
                return;
            }

            // Check if we bumpin
            bumpAndGrind(movingTask);
            
            saveGanttData(ganttData);
        });


    });

    function createPopup(task, node) {
        const rect = node.getBoundingClientRect();
        const div = document.createElement('div');
        div.className = 'sg-popup bg-white border border-gray-300 shadow-md p-2 rounded z-[100]';
        div.innerHTML = `
            <table class="sg-popup-table" style="border-collapse: collapse; width: 100%;">
                <tr style="border-bottom: 1px solid #ddd;"><th style="text-align: left;">Task</th><td>${task.label}</td></tr>
                <tr style="border-bottom: 1px solid #ddd;"><th style="text-align: left;">Product</th><td>${task.product}</td></tr>
                <tr style="border-bottom: 1px solid #ddd;"><th style="text-align: left;">Start</th><td>${new Date(task.from).toLocaleTimeString()}</td></tr>
                <tr style="border-bottom: 1px solid #ddd;"><th style="text-align: left;">End</th><td>${new Date(task.to).toLocaleTimeString()}</td></tr>
                <tr style="border-bottom: 1px solid #ddd;"><th style="text-align: left;">Runtime</th><td>${task.runTime / 60000} minutes</td></tr>
            </table>
        `;
        div.style.position = 'absolute';
        div.style.top = `${rect.bottom}px`;
        div.style.left = `${rect.left + rect.width / 2}px`;
        document.body.appendChild(div);
        return div;
    }



    function onSetDayView() {
        options.fitWidth = true;
        options.columnUnit = 'minute';
        options.columnOffset = 15;
        options.from = currentStart.clone().startOf('day');
        options.to = currentStart.clone().endOf('day');
        options.minWidth = 1000;
        options.headers = [
            { unit: 'day', format: 'MM.DD.YYYY' },
            { unit: 'hour', format: 'HH' }
        ];
        gantt.$set(options);
    };
    function onSetWeekView() {
        console.log('weekinit')
        options.fitWidth = false;
        options.columnUnit = 'hour';
        options.columnOffset = 1;
        options.from = currentStart.clone().startOf('week');
        options.to = currentStart.clone().endOf('week');
        options.minWidth = 5000;
        options.headers = [
            { unit: 'month', format: 'MMMM YYYY', sticky: true },
            { unit: 'day', format: 'ddd DD', sticky: true }
        ];
        gantt.$set(options);
    };
    function onSetNextDay() {
        options.from=options.from.clone().add(1, 'day');
        options.to=options.to.clone().add(1, 'day');
        gantt.$set(options);
    };
    function onSetPreviousDay() {
        options.from=options.from.clone().subtract(1, 'day');
        options.to=options.to.clone().subtract(1, 'day');
        gantt.$set(options);
    };

    function snapback() {
        console.log('snapback')
        

    };

    function updateGanttData(ganttData, taskUpdate) {
        ganttData.tasks.forEach(task => {
            if (task.id === taskUpdate.id) {
                task.resourceId = taskUpdate.resourceId;
                task.from = taskUpdate.from;
                task.to = taskUpdate.to
            }
        });
    }

    function removeTask(doomedTask) {
        console.log('killing', doomedTask)
        // Find the task in the tasks array
        let doomedTaskIndex = ganttData.tasks.findIndex(task => task.id === doomedTask.id);

        // If found, remove it
        if (doomedTaskIndex >= 0) {
            ganttData.tasks.splice(doomedTaskIndex, 1);
        }

        // Update the Gantt chart
        gantt.$set(options);

        // Update the saved Gantt data
        saveGanttData(ganttData);
    }



    async function saveGanttData(ganttData) {
        try {
            const response = await fetch('/api/GanttDataToRedis', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ganttData }),
            });

            if (response.ok) {
            const result = await response.json();
            console.log(result);  // Logs 'Success' on successful save
            // handle further processing here
            } else {
            console.error(`Server responded with status ${response.status}`);
            }
        } catch (err) {
            console.error(err);
        }
    }

    async function wipeGanttData() {
        try {
            const response = await fetch('/api/WipeRedis', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                console.log(result);  // Logs 'Success' on successful save
                // handle further processing here
            } else {
                console.error(`Server responded with status ${response.status}`);
            }
        } catch (err) {
            console.error(err);
        }
        refreshGanttData();
    }



</script>

<style>

    #example-gantt {
        display: flex;
        flex-grow: 1;
        overflow: auto;
    }

    .container {
        display: flex;
        overflow: auto;
        flex: 1;
        width: 100vw;
    }

    :global(.setup-task) {
        background-color: #ccc; /* grey background */
        background-image: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            #888 10px,
            #888 20px
        ); /* diagonal lines */
    }

    :global(.setup-task:hover) {
        background-color: #ccc !important; /* grey background */
        background-image: repeating-linear-gradient(
        45deg,
        transparent,
        transparent 10px,
        #888 10px,
        #888 20px
    ); /* diagonal lines */
    }

    :global(.mix-row) {
        background-color: rgba(0, 123, 255, 0.1); /* light, semi-transparent blue */
    }

    :global(.holding-row) {
        background-color: rgba(255, 238, 0, 0.1); /* light, semi-transparent orange */
    }

    :global(.filling-row) {
        background-color: rgba(0, 128, 0, 0.1); /* light, semi-transparent green */
    }


    #example-gantt :global(.sg-hover) {
        background-color: #00000008;
    }
    
    #example-gantt :global(.sg-hover .sg-table-body-cell) {
        background-color: #00000008;
    }

    #new-task {
        position: absolute;
        bottom: 0;
        right: 0;
        z-index: 1;
        background-color: #ee6e73;
        color: white;
        padding: 1rem;
        margin: 0.5rem;
        cursor: grab;
    }

    .sg-popup {
        background-color: white;
        border: 1px solid #ccc;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        padding: 8px;
        border-radius: 4px;
    }

    :global(.selected) {
        background-color: purple;
        color: initial;
    }

    :global(.red-middle-gradient) {
        border: 1px solid black;
        background: linear-gradient(to right, rgb(0, 195, 255) calc(50% - 15%), transparent calc(50% - 15%), transparent calc(50% + 15%), rgb(0, 195, 255) calc(50% + 15%));
    }
    :global(.red-middle-gradient:hover) {
        border: 1px solid black;
        background: linear-gradient(to right, rgb(0, 195, 255) calc(50% - 15%), transparent calc(50% - 15%), transparent calc(50% + 15%), rgb(0, 195, 255) calc(50% + 15%));
    }


    :global(.black-border){
        border: 1px solid black;
    }

    :global(.red-background-black-border){
        background-color: red;
        border: 1px solid black;
    }

    :global(.black-border){
        border: 1px solid black;
    }

    .dropdown-menu {
    transform: none;
    position: absolute;
    top: 70%;
    left: 0;
    display: none;
    background-color: whitesmoke;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    padding: 1rem;
    border-radius: 4px;
    padding: 5px;
  }

  .dropdown:hover .dropdown-menu {
    display: block;
  }

</style>


<header class="header">
    <div class="header flex justify-center bg-gray-200">
        <button on:click={onSetPreviousDay}><Icon icon="material-symbols:skip-previous" width="30" height="30" color="red"/></button>
        <Tooltip  color="yellow">Previous Day</Tooltip>
        <button on:click={onSetDayView}><Icon icon="material-symbols:clear-day" width="30" height="30" color="red"/></button>
        <Tooltip  color="yellow">Go to Today</Tooltip>
        <button on:click={onSetNextDay}><Icon icon="material-symbols:skip-next" width="30" height="30" color="red"/></button>
        <Tooltip  color="yellow">Next Day</Tooltip>
        <button on:click={onSetWeekView}><Icon icon="mdi:calendar-week" width="30" height="30" color="red"/></button>
        <Tooltip  color="yellow">Go to This Week</Tooltip>

        <button on:click={snapback}><Icon icon="game-icons:brutal-helm" width="30" height="30" color="red"/></button>
        <Tooltip  color="yellow">Zoink</Tooltip>

        <button on:click={wipeGanttData}><Icon icon="ion:trash-sharp" width="30" height="30" color="red"/></button>
        <Tooltip  color="yellow">Clear</Tooltip>
        
    </div>
</header>
<div class="w-full">
    <div id="example-gantt"></div>
    <div id="new-task">Drag to gantt</div> 
    <!-- <GanttOptions options={options} on:change={onChangeOptions}/> -->
</div>