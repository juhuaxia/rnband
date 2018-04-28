'use strict';
import IService from 'PaiBandRN/src/services/base/iservice';
import webapi from 'PaiBandRN/src/services/webapi';
import paibandService from 'PaiBandRN/src/services/paiband';
import jutils from 'jutils';

class FlowersService extends IService {
    /**
    * 获得孩子当前小红花数据
    */
    async getFlowers(requestid) {
        try {
            const result = await webapi.asyncCallAPI('getFlowersData', {_request_id: requestid});
            if (result.http_code == 200) {
                return result.data;
            }else{
                console.log(result)
                throw new Error(result)
            }
        } catch(e) {
            throw e;
        };
    }
    /**
    * 小红花奖励/兑换记录列表
    */
    async getFlowersList(page,pagesize,requestid) {
        let result;
        try {
            result = await webapi.asyncCallAPI('getFlowersDataList', {_request_id: requestid,page:page,pagesize:pagesize, });
            result = result && result.data;

            for(let i = 0; i < result.data.length; i++) {
                const date = new Date(result.data[i]['create_time'] * 1000);
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const day = date.getDate();
                const hours = date.getHours();
                const minutes = date.getMinutes();
                const seconds = date.getSeconds();
                result.data[i]['create_time'] = [year + "年" + ('0' + month).substr(-2)+"月"+
                 ('0' + day).substr(-2)+"日"] + ' ' + [('0' + hours).substr(-2),('0' + minutes).
                 substr(-2),('0' + seconds).substr(-2)].join(':');
                //console.log(2,data.data.data[i]['create_time']);
            }
        } catch(e) {
            throw e;
        };
        return result;
    }
    
    /**
    * 奖励/兑换小红花
    */
    async settingsFlowers(type,num,remark,requestid) {
        let result;
        let params = Object.assign({type:type,num:num,remark:remark, _request_id: requestid });
        try {
            result = await webapi.asyncCallAPI('settingsFlowers', params);
            result = result && result.data;
        } catch(e) {
            throw e;
        };
        return result;
    }

    /**
    * 分页获取已结算奖励事件
    */
    async getClearedList(type=1, page=1, pagesize=10, requestid) {
        try{
            requestid === undefined && (requestid = jutils.makeSimpleGUID());
            const params = Object.assign({ _request_id: requestid }, {type, page, pagesize});
            const result = await webapi.asyncCallAPI('getClearedList', params);
            return result;
        }catch(err){
            throw err;
        }
    }
};

export default new FlowersService();
