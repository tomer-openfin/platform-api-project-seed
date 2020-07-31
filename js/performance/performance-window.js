import PagePerformanceReport from './PagePerformanceReport.js';
import TimeTable from './time-table.js';
import SimpleMetric from './simple-metric.js';

(async () => {
    const app = fin.Application.getCurrentSync();
    var appData, windowsData;
    app.on('view-created', update);
    app.on('view-destroyed', update);
    app.on('window-created', update);
    app.on('window-closed', update);
    window.on('DOMContentLoaded', update);
    // let windowsEventsMap = new Map(); 
    // let windowsTimeTables = new Map();

    // let applicationEvents;
    // const SimpleMetric = new SimpleMetric([], document.getElementById('simple-metrics'));
    const timeTableContainer = document.getElementById('windows');

    // clientBus.register('performance-report', (payload, identity) => {
    //     // windowsTimeTables.set(identity.name, payload);


    // });
    async function getChannel() {
        return await fin.InterApplicationBus.Channel.connect('internal-performance-channel'/*, { wait: true }*/);
    }

    // connectToProvider = async (uuid) => {
    //     try {
    //         const channelName = `internal-performance-channel`;
    //         const client = await this._channel.connect(channelName, { wait: false });
    //         client.onDisconnection(() => {
    //             this.clientMap.delete(uuid);
    //         });
    //         return client;
    //     } catch (e) {
    //         this.clientMap.delete(uuid);
    //         throw new Error(
    //             'The targeted Platform is not currently running. Listen for application-started event for the given Uuid.'
    //         );
    //     }
    // };

    async function update() {
        const channel = await getChannel();
        channel.dispatch('update').then(({app, windows}) => {
            renderAppInfo(app);
            renderWindows(windows);
        });
    }


    function renderWindows(windows) {
        timeTableContainer.innerHTML = '';
        // const currentElem = document.getElementById(identity.name);
        // currentElem && currentElem.parentNode.removeChild(currentElem);
        windows.forEach(({performanceReport, identity}) => {
            const container = document.createElement('div');
            container.id = identity.name;
            if(performanceReport) {
                const newElem = new PagePerformanceReport(container, performanceReport, identity);
                newElem.render();
                timeTableContainer.appendChild(container);
            }
        });
    }

    function renderAppInfo(appInfo) {
        const parent = document.getElementById('app-data');
        parent.innerHTML = '';
        Object.keys(appInfo).forEach(key => {
            
            const wrapper = document.createElement('div');
            wrapper.className = 'simple-metric';

            new SimpleMetric(wrapper, appInfo[key]);
            parent.appendChild(wrapper);
        });
    }


    // clientBus.register('update', (payload, identity) => {
    //     // timeTableContainer.innerHTML = '';
    //     // windowsEventsMap.clear();
    //     // applicationEvents = [];
    //     // payload.forEach(event => {
    //     //     if(event.topic === 'window') {
    //     //         const winName = event.identity.name;
    //     //         const windowEvents = windowsEventsMap.get(winName)

    //     //         windowsEventsMap.set(winName, windowEvents ? [...windowEvents, event] : [event]);
    //     //     } else if(event.topic === 'platform') {
    //     //         applicationEvents.push(event);
    //     //     }
    //     // });

    //     // const appData = document.getElementById('app_data');
    //     // // appMetrics.render();
    //     // windowsEventsMap.forEach((windowEvents, windowName) => {
    //     //     const container = document.createElement('div');
    //     //     let windowTimeTable;

    //     //     container.className = "row";
    //     //     if(!windowsTimeTables.has(windowName)) {
    //     //         windowTimeTable = new TimeTable(container, `window ${windowName}`);
    //     //         windowsTimeTables.set(windowName, windowTimeTable);
    //     //     } else {
    //     //         windowTimeTable = windowsTimeTables.get(windowName);
    //     //     }

    //     //     windowTimeTable.updateEnteries(windowEvents);

            
    //     //     // windowsTimeTables.get(windowName).updateEnteries(windowsEventsMap.get(windowName));
    //     //     // timeTable.updateEnteries(payload);

    //     //     timeTableContainer.appendChild(container);
    //     // });
    //     // // SimpleMetric.setMetrics(payload).render();
    // });
})();
