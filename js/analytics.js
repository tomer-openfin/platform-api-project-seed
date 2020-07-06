import SimpleMetrics from './simple-metric.js';
(async () => {
    console.log('in analytics');
    const clientBus = await fin.InterApplicationBus.Channel.connect('internal-performance-channel');
    const simpleMetrics = new SimpleMetrics([], document.getElementById('simple-metrics'));
    console.log(clientBus);
    clientBus.register('update', (payload, identity) => {
        simpleMetrics.setMetrics(payload).render();
    });
    
    const startTimeMs = Date.now();
    const platform = fin.Platform.getCurrentSync();
    
    // const ms = timeInMs => `${Math.round(timeInMs/1000, 4)} sec`
})();
