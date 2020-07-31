import { html, render } from 'https://unpkg.com/lit-html@1.0.0/lit-html.js';

export default class TimeTable {
    constructor(target, title) {
        this.target = target;
        this.title = title;
    }

    updateEnteries(newEnteries) {
        this.enteries = newEnteries.sort((eventA, eventB) => eventA.timestamp - eventB.timestamp);
        this.startTime = this.enteries[0].timestamp;
        this.endTime = this.enteries[this.enteries.length - 1].timestamp;
        this.totalTime = this.endTime - this.startTime;
        this.render();
    }

    render = () => {
        // const metricElems = this.metrics.map(metric => this.buildMetric(metric.topic, metric.identity, metric.time));
        const res = html
        `<table class="window">
        <tr>
        <th>description</th>
        <th>time in ms</th>
        <th>time from ${this.enteries[0].description}</th>
        <th>% of total</th>
        </tr>
        ${this.buildTable()}
        </table>
        `;
        return render(res, this.target);
    }

    buildEntery = (from, to, dt, time, percentOfTotal) => {
        return html`        
        <tr>
        <td>${from} to ${to}</td>
        <td>${dt}</td>
        <td>${time}</td>
        <td>${percentOfTotal}</td>
        </tr>`
    }

    buildTable = () => {
        let dt;
        let prev;

        return this.enteries.reduce((res, entery) => {
            if(prev) {
                dt = entery.timestamp - prev.timestamp;
                res.push(
                    this.buildEntery(
                        prev.description,
                        entery.description,
                        dt, 
                        entery.timestamp - this.startTime, 
                        `${((dt/this.totalTime)*100).toFixed(1)}%`)
                );
            }
            prev = entery;
            return res;
        }, []);
    }
}