'use strict';
import IService from 'PaiBandRN/src/services/base/iservice';
import webapi from 'PaiBandRN/src/services/webapi';
import paibandService from 'PaiBandRN/src/services/paiband';
import jutils from 'jutils';

class ClearedService extends IService {
    /**
    * 获取奖励兑换事件名称
    */
    async getClearedList(type, page, pagesize, requestid) {
        try{
            requestid === undefined && (requestid = jutils.makeSimpleGUID());
            const params = Object.assign({ _request_id: requestid }, {type, page, pagesize});
            const result = await webapi.asyncCallAPI('getClearedList', params);
            if (result.http_code == 200) {
                return result.data;
            }else{
                throw new Error(result)
            }
        }catch(err){
            throw new Error(err);
        }
    }
    
};

export default new ClearedService();
