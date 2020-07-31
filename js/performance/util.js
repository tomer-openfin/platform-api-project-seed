export function parsePerformanceReport({timing: raw}) {

    return {
        firstByte: {
            val: raw.responseStart - raw.navigationStart,
            name: "Total First byte Time",
            desc: "Total First byte Time = responseStart — navigationStart"
        },
        latency: {
            val: raw.responseStart - raw.fetchStart,
            name: "Latency",
            desc: "Latency = responseStart — fetchStart"
        },            
        lookup: {
            val: raw.domainLookupEnd - raw.domainLookupStart,
            name: "DNS / Domain Lookup Time",
            desc: "DNS / Domain Lookup Time = domainLookupEnd — domainLookupStart"
        },            
        serverConnect: {
            val: raw.connectEnd - raw.connectStart,
            name: "Server connect Time",
            desc: "Server connect Time = connectEnd — connectStart"
        },            
        serverResponse: {
            val: raw.responseStart - raw.requestStart,
            name: "Server Response Time",
            desc: "Server Response Time = responseStart — requestStart"
        },            
        loadTime: {
            val: raw.loadEventStart - raw.navigationStart,
            name: "Page Load time",
            desc: "Page Load time = loadEventStart — navigationStart"
        },            
        downloadTime: {
            val: raw.responseEnd - raw.responseStart,
            name: "Transfer/Page Download Time",
            desc: "Transfer/Page Download Time = responseEnd — responseStart"
        },            
        domInteractive: {
            val: raw.domInteractive - raw.navigationStart,
            name: "DOM Interactive Time",
            desc: "DOM Interactive Time = domInteractive — navigationStart"
        },            
        domContentLoaded: {
            val: raw.domContentLoadedEventEnd - raw.navigationStart,
            name: "DOM Content Load Time",
            desc: "DOM Content Load Time = domContentLoadedEventEnd — navigationStart"
        },
        processingToInteractive: {
            val: raw.domInteractive - raw.domLoading,
            name: "DOM Processing to Interactive",
            desc: "raw.domInteractive - raw.domLoading. How much time browser spends loading the webpage until the user can starting interacting with it."
        },            
        interactiveToComplete: {
            val: raw.domComplete - raw.domInteractive,
            name: "DOM Interactive to Complete",
            desc: "raw.domComplete - raw.domInteractive. How much time browser will take to load images/videos and execute any JavaScript code waiting for the domContentLoaded event."
        },            
        onload: {
            val: raw.loadEventEnd - raw.loadEventStart,
            name: "Time to onload",
            desc: "raw.loadEventEnd - raw.loadEventStart. How much time browser will take to execute Javascript code waiting for the window.load event."
        }
    }
}