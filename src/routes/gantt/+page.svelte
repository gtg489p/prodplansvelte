<script>
    import { SvelteGantt, SvelteGanttDependencies, SvelteGanttExternal, SvelteGanttTable, MomentSvelteGanttDateAdapter } from 'svelte-gantt';
    import { onMount, getContext } from 'svelte';
    import { time } from '../../utils';
    import moment from 'moment';
    import Icon from '@iconify/svelte';
    import { Tooltip } from 'flowbite-svelte'
    import getDummyGanttData from '../../SpinUpSomeGantt';

    export let data;


    const currentDate = new Date();
    const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const currentStart = time('06:00');
    const currentEnd = time('18:00');

    
    // Create a map to store the original state of tasks
    let originalTaskState = {};


    const colors = ['blue', 'green', 'orange']
    
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
        tableWidth: 240,
        ganttTableModules: [SvelteGanttTable],
        ganttBodyModules: [SvelteGanttDependencies],
        taskElementHook: (node, task) => {
            let popup;
            function onHover() {
                popup = createPopup(task, node);
            }
            function onLeave() {
                if(popup) {
                    popup.remove();
                }
            }
            addMouseDownEventListener(node, task);
            node.addEventListener('mouseenter', onHover);
            node.addEventListener('mouseleave', onLeave);
            return {
                destroy() {
                    node.removeEventListener('mouseenter', onHover);
                    node.removeEventListener('mouseleave', onLeave);
                }
            }
        },

    }

    function addMouseDownEventListener(node, task) {
        node.addEventListener('mousedown', () => {

            // Store the original state of the task
            originalTaskState = JSON.parse(JSON.stringify(gantt.getTask(task.id)));
            
        });
    }

    function checkTaskOverlap(task) {
        let otherTasks = gantt.getTasks(task.resourceId);
        if (!otherTasks) {
            return false;
        }
        for (let otherTask of otherTasks) {
            if (otherTask.model.id === task.id) continue;
            if ((task.from < otherTask.model.to && task.from >= otherTask.model.from) ||
                (task.to <= otherTask.model.to && task.to > otherTask.model.from) ||
                (task.from <= otherTask.model.from && task.to >= otherTask.model.to)) {
                
                console.warn(`Task ${task.id} overlapped with Task ${otherTask.model.id} on resource ${task.resourceId}`);
                return true;
            }
        }
        return false;
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

    function getBreakOverlapTime(movingTask, timeRanges) {
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

        return totalOverlap;
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
                    classes: colors[(Math.random() * colors.length) | 0],
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

        gantt.api.tasks.on.move((event)=>{
            console.log('moving event', event)
        });

        gantt.api.tasks.on.change((event) => {
            let movingTask = event[0].task.model
            console.log('movingTask',movingTask)
            console.log

            let overlapDetected = checkTaskOverlap(movingTask)
            if (overlapDetected) {
                console.log('overlapDetected',overlapDetected)
                updateGanttData(ganttData, originalTaskState.model)
                gantt.$set(options);
                return;
            }

            //Check if task starts in break
            let startInBreak = doesTaskStartInBreak(movingTask, timeRanges);
            if (startInBreak){
                console.log('task would start IN break',startInBreak)
                updateGanttData(ganttData, originalTaskState.model)
                gantt.$set(options);
                return;
            }

            let breakOverlapTime = getBreakOverlapTime(movingTask, timeRanges);
            if (breakOverlapTime>0){
                console.log('breakOverlapTime',breakOverlapTime/60000);
                // Create a clone of the movingTask
                let movingTaskClone = {...movingTask};

                // Extend the end date of the task by the breakOverlapTime
                movingTaskClone.to += breakOverlapTime;

                // Send the updated task to the function
                updateGanttData(ganttData, movingTaskClone);
                gantt.$set(options);
                return;
            }
            

            updateGanttData(ganttData, movingTask);
            saveGanttData(ganttData);
            
        });


    });

    function createPopup(task, node) {
        const rect = node.getBoundingClientRect();
        const div = document.createElement('div');
        div.className = 'sg-popup bg-white border border-gray-300 shadow-md p-2 rounded z-[100]';
        div.innerHTML = `
            <div class="sg-popup-title font-bold">${task.label}</div>
            <div class="sg-popup-item">
                <div class="sg-popup-item-label">From:</div>
                <div class="sg-popup-item-value">${new Date(task.from).toLocaleTimeString()}</div>
            </div>
            <div class="sg-popup-item">
                <div class="sg-popup-item-label">To:</div>
                <div class="sg-popup-item-value">${new Date(task.to).toLocaleTimeString()}</div>
            </div>
        `;
        div.style.position = 'absolute';
        div.style.top = `${rect.bottom}px`;
        div.style.left = `${rect.left + rect.width / 2}px`;
        document.body.appendChild(div);
        return div;
    }


    function onChangeOptions(event) {
        gantt.$set(options);
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
        onChangeOptions();
    };
    function onSetWeekView() {
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
        onChangeOptions();
    };
    function onSetNextDay() {
        options.from=options.from.clone().add(1, 'day');
        options.to=options.to.clone().add(1, 'day');
        onChangeOptions();
    };
    function onSetPreviousDay() {
        options.from=options.from.clone().subtract(1, 'day');
        options.to=options.to.clone().subtract(1, 'day');
        onChangeOptions();
    };

    function snapback() {
        console.log(options.timeRanges)
    };

    function updateGanttData(ganttData, taskUpdate) {
        ganttData.tasks.forEach(task => {
            if (task.id === taskUpdate.id) {
                task.resourceId = taskUpdate.resourceId;
                task.from = taskUpdate.from;
                task.to = taskUpdate.to;
            }
        });

        return ganttData;
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
        
    </div>
</header>
<div class="w-full">
    <div id="example-gantt"></div>
    <div id="new-task">Drag to gantt</div> 
    <!-- <GanttOptions options={options} on:change={onChangeOptions}/> -->
</div>