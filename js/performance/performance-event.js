export default class PerformanceEvent {
    constructor(identity, description, timestamp, topic) {
        this.topic = topic; // platform, window, view
        this.identity = identity;
        this.description = description;
        this.timestamp = timestamp;
    }
}