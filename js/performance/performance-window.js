import SimpleMetrics from './simple-metric.js';
import TimeTable from './time-table.js';

(async () => {
    const clientBus = await fin.InterApplicationBus.Channel.connect('internal-performance-channel');
    let windowsEventsMap = new Map(); 
    let windowsTimeTables = new Map();

    let applicationEvents;
    // const simpleMetrics = new SimpleMetrics([], document.getElementById('simple-metrics'));
    const timeTableContainer = document.getElementById('time-table');


    clientBus.register('update', (payload, identity) => {
        console.log('update');
        console.log(payload);
        timeTableContainer.innerHTML = '';
        windowsEventsMap.clear();
        applicationEvents = [];
        payload.forEach(event => {
            if(event.topic === 'window') {
                const winName = event.identity.name;
                const windowEvents = windowsEventsMap.get(winName)

                windowsEventsMap.set(winName, windowEvents ? [...windowEvents, event] : [event]);
            } else if(event.topic === 'platform') {
                applicationEvents.push(event);
            }
        });

        windowsEventsMap.forEach((windowEvents, windowName) => {
            const container = document.createElement('div');
            let windowTimeTable;

            container.className = "row";
            if(!windowsTimeTables.has(windowName)) {
                windowTimeTable = new TimeTable(container, `window ${windowName}`);
                windowsTimeTables.set(windowName, windowTimeTable);
            } else {
                windowTimeTable = windowsTimeTables.get(windowName);
            }

            windowTimeTable.updateEnteries(windowEvents);

            
            // windowsTimeTables.get(windowName).updateEnteries(windowsEventsMap.get(windowName));
            // timeTable.updateEnteries(payload);

            timeTableContainer.appendChild(container);
        });
        // simpleMetrics.setMetrics(payload).render();
    });
})();
