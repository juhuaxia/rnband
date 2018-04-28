'use strict';

import React from 'react';

import jpslib from 'jpslib';

class ComSubscriber extends jpslib.ISubscriber {
    constructor(name, callback, scope) {
        super();

        this._name = name;
        this._callback = callback;
        this._scope = scope;
    }

    get name() {
        return this._name;
    }

    get callback() {
        return this._callback;
    }

    listNotificationInterested() {
        return [this._name];
    }

    executeNotification(notice) {
        this._callback.call(this._scope || {}, notice.getBody());
    }
}

class PSComponent extends React.Component {
    constructor(props) {
        super(props);

        this._subscribers = [];
    }

    hasSubscriber(name, callback) {
        for(let i = 0; i < this._subscribers.length; i++) {
            let sub = this._subscribers[i];
            if(sub.name === name && sub.callback === callback) {
                return true;
            }
        }
        return false;
    }

    addSubscriber(name, callback) {
        if(typeof name === 'string') {
            if(typeof callback === 'function') {
                if(this.hasSubscriber(name, callback)) {
                    return false;
                }
                let subscriber = new ComSubscriber(name, callback, this);
                jpslib.subscribe(subscriber);
                this._subscribers.push(subscriber);
                return true; 
            } else {
                throw new Error('addSubscriber parameter callback should be type of function');
            }
        } else {
            throw new Error('addSubscriber parameter name should be type of string');
        }
    }

    removeSubscriber(name, callback) {
        if(typeof name === 'string' && typeof callback === 'function') {
            for(let i = 0; i < this._subscribers.length; i++) {
                let sub = this._subscribers[i];
                if(sub.name === name && sub.callback === callback) {
                    const subscriber = this._subscribers.splice(i, 1)[0];
                    jpslib.unsubscribe(name, subscriber);
                    return true;
                }
            }
        } else if(typeof name === 'string' && callback === undefined) {
            for(let i = 0; i < this._subscribers.length; i++) {
                let sub = this._subscribers[i];
                if(sub.name === name) {
                    const subscirber = this._subscribers.splice(i, 1);
                    jpslib.unsubscribe(name, subscriber);
                    i--;
                }
            }
            return true;
        }
        return false;
    }

    sendNotification(name, body) {
        if(typeof name === 'string') {
            const notice = jpslib.createNotification(name, body);
            jpslib.publish(notice);
        }
    }
}

export default PSComponent;
