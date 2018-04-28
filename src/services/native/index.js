/**
 * 封装与APP通讯的接口
 */
'use strict';

import React from 'react';
import { 
    NativeAppEventEmitter, NativeModules
} from 'react-native';

import jutils from 'jutils';

import IService from 'PaiBandRN/src/services/base/iservice';

import config from 'PaiBandRN/src/config';

const isObjEmpty = obj => Object.getOwnPropertyNames(obj).length === 0;

class NativeCommunication extends IService {
    constructor() {
        super();

        this._subscription = null;
        this._nativeService = null;

        this._appAwakenCalls = null;
        this._bluetoothStatusCalls = null;
    }

    init() {
        this._subscription = NativeAppEventEmitter.addListener('PaiBandServiceEvent', this._nativeEventHandler.bind(this));
        this._nativeService = NativeModules.PaiBandService;

        
        if(config.isLocalTest) {
            //setInterval(() => {
                //this._callBluetoothStatus({
                    //status: parseInt(Math.random() * 4)
                //});
            //}, 4000);
            //setInterval(() => {
                //this._callAppAwaken();
            //}, 6000);
        }
    }

    update() {
    }

    destroy() {
        if(this._subscription) {
            this._subscription.remove();
            this._nativeService = null;
        }

        this._appAwakenCalls = null;
        this._bluetoothStatusCalls = null;
    }

    listenAppAwaken(callback) {
        this._appAwakenCalls = this._appAwakenCalls || [];
        if(typeof callback === 'function' && this._appAwakenCalls.indexOf(callback) < 0) {
            this._appAwakenCalls.push(callback);
        }
    }

    removeAppAwakenCall(callback) {
        if(this._appAwakenCalls) {
            const idx = this._appAwakenCalls.indexOf(callback);
            if(idx > -1) {
                this._appAwakenCalls.splice(idx, 1);
            }
        }
    }

    listenBluetoothStatus(callback) {
        this._bluetoothStatusCalls = this._bluetoothStatusCalls || [];
        if(typeof callback === 'function' && this._bluetoothStatusCalls.indexOf(callback) < 0) {
            this._bluetoothStatusCalls.push(callback);
        }
    }

    removeBluetoothStatusCall(callback) {
        if(this._bluetoothStatusCalls) {
            const idx = this._bluetoothStatusCalls.indexOf(callback);
            if(idx > -1) {
                this._bluetoothStatusCalls.splice(idx, 1);
            }
        }
    }

    /**
    * callback(error, result)
    */
    getSystemInfo(deviceid, requestid) {
        const name = 'system-info';
        requestid = requestid || jutils.makeSimpleGUID();
        return new Promise((resolve, reject) => {
            if(config.isLocalTest) {
                setTimeout(() => {
                    resolve({
                        'type': 'system-info',
                        'data': {
                            'device_id': deviceid,
                            'version': '1.1.1',
                            'battery': 10,
                            'qrcode': 'data:image/jpeg:base64,/9j...',
                            'sensor_version': 'xxx',
                            'sensor_mark': 0,
                            'request_id': requestid
                        }
                    });
                    //reject('eeeeee');
                }, 2000);
            } else {
                this._callNative({
                    'type': name,
                    'data': {
                        'device_id': deviceid,
                        'request_id': requestid
                    }
                }, (error, data) => {
                    if(error && !isObjEmpty(error)) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            }
        });
    }

    /**
    * status true/false 是否打开安全监控
    */
    setSafeDistance(status, requestid) {
        const name = 'out-safeDistance';
        requestid = jutils.makeSimpleGUID();
        return new Promise((resolve, reject) => {
            if(config.isLocalTest) {
                setTimeout(() => {
                    resolve({
                        'type': name,
                        'data': {
                            'request_id': requestid,
                            'status': true
                        }
                    });
                    //reject('eeeeee');
                }, 2000);
            } else {
                this._callNative({
                    'type': name,
                    'data': {
                        'request_id': requestid,
                        'status': status
                    }
                }, (error, data) => {
                    if(error && !isObjEmpty(error)) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            }
        });
    }

    getClientIP(requestid) {
        const name = 'get-ip';
        requestid = requestid || jutils.makeSimpleGUID();
        return new Promise((resolve, reject) => {
            if(config.isLocalTest) {
                setTimeout(() => {
                    resolve({
                        'type': name,
                        'data': { 
                            'city': 'shanghai',
                            'cityip': '115.239.210.27'
                        }
                    });
                    //reject('eeeeee');
                }, 1000);
            } else {
                this._callNative({
                    'type': name,
                    'data': {
                        'request_id': requestid
                    }
                }, (error, data) => {
                    if(error && !isObjEmpty(error)) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            }
        });
    }

    savePic(requestid) {
        const name = 'save-pic';
        requestid = requestid || jutils.makeSimpleGUID();
        return new Promise((resolve, reject) => {
            if(config.isLocalTest) {
                setTimeout(() => {
                    resolve({
                        'type': name,
                        'data': { 
                            'status': 0
                        }
                    });
                    //reject('eeeeee');
                }, 2000);
            } else {
                this._callNative({
                    'type': name,
                    'data': {
                        'request_id': requestid
                    }
                }, (error, data) => {
                    if(error && !isObjEmpty(error)) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            }
        });
    }

    openNotification(requestid) {
        const name = 'notification-open';
        requestid = requestid || jutils.makeSimpleGUID();
        return new Promise((resolve, reject) => {
            if(config.isLocalTest) {
                setTimeout(() => {
                    resolve({
                        'type': name,
                        'data': { 
                            'status': 0
                        }
                    });
                    //reject('eeeeee');
                }, 2000);
            } else {
                this._callNative({
                    'type': name,
                    'data': {
                        'request_id': requestid
                    }
                }, (error, data) => {
                    if(error && !isObjEmpty(error)) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            }
        });
    }

    setChildWeight(cid, weight, requestid) {
        const name = 'update-weight';
        requestid = requestid || jutils.makeSimpleGUID();
        return new Promise((resolve, reject) => {
            if(config.isLocalTest) {
                setTimeout(() => {
                    resolve({
                        'type': name,
                        'data': { 
                            'status': 0
                        }
                    });
                    //reject('eeeeee');
                }, 2000);
            } else {
                this._callNative({
                    'type': name,
                    'data': {
                        'request_id': requestid,
                        'cid': 'xxxx',
                        'weight': weight
                    }
                }, (error, data) => {
                    if(error && !isObjEmpty(error)) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            }
        });
    }

    setChildHeight(cid, height, requestid) {
        const name = 'update-height';
        requestid = requestid || jutils.makeSimpleGUID();
        return new Promise((resolve, reject) => {
            if(config.isLocalTest) {
                setTimeout(() => {
                    resolve({
                        'type': name,
                        'data': { 
                            'status': 0
                        }
                    });
                    //reject('eeeeee');
                }, 2000);
            } else {
                this._callNative({
                    'type': name,
                    'data': {
                        'request_id': requestid,
                        'cid': 'xxxx',
                        'height': height
                    }
                }, (error, data) => {
                    if(error && !isObjEmpty(error)) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            }
        });
    }

    /**
    * cur_num： 当前小红花
    * num: 需要增加或减少的小红花数量
    * action: 'add_num'增加 'minus_num'减少
    */
    setFlowers(deviceid, cur_num, num, action, requestid) {
        const name = 'flowers';
        requestid = requestid || jutils.makeSimpleGUID();
        return new Promise((resolve, reject) => {
            if(config.isLocalTest) {
                setTimeout(() => {
                    resolve({
                        'type': name,
                        'data': { 
                            'status': 0
                        }
                    });
                    //reject('eeeeee');
                }, 200);
            } else {
                this._callNative({
                    'type': name,
                    'data': {
                        'request_id': requestid,
                        'device_id': deviceid,
                        'current_num': cur_num,
                        'num_info': num,
                        'action': action
                    }
                }, (error, data) => {
                    if(error && !isObjEmpty(error)) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            }
        });
    }

    /**
    * begin_h 开始小时
    * begin_m 开始分钟
    * end_h 结束小时
    * end_m 结束分钟
    * close 是否开启 true false
    */
    setBrightScreen(deviceid, begin_h, begin_m, end_h, end_m, close, requestid) {
        const name = 'bright-screen';
        requestid = requestid || jutils.makeSimpleGUID();
        return new Promise((resolve, reject) => {
            if(config.isLocalTest) {
                setTimeout(() => {
                    resolve({
                        'type': name,
                        'data': { 
                            'status': 0
                        }
                    });
                    //reject('eeeeee');
                }, 2000);
            } else {
                this._callNative({
                    'type': name,
                    'data': {
                        'request_id': requestid,
                        'device_id': deviceid,
                        'begin_hour': begin_h,
                        'begin_minute': begin_m,
                        'end_hour': end_h,
                        'end_minute': end_m,
                        'close': close
                    }
                }, (error, data) => {
                    if(error && !isObjEmpty(error)) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            }
        });
    }

    /**
    * 设置身高体重等
    */
    setGrow(requestid) {
        const name = 'grow-setting';
        requestid = requestid || jutils.makeSimpleGUID();
        return new Promise((resolve, reject) => {
            if(config.isLocalTest) {
                setTimeout(() => {
                    resolve({
                        'type': name,
                        'data': { }
                    });
                    //reject('eeeeee');
                }, 2000);
            } else {
                this._callNative({
                    'type': name,
                    'data': {
                        'request_id': requestid
                    }
                }, (error, data) => {
                    if(error && !isObjEmpty(error)) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            }
        });
    }

    //关闭paiband
    closePaiBand(page, requestid) {
        const name = 'close';
        requestid = requestid || jutils.makeSimpleGUID();
        return new Promise((resolve, reject) => {
            if(config.isLocalTest) {
            } else {
                this._callNative({
                    'type': name,
                    'data': { page }
                }, (error, data) => {
                    if(error && !isObjEmpty(error)) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            }
        });
    }

    /**
    * status 蓝牙状态 0未打开手机蓝牙 1已经连接 2连接中  3未找到指定设备
    */
    getBluetoothStatus(deviceid, requestid) {
        const name = 'bluetooth-status';
        requestid = requestid || jutils.makeSimpleGUID();
        return new Promise((resolve, reject) => {
            if(config.isLocalTest) {
                setTimeout(() => {
                    resolve({
                        'type': name,
                        'data': { 
                            'device_id': deviceid,
                            'status': 1
                        }
                    });
                    //reject('eeeeee');
                }, 2000);
            } else {
                this._callNative({
                    'type': name,
                    'data': {
                        'request_id': requestid,
                        'device_id': deviceid
                    }
                }, (error, data) => {
                    if(error && !isObjEmpty(error)) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            }
        });
    }

    /**
    * 打开手机蓝牙设置
    */ 
    openBluetooth(requestid) {
        const name = 'bluetooth-open';
        requestid = requestid || jutils.makeSimpleGUID();
        return new Promise((resolve, reject) => {
            if(config.isLocalTest) {
                setTimeout(() => {
                    resolve({
                        'type': name,
                        'data': { 
                            'status': 0
                        }
                    });
                    //reject('eeeeee');
                }, 2000);
            } else {
                this._callNative({
                    'type': name,
                    'data': {
                        'request_id': requestid,
                    }
                }, (error, data) => {
                    if(error && !isObjEmpty(error)) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            }
        });
    }

    determineHeartRate(deviceid, cid, requestid) {
        const name = 'heartrate-determine';
        requestid = requestid || jutils.makeSimpleGUID();
        return new Promise((resolve, reject) => {
            if(config.isLocalTest) {
                setTimeout(() => {
                    resolve({
                        'type': name,
                        'data': { 
                            'device_id': deviceid,
                            'cid': cid,
                            'heart_rate': 100,
                            'status': 0
                        }
                    });
                    //reject('eeeeee');
                }, 10000);
            } else {
                this._callNative({
                    'type': name,
                    'data': {
                        'request_id': requestid,
                        'device_id': deviceid,
                        'cid': cid
                    }
                }, (error, data) => {
                    if(error && !isObjEmpty(error)) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            }
        });
    }

    /**
    * 同步手环数据
    * synctype 'write'/'read'
    * datatype 'motion'/'sleep'/'heart'/'grow'/'clock'/'heart_clock'
    * data: {
    *   nickname data_type为grow时孩子昵称
    *   height data_type为grow时孩子身高
    *   weight data_type为grow时孩子体重
    *   clock: [  //sync_type为write data_type为clock时闹钟数据
    *       {
    *           time: '10:23',
    *           type: 'getup',
    *           repeat: 255
    *       }
    *   clock_list: ['01:01', '01:24'] //sync_type为write data_type为heart_clock定时闹钟
    * }
    */
    syncPaiBandData(deviceid, cid, synctype, datatype, data, requestid) {
        const name = 'bluetooth-sync';
        requestid = requestid || jutils.makeSimpleGUID();
        return new Promise((resolve, reject) => {
            if(config.isLocalTest) {
                setTimeout(() => {
                    resolve({
                        'type': name,
                        'data': { 
                            'device_id': deviceid,
                            'cid': cid,
                            'sync_type': synctype,
                            'data_type': datatype,
                            'status': 0
                        }
                    });
                    //reject('eeeeee');
                }, 2000);
            } else {
                this._callNative({
                    'type': name,
                    'data': {
                        'request_id': requestid,
                        'device_id': deviceid,
                        'cid': cid,
                        'sync_type': synctype,
                        'data_type': datatype,
                        'data': data
                    }
                }, (error, data) => {
                    if(error && !isObjEmpty(error)) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            }
        });
    }

    _nativeEventHandler(event) {
        if(event.type === 're-awaken') {
            this._callAppAwaken();
        } else if(event.type === 'bluetooth-status') {
            this._callBluetoothStatus(event.data);
        }
    }

    _callAppAwaken() {
        if(this._appAwakenCalls) {
            for(let i = 0; i < this._appAwakenCalls.length; i++) {
                this._appAwakenCalls[i]();
            }
        }
    }

    _callBluetoothStatus(data) {
        if(this._bluetoothStatusCalls) {
            for(let i = 0; i < this._bluetoothStatusCalls.length; i++) {
                this._bluetoothStatusCalls[i](data);
            }
        }
    }

    _callNative(params, callback) {
        // const timeid = setTimeout(() => {
        //     callback && callback({
        //         'type': params.name,
        //         'message': 'timeout'
        //     }, null);
        //     callback = null;
        // }, 8000);
        this._nativeService.execute(params, (err, data) => {
            console.log('receive paiband service:', err, data);
            // clearTimeout(timeid);
            callback && callback(err, data);
            callback = null;
        });
    }
}

const _communication = new NativeCommunication();
_communication.init();

export default _communication;
