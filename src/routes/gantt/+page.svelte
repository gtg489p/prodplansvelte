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
    ganttData = postProcessGanttData(ganttData);

    function postProcessGanttData(ganttData) {
        for(let row of ganttData.rows) {
            if(row.category === "Mix") {
                row.classes = "mix-row";
            } else if(row.category === "Hold") {
                row.classes = "holding-row";
            } else if(row.category === "Fill") {
                row.classes = "filling-row";
            }
        }
        return ganttData;
    }

    let productInfo={
        'Shampoo A':{'category':'Shampoo','pumpRateLbsPerMin': 150},
        'Conditioner A':{'category':'Conditioner','pumpRateLbsPerMin': 200},
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
        headers: [{ unit: 'day', format: 'MM.DD.YYYY' }, { unit: 'hour', format: 'HH' }],
        fitWidth: true,
        minWidth: 1000,
        from: currentStart.clone().startOf('day'),
        to: currentStart.clone().endOf('day'),
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
            return [];
        }

        let bumpedTasks = []; // Array to hold bumped tasks and their overlap percentages

        for (let otherTask of otherTasks) {
            if (otherTask.model.id === movingTask.id || otherTask.model.category === "Setup") continue;

            let rangeStart = otherTask.model.from - (otherTask.model.product === movingTask.product ? otherTask.model.setupTime : otherTask.model.changeoverTime);
            let rangeEnd = otherTask.model.to + (otherTask.model.product === movingTask.product ? movingTask.setupTime : movingTask.changeoverTime);

            if ((movingTask.from < rangeEnd && movingTask.from >= rangeStart) ||
                (movingTask.to <= rangeEnd && movingTask.to > rangeStart) ||
                (movingTask.from <= rangeStart && movingTask.to >= rangeEnd)) {

                let overlapPct = (movingTask.from - otherTask.model.from) / (otherTask.model.to - otherTask.model.from);
                console.log(`Task ${movingTask.id} overlapped with Task ${otherTask.model.id} on resource ${movingTask.resourceId} at ${overlapPct * 100}%`);

                bumpedTasks.push({ // Push bumped task and overlap percentage into the array
                    bumpedTask: otherTask.model,
                    overlapPct: overlapPct
                });
            }
        }

        return bumpedTasks; // Return the array of bumped tasks
    }

    function checkDependencyOverlap(movingTask) {
        // Fetch the tasks related by dependencies
        let fetchRelatedTasks = (taskId, direction) => {
            let relatedTasks = [];
            let searchTaskIds = [taskId];

            while (searchTaskIds.length > 0) {
                let currentTaskId = searchTaskIds.pop();
                let relatedDependencies = ganttData.dependencies.filter(dep => dep[direction] === currentTaskId);

                for (let dep of relatedDependencies) {
                    let relatedTaskId = dep[direction === 'fromId' ? 'toId' : 'fromId'];
                    let relatedTask = ganttData.tasks.find(task => task.id === relatedTaskId);

                    if (relatedTask.category !== 'Hold') {
                        relatedTasks.push(relatedTask);
                    } else {
                        searchTaskIds.push(relatedTaskId);
                    }
                }
            }

            return relatedTasks;
        }

        // Determine if the moving task is 'mix' or 'fill'
        // If moving task is 'mix', we're looking for 'fill' tasks, so we need to look forward
        // If moving task is 'fill', we're looking for 'mix' tasks, so we need to look backward
        let direction = movingTask.category === 'Mix' ? 'fromId' : 'toId';
        
        // Fetch related tasks based on the dependencies
        let relatedTasks = fetchRelatedTasks(movingTask.id, direction);
        
        let bumpedTasks = [];

        for (let relatedTask of relatedTasks) {
            let rangeStart = relatedTask.from - (relatedTask.product === movingTask.product ? relatedTask.setupTime : relatedTask.changeoverTime);
            let rangeEnd = relatedTask.to + (relatedTask.product === movingTask.product ? movingTask.setupTime : movingTask.changeoverTime);

            let isOverlap = false;
            if (movingTask.category === 'Mix' && movingTask.from >= relatedTask.from) {
                isOverlap = true;  // For Mix task, anything greater than the relatedTask.from is overlap
            } else if (movingTask.category === 'Fill' && movingTask.to <= relatedTask.to) {
                isOverlap = true;  // For Fill task, anything less than the relatedTask.to is overlap
            } else {
                // Overlap detection for when moving task is in between the range of related task
                isOverlap = (movingTask.from < rangeEnd && movingTask.from >= rangeStart) ||
                            (movingTask.to <= rangeEnd && movingTask.to > rangeStart) ||
                            (movingTask.from <= rangeStart && movingTask.to >= rangeEnd);
            }

            if (isOverlap) {
                let overlapPct;
                if (movingTask.category === 'Mix') {
                    overlapPct = 0.01; // Forces the Mix task to be before the Fill task
                } else { // If moving task is Fill
                    overlapPct = 0.99; // Forces the Fill task to be after the Mix task
                }

                console.log(`Task ${movingTask.id} overlapped with Task ${relatedTask.id} at ${overlapPct * 100}%`);

                bumpedTasks.push({
                    bumpedTask: relatedTask,
                    overlapPct: overlapPct
                });
            }
        }


        return bumpedTasks;
    }







    function bumpAndGrind(movingTask) {
        console.log('bumpin')

        let bumpedTasks = [...checkTaskOverlap(movingTask), ...checkDependencyOverlap(movingTask)];

        // Iterate through each bumpedTask
        for (let { bumpedTask, overlapPct } of bumpedTasks) {
            // Update the bumpedTask
            let bumpedRuntime = (bumpedTask.to - bumpedTask.from);
            let setupTimeOrChangeoverTime = bumpedTask.product === movingTask.product ? bumpedTask.setupTime : bumpedTask.changeoverTime;

            if (overlapPct < 0.5) {
                // If overlapPct < 50%
                bumpedTask.from = movingTask.to + setupTimeOrChangeoverTime;
                bumpedTask.to = bumpedTask.from + bumpedRuntime;
            } else {
                // If overlapPct >= 50%
                bumpedTask.to = movingTask.from - setupTimeOrChangeoverTime;
                bumpedTask.from = bumpedTask.to - bumpedRuntime;
            }

            // Use the updateTask method from Svelte Gantt to redraw the bumped task
            gantt.updateTask(bumpedTask);

            // Recursively call bumpAndGrind with the bumpedTask
            bumpAndGrind(bumpedTask);
        }
    }


    function deleteAndCloneTask(originalTask) {
        // Create a clone of originalTask
        let cloneTask = JSON.parse(JSON.stringify(originalTask));
        // Get all tasks
        let allTasks = getAllTasks(); // replace this with your function to get all tasks

        // Find the maximum id among all tasks
        let maxId = Math.max(...allTasks.filter(task => !isNaN(task.id)).map(task => Number(task.id)));

        // Assign a new id to cloneTask by incrementing the maximum id by 1
        console.log('maxId', maxId)
        cloneTask.id = maxId + 1;

        // Remove originalTask from ganttData.tasks
        ganttData.tasks = ganttData.tasks.filter(task => task.id !== originalTask.id);
        // Update the Gantt chart
        options.tasks = ganttData.tasks;
        gantt.$set(options);

        // After deleting the original task, add the cloneTask to the Gantt chart
        ganttData.tasks.push(cloneTask);
        gantt.updateTask(cloneTask);
    }



    async function addsetups() {
        // Remove tasks that start with "setup_"
        ganttData.tasks = ganttData.tasks.filter(task => task.category !== "Setup");
        // Update the Gantt chart
        options.tasks = ganttData.tasks;
        gantt.$set(options);
        for (let row of ganttData.rows) {
            // Get tasks for current row
            let rowTasks = await gantt.getTasks(row.id);
            // If rowTasks is null, set it to an empty array
            if (rowTasks === null) {
                rowTasks = [];
            }

            // Sort tasks by their start times
            rowTasks.sort((a, b) => a.model.from - b.model.from);

            // Compare each task with all other tasks in the row
            for (let i = 0; i < rowTasks.length - 1; i++) {
                for (let j = i + 1; j < rowTasks.length; j++) {

                    let taskA = rowTasks[i];
                    let taskB = rowTasks[j];

                    // If either task is of "Pump" or "Idle Pump" category, skip the current iteration
                    if (taskA.model.category === "Pump" || 
                        taskB.model.category === "Pump" || 
                        taskA.model.category === "Idle Pump" || 
                        taskB.model.category === "Idle Pump") {
                        continue;
                    }

                    // Calculate setup/changeover time
                    let setupTimeOrChangeoverTime = taskA.model.product === taskB.model.product ? taskA.model.setupTime : taskA.model.changeoverTime;

                    // Check if tasks are separated by their setup/changeover times
                    if (taskB.model.from - taskA.model.to === setupTimeOrChangeoverTime) {
                        // Create a new setup task
                        let setupTask = {
                            id: "setup_" + taskA.model.id+"_"+taskB.model.id,
                            from: taskA.model.to,
                            to: taskB.model.from,
                            resourceId: taskA.model.resourceId,
                            label: " ",
                            runTime: setupTimeOrChangeoverTime,
                            setupTime: 0,
                            changeoverTime: 0,
                            classes: "setup-task",
                            enableDragging: false,
                            category: "Setup"
                        };

                        // Add the setup task to ganttData.tasks
                        ganttData.tasks.push(setupTask);
                        
                        // Update the setup task on the Gantt chart
                        gantt.updateTask(setupTask);
                    }
                }
            }
        }
    }



    function addPumps() {
        // Remove current pump tasks
        ganttData.tasks = ganttData.tasks.filter(task => task.category !== "Pump" && task.category !== "Idle Pump");

        // Create a hash map for tasks
        let taskMap = {};
        getAllTasks().forEach(task => taskMap[task.id] = task);

        // Create a hash map for dependencies
        let dependencyMap = {};
        ganttData.dependencies.forEach(dep => {
            if (!dependencyMap[dep.fromId]) dependencyMap[dep.fromId] = [];
            dependencyMap[dep.fromId].push(dep.toId);
        });

        // Filter out the mix tasks
        const mixTasks = getAllTasks().filter(task => task.category === "Mix");

        // Calculate maxId before your loop:
        let maxId = Math.max(...ganttData.tasks.filter(task => !isNaN(task.id)).map(task => Number(task.id)));


        // For each mix task, compute and add a pump task
        mixTasks.forEach(mixTask => {
            // Get dependencies of the current mix task
            let dependencies = dependencyMap[mixTask.id] || [];

            // Get subsequent tasks of the current mix task which are of the "Hold" category
            let subsequentHoldTasks = dependencies
                .map(depId => taskMap[depId])
                .filter(task => task && task.category === "Hold");

            if (!subsequentHoldTasks.length) {
                return;
            }

            // Sort the hold tasks by the "from" time of their child fill task
            subsequentHoldTasks.sort((a, b) => {
                let fillTaskA = dependencyMap[a.id]?.[0];
                let fillTaskB = dependencyMap[b.id]?.[0];
                return (taskMap[fillTaskA]?.from || 0) - (taskMap[fillTaskB]?.from || 0);
            });

            // For each hold task, create a pump task
            subsequentHoldTasks.forEach(holdTask => {
                // Compute the pump duration
                let pumpDuration = Math.ceil(holdTask.lbs / (productInfo[mixTask.product]?.pumpRateLbsPerMin ?? 200) / 15) * 15 * 60000;

                // Find all existing pump tasks for this mixTask on the same resource
                let existingPumpTasks = ganttData.tasks.filter(task => task.category === "Pump" && task.mixId === mixTask.id && task.resourceId === mixTask.resourceId);

                // Get the maximum "to" time of the existing pump tasks
                let maxPumpTo = Math.max(...existingPumpTasks.map(task => task.to), mixTask.to);
                
                // Start of the pump task is the maximum of the hold task "from" time and the max "to" time of the existing pump tasks
                let pumpFrom = Math.max(holdTask.from, maxPumpTo);
                // End of the pump task is the start time + the pump duration
                let pumpTo = pumpFrom + pumpDuration;

                // Create a new pump task
                let pumpTask = {
                    id: ++maxId, // Assign new id
                    from: pumpFrom,
                    to: pumpTo,
                    resourceId: mixTask.resourceId,
                    mixId: mixTask.id,
                    label: "Pump",// + gantt.getRow(holdTask.resourceId).model.name,
                    product: mixTask.product,
                    runTime: pumpDuration,
                    setupTime: 0,
                    changeoverTime: 0,
                    classes: "setup-task",
                    enableDragging: false,
                    category: "Pump",
                    lbs: holdTask.lbs
                };

                // Add the pump task to ganttData.tasks
                ganttData.tasks.push(pumpTask);
                gantt.updateTask(pumpTask);
            });

            // Get all pump tasks for the current mixTask
            let pumpTasks = ganttData.tasks.filter(task => task.category === "Pump" && task.mixId === mixTask.id);

            // Sort pump tasks by the "from" time
            pumpTasks.sort((a, b) => a.from - b.from);

            // Check for gaps between pump tasks
            for (let i = 0; i < pumpTasks.length - 1; i++) {
                let gap = pumpTasks[i + 1].from - pumpTasks[i].to;
                if (gap > 0) {
                    // Compute the idle time
                    let idleTime = pumpTasks[i + 1].from - pumpTasks[i].to;

                    // Create a new idle pump task
                    let pumpIdleTask = {
                        id: ++maxId,
                        from: pumpTasks[i].to,
                        to: pumpTasks[i].to + idleTime,
                        resourceId: mixTask.resourceId,
                        mixId: mixTask.id,
                        label: "Waiting",
                        product: mixTask.product,
                        runTime: idleTime,
                        setupTime: 0,
                        changeoverTime: 0,
                        classes: "setup-task",
                        enableDragging: false,
                        category: "Idle Pump"
                    };

                    // Add the idle pump task to ganttData.tasks
                    ganttData.tasks.push(pumpIdleTask);
                    gantt.updateTask(pumpIdleTask);
                }
            }
        });

        // Update the Gantt chart
        options.tasks = ganttData.tasks;
        gantt.$set(options);
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
        gantt.api.tasks.on.dblclicked((task) => {
            console.log("Task is select:", task);
        });

 
        gantt.api.tasks.on.changed ( (event) => {
            let movingTask = event[0].task.model;
            console.log('movingTask', movingTask);

            addHoldDependencies();

            updateAllHoldingTasks();

            // check if task is resized
            if ((movingTask.to - movingTask.from) !== (originalTaskState.to - originalTaskState.from)) {
                console.log('The task has been resized');
                            
                // calculate new runTime and update the task object
                movingTask.runTime = movingTask.to - movingTask.from;

                console.log('New runTime: ', movingTask.runTime);
                gantt.updateTask(movingTask);
            }

            // // check if task overlaps a break
            // let { breakOverlapTime, timeRangeDuration } = getBreakOverlapTimeAndDuration(movingTask, timeRanges);
            // if (breakOverlapTime > 0 && movingTask.category !== 'Hold'){
            //     console.log('breakOverlapTime', breakOverlapTime / 60000);
            //     // Create a clone of the movingTask
            //     let movingTaskClone = {...movingTask};

            //     // Extend the end date of the task by the full duration of the overlapping timeRange
            //     movingTaskClone.to += timeRangeDuration;

            //     gantt.updateTask(movingTaskClone);
            // }

            //addPumps();

            // Check if we bumpin
            bumpAndGrind(movingTask);

            addsetups();

            //syncGanttData();

            // Save to redis
            //saveGanttData(ganttData);
            
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
                <tr style="border-bottom: 1px solid #ddd;"><th style="text-align: left;">Lbs</th><td>${task.lbs}</td></tr>
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
        options.fitWidth = false;
        options.columnUnit = 'hour';
        options.columnOffset = 1;
        options.from = moment().startOf('day').toDate();
        options.to = moment().startOf('day').add(1, 'week').toDate();
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

    function addHoldDependencies() {
        // Get all tasks
        const allTasks = getAllTasks();

        // Filter out the hold tasks
        const holdTasks = allTasks.filter(task => task.category === "Hold");

        // Group hold tasks by resourceId
        const tasksByResource = holdTasks.reduce((acc, task) => {
            if (!acc[task.resourceId]) {
                acc[task.resourceId] = [];
            }
            acc[task.resourceId].push(task);
            return acc;
        }, {});

        // For each resource, sort the tasks by "from" time
        Object.keys(tasksByResource).forEach(resourceId => {
            tasksByResource[resourceId].sort((a, b) => a.from - b.from);
        });

        // Determine the highest dependency id, to correctly assign a unique id to new dependencies
        let maxId = ganttData.dependencies.reduce((max, dependency) => {
            return typeof dependency.id === "number" ? Math.max(max, dependency.id) : max;
        }, 0);

        // Iterate over each resource
        Object.keys(tasksByResource).forEach(resourceId => {
            let holdTasksInResource = tasksByResource[resourceId];

            // Iterate over each hold task in the resource, skipping the first one
            for(let i = 1; i < holdTasksInResource.length; i++) {
                let precedingTask = holdTasksInResource[i-1];
                let currentTask = holdTasksInResource[i];

                // Create a new dependency
                let newDependency = {
                    id: ++maxId,
                    fromId: precedingTask.id,
                    toId: currentTask.id,
                    stroke: '#ff0000',
                    strokeWidth: 1,
                    arrowSize: 10
                };

                // Check if this dependency already exists
                let existingDependency = ganttData.dependencies.find(dep => dep.fromId === newDependency.fromId && dep.toId === newDependency.toId);

                // If the dependency does not exist, add it
                if (!existingDependency) {
                    ganttData.dependencies.push(newDependency);
                }
            }
        });

        // Collect all dependencies related to Hold tasks
        let holdDependencies = ganttData.dependencies.filter(dep => holdTasks.find(task => task.id === dep.fromId || task.id === dep.toId));

        // Iterate over all hold dependencies to verify if they're still valid
        for (let dep of holdDependencies) {
            let fromTask = gantt.getTask(dep.fromId).model;
            let toTask = gantt.getTask(dep.toId).model;

            // Check the conditions for the dependency. If both are not met, remove the dependency
            if (fromTask.category === 'Hold' && toTask.category === 'Hold') {
                if (fromTask.resourceId !== toTask.resourceId || fromTask.to >= toTask.from) {
                    let index = ganttData.dependencies.findIndex(d => d.id === dep.id);
                    ganttData.dependencies.splice(index, 1);
                }
            }
        }

        // Update the Gantt chart
        options.dependencies = ganttData.dependencies;
        gantt.$set(options);
    }

    async function updateAllHoldingTasks() {
        // Get all tasks using getAllTasks function
        let allTasks = getAllTasks();

        // Iterate over all tasks
        for (let task of allTasks) {

            // Check if the task category is 'Hold'
            if (task.category === 'Hold') {

                // Holding tanks are used on fill line until fill job comlete and holding tank empty
                let nextStep = ganttData.dependencies.find(dep => dep.fromId === task.id);
                let fillTask = gantt.getTask(nextStep.toId).model;
                if (fillTask) {
                    task.to = fillTask.to;
                    gantt.updateTask(task);
                }

                // Wait for 25 milliseconds before proceeding
                await new Promise(r => setTimeout(r, 25));

                // Determine the 'from' time based on the preceding task
                let lastSteps = ganttData.dependencies.filter(dep => dep.toId === task.id);
                let precedingTasks = lastSteps.map(dep => gantt.getTask(dep.fromId).model);

                // Give priority to Hold tasks
                let precedingTask = precedingTasks.find(t => t.category === 'Hold') || precedingTasks[0];

                // If the preceding task is a Hold task, use its 'to' time + setup/changeover time
                if (precedingTask.category === 'Hold') {
                    let setupTimeOrChangeoverTime = precedingTask.product === task.product ? precedingTask.setupTime : precedingTask.changeoverTime;
                    task.from = precedingTask.to + setupTimeOrChangeoverTime;
                }
                // If it's not, use the mix task's 'to' time
                else {
                    task.from = precedingTask.to;
                }

                // Update the task
                gantt.updateTask(task);
            }
        }

        addPumps();
    }




    function snapback() {
        
        console.log(gantt.getTasks(4))

        // ganttData.rows.forEach(row => {
        //     const tasks = gantt.getTasks(row.id);
        //     if(tasks){
        //         tasks.forEach(task => {
        //             let taskData = task.model;
        //             // Find task in ganttData.tasks by id
        //             let existingTask = ganttData.tasks.find(task => task.id === taskData.id);

        //             if(existingTask){
        //                 // Update existing properties and add new properties
        //                 Object.keys(taskData).forEach(prop => {
        //                     existingTask[prop] = taskData[prop];
        //                 });
        //             } else {
        //                 // Insert new task in ganttData.tasks
        //                 ganttData.tasks.push(taskData);
        //             }
        //         });
        //     }
        // });
        console.log('ganttData post zoink', ganttData)
    };

    function getAllTasks() {
        let tasksArray = [];

        ganttData.rows.forEach(row => {
            const tasks = gantt.getTasks(row.id);
            if(tasks){
                tasks.forEach(task => {
                    let taskData = task.model;
                    // Find task in tasksArray by id
                    let existingTask = tasksArray.find(task => task.id === taskData.id);

                    if(existingTask){
                        // Update existing properties and add new properties
                        Object.keys(taskData).forEach(prop => {
                            existingTask[prop] = taskData[prop];
                        });
                    } else {
                        // Insert new task in tasksArray
                        tasksArray.push(taskData);
                    }
                });
            }
        });

        return tasksArray;
    }


    function syncGanttData() {
        console.log('Syncing')

        ganttData.rows.forEach(row => {
            const tasks = gantt.getTasks(row.id);
            if(tasks){
                tasks.forEach(task => {
                    let taskData = task.model;
                    // Find task in ganttData.tasks by id
                    let existingTask = ganttData.tasks.find(task => task.id === taskData.id);

                    if(existingTask){
                        // Update existing properties and add new properties
                        Object.keys(taskData).forEach(prop => {
                            existingTask[prop] = taskData[prop];
                        });
                    } else {
                        // Insert new task in ganttData.tasks
                        ganttData.tasks.push(taskData);
                    }
                });
            }
        });

        saveGanttData(ganttData);
    };

    function removeTask(doomedTask) {

        const doomedTaskIndex = ganttData.tasks.findIndex(task => task.id === doomedTask.id);

        // If found, remove it
        if (doomedTaskIndex >= 0) {
            ganttData.tasks.splice(doomedTaskIndex, 1);
        }
        // Update the Gantt chart with the modified options
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

        <button on:click={syncGanttData}><Icon icon="material-symbols:save-sharp" width="30" height="30" color="red"/></button>
        <Tooltip  color="yellow">Save</Tooltip>
        
    </div>
</header>
<div class="w-full">
    <div id="example-gantt"></div>
    <div id="new-task">Drag to gantt</div> 
    <!-- <GanttOptions options={options} on:change={onChangeOptions}/> -->
</div>