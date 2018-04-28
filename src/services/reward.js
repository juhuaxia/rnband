'use strict';
import IService from 'PaiBandRN/src/services/base/iservice';
import webapi from 'PaiBandRN/src/services/webapi';
import paibandService from 'PaiBandRN/src/services/paiband';
import jutils from 'jutils';

class RewardService extends IService {
    /**
    * 新建奖励事件
    */
    async createReward(newReward, requestid) {
        newReward.category = 5;
        try{
            requestid === undefined && (requestid = jutils.makeSimpleGUID());
            const params = Object.assign({ _request_id: requestid }, newReward);
            const result = await webapi.asyncCallAPI('createReward', params);
            return result;
        }catch(err){
            throw err;
        }
    }
    /**
    * 修改奖励事件
    */
    async updateReward(newReward, requestid) {
        newReward.category = 5;
        try{
            requestid === undefined && (requestid = jutils.makeSimpleGUID());
            const params = Object.assign({ _request_id: requestid }, newReward);
            const result = await webapi.asyncCallAPI('updateReward', params);
            return result;
        }catch(err){
            throw err;
        }
    }
    /**
    * 删除奖励事件
    */
    async deleteReward(event_id, timestamp, requestid) {
        try{
            requestid === undefined && (requestid = jutils.makeSimpleGUID());
            const params = Object.assign({ _request_id: requestid }, {event_id, timestamp});
            console.log(params)
            const result = await webapi.asyncCallAPI('deleteReward', params);
            return result;
        }catch(err){
            throw err;
        }
    }
    /**
    * 结算奖励事件
    */
    async clearReward(event_id, date, status, requestid) {
        try{
            requestid === undefined && (requestid = jutils.makeSimpleGUID());
            const params = Object.assign({ _request_id: requestid }, {event_id, date, status});
            const result = await webapi.asyncCallAPI('clearReward', params);
            return result;
        }catch(err){
            throw err;
        }
    }
    /**
    * 直接奖励小花
    */
    async directReward(name, flower, date, requestid) {
        try{
            requestid === undefined && (requestid = jutils.makeSimpleGUID());
            const params = Object.assign({ _request_id: requestid }, {name, flower, date});
            const result = await webapi.asyncCallAPI('directReward', params);
            return result;
        }catch(err){
            throw err;
        }
    }
    /**
    * 获取奖励事件列表
    */
    async getListsReward(timestamp, requestid) {
        try{
            requestid === undefined && (requestid = jutils.makeSimpleGUID());
            const params = Object.assign({ _request_id: requestid }, {timestamp});
            const result = await webapi.asyncCallAPI('getListsReward', params);
            // const result = {
            //     http_code: 200,
            //     data: {
                
            //     },
            //     elapsed: 7
            // }
           
            if (result.http_code == 200) {
                return result.data;
            }else{
                throw new Error(result)
            }
        }catch(err){
            throw err;
        }
    }
};

export default new RewardService();
