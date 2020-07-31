import PerformanceEvent from './performance-event.js';

export default class Logger {
    constructor() {
        this.timeBaseline = Date.now();
        this.entities = [new PerformanceEvent(fin.me.identity, 'epoch', this.timeBaseline, 'platform')];
        this.windowsData = [];
        this.platformData = {};
    }

    // push(identity, description, topic, timestamp) {
    //     this.entities.push(new PerformanceEvent(identity, description, timestamp || Date.now(), topic));
    //     return this;
    // }

    // bulkPush(arr) {
    //     arr.forEach(args => this.push(...args));
    //     return this;
    // }

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
        this.channel.onConnection(this.onConnection.bind(this));
        this.channel.register('update', this.sendUpdate.bind(this));
        // this.channel.onDisconnection(identity => identity.name === 'performance_window' ? this.isConnected = false : '');
    }

    async sendUpdate() {
        if(!this.isConnected()) {
            this.hasPendingDispatch = true;
            return;
        }
        const payload = {
            app: this.platformData,
            windows: this.windowsData
        };
        return payload;
        // await this.channel.dispatch({uuid: 'performance_app', name: 'performance_window'} ,'update', payload);
    }

    onConnection(identity, payload) {
        if(identity.name !== 'performance_window') return;
        console.log(`on connection. hasPendingDispatch ${this.hasPendingDispatch}`);
        if(this.hasPendingDispatch) this.sendUpdate();
    }

    isConnected() {
        return !!this.channel.connections.filter(connection => connection.name === 'performance_window').length;
    }

    // async dispatch() {
    //     console.log('trying to dispatch');
    //     console.log(`isConnected: ${this.isConnected()}`)
    //     if(!this.isConnected()) {
    //         this.hasPendingDispatch = true;
    //         return;
    //     }
    //     console.log(this.channel);
    //     await this.channel.dispatch({uuid: 'performance_app', name: 'performance_window'} ,'update', this.entities);
    //     this.hasPendingDispatch = false;

    //     return this;
    // }

    async updateWindowPerformanceReport(rawReport, identity) {
        // if(!this.isConnected()) {
        //     this.hasPendingDispatch = true;
        //     return;
        // }
        this.windowsData.push({performanceReport: rawReport, identity});
        // await this.channel.dispatch({uuid: 'performance_app', name: 'performance_window'} ,'performance-report', {rawReport, identity});
        // this.hasPendingDispatch = false;
        return this;
    }

    async updateAppPerformanceReport(entery) {
        this.platformData[entery.name] = entery;
        return this; 
    }

    async addLifecycleEvent(event) {
        
    }

    // getClient = (identity) => {
    //     const target = identity || this.identity;
    //     const { uuid } = target;
    //     if (!this.clientMap.has(uuid)) {
    //         const clientPromise = this.#connectToProvider(uuid);
    //         this.clientMap.set(uuid, clientPromise);
    //     }
    //     return this.clientMap.get(uuid);
    // };
}