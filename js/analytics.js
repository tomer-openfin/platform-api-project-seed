import SimpleMetric from './simple-metric.js';

const startTimeMs = Date.now();
const platform = fin.Platform.getCurrentSync();

const whenAPIReady = payload => {
    const simpleMetrics = document.getElementById('simple-metrics');
    simpleMetrics.appendChild(new SimpleMetric('API Ready', ms(startTimeMs - Date.now())));
}

platform.on('platform-api-ready', whenAPIReady);

const ms = timeInMs => `${Math.round(timeInMs/1000, 4)} sec`