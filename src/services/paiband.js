'use strict';

import jutils from 'jutils';

import IService from 'PaiBandRN/src/services/base/iservice';
import ServiceNotice from 'PaiBandRN/src/notice/service';

import nativeCommunication from 'PaiBandRN/src/services/native';

class PaiBandService extends IService {
    constructor() {
        super();

        this._nativeCommunication = null;
        this._init = false;

        this._bluetoothStatus = {};
    }

    async init() {
        if(this._init) {
            return 'ok';
        }

        this._nativeCommunication = nativeCommunication;
        this._nativeCommunication.listenAppAwaken(this._listenAppAwakenHandler.bind(this));
        this._nativeCommunication.listenBluetoothStatus(this._listenBluetoothStatusHandler.bind(this));
        this._init = true;
        console.log('paibandService  init ok');
        return 'ok';
    }

    async update() {
        return 'ok';
    }

    async destroy() {
        this._nativeCommunication.removeAppAwaken(this._listenAppAwakenHandler);
        this._nativeCommunication.removeBluetoothStatus(this._listenBluetoothStatusHandler);

        this._nativeCommunication = null;
        return 'ok';
    }

    /**
    * 获取系统信息
    */
    async getSystemInfo(deviceid, requestid) {
        let result;
        try {
            result = await this._nativeCommunication.getSystemInfo(deviceid, requestid);
            result = result && result.data;
        } catch(e) {
            throw e;
        }
        return result;
    }

    /**
    * 获取ip
    */
    async getClientIP(requestid) {
        let result;
        try {
            result = await this._nativeCommunication.getClientIP(requestid);
            result = result && result.data;
        } catch(e) {
            throw e;
        }
        return result;
    }

    /**
    * 写入身高
    */
    async syncWriteHeight(cid, height, requestid) {
        let result = '';
        try {
            result = await this._nativeCommunication.setChildHeight(cid, height);
            result = result && result.data;
        } catch(e) {
            throw e;
        }
        return result;
    }

    /**
    * 写入体重
    */
    async syncWriteWeight(cid, weight) {
        let result;
        try {
            result = await this._nativeCommunication.setChildWeight(cid, weight);
            result = result && result.data;
        } catch(e) {
            throw e;
        }
        return result;
    }

    /**
    * 写入抬腕亮屏时间
    * timeinfo: {
    *   begin_h 开始小时
    *   begin_m 开始分钟
    *   end_h 结束小时
    *   end_m 结束分钟
    *   close 是否关闭
    * }
    */
    async syncWriteBrightScreen(deviceid, timeinfo, requestid) {
        let result;
        try {
            result = await this._nativeCommunication.setBrightScreen(deviceid, timeinfo.begin_h, timeinfo.begin_m, timeinfo.end_h, timeinfo._end_m, timeinfo.close, requestid);
            result = result && result.data;
        } catch(e) {
            throw e;
        }
        return result;
    }

    /**
    * 写入小红花数据
    * flowerinfo: {
    *   cur_num 当前小红花数
    *   num 需要变化的小红花数
    *   action 'add_num'/'minus_num'
    * }
    */
    async syncWriteFlowers(deviceid, flowerinfo) {
        let result;
        try {
            result = await this._nativeCommunication.setFlowers(deviceid, flowerinfo.cur_num, flowerinfo.num, flowerinfo.action);
            result = result && result.data;
        } catch(e) {
            throw e;
        }
        return result;
    }

    /**
    * 写入安全距离监控状态
    * status true/false
    */
    async syncWriteSecurity(status) {
        let result;
        try {
            result = await this._nativeCommunication.setSafeDistance(status);
            result = result && result.data;
        } catch(e) {
            throw e;
        }
        return result;
    }

    async closePaiBand(page) {
        let result;
        try {
            result = await this._nativeCommunication.closePaiBand(page);
            result = result && result.data;
        } catch(e) {
            throw e;
        }
        return result;
    }

    /**
    * 保存二维码到相册
    */
    async saveQCodePic(requestid) {
        let result;
        try {
            result = await this._nativeCommunication.savePic(requestid);
            result = result && result.data;
        } catch(e) {
            throw e;
        }
        return result;
    }

    /**
    * 获取蓝牙状态
    */
    async getBluetoothStatus(deviceid, requestid) {
        if(this._bluetoothStatus[deviceid] != null) {
            return this._bluetoothStatus[deviceid];
        }
        let result;
        try {
            result = await this._nativeCommunication.getBluetoothStatus(deviceid, requestid);
            result = result && result.data;
            this._bluetoothStatus[deviceid] = result;
        } catch(e) {
            throw e;
        }
        return result;
    }

    /**
    * 打开蓝牙设置
    */
    async openBluetoothSetting(requestid) {
        let result;
        try {
            result = await this._nativeCommunication.openBluetooth(requestid);
            result = result && result.data;
        } catch(e) {
            throw e;
        }
        return result;
    }

    /**
    * 测量心率
    */
    async determineHeartRate(deviceid, cid, requestid) {
        let result;
        try {
            result = await this._nativeCommunication.determineHeartRate(deviceid, cid, requestid);
            result = result && result.data;
        } catch(e) {
            throw e;
        }
        return result;
    }

    /**
    * 打开通知
    */
    async openNotification(requestid) {
        let result;
        try {
            result = await this._nativeCommunication.openNotification(requestid);
            result = result && result.data;
        } catch(e) {
            throw e;
        }
        return result;
    }

    /**
    * 写入闹钟数据
    */
    async syncWriteClock(deviceid, cid, clock, requestid) {
        let result;
        try {
            result = await this._nativeCommunication.syncPaiBandData(deviceid, cid, 'write', 'clock', { clock }, requestid);
            result = result && result.data;
        } catch(e) {
            throw e;
        }
        return result;
    }

    /**
    * 写入心率时钟数据
    */
    async syncWriteHeartClock(deviceid, cid, clock, requestid) {
        let result;
        try {
            result = await this._nativeCommunication.syncPaiBandData(deviceid, cid, 'write', 'heart_clock', { 'clock_list': clock }, requestid);
            result = result && result.data;
        } catch(e) {
            throw e;
        }
        return result;
    }

    /**
    * 设置成长信息
    */
    async showGrowSetting(requestid) {
        let result;
        try {
            result = await this._nativeCommunication.setGrow(requestid);
            result = result && result.data;
        } catch(e) {
            throw e;
        }
        return result;
    }

    _listenAppAwakenHandler() {
        this.sendNotification(ServiceNotice.PAIBAND_SERVICE_APPAWAKEN);
    }

    _listenBluetoothStatusHandler(data) {
        this._bluetoothStatus[data.device_id] = data;
        this.sendNotification(ServiceNotice.PAIBAND_SERVICE_BLUETOOTHSTATUS, data);
    }
}

const _paibandService = new PaiBandService();

export default _paibandService;
