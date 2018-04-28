'use strict';
import IService from 'PaiBandRN/src/services/base/iservice';
import webapi from 'PaiBandRN/src/services/webapi';
import paibandService from 'PaiBandRN/src/services/paiband';
import jutils from 'jutils';

class ExchangeService extends IService {
    /**
    * 新建兑换事件
    */
    async createExchange(newExchange, requestid) {
        try{
            requestid === undefined && (requestid = jutils.makeSimpleGUID());
            const params = Object.assign({ _request_id: requestid }, newExchange);
            const result = await webapi.asyncCallAPI('createExchange', params);
            return result;
        }catch(err){
            throw err;
        }
    }
    /**
    * 修改兑换事件
    */
    async updateExchange(exchange, requestid) {
        try{
            requestid === undefined && (requestid = jutils.makeSimpleGUID());
            const params = Object.assign({ _request_id: requestid }, exchange);
            const result = await webapi.asyncCallAPI('updateExchange', params);
            return result;
        }catch(err){
            throw err;
        }
    }
    /**
    * 删除兑换事件
    */
    async deleteExchange(event_id, timestamp, requestid) {
        try{
            requestid === undefined && (requestid = jutils.makeSimpleGUID());
            const params = Object.assign({ _request_id: requestid }, {event_id, timestamp});
            const result = await webapi.asyncCallAPI('deleteExchange', params);
            return result;
        }catch(err){
            throw err;
        }
    }
    /**
    * 结算兑换事件
    */
    async clearedExchange(event_id, date, requestid) {
        
        try{
            requestid === undefined && (requestid = jutils.makeSimpleGUID());
            const params = Object.assign({ _request_id: requestid }, {event_id, date});
            const result = await webapi.asyncCallAPI('clearedExchange', params);
            return result;
        }catch(err){
            throw err;
        }
    }
    /**
    * 兑换事件列表
    */
    async getListExchange(requestid) {
        try{
            requestid === undefined && (requestid = jutils.makeSimpleGUID());
            const params = Object.assign({ _request_id: requestid }, {});
            const result = await webapi.asyncCallAPI('getListExchange', params);
            // const result = {
            //     http_code: 200,
            //     data: {
                
            //     },
            //     elapsed: 7
            // }
            if (result.http_code == 200) {
                return result.data;
            }else{
                throw new Error(result);
            }
        }catch(err){
            throw err;
        }
    }
    /**
    * 直接兑换小花
    */
    async directExchange(name, flower, date, requestid) {
        try{
            requestid === undefined && (requestid = jutils.makeSimpleGUID());
            const params = Object.assign({ _request_id: requestid }, {name, flower, date});
            const result = await webapi.asyncCallAPI('directExchange', params);
            return result;
        }catch(err){
            throw err;
        }
    }
};

export default new ExchangeService();
