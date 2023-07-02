<script>
    import { SvelteGantt, SvelteGanttDependencies, SvelteGanttExternal, SvelteGanttTable, MomentSvelteGanttDateAdapter} from 'svelte-gantt';
    import { onMount, getContext } from 'svelte';
    import { time } from '../utils';
    import moment from 'moment';

    const currentDate = new Date();
    const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const currentStart = time('06:00');
    const currentEnd = time('18:00');

    const colors = ['blue', 'green', 'orange']
    
    let options2 = getContext('options');

    export const data = {
        rows: [{
            id: 1,
            label: "Tank 1",
        }, {
            id: 2,
            label: "Tank 2",
        }, {
            id: 3,
            label: "Tank 3"
        }, {
            id: 4,
            label: "Line 1"
        }, {
            id: 5,
            label: "Line 2"
        }],
        tasks: [{
            id: 1,
            resourceId: 1,
            label: "Job 1",
            from: time("12:00"),
            to: time("15:00"),
            classes: ['red-background-black-border'],
            amountDone: 55,
            showButton: false,
            buttonHtml: `<button class="bg-white hover:bg-gray-100 text-gray-800 font-bold py-1 px-2 border border-gray-400 rounded shadow"> Click me! </button>`
        }, {
            id: 2,
            resourceId: 1,
            label: "Job 2",
            from: time("9:30"),
            to: time("11:30"),
            classes: "orange"
        }, {
            id: 3,
            resourceId: 2,
            label: "Job 3",
            from: time("15:15"),
            to: time("16:00"),
            classes: "green"
        }, {
            id: 4,
            resourceId: 2,
            label: "Job 4",
            from: time("14:00"),
            to: time("17:00"),
            classes: "blue"
        }, {
            id: 5,
            resourceId: 2,
            label: "Job 5",
            from: time("13:00"),
            to: time("14:00"),
            classes: "blue"
        }, {
            id: 6,
            resourceId: 3,
            label: "Job 6",
            from: time("14:00"),
            to: time("15:30"),
            classes: "blue"
        }, {
            id: 7,
            resourceId: 4,
            label: "Job 7",
            from: time("15:00"),
            to: time("17:00"),
            classes: "green"
        }, {
            id: 8,
            resourceId: 5,
            label: "Job 8",
            from: time("14:30"),
            to: time("15:30"),
            classes: "orange"
        }],
        dependencies: [{
            id: 1,
            fromId: 1,
            toId: 2,
            stroke:"green"
        }, {
            id: 2,
            fromId: 2,
            toId: 3
        }, {
            id: 3,
            fromId: 3,
            toId: 4
        }, {
            id: 4,
            fromId: 4,
            toId: 5
        }, {
            id: 5,
            fromId: 6,
            toId: 5
        }]
    }

    let options = {
        dateAdapter: new MomentSvelteGanttDateAdapter(moment),
        rows: data.rows,
        tasks: data.tasks,
        dependencies: data.dependencies,
        timeRanges: [],
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
        const opts = event.detail;
        Object.assign(options, opts);
        gantt.$set(options);
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


    :global(.red-background-black-border){
    background-color: red;
    border: 1px solid black;
}

    :global(.black-border){
        border: 1px solid black;
    }

</style>

<div class="w-full">
    <div id="example-gantt"></div>
    <div id="new-task">Drag to gantt</div>
    <!-- <GanttOptions options={options} on:change={onChangeOptions}/> -->
</div>