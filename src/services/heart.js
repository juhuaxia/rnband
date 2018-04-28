'use strict';

import webapi from 'PaiBandRN/src/services/webapi';

import jutils from 'jutils';

const heartService = {
    /**
    * 获取今天的心率数据统计
    */
    async getHeartTestRecord(requestid) {
        try{
            requestid === undefined && (requestid = jutils.makeSimpleGUID());
            let result = await webapi.asyncCallAPI('getHeartTestRecord', { _request_id: requestid });
            return result;
        }catch(err){
            throw err;
        }
    },
     /**
    * 获取身高增长曲线
    */
    async postTestHeartRate(device_id, data, dtype, requestid) {
        try{
            requestid === undefined && (requestid = jutils.makeSimpleGUID());
            const params = {device_id, data, dtype: 0, _request_id: requestid};
            const result = await webapi.asyncCallAPI('postTestHeartRate', params);
            return result
        }catch(err){
            throw new Error(err)
        }
    }
};

export default heartService;
