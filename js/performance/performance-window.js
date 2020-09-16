import { render } from 'https://unpkg.com/lit-html@1.0.0/lit-html.js';
import { create as createTable } from '../components/table.js';
import PlatformLauncher from '../components/platform-launcher.js';
import SnapshotLauncher from '../components/snapshot-launcher.js';

(async ()=>{
    let platformMap = new Map();

    const provider = await fin.InterApplicationBus.Channel.create('internal-performance-channel');
    provider.onConnection((identity, payload) => {
        console.log('onConnection identity: ', JSON.stringify(identity));
        console.log('onConnection payload: ', JSON.stringify(payload));
    });
        // .catch(err =>  console.error('client registration error', JSON.stringify(err)));
    provider.onDisconnection((identity) => {
        console.log('onDisconnection identity: ', JSON.stringify(identity));
    });
    provider.register('update', update);

    const platformLauncherWrapper = document.getElementById("platform-launcher");
    const platformLauncher = new PlatformLauncher().get();
    render(platformLauncher, platformLauncherWrapper);
    
    const snapshotLauncherWrapper = document.getElementById("snapshot-launcher");
    const snapshotLauncher = new SnapshotLauncher().get();
    render(snapshotLauncher, snapshotLauncherWrapper);

    function update(payload) {
        const { uuid, entities } = payload;
        const { /*windows,*/ platformEvents } = entities.reduce((res, current) => {
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
        platformMap.set(uuid, entities);
        updatePlatformData(uuid, platformEvents);
        // updateWindowsData(windows);
    }
    
    function updatePlatformData(platformEvents) {
        const platformsContainer = document.getElementById(`platform-container`);
    
        let platformContainer = document.getElementById(`platform-container-${uuid}`);
        if(!platformContainer) {
            platformContainer = document.createElement('div');
            platformContainer.id = `platform-container-${uuid}`;
            platformsContainer.appendChild(platformContainer);
        }
    
        const table = createTable(platformEvents);
    
        render(table, platformContainer);
    };
    
    // function updateWindowsData(windowsEvents) {
    //     const container = document.getElementById("windows-container");
    //     const res = html`${windows.map(windowEvents => createTable(windowEvents))}`
    
    //     render(res, container);
    // }
    
    
})()
