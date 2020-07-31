import Logger from './performance/logger.js';

async function main() {
    const logger = new Logger();
    const uuid = fin.me.identity.uuid;
    await logger.registerChannel();
    logger.updateAppPerformanceReport({
        identity: {uuid}, 
        name: 'before-platform-init', 
        target: 'platform',
        time: Date.now()
    });
    
    fin.Platform.init({
        overrideCallback: async (Provider) => {
            class Override extends Provider {
                async createWindow(options) {
                    if(options.name === 'performance_window') {
                        return await super.createWindow(options);
                    }
                    // logger.updateAppPerformanceReport({uuid, name: options.name || 'nameless window'}, 'creating window', 'platform');
                    const win = await super.createWindow(options);

                    setupWindowListeners(win);
                    // logger.updateAppPerformanceReport({uuid, name: options.name || 'nameless window'}, `created-window`, 'platform');
    
                    return win;
                }
                async createView(options) {
                    const view = await super.createView(options);
                    setupViewListeners(fin.View.wrapSync(view.identity));
                }
            };
            return new Override();
        }
    }).then(payload => {
        logger.updateAppPerformanceReport({
            identity: {uuid}, 
            name: 'after-platform-init', 
            target: 'platform',
            time: Date.now(),
            payload
        });
    
        const p = fin.Platform.getCurrentSync();
        setupPlatformListeners(p);
    });
    
    function setupWindowListeners(window) {
        // window.on('layout-initialized', event => logger.push(window.identity, 'layout-initialized', 'window').dispatch());
        // window.on('window-initialized', event => logger.push(window.identity, 'layout-window', 'window').dispatch());
        // window.on('shown', event => logger.push(window.identity, 'window-shown', 'window').dispatch());
        window.on('performance-report', payload => logger.updateWindowPerformanceReport(payload, window.identity));
    }
    
    function setupViewListeners(view) {
        // view.on('target-changed', event => logger.push(view.identity, 'view-target-changed', 'view').dispatch());
        // view.on('created', event => logger.push(view.identity, 'view-created', 'view').dispatch());
    }
    
    function setupPlatformListeners(platform) {
        platform.once('platform-api-ready', event => logger.updateAppPerformanceReport({
            identity: {uuid}, 
            name: 'platform-api-ready', 
            target: 'platform',
            payload: event,
            time: Date.now()
        }));
        platform.once('platform-snapshot-applied', event => logger.updateAppPerformanceReport({
            identity: {uuid}, 
            name: 'initial-platform-snapshot-applied', 
            target: 'platform', 
            payload: event,
            time: Date.now()
        }));
    }
}

main();