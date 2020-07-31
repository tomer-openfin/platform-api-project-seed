export const CONTAINER_ID = 'layout-container';

function parsePerformanceReport({timing: raw}) {
    return {
        firstByte: {
            val: raw.responseStart - raw.navigationStart,
            name: "Total First byte Time",
        },
        latency: {
            val: raw.responseStart - raw.fetchStart,
            name: "Latency",
        },            
        lookup: {
            val: raw.domainLookupEnd - raw.domainLookupStart,
            name: "DNS / Domain Lookup Time",
        },            
        serverConnect: {
            val: raw.connectEnd - raw.connectStart,
            name: "Server connect Time",
        },            
        serverResponse: {
            val: raw.responseStart - raw.requestStart,
            name: "Server Response Time",
        },            
        loadTime: {
            val: raw.loadEventStart - raw.navigationStart,
            name: "Page Load time",
        },            
        downloadTime: {
            val: raw.responseEnd - raw.responseStart,
            name: "Transfer/Page Download Time",
        },            
        domInteractive: {
            val: raw.domInteractive - raw.navigationStart,
            name: "DOM Interactive Time",
        },            
        domContentLoaded: {
            val: raw.domContentLoadedEventEnd - raw.navigationStart,
            name: "DOM Content Load Time",
        },
        processingToInteractive: {
            val: raw.domInteractive - raw.domLoading,
            name: "DOM Processing to Interactive",
        },            
        interactiveToComplete: {
            val: raw.domComplete - raw.domInteractive,
            name: "DOM Interactive to Complete",
        },            
        onload: {
            val: raw.loadEventEnd - raw.loadEventStart,
            name: "Time to onload",
        }
    }
}

fin.me.on('performance-report', payload => console.table(parsePerformanceReport(payload)));

window.addEventListener('DOMContentLoaded', () => {
    // Before .50 AI version this may throw...
    fin.Platform.Layout.init({containerId: CONTAINER_ID});
});
