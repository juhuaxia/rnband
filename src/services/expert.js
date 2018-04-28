'use strict';

import IService from 'PaiBandRN/src/services/base/iservice';

import db from 'PaiBandRN/src/dbs/hashmap';

import jutils from 'jutils';

import webapi from 'PaiBandRN/src/services/webapi';

class ExpertService extends IService {
    /**
    * 获取孩子信息及专家策略信息
    */
    async getStrategy(requestid) {
        try{
            requestid === undefined && (requestid = jutils.makeSimpleGUID());
            let result = await webapi.asyncCallAPI('getExpertStrategy', { _request_id: requestid });
            return result;
        }catch(err){
            throw err;
        }
    }

    /**
    * 获取身高增长曲线
    */
    async getHeightGrowing(endtime, requestid) {
        if(db.get('isLocalTest')) {
            const resJson = {
                http_code: 200,
                data:[
                    {
                        height:"20",
                        status:"0",
                        time:"2016-08-11"
                    },
                    {
                        height:"30",
                        status:"0",
                        time:"2016-08-12"
                    },
                    {
                        height:"50",
                        status:"0",
                        time:"2016-08-13"
                    },
                    {
                        height:"50",
                        status:"0",
                        time:"2016-08-14"
                    },
                    {
                        height:"10",
                        status:"0",
                        time:"2016-08-15"
                    },
                ]
            }
            Promise.resolve(resJson)  
        }
        try{
            const params = this.getParams(endtime, requestid);
            let data = await webapi.asyncCallAPI('getExpertHeightGrowing', params);
            data = this.formatDate(data);
            return data
        }catch(err){
            throw new Error(err)
        }
    }

    /**
    * 获取体重增长曲线
    */
    async getWeightGrowing(endtime, requestid) {
        if(db.get('isLocalTest')) {
            const resJson = {
                error_code: 0,
                data:[
                    {
                        weight:"40",
                        status:"0",
                        bmi:"12",
                        time:"2016-08-11"
                    },
                    {
                        weight:"30",
                        status:"0",
                        bmi:"12",
                        time:"2016-08-12"
                    },
                    {
                        weight:"10",
                        status:"0",
                        bmi:"12",
                        time:"2016-08-13"
                    },
                    {
                        weight:"50",
                        status:"0",
                        bmi:"12",
                        time:"2016-08-14"
                    },
                    {
                        weight:"20",
                        status:"0",
                        bmi:"12",
                        time:"2016-08-15"
                    },
                ]
            };
            Promise.resolve(resJson)  
        }
        try{
            const params = this.getParams(endtime, requestid);
            let data = await webapi.asyncCallAPI('getExpertWeightGrowing', params);
            data = this.formatDate(data);
            return data
        }catch(err){
            throw new Error(err)
        }
    }

    /**
    * 获取身高记录
    */
    async getHeightRecords(endtime, requestid) {
        if(db.get('isLocalTest')) {
            const resJson = {
                data:[
                    {
                        height:"40",
                        status:"0",
                        time:"2016-08-11"
                    },
                    {
                        height:"30",
                        status:"0",
                        time:"2016-08-11"
                    },
                    {
                        height:"10",
                        status:"0",
                        time:"2016-08-11"
                    },
                    {
                        height:"50",
                        status:"0",
                        time:"2016-08-14"
                    },
                    {
                        height:"20",
                        status:"0",
                        time:"2016-08-15"
                    },
                    {
                        height:"20",
                        status:"0",
                        time:"2016-06-15"
                    },
                ]
            };
            Promise.resolve(resJson)  
        }

        try{
            const params = this.getParams(endtime, requestid);
            let data = await webapi.asyncCallAPI('getExpertHeightRecords', params);
            data = this.formatDate(data);
            return data
        }catch(err){
            throw new Error(err)
        }
    }

    /**
    * 获取体重记录
    */
    async getWeightRecords(endtime, requestid) {
        if(db.get('isLocalTest')) {
            const resJson = {
                data:[
                    {
                        weight:"40",
                        status:"0",
                        time:"2016-08-11"
                    },
                    {
                        weight:"30",
                        status:"0",
                        time:"2016-08-11"
                    },
                    {
                        weight:"10",
                        status:"0",
                        time:"2016-08-13"
                    },
                    {
                        weight:"50",
                        status:"0",
                        time:"2016-08-13"
                    },
                    {
                        weight:"20",
                        status:"0",
                        time:"2016-08-15"
                    },
                ]
            };
            Promise.resolve(resJson)  
        }

        try{
            const params = this.getParams(endtime, requestid);
            let data =  await webapi.asyncCallAPI('getExpertWeightRecords', params);
            data = this.formatDate(data);
            return data
        }catch(err){
            throw new Error(err)
        }
    }
    /**
     * 处理参数
     */
    getParams(endtime, requestid){
        // endtime = '20170802'
        let params;
        //需要创建一个requestid标记
        requestid === undefined && (requestid = jutils.makeSimpleGUID());
        if (endtime) {
            endtime = endtime ? endtime.toString() : '';
            const end = endtime ? +(new Date(endtime.substr(0, 4), endtime.substr(4, 2) - 1, 
                endtime.substr(6, 2), 23, 59, 59)) * 0.001 : Math.floor(+(new Date()) * 0.001);
            const start = +(new Date(end * 1000 - 7 * 24 * 60 * 60 * 1000)) * 0.001;
            params = Object.assign({ _request_id: requestid }, {
                time_start: start,
                time_end: end
            });
        }else{
            params = { _request_id: requestid };
        }
        return Object.assign(params, { timezone: this.getTimeZone() });
    }
    /*
    处理时区，大于东12区算作12区
     */
    getTimeZone(){
        let timezone = - new Date().getTimezoneOffset()/60;
        if (timezone > 12) {
            timezone = 12;
        }
        return timezone;
    }
    /**
     * 处理返回数据日期
     */
    formatDate(data){
        console.log(data)
        if(data['error_code'] === 0) {
            for(let i = 0; i < data.data.length; i++) {
                const date = new Date(data.data[i]['time'] * 1000);
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const day = date.getDate();
                data.data[i]['time'] = [year, ('0' + month).substr(-2), ('0' + day).substr(-2)].join('/');
            }
            data.http_code = 200;
        } else {
            data.http_code = 201;
        }
        return data;
    }
};

export default new ExpertService()
