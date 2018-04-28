'use strict';
import IService from 'PaiBandRN/src/services/base/iservice';
import webapi from 'PaiBandRN/src/services/webapi';
import paibandService from 'PaiBandRN/src/services/paiband';

class SleepService extends IService {
    /**
    * 获取今天的睡眠数据统计 date 日期格式yyyy-mm-dd,默认为当前日期 string
    */
    async getToday(time,requestid) {
        let result;
        try {
            result = await webapi.asyncCallAPI('getSleepToday', {date:time,_request_id: requestid});
            result = result && result.data;
        } catch(e) {
            throw e;
        };
        return result;
    }

    /**
    year    N   int 年份，默认当年
    week    N   int 第几周，默认当前周
    */
    async getWeek(year,week,requestid) {
        let result;
        try {
            result = await webapi.asyncCallAPI('getSleepWeek', {year:year,week:week,_request_id: requestid});
            result = result && result.data;
        } catch(e) {
            throw e;
        };
        return result;
    }

    /**
    year    N   int 年份，默认当年
    month    N   int 月份，默认当前月
    */
    async getMonth(year,month,requestid) {
        let result;
        try {
            result = await webapi.asyncCallAPI('getSleepMonth', {year:year,month:month,_request_id: requestid});
            result = result && result.data;
        } catch(e) {
            throw e;
        };
        return result;
    }

    /**
    year    N   int 年份，默认当年
    month    N   int 月份，默认当前月
    */
    async getYear(year,requestid) {
        let result;
        try {
            result = await webapi.asyncCallAPI('getSleepYear', {year:year,_request_id: requestid});
            result = result && result.data;
        } catch(e) {
            throw e;
        };
        return result;
    }
};


export default new SleepService();
