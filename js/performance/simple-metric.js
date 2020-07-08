import { html, render } from 'https://unpkg.com/lit-html@1.0.0/lit-html.js';

export default class SimpleMetrics {
    constructor(metrics, target, title) {
        this.metrics = metrics;
        this.target = target;
        this.title = title;
    }

    render = () => {
        const metricElems = this.metrics.map(metric => this.buildMetric(metric.topic, metric.identity, metric.time));
        const res = html
        `<div>${this.title}</div>
        <ul>${metricElems}</ul>`;
        return render(res, this.target);
    }

    buildMetric = (topic, identity, time) => {
        const shortenedIdentity = this.buildShortenedIdentity(identity);

        return html`        
        <li style='display: block;'>
            <span><b>${topic}</b> ${shortenedIdentity}:  <b>${time}ms</b></span>
        </li>`
    }

    buildShortenedIdentity(identity) {
        if(!identity) return `N/A`;
        if(identity.name) {
            if(identity.name.startsWith('internal-generated')) {
                return `<generated> ...${identity.name.substr(identity.name.length-4)}`;
            } else {
                return `name: ${identity.name}`;
            }
        } else if(identity.uuid) {
            return `uuid: ${identity.uuid}`;
        } 

        return `N/A`;
        
    }

    setMetrics(metrics) {
        this.metrics = metrics;
        return this;
    }
}