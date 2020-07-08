import PerformanceEvent from './performance-event.js';

export default class Logger {
    constructor() {
        this.timeBaseline = Date.now();
        this.entities = [new PerformanceEvent(fin.me.identity, 'epoch', this.timeBaseline, 'platform')];
        this.isConnected = false;
    }

    push(identity, description, topic, timestamp) {
        this.entities.push(new PerformanceEvent(identity, description, timestamp || Date.now(), topic));
        return this;
    }

    bulkPush(arr) {
        arr.forEach((...args) => this.push(...args));
    }

    // log(logLevel) {
    //     if(!logLevel) logLevel = 0;

    //     switch(logLevel) {
    //         case 0: {
    //             console.table(this.entities.map(({time, topic}) => ({time, topic}))); // basic
    //             break;    
    //         }
    //         case 1: {
    //             console.table(this.entities); //robust
    //         }
    //     }
    //     return this;
    // }

    async registerChannel() {
        this.channel = await fin.InterApplicationBus.Channel.create('internal-performance-channel');
        this.channel.onConnection(() => {
            this.isConnected = true;
            if(this.hasPendingDispatches) {
                this.dispatch().then(() => this.hasPendingDispatches = false).catch(e => console.log(`failed to dispatch. err: ${e.toString()}`));
            }
        });
    }

    async dispatch() {
        if(this.isConnected) {
            await this.channel.dispatch({uuid: 'performance_app', name: 'performance_window'} ,'update', this.entities);
        } else {
            this.hasPendingDispatches = true;
        }
        return this;
    }
}