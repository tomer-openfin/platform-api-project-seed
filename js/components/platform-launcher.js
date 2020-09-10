import { render, html } from 'https://unpkg.com/lit-html@1.0.0/lit-html.js';
import { /*isValidURI,*/ isValidJSON } from '../utils.js';

const container = document.getElementById("launch");

const clickHandler = () => {
    const inputElem = document.getElementById("manifest-input");
    const trimmedInput = inputElem.value.trim();

    if(isValidJSON(trimmedInput)) {
        trimmedInput.providerUrl = "http://localhost:5555/provider.html";

        fin.Platform.start(JSON.parse(trimmedInput));
    }

    // since we need to inject our own custom provider, implement this when fetchManifest is a thing 
    // else if(isValidURI(trimmedInput)) { 
    //     fin.Platform.startFromManifest(trimmedInput);
    // }
}



const isValidInput = input => isValidJSON(input)/* || isValidURI(input)*/ ;

const button = html`
    <div id="launch" @click=${clickHandler}>Launch!</div>
`

const onInputKeyUp = event => 
    document.getElementById("bad-input-error").style.visibility = isValidInput(event.target.value) ? 'hidden' : 'visible';

const textField = html`
    <span id="instructions" class="segment"> Benchmark a Platform</span>
    <span class="segment">Specify a JSON object with
    <a href="https://cdn.openfin.co/docs/javascript/stable/global.html#PlatformOptions">PlatformOptions</a>
    (launch from url is coming). ProviderUrl values are overridden.</span>
    <textarea @keyup=${onInputKeyUp} id="manifest-input" placeholder="paste JSON here"></textarea>
    <div class="segment" id="bad-input-error">
        input is not a valid JSON
    </div>
`

export default html`
    ${textField}
    ${button}
`