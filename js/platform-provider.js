import Logger from './performance/logger.js';

const logger = new Logger();
const identity = fin.me.identity;

logger.push('platform', identity, 'before-platform-init', Date.now());

fin.Platform.init({
    overrideCallback: async (Provider) => {
        class Override extends Provider {
            async getSnapshot() {
                logger.push('platform', identity, 'get-snapshot-start', Date.now(), '');

                super.getSnapshot().then(snapshot => 
                    logger.push('platform', identity, 'get-snapshot-resolved', Date.now(), '', snapshot)
                );
            }

            async applySnapshot({ snapshot, options }) {
                logger.push('platform', identity, 'apply-snapshot-start', Date.now(), '', {snapshot, options});
                const originalPromise = super.applySnapshot({ snapshot, options });
                originalPromise.then(payload => logger.push('platform', identity, 'apply-snapshot-end', Date.now(), '', payload));
                return originalPromise;
            }

            async createView(options) {
                const view = await super.createView(options);
                setupViewListeners(fin.View.wrapSync(view.identity));
                return view;
            }

            async createWindow(options) {
                logger.push('window', window.identity, 'create-window-called', Date.now(), '', options);                
                const win = await super.createWindow(options);

                setupWindowListeners(win);

                return win;
            }
        };
        return new Override();
    }
}).then(payload => logger.push('platform', identity, 'platform-init-resolved', Date.now(), '', payload));


function setupViewListeners(view) {
    view.on('target-changed', payload => logger.push('view', view.identity, 'target-changed-event', Date.now(), '', payload));
    view.on('created', payload => logger.push('view', view.identity, 'created-event', Date.now(), '', payload));
}

function setupWindowListeners(window) {
    window.on('layout-initialized', payload => logger.push('window', window.identity, 'layout-initialized-event', Date.now(), '', payload));
    window.on('initialized', payload => logger.push('window', window.identity, 'window-initialized-event', Date.now(), '', payload));
    window.on('shown', payload => logger.push('window', window.identity, 'shown-event', Date.now(), '', payload));
    window.on('performance-report', payload => logger.push('window', window.identity, 'performance-report-event', Date.now(), '', payload));
}