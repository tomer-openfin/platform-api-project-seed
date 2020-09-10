export default class PerformanceEvent {
    constructor(identity, name, description, timestamp, topic, payload) {
        this.topic = topic; // platform, window, view
        this.identity = identity;
        this.name = name;
        this.timestamp = timestamp;
        this.description = description
        this.payload = payload;
    }
}