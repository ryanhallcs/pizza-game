var moment = require('moment');

class PizzaStream {
    constructor() {
        this.events = [];
        this.maxSize = 10;
    }
    publish(body, type) {
        this.events.push({
            body: body,
            type: type,
            id: this.generateId(),
            timestamp: moment()
        });

        while (this.events.length > this.maxSize) {
            this.events.shift();
        }
    }
    generateId(){
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }
}

export default PizzaStream;