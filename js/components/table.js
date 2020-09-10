import { html } from 'https://unpkg.com/lit-html@1.0.0/lit-html.js';
import { create as createEntity } from './entity.js';

export function create(items) {
    return html
    `<table class="table">
        <tr>
            <th>topic</th>
            <th>name</th>
            <th>identity</th>
            <th>timestamp</th>
            <th>description</th>
        </tr>
        ${items.forEach(item => createEntity(item))}
    </table>
    `;
}