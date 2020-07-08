import SimpleMetrics from './simple-metric.js';
import TimeTable from './time-table.js';

(async () => {
    const clientBus = await fin.InterApplicationBus.Channel.connect('internal-performance-channel');
    // const simpleMetrics = new SimpleMetrics([], document.getElementById('simple-metrics'));
    const timeTableContainer = document.getElementById('time-table');

    const timeTable = new TimeTable(timeTableContainer, 'window');
    clientBus.register('update', (payload, identity) => {
        timeTable.updateEnteries(payload);
        // simpleMetrics.setMetrics(payload).render();
    });
})();
