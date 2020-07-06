import Logger from './logger.js';

async function main() {
    const logger = new Logger();
    await logger.registerChannel();
    
    logger.push('before-platform-init');
    
    fin.Platform.init({
        overrideCallback: async (Provider) => {
            class Override extends Provider {
                async createWindow(options) {
                    if(options.name === 'performance_window') {
                        return await super.createWindow(options);
                    }

                    logger.push(`creating-window`, {name: options.name || 'nameless window'}, 'right before createWindow is called');
                    const win = await super.createWindow(options);
                    setupWindowListeners(win);
                    logger.push(`created-window`, {name: options.name}, 'right after createWindow resolves');
    
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
        logger.push(`after-platform-init`, payload, 'right after platform.init is resolved').dispatch();
    
        const p = fin.Platform.getCurrentSync();
        setupPlatformListeners(p);
    });
    
    function setupWindowListeners(window) {
        window.on('layout-initialized', event => logger.push('layout-initialized', event, 'api event').dispatch());
        window.on('window-initialized', event => logger.push('window-initialized', event, 'api event').dispatch());
        window.on('shown', event => logger.push('window-shown', event, 'api event').dispatch());
    }
    
    function setupViewListeners(view) {
        view.on('target-changed', event => logger.push('view-target-changed', event, 'api event').dispatch());
        view.on('created', event => logger.push('view-created', event, 'api event').dispatch());
    }
    
    function setupPlatformListeners(platform) {
        platform.on('platform-api-ready', event => logger.push('platform-api-ready', event).dispatch());
        platform.on('platform-snapshot-applied', event => logger.push('platform-snapshot-applied', event, 'api event').dispatch());
    }
    
    window.logger = logger;
}

main();