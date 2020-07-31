import { html, render } from 'https://unpkg.com/lit-html@1.0.0/lit-html.js';

export default class SimpleMetric {
    constructor(parent, entery) {
        this.parent = parent;
        this.entery = entery;
        this.render();
    }

    render = () => {
        // const metricElems = this.entery.map(metric => this.buildMetric(metric.topic, metric.identity, metric.timestamp));
        const elem = html`<ul>${this.buildMetric(this.entery)}</ul>`;
        return render(elem, this.parent);
    }

    buildMetric = ({identity, name, time}) => {
        const shortenedIdentity = this.buildShortenedIdentity(identity);

        return html`        
        <div style='display: block;'>
            <span><b>${name}</b>  ${shortenedIdentity}:  <b>${time}ms</b></span>
        </div>`
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

    // setMetrics(metrics) {
    //     this.metrics = metrics;
    //     return this;
    // }
}