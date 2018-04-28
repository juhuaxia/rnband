'use strict';

import webapi from 'PaiBandRN/src/services/webapi';

import jutils from 'jutils';

const heartclockService = {
    /**
    * 获取心率测定记录
    */
    getHeartTestRecord(successback, failback, requestid) {
        webapi.callAPI('getHeartTestRecord', { _request_id: requestid }, data => {
            if(successback && typeof successback === 'function') {
                successback(data);
            }
        }, error => {
            if(failback && typeof failback === 'function') {
                failback(error);
            }
        });
    },

    /**
    * 获取心率定时列表
    */
    async getHeartClockList(requestid) {
        try{
            requestid === undefined && (requestid = jutils.makeSimpleGUID());
            let result = await webapi.asyncCallAPI('getHeartClockList', { _request_id: requestid });
            return result;
        }catch(err){
            throw err;
        }
    },

    /**
    * 添加心率定时
    * time: '02:11'
    */
    async addHeartClock(time, requestid) {
        try{
            requestid === undefined && (requestid = jutils.makeSimpleGUID());
            let result = await webapi.asyncCallAPI('addHeartClock', { time , _request_id: requestid });
            return result;
        }catch(err){
            throw err;
        }
    },

    /**
    * 删除心率定时
    * clockid: 定时id
    */
    async deleteHeartClock(clockid, requestid) {
        try{
            requestid === undefined && (requestid = jutils.makeSimpleGUID());
            let result = await webapi.asyncCallAPI('deleteHeartClock', {clock_id: clockid, _request_id: requestid });
            return result;
        }catch(err){
            throw err;
        }
    },

    /**
    * 修改心率定时
    * clockid: 定时id
    * time: '02:12'
    */
    async modifyHeartClock(clockid, time, status, requestid) {
        try{
            requestid === undefined && (requestid = jutils.makeSimpleGUID());
            let result = await webapi.asyncCallAPI('modifyHeartClock', {clock_id: clockid, time: time, status: status, _request_id: requestid });
            return result;
        }catch(err){
            throw err;
        }
    },
};

export default heartclockService;
