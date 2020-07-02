import { html, render } from 'https://unpkg.com/lit-html@1.0.0/lit-html.js';

export default class SimpleMetric extends HTMLElement {
    constructor(title, value) {
        super();
        this.title = title;
        this.value = value;
        this.render();
    }

    render = () => {
        const content = html`
        <div>
            <h2>${this.title}</h2>
            <div>${this.value}</div>
        </div>`;
        return render(content, this);
    }
}