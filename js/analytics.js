import SimpleMetric from './simple-metric.js';
(async () => {
    const clientBus = await fin.InterApplicationBus.Channel.connect('internal-performance-channel');

    clientBus.register('update', (payload, identity) => {
        updateSimpleMetrics(payload);
    });
    
    const startTimeMs = Date.now();
    const platform = fin.Platform.getCurrentSync();
    
    const updateSimpleMetrics = payload => {
        const simpleMetrics = document.getElementById('simple-metrics');
        simpleMetrics.innerHTML = '';
        payload.array.forEach(item => {
            simpleMetrics.appendChild(new SimpleMetric(item.topic, ms(item.time)));
        });
    }
    
    const ms = timeInMs => `${Math.round(timeInMs/1000, 4)} sec`
})();
