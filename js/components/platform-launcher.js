import { html } from 'https://unpkg.com/lit-html@1.0.0/lit-html.js';
import { /*isValidURI,*/ isValidJSON } from '../utils.js';
export default class PlatformLauncher {
    constructor() {
        this.container = document.getElementById("launch-platform");
        this.button = html`<div id="launch" @click=${this.clickHandler}>Launch!</div>`;
        this.textField = html`
            <span class="segment">Specify a platform config (a valid JSON). ProviderUrl values are overridden.</span>
            <textarea @keyup=${this.onInputKeyUp} id="manifest-input" placeholder="paste JSON here"></textarea>
            <div class="segment" id="bad-input-error">
                input is not a valid JSON
            </div>
        `;
    }

    clickHandler = () => {
        const inputElem = document.getElementById("manifest-input");
        const trimmedInput = inputElem.value.trim();
    
        if(isValidJSON(trimmedInput)) {
            const options = JSON.parse(trimmedInput);
            options.providerUrl = "http://localhost:5555/provider.html";
    
            fin.Platform.start(options);
        }
    
        // since we need to inject our own custom provider, implement this when fetchManifest is a thing 
        // else if(isValidURI(trimmedInput)) { 
        //     fin.Platform.startFromManifest(trimmedInput);
        // }
    }

    isValidInput = input => isValidJSON(input)/* || isValidURI(input)*/ ;
    
    onInputKeyUp = event => 
        document.getElementById("bad-input-error").style.visibility = isValidInput(event.target.value) ? 'hidden' : 'visible';
        
    get = async () => html`
        ${this.textField}
        ${this.button}
    `;
}