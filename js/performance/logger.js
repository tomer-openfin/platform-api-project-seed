import PerformanceEvent from './performance-event.js';

export default class Logger {
    constructor() {
        this.timeBaseline = Date.now();
        this.entities = [new PerformanceEvent(fin.me.identity, 'epoch', 'the logger is initialized',this.timeBaseline, 'platform')];
        this.registerChannel();
    }

    push(topic,identity, name, timestamp, description, payload) {
        this.entities.push(new PerformanceEvent(topic, identity, name, timestamp || Date.now(), description, payload));
        this.sendUpdate();
    }

    bulkPush(arr) {
        arr.forEach(args => this.push(...args));
        this.sendUpdate();
    }

    async registerChannel() {
        this.channel = await fin.InterApplicationBus.Channel.create('internal-performance-channel');
        // this.channel.onConnection(this.onConnection.bind(this));
        // this.channel.onDisconnection(identity => identity.name === 'performance_window' ? this.isConnected = false : '');
    }

    // isConnected() {
    //     return !!this.channel.connections.filter(connection => connection.name === 'performance_window').length;
    // }

    async sendUpdate() {
        // if(!this.isConnected()) {
        //     this.hasPendingDispatch = true;
        //     return;
        // }

        return this.channel.publish('update', this.entities);
    }
}