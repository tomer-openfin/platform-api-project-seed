import PerformanceEvent from './performance-event.js';

export default class Logger {
    constructor() {
        this.uuid = fin.me.identity.uuid;
        this.channel = undefined;
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
        this.channel = await fin.InterApplicationBus.Channel.connect('internal-performance-channel');
        this.isConnected = true;
        // this.channel.onConnection(this.onConnection.bind(this));
        this.channel.onDisconnection(() => this.isConnected = false);
    }

    onConnection() {
        this.isConnected = true;
        if(this.hasPendingDispatch) this.sendUpdate();
    }

    // isConnected() {
    //     return !!this.channel.connections.filter(connection => connection.name === 'performance_window').length;
    // }

    async sendUpdate() {
        if(!this.isConnected) {
            this.hasPendingDispatch = true;
            return;
        }
        this.hasPendingDispatch = false;
        return this.channel.dispatch('update', {uuid: this.uuid, entities: this.entities});
    }
}