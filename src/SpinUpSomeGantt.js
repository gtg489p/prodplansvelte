// SpinUpSomeGantt.js

import { time } from './utils';

export default function getDummyGanttData() {
  return {
    rows: [{
        id: 1,
        label: "Mix 1",
        category: "mix",
        size: 10000
    }, {
        id: 2,
        label: "Mix 2",
        category: "mix"
    }, {
        id: 3,
        label: "Mix 3",
        category: "mix"
    }, {
        id: 4,
        label: "Holding Tank 1",
        category: "holding"
    }, {
        id: 5,
        label: "Holding Tank 2",
        category: "holding"
    }, {
      id: 6,
      label: "Line 2",
      category: "fill"
  }, {
    id: 7,
    label: "Line 2",
    category: "fill"
}
  
  ],
    tasks: [
        {
            id: 1,
            resourceId: 1,
            label: "Job 1",
            from: new Date(time("12:00")).getTime(),
            to: new Date(time("15:00")).getTime(),
            product: 'Shampoo A',
            category: "job",
            processTime: 10800000, // 3 hours,
            setupTime: 1800000, // 0.5 hour,
            changeoverTime: 3600000, // 1 hour,
            idleTime: 0,
            classes: ['red-background-black-border'],
            amountDone: 55,
            showButton: true,
            html: `
              <div style="position: relative; width: 100%; height: 100%;">
                <div>Job 1</div>
                <button onclick="console.log('hi')" }>
                  <svg style="position: absolute; top: -50%; left: -75%; width: 24px; height: 24px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path fill="#CCCCCC" stroke="#000000" stroke-width="1" d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1c0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z"/>
                  </svg>
                </button>
              </div>
            `,
          },
          
        
        {
          id: 2,
          resourceId: 1,
          label: "Job 2",
          from: new Date(time("8:30")).getTime(),
          to: new Date(time("12:30")).getTime(),
          product: 'Shampoo A',
          category: "job",
          processTime: 14400000, // 4 hours
          runTime: 14400000, // 4 hours
          setupTime: 1800000, // 0.5 hour,
          changeoverTime: 3600000, // 1 hour,
          idleTime: 0,
          classes: []
        },
        {
          id: 3,
          resourceId: 2,
          label: "Job 3",
          from: new Date(time("15:15")).getTime(),
          to: new Date(time("16:00")).getTime(),
          product: 'Shampoo B',
          category: "job",
          processTime: 2700000, // 45 minutes
          runTime: 2700000, // 45 minutes
          setupTime: 1800000, // 0.5 hour,
          changeoverTime: 3600000, // 1 hour,
          idleTime: 0,
          classes: "green"
        },
        {
          id: 4,
          resourceId: 2,
          label: "Job 4",
          from: new Date(time("14:00")).getTime(),
          to: new Date(time("17:00")).getTime(),
          product: 'Conditioner A',
          category: "job",
          processTime: 10800000, // 3 hours
          runTime: 10800000, // 3 hours
          setupTime: 1800000, // 0.5 hour,
          changeoverTime: 3600000, // 1 hour,
          idleTime: 0,
          classes: "blue"
        },
        {
          id: 5,
          resourceId: 2,
          label: "Job 5",
          from: new Date(time("13:00")).getTime(),
          to: new Date(time("14:00")).getTime(),
          product: 'Conditioner A',
          category: "job",
          processTime: 3600000, // 1 hour
          runTime: 3600000, // 1 hour
          setupTime: 1800000, // 0.5 hour,
          changeoverTime: 3600000, // 1 hour,
          idleTime: 0,
          classes: "blue"
        },
        {
          id: 6,
          resourceId: 3,
          label: "Job 6",
          from: new Date(time("14:00")).getTime(),
          to: new Date(time("15:30")).getTime(),
          product: 'Conditioner A',
          category: "job",
          processTime: 5400000, // 1.5 hours
          runTime: 5400000, // 1.5 hours
          setupTime: 1800000, // 0.5 hour,
          changeoverTime: 3600000, // 1 hour,
          idleTime: 0,
          classes: "blue"
        },
        {
          id: 7,
          resourceId: 4,
          label: "Job 7",
          from: new Date(time("15:00")).getTime(),
          to: new Date(time("17:00")).getTime(),
          product: 'Conditioner B',
          category: "job",
          processTime: 5400000, // 1.5 hours
          runTime: 5400000, // 1.5 hours
          setupTime: 1800000, // 0.5 hour,
          changeoverTime: 3600000, // 1 hour,
          idleTime: 0,
          classes: "green"
        },
        {
          id: 8,
          resourceId: 5,
          label: "Job 8",
          from: new Date(time("14:30")).getTime(),
          to: new Date(time("15:30")).getTime(),
          product: 'Conditioner C',
          category: "job",
          processTime: 3600000, // 1 hour,
          runTime: 3600000, // 1 hour,
          setupTime: 1800000, // 0.5 hour,
          changeoverTime: 3600000, // 1 hour,
          idleTime: 0,
          classes: "orange"
        }
      ],
    dependencies: [{
        id: 1,
        fromId: 1,
        toId: 3,
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
}
