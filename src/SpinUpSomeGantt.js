//SpinUpSomeGantt.js

import { time } from './utils';

export default function getDummyGanttData() {
  return {
    rows: [{
      id: 1,
      label: "Mixer 1, 6k Gal",
      name: "Mixer 1",
      category: "Mix",
      direct: ['Filler 2','Filler 3'],
      gallons: 6000,
      headerHtml: '<button type="button" id="MT02">MT02: 6,000 gal., DM, Jacketed.</button>'
    },    
    {
      id: 2,
      label: "Mixer 2 - 6k Gal",
      name: "Mixer 2",
      category: "Mix",
      gallons: 6000
    }, 
    {
      id: 3,
      label: "Mixer 3 - 3k Gal",
      name: "Mixer 3",
      category: "Mix",
      gallons: 3000
    }, 
    {
      id: 4,
      label: "Holding 1 - 3k Gal",
      name: "Holding 1",
      category: "Hold",
      gallons: 3000
    }, 
    {
      id: 5,
      label: "Holding 2 - 3k Gal",
      name: "Holding 2",
      category: "Hold",
      gallons: 3000
    },
    {
      id: 6,
      label: "Holding 3 - 3k Gal",
      name: "Holding 3",
      category: "Hold",
      gallons: 3000
    },
    {
      id: 7,
      label: "Holding 4 - 3k Gal",
      name: "Holding 4",
      category: "Hold",
      gallons: 3000
    },
    {
      id: 8,
      label: "Holding 5 - 3k Gal",
      name: "Holding 5",
      category: "Hold",
      gallons: 3000
    },
    {
      id: 9,
      label: "Filler 1",
      name: "Filler 1",
      category: "Fill",
      rate: {'Shampoo A': 125, 'Shampoo B': 125, 'Conditioner A': 125}
    }, 
    {
      id: 10,
      label: "Filler 2",
      name: "Filler 2",
      category: "Fill",
      rate: {'Shampoo A': 125, 'Shampoo B': 125, 'Conditioner A': 125}
    },
    {
      id: 11,
      label: "Filler 3",
      name: "Filler 3",
      category: "Fill",
      rate: {'Shampoo A': 125, 'Shampoo B': 125, 'Conditioner A': 125}
    }
    
  ],
    tasks: [
        {
            id: 1,
            job: "Job 1",
            resourceId: 1,
            label: "Mix Job 1",
            from: new Date(time("6:00")).getTime(),
            to: new Date(time("10:00")).getTime(),
            product: 'Shampoo A',
            category: "Mix",
            gallons: 6000,
            processTime: 10800000, // 4 hours,
            runTime: 10800000, // 4 hours,
            setupTime: 900000, // 15 min,
            changeoverTime: 3600000, // 1 hour,
            idleTime: 0,
            classes: [],
            amountDone: 55,
            showButton: false,
            // html: `
            //   <div style="position: relative; width: 100%; height: 100%;">
            //     <div>Job 1</div>
            //     <button onclick="console.log('hi')" }>
            //       <svg style="position: absolute; top: -50%; left: -75%; width: 24px; height: 24px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            //         <path Fill="#CCCCCC" stroke="#000000" stroke-width="1" d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1c0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z"/>
            //       </svg>
            //     </button>
            //   </div>
            // `,
          },
          
        
        {
          id: 2,
          job: "Job 1",
          resourceId: 4,
          label: "Hold Job 1",
          from: new Date(time("6:00")).getTime(),
          to: new Date(time("8:00")).getTime(),
          product: 'Shampoo A',
          category: "Hold",
          gallons: 3000,
          processTime: 7200000, // 2 hours
          runTime: 7200000, // 2 hours
          setupTime: 900000, // 15 min,
          changeoverTime: 3600000, // 1 hour,
          idleTime: 0,
          classes: [],
          amountDone: 0,
          showButton: false,
        },
        {
          id: 3,
          job: "Job 1",
          resourceId: 5,
          label: "Hold Job 1",
          from: new Date(time("6:00")).getTime(),
          to: new Date(time("8:00")).getTime(),
          product: 'Shampoo A',
          category: "Hold",
          gallons: 3000,
          processTime: 7200000, // 2 hours
          runTime: 7200000, // 2 hours
          setupTime: 900000, // 15 min,
          changeoverTime: 3600000, // 1 hour,
          idleTime: 0,
          classes: [],
          amountDone: 0,
          showButton: false,
        },
        {
          id: 4,
          job: "Job 1",
          resourceId: 9,
          label: "Fill Job 1",
          from: new Date(time("11:00")).getTime(),
          to: new Date(time("11:00")).getTime() + 21600000,
          product: 'Shampoo A',
          category: "Fill",
          gallons: 3000,
          pc: 30000,
          processTime: 21600000, // 6 hour
          runTime: 21600000, // 6 hour
          setupTime: 900000, // 15 min,
          changeoverTime: 3600000, // 1 hour,
          idleTime: 0,
          classes: [],
          amountDone: 0,
          showButton: false,
        },
        {
          id: 5,
          job: "Job 1",
          resourceId: 9,
          label: "Fill Job 1",
          from: new Date(time("11:00")).getTime() + 21600000 + 3600000/2,
          to: new Date(time("11:00")).getTime() + 21600000 + 21600000 ,
          product: 'Shampoo A',
          category: "Fill",
          gallons: 3000,
          processTime: 21600000, // 6 hour
          runTime: 21600000, // 6 hour
          setupTime: 900000, // 15 min,
          changeoverTime: 3600000, // 1 hour,
          idleTime: 0,
          classes: [],
          amountDone: 0,
          showButton: false,
        },
        
        {
          id: 7,
          job: "Job 2",
          resourceId: 1,
          label: "Mix Job 2",
          from: new Date(time("6:00")).getTime(),
          to: new Date(time("12:00")).getTime(),
          product: 'Conditioner A',
          category: "Mix",
          gallons: 6000,
          processTime: 21600000 , // 6 hour
          runTime: 21600000 , // 6 hour
          setupTime: 900000, // 15 min,
          changeoverTime: 3600000, // 1 hour,
          idleTime: 0,
          classes: [],
          amountDone: 0,
          showButton: false,
        },
        {
          id: 8,
          job: "Job 2",
          resourceId: 10,
          label: "Fill Job 2",
          from: new Date(time("12:00")).getTime(),
          to: new Date(time("18:00")).getTime(),
          product: 'Conditioner A',
          category: "Fill",
          gallons: 6000,
          processTime: 21600000 , // 6 hour
          runTime: 21600000 , // 6 hour
          setupTime: 900000, // 15 min,
          changeoverTime: 3600000, // 1 hour,
          idleTime: 0,
          classes: [],
          amountDone: 0,
          showButton: false,
        },
        {
          id: 9,
          job: "Job 1",
          label: "Pump",
          from: new Date(time("6:00")).getTime(),
          to: new Date(time("6:00")).getTime() + 9900000,
          resourceId: 1,
          mixId: 1,
          holdId: 2,
          product: "Shampoo A",
          category: "Pump",
          gallons: 3000,
          runTime: 9900000, //Math.ceil(holdTask.gallons / (productInfo[mixTask.product]?.pumpRateGallonsPerMin ?? 200) / 15) * 15 * 60000;
          setupTime: 0,
          changeoverTime: 0,
          idleTime: 0,
          classes: "setup-task",
          amountDone: 0,
          showButton: false,
        },
        {
          id: 10,
          job: "Job 1",
          label: "Pump",
          from: new Date(time("6:00")).getTime() ,
          to: new Date(time("6:00")).getTime() + 9900000 ,
          resourceId: 1,
          mixId: 1,
          holdId: 3,
          product: "Shampoo A",
          category: "Pump",
          gallons: 3000,
          runTime: 9900000, //Math.ceil(holdTask.gallons / (productInfo[mixTask.product]?.pumpRateGallonsPerMin ?? 200) / 15) * 15 * 60000;
          setupTime: 0,
          changeoverTime: 0,
          idleTime: 0,
          classes: "setup-task",
          amountDone: 0,
          showButton: false,
        }
      ],
    dependencies: [{
        id: 1,
        fromId: 1,
        toId: 9,
    },
    {
        id: 2,
        fromId: 1,
        toId: 10,
    },
    {
        id: 3,
        fromId: 9,
        toId: 2
    }, 
    {
        id: 4,
        fromId: 10,
        toId: 3
    }, 
    {
        id: 5,
        fromId: 2,
        toId: 4
    }, 
    {
        id: 6,
        fromId: 3,
        toId: 5
    },
    {
        id: 7,
        fromId: 7,
        toId: 8
    }, 

  ]
  }
}
