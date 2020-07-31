import { html, render } from 'https://unpkg.com/lit-html@1.0.0/lit-html.js';
import { parsePerformanceReport } from './util.js';

export default class PagePerformanceReport {
    constructor(target, rawReport, identity) {
        this.target = target;
        this.metrics = parsePerformanceReport(rawReport);
        this.identity = identity;
    }
    render = () => {
        const templatedEntries = Object.keys(this.metrics).map(key => {
            const {name, val, desc} = this.metrics[key];
            return html`
            <tr>
                <td class='tooltip'>
                    ${name}
                    <span class="tooltiptext">${desc}</span>
                </td>
                <td>${val}</td>
            </tr>`
        });

        const res = html`
        <div>${this.identity.name}</div>
        <table class="window">
            <tr>
                <th>name</th>
                <th>time in ms</th>
            </tr>
            ${templatedEntries}
        </table>
        `;

        return render(res, this.target);
    }
}