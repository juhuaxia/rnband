'use strict';

import webapi from 'PaiBandRN/src/services/webapi';

const settingsService = {
    /**
    * 获取时钟设定
    */
    getSettings(successback, failback, requestid) {
        webapi.callAPI('getSettingsData', { _request_id: requestid }, data => {
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
    * 愿景设定
    */
    setExpect(expect_id, successback, failback, requestid) {
        const params = Object.assign({ _request_id: requestid }, {
            expect_id: expect_id
        });
        webapi.callAPI('setExpect', params, data => {
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
    * 目标设定、、步数目标
    */
    setTarget(target, successback, failback, requestid) {
        const params = Object.assign({ _request_id: requestid }, {
            steps:target,
        });
        webapi.callAPI('setTarget', params, data => {
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
    * 目标设定、、睡眠目标
    */
    setSleepTarget(target, successback, failback, requestid) {
        const params = Object.assign({ _request_id: requestid }, {
            sleeping:target,
        });
        webapi.callAPI('setSleepTarget', params, data => {
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
    * 目标设定、、睡眠目标
    */
    setUnBind(successback, failback, requestid) {
        webapi.callAPI('setUnBind', { _request_id: requestid }, data => {
            if(successback && typeof successback === 'function') {
                successback(data);
            }
        }, error => {
            if(failback && typeof failback === 'function') {
                failback(error);
            }
        });
    },
};

export default settingsService;
