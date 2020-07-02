export default class Logger {
    constructor() {
        this.timeBaseline = Date.now();
        this.entities = [{topic: 'logger-started', time: 0}];
        this.isConnected = false;
    }

    push(topic, payload, description) {
        let identity
        if(payload) {
            identity = JSON.stringify(payload.identity || {uuid: payload.uuid || '', name: payload.name || ''});
        } else {
            identity = 'N/A';
        }
        const entity = {time: Date.now() - this.timeBaseline, topic, identity, payload: JSON.stringify(payload) || '', description: description || ''};
        this.entities.push(entity);
        return this;
    }

    log(logLevel) {
        if(!logLevel) logLevel = 0;

        switch(logLevel) {
            case 0: {
                console.table(this.entities.map(({time, topic}) => ({time, topic}))); // basic
                break;    
            }
            case 1: {
                console.table(this.entities); //robust
            }
        }
        return this;
    }

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