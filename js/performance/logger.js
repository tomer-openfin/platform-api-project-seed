import PerformanceEvent from './performance-event.js';

export default class Logger {
    constructor() {
        this.timeBaseline = Date.now();
        this.entities = [new PerformanceEvent(fin.me.identity, 'epoch', this.timeBaseline, 'platform')];
    }

    push(identity, description, topic, timestamp) {
        this.entities.push(new PerformanceEvent(identity, description, timestamp || Date.now(), topic));
        return this;
    }

    bulkPush(arr) {
        arr.forEach(args => this.push(...args));
        return this;
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
        this.channel.onConnection(this.onConnection.bind(this));
        // this.channel.onDisconnection(identity => identity.name === 'performance_window' ? this.isConnected = false : '');
    }

    onConnection(identity) {
        if(identity.name !== 'performance_window') return;
        console.log(`on connection. hasPendingDispatch ${this.hasPendingDispatch}`);
        if(this.hasPendingDispatch) this.dispatch();
    }

    isConnected() {
        return !!this.channel.connections.filter(connection => connection.name === 'performance_window').length;
    }

    async dispatch() {
        console.log('trying to dispatch');
        console.log(`isConnected: ${this.isConnected()}`)
        if(!this.isConnected()) {
            this.hasPendingDispatch = true;
            return;
        }
        console.log(this.channel);
        await this.channel.dispatch({uuid: 'performance_app', name: 'performance_window'} ,'update', this.entities);
        this.hasPendingDispatch = false;

        return this;
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

    // #connectToProvider = async (uuid) => {
    //     try {
    //         const channelName = `custom-frame-${uuid}`;
    //         const client = await this._channel.connect(channelName, { wait: false });
    //         client.onDisconnection(() => {
    //             this.clientMap.delete(uuid);
    //         });
    //         return client;
    //     } catch (e) {
    //         this.clientMap.delete(uuid);
    //         throw new Error(
    //             'The targeted Platform is not currently running. Listen for application-started event for the given Uuid.'
    //         );
    //     }
    // };
}