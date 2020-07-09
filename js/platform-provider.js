import Logger from './performance/logger.js';

async function main() {
    const logger = new Logger();
    const uuid = fin.me.identity.uuid;
    await logger.registerChannel();
    // logger.push({uuid}, 'before-platform-init', 'platform');
    
    fin.Platform.init({
        overrideCallback: async (Provider) => {
            class Override extends Provider {
                async createWindow(options) {
                    if(options.name === 'performance_window') {
                        return await super.createWindow(options);
                    }
                    // logger.push({uuid, name: options.name || 'nameless window'}, 'creating window', 'platform');
                    const win = await super.createWindow(options);

                    setupWindowListeners(win);
                    // logger.push({uuid, name: options.name || 'nameless window'}, `created-window`, 'platform');
    
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
        // logger.push({uuid}, 'after-platform-init', 'platform').dispatch();
    
        const p = fin.Platform.getCurrentSync();
        setupPlatformListeners(p);
    });
    
    function setupWindowListeners(window) {
        // window.on('layout-initialized', event => logger.push(window.identity, 'layout-initialized', 'window').dispatch());
        // window.on('window-initialized', event => logger.push(window.identity, 'layout-window', 'window').dispatch());
        // window.on('shown', event => logger.push(window.identity, 'window-shown', 'window').dispatch());
        window.on('performance-report', payload => logger.bulkPush(performanceReportToArrayOfEvents(payload)));
    }
    
    function setupViewListeners(view) {
        // view.on('target-changed', event => logger.push(view.identity, 'view-target-changed', 'view').dispatch());
        // view.on('created', event => logger.push(view.identity, 'view-created', 'view').dispatch());
    }
    
    function setupPlatformListeners(platform) {
        // platform.on('platform-api-ready', event => logger.push({uuid}, 'platform-api-ready', 'platform').dispatch());
        // platform.on('platform-snapshot-applied', event => logger.push({uuid}, 'platform-snapshot-applied', 'platform').dispatch());
    }

    function performanceReportToArrayOfEvents (report) {
        console.log('performanceReportToArrayOfEvents');
        console.log(report);
        return Object.keys(report.timing).map(key =>
            [{uuid, name: report.name}, key, 'window', report.timing[key]]
        ).filter(item => item[3]) // get rid of items without a timestamp
    }
    
    const performanceWindow = fin.Window.wrapSync({uuid: 'performance_app', name: 'performance_window'});
    performanceWindow.on('initialized', () => logger.dispatch());
}

main();