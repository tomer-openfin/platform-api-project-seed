import { html } from 'https://unpkg.com/lit-html@1.0.0/lit-html.js';

export function create(item) {
    return html`        
        <tr>
        <td>${item.topic}</td>
        <td>${item.name}</td>
        <td>${item.identity}</td>
        <td>${item.timestamp}</td>
        <td>${item.description}</td>
        </tr>
    `
}