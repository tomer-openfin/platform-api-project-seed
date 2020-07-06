import { html, render } from 'https://unpkg.com/lit-html@1.0.0/lit-html.js';

export default class SimpleMetrics {
    constructor(metrics, target) {
        this.metrics = metrics;
        this.target = target;
    }

    render = () => {
        const metricElems = this.metrics.map(metric => this.buildMetric(metric.title, metric.value));
        const res = html`${metricElems.join('\n')}`;
        return render(res, this.target);
    }

    buildMetric = (title, value) => {
        return `        
        <div>
            <h2>${title}</h2>
            <div>${value}</div>
        </div>`
    }

    setMetrics(metrics) {
        this.metrics = metrics;
        return this;
    }
}