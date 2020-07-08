import Logger from './performance/logger.js';

async function main() {
    const appLogger = new Logger();
    let windowLoggers = new Map();
    const uuid = fin.me.identity.uuid;
    await appLogger.registerChannel();
    
    appLogger.push({uuid}, 'before-platform-init', 'platform');
    
    fin.Platform.init({
        overrideCallback: async (Provider) => {
            class Override extends Provider {
                async createWindow(options) {
                    if(options.name === 'performance_window') {
                        return await super.createWindow(options);
                    }
                    appLogger.push({uuid, name: options.name || 'nameless window'}, 'creating window', 'platform');
                    const win = await super.createWindow(options);
                    win.on('performance-report', payload => appLogger.bulkPush(performanceReportToArrayOfEvents(payload)));

                    setupWindowListeners(win);
                    appLogger.push({uuid, name: options.name || 'nameless window'}, `created-window`, 'platform');
    
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
        appLogger.push({uuid}, 'after-platform-init', 'platform').dispatch();
    
        const p = fin.Platform.getCurrentSync();
        setupPlatformListeners(p);
    });
    
    function setupWindowListeners(window) {
        window.on('layout-initialized', event => appLogger.push(window.identity, 'layout-initialized', 'window').dispatch());
        window.on('window-initialized', event => appLogger.push(window.identity, 'layout-window', 'window').dispatch());
        window.on('shown', event => appLogger.push(window.identity, 'window-shown', 'window').dispatch());
    }
    
    function setupViewListeners(view) {
        view.on('target-changed', event => appLogger.push(view.identity, 'view-target-changed', 'view').dispatch());
        view.on('created', event => appLogger.push(view.identity, 'view-created', 'view').dispatch());
    }
    
    function setupPlatformListeners(platform) {
        platform.on('platform-api-ready', event => appLogger.push({uuid}, 'platform-api-ready', 'platform').dispatch());
        platform.on('platform-snapshot-applied', event => appLogger.push({uuid}, 'platform-snapshot-applied', 'platform').dispatch());
    }

    function performanceReportToArrayOfEvents (report) {
        Object.keys(report.timing).map(key =>
            [{uuid, name: report.name}, key, 'window', report.timing[key]]
        ).filter(item => item[3]) // get rid of items without a timestamp
    }
    
    window.appLogger = appLogger;
}

main();