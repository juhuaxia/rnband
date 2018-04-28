'use strict';

import IService from 'PaiBandRN/src/services/base/iservice';

import db from 'PaiBandRN/src/dbs/hashmap';

import jutils from 'jutils';

import webapi from 'PaiBandRN/src/services/webapi';

class ClockService extends IService {
    /**
    * 获取时钟设定
    */
    async getClock(requestid) {
        try{
            requestid === undefined && (requestid = jutils.makeSimpleGUID());
            const result = await webapi.asyncCallAPI('getClockData', { _request_id: requestid });
            return result.data
        }catch(err){
            throw new Error(err);
        }
    }
    /**
    * 删除闹钟
    */
    async deleteClock(clock_id, requestid) {
        requestid === undefined && (requestid = jutils.makeSimpleGUID());
        const params = Object.assign({ _request_id: requestid }, {
            clock_id: clock_id,
        });
        try{
            const result = await webapi.asyncCallAPI('deleteClock', params);
            return result;
        }catch(err){
            throw new Error(err);
        }
    }
    /**
    * 添加闹钟
    */
    async addClock(clock_add_config, requestid) {
        requestid === undefined && (requestid = jutils.makeSimpleGUID());
        const params = Object.assign({ _request_id: requestid }, clock_add_config);
        try{
            const result = await webapi.asyncCallAPI('addClock', params);
            return result
        }catch(err){
            throw new Error(err);
        }
    }
    /**
    * 修改闹钟
    */
    async editClock(clock_edit_config, requestid) {
        requestid === undefined && (requestid = jutils.makeSimpleGUID());
        const params = Object.assign({ _request_id: requestid }, clock_edit_config);
        try{
            const result = await webapi.asyncCallAPI('editClock', params);
            return result
        }catch(err){
            throw new Error(err);
        }
    }
    /**
    * 获取抬腕亮屏设置值
    */
    getScreen(successback, failback, requestid) {
        webapi.callAPI('getScreenData', { _request_id: requestid }, data => {
            if(successback && typeof successback === 'function') {
                successback(data);
            }
        }, error => {
            if(failback && typeof failback === 'function') {
                failback(error);
            }
        });
    }
    /**
    * 设置腕亮屏时间
    */
    setScreen(set_screen_config,successback, failback, requestid) {
        const params = Object.assign({ _request_id: requestid }, set_screen_config);
        webapi.callAPI('setScreenData', params, data => {
            if(successback && typeof successback === 'function') {
                successback(data);
            }
        }, error => {
            if(failback && typeof failback === 'function') {
                failback(error);
            }
        });
    }
};

export default new ClockService();
