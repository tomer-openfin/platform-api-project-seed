import { html } from 'https://unpkg.com/lit-html@1.0.0/lit-html.js';

export default function wrap(element, classes) {
    return html`
    <div class=${classes}>
        ${element}
    </div>
    `
}