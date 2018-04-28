'use strict';

import jpslib from 'jpslib';

class PSService {
    constructor() {
    }

    sendNotification(name, body) {
        if(typeof name === 'string') {
            const notice = jpslib.createNotification(name, body);
            jpslib.publish(notice);
        }
    }
}

export default PSService;
