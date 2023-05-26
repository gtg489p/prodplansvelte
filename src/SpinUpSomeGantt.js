// SpinUpSomeGantt.js

import { time } from './utils';

export default function getDummyGanttData() {
  return {
    rows: [{
        id: 1,
        label: "Mixing Tank 1",
        category: "Mix",
        size: 10000
    }, 
    {
        id: 2,
        label: "Mixing Tank 2",
        category: "Mix"
    }, 
    {
        id: 3,
        label: "Mixing Tank 3",
        category: "Mix"
    }, 
    {
        id: 4,
        label: "Hold Tank 1",
        category: "Hold"
    }, 
    {
        id: 5,
        label: "Hold Tank 2",
        category: "Hold"
    },
    {
        id: 6,
        label: "Hold Tank 3",
        category: "Hold"
    },
  {
      id: 7,
      label: "Hold Tank 4",
      category: "Hold"
  },
  {
      id: 8,
      label: "Hold Tank 5",
      category: "Hold"
  },
    {
      id: 9,
      label: "Fill Line 1",
      category: "Fill"
  }, 
  {
    id: 10,
    label: "Fill Line 2",
    category: "Fill"
}
  
  ],
    tasks: [
        {
            id: 1,
            resourceId: 1,
            label: "Mix 30k Lbs Shampoo A",
            from: new Date(time("6:00")).getTime(),
            to: new Date(time("10:00")).getTime(),
            product: 'Shampoo A',
            category: "Mix",
            processTime: 10800000, // 4 hours,
            setupTime: 900000, // 15 min,
            changeoverTime: 3600000, // 1 hour,
            idleTime: 0,
            classes: [],
            amountDone: 55,
            showButton: true,
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
          resourceId: 4,
          label: "Hold 10k Lbs Shampoo A",
          from: new Date(time("6:00")).getTime(),
          to: new Date(time("8:00")).getTime(),
          product: 'Shampoo A',
          category: "Hold",
          processTime: 7200000, // 2 hours
          runTime: 7200000, // 2 hours
          setupTime: 900000, // 15 min,
          changeoverTime: 3600000, // 1 hour,
          idleTime: 0,
          classes: []
        },
        {
          id: 3,
          resourceId: 5,
          label: "Hold 10k Lbs Shampoo A",
          from: new Date(time("6:00")).getTime(),
          to: new Date(time("8:00")).getTime(),
          product: 'Shampoo A',
          category: "Hold",
          processTime: 7200000, // 2 hours
          runTime: 7200000, // 2 hours
          setupTime: 900000, // 15 min,
          changeoverTime: 3600000, // 1 hour,
          idleTime: 0,
          classes: []
        },
        {
          id: 4,
          resourceId: 6,
          label: "Hold 10k Lbs Shampoo A",
          from: new Date(time("6:00")).getTime(),
          to: new Date(time("8:00")).getTime(),
          product: 'Shampoo A',
          category: "Hold",
          processTime: 7200000, // 2 hours
          runTime: 7200000, // 2 hours
          setupTime: 900000, // 15 min,
          changeoverTime: 3600000, // 1 hour,
          idleTime: 0,
          classes: []
        },
        {
          id: 5,
          resourceId: 9,
          label: "Fill 10k Lbs Shampoo A",
          from: new Date(time("6:00")).getTime(),
          to: new Date(time("8:00")).getTime(),
          product: 'Shampoo A',
          category: "Fill",
          processTime: 7200000, // 2 hour
          runTime: 7200000, // 2 hour
          setupTime: 900000, // 15 min,
          changeoverTime: 3600000, // 1 hour,
          idleTime: 0,
          classes: []
        },
        {
          id: 6,
          resourceId: 9,
          label: "Fill 10k Lbs Shampoo A",
          from: new Date(time("8:00")).getTime(),
          to: new Date(time("10:00")).getTime(),
          product: 'Shampoo A',
          category: "Fill",
          processTime: 7200000, // 2 hour
          runTime: 7200000, // 2 hour
          setupTime: 900000, // 15 min,
          changeoverTime: 3600000, // 1 hour,
          idleTime: 0,
          classes: []
        },
        {
          id: 7,
          resourceId: 9,
          label: "Fill 10k Lbs Shampoo A",
          from: new Date(time("10:00")).getTime(),
          to: new Date(time("12:00")).getTime(),
          product: 'Shampoo A',
          category: "Fill",
          processTime: 7200000, // 2 hour
          runTime: 7200000, // 2 hour
          setupTime: 900000, // 15 min,
          changeoverTime: 3600000, // 1 hour,
          idleTime: 0,
          classes: []
        },

        
        {
          id: 8,
          resourceId: 2,
          label: "Mix 30k Lbs Conditioner A",
          from: new Date(time("6:00")).getTime(),
          to: new Date(time("12:00")).getTime(),
          product: 'Conditioner A',
          category: "Mix",
          processTime: 21600000 , // 6 hour
          runTime: 21600000 , // 6 hour
          setupTime: 900000, // 15 min,
          changeoverTime: 3600000, // 1 hour,
          idleTime: 0,
          classes: []
        },
        {
          id: 9,
          resourceId: 10,
          label: "Fill 30k Lbs Conditioner A",
          from: new Date(time("12:00")).getTime(),
          to: new Date(time("18:00")).getTime(),
          product: 'Conditioner A',
          category: "Fill",
          processTime: 21600000 , // 6 hour
          runTime: 21600000 , // 6 hour
          setupTime: 900000, // 15 min,
          changeoverTime: 3600000, // 1 hour,
          idleTime: 0,
          classes: []
        },
      ],
    dependencies: [{
        id: 1,
        fromId: 1,
        toId: 2,
        stroke:"green"
    }, 
    {
        id: 2,
        fromId: 1,
        toId: 3
    }, 
    {
        id: 3,
        fromId: 1,
        toId: 4
    }, 
    {
        id: 4,
        fromId: 2,
        toId: 5
    }, 
    {
        id: 5,
        fromId: 3,
        toId: 6
    }, 
    {
        id: 6,
        fromId: 4,
        toId: 7
    }, 
    {
        id: 7,
        fromId: 8,
        toId: 9
    }, 

  ]
  }
}
