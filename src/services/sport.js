'use strict';

import IService from 'PaiBandRN/src/services/base/iservice';

import webapi from 'PaiBandRN/src/services/webapi';
import paibandService from 'PaiBandRN/src/services/paiband';

class SportService extends IService {

    /**
    * 获取今天的运动数据统计
    */
    async getToday(date,requestid) {
        let result;
        try {
            const ipinfo = await paibandService.getClientIP();
            result = await webapi.asyncCallAPI('getSportToday', {cityip: ipinfo.cityip, _request_id: requestid,date:date});
            result = result && result.data;
        } catch(e) {
            throw e;
        };
        return result;
    }

    /**
     * 获取运动数据
     */

    async getYearSportData(year,requestid) {
        let result;
        try {
            const ipinfo = await paibandService.getClientIP();
            result = await webapi.asyncCallAPI('getSportYear', {cityip: ipinfo.cityip, _request_id: requestid,year:year});
            result = result && result.data;
        } catch(e) {
            throw e;
        };
        return result;
    }

    async getMonthSportData(year,month,requestid) {
        let result;
        try {
            const ipinfo = await paibandService.getClientIP();
            result = await webapi.asyncCallAPI('getSportMonth', {cityip: ipinfo.cityip, _request_id: requestid,year:year,month:month});
            result = result && result.data;
        } catch(e) {
            throw e;
        };
        return result;
    }

    async getWeekSportData(year,week,requestid) {
        let result;
        try {
            const ipinfo = await paibandService.getClientIP();
            result = await webapi.asyncCallAPI('getSportWeek', {cityip: ipinfo.cityip, _request_id: requestid,year:year,week:week});
            result = result && result.data;
        } catch(e) {
            throw e;
        };
        return result;
    }

    async setTarget(steps) {
        let result;
        try {
            // const ipinfo = await paibandService.getClientIP();
            result = await webapi.asyncCallAPI('setTarget', {steps:steps});
            result = result && result.data;
        } catch(e) {
            throw e;
        };
        return result;
    }

    /**
    * 获取以结束日期为准的前7天的运动数据统计
    * endtime如果为空，则最后一天是昨天 例如20160727
    */
    getLast7Days(year,week, successback, failback, requestid) {
        webapi.callAPI('getSportWeek', { year:year,week:week, _request_id: requestid }, data => {
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
    * 获取以结束日期为准的前30天的运动数据统计
    * endtime如果为空，则最后一天是昨天 例如20160727
    */
    getLast30Days(year,month, successback, failback, requestid) {
        webapi.callAPI('getSportMonth', { year: year,month:month, _request_id: requestid }, data => {
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
    * 获取运动专家策略信息
    */
    getStrategy(successback, failback, requestid) {
        webapi.callAPI('getExpertStrategy', { _request_id: requestid }, data => {
            if(data['http_code'] === 200) {
                if(successback && typeof successback === 'function') {
                    successback(data);
                }
            } else {
                if(failback && typeof failback === 'function') {
                    failback({
                        type: 'api-fail',
                        status: data,
                        message: data.message
                    });
                }
            }
        }, error => {
            if(failback && typeof failback === 'function') {
                failback(error);
            }
        });
    }
}

export default new SportService();
