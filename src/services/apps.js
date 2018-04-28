'use strict';

import webapi from 'PaiBandRN/src/services/webapi';

const appsService = {
    /**
    * 获取应用列表
    */
    getAppList(successback, failback, requestid) {
        webapi.callAPI('getAppList', { _request_id: requestid }, data => {
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

export default appsService;
