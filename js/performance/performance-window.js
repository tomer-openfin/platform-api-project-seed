import { render } from 'https://unpkg.com/lit-html@1.0.0/lit-html.js';
import { create as createTable } from '../components/table.js';
import PlatformLauncher from '../components/platform-launcher.js';

const clientBus = fin.InterApplicationBus.Channel.connect('internal-performance-channel')
    .then(() => clientBus.register('update', update))
    .catch(err =>  console.error('client registration error', JSON.stringify(err)));

const launcherWrapper = document.getElementById("platform-launcher");
render(PlatformLauncher, launcherWrapper);

function update(payload) {
    const { windows, platformEvents } = payload.reduce((res, current) => {
        switch (current.topic) {
            case 'platform':
                res.platformData.push(current);
                break;
            case 'window':
            case 'view':
                res.window[current.identity.name] ?
                    res.window[current.identity.name].push(current):
                    res.window[current.identity.name] = [current]
        }
    }, { windows: {}, platformEvents: [] });

    updatePlatformData(platformEvents);
    updateWindowsData(windows);
}

function updatePlatformData(platformEvents) {
    const container = document.getElementById("platform-container");
    const table = createTable(platformEvents);

    render(table, container);
};

function updateWindowsData(windowsEvents) {
    const container = document.getElementById("windows-container");
    const res = html`${windows.map(windowEvents => createTable(windowEvents))}`

    render(res, container);
}

