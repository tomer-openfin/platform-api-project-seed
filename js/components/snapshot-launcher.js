import { html } from 'https://unpkg.com/lit-html@1.0.0/lit-html.js';
import { /*isValidURI,*/ isValidJSON } from '../utils.js';

export default class SnapshotLauncher {
    constructor() {
        this.seletedPlatform = null;
        this.container = document.getElementById("apply-snapshot");
        this.button = html`<div id="apply" @click=${this.clickHandler}>Apply!</div>`;
        this.textField = html`
            <span class="segment">Specify a snapshot to apply (a valid JSON).</span>
            <textarea @keyup=${this.onInputKeyUp} id="snapshot-input" placeholder="paste JSON here"></textarea>
            <div class="segment" style="visibility=hidden" id="bad-snapshot">
                input is not a valid JSON
            </div>
        `;
    }

    clickHandler = () => {
        const inputElem = document.getElementById("snapshot-input");
        const trimmedInput = inputElem.value.trim();
    
        if(isValidJSON(trimmedInput) && this.seletedPlatform) {
            const snapshot = JSON.parse(trimmedInput);
    
            fin.Platform.wrapSync({uuid: this.seletedPlatform}).applySnapshot(snapshot);
        }
    }

    handleSelection = event => {
        this.seletedPlatform = event.target.innerText;
        console.log('made selection', event.target.innerText);
    }

    isValidInput = input => isValidJSON(input)/* || isValidURI(input)*/ ;
    
    onInputKeyUp = event => 
        document.getElementById("bad-snapshot").style.visibility = isValidInput(event.target.value) ? 'hidden' : 'visible';
    
    buildPlatformPicker = async () => html`<table>${fin.System.getAllApplications().then(allApps => allApps.filter(app => app.isPlatform).map(platform => html`<tr @click=${handleSelection}>${platform.uuid}</tr>`))}</table>`;
    
    get = async () => html`
        ${await platformPicker()}
        ${textField}
        ${button}
    `;
}