'use strict';

import db from 'PaiBandRN/src/dbs/hashmap';

import webapi from 'PaiBandRN/src/services/webapi';

const indexService = {
    getMenuList(successback, failback, requestid) {
        webapi.callAPI('getMenuList', result => {
        }, error => {
        })
    },

    //获取ota版本号列表
    getOtaVersionList(sensor_mark, version, sensor_version, successback, failback, requestid) {
        webapi.callAPI('getOtaVersionList', {t:sensor_mark, m:sensor_version, s: version, _request_id: requestid }, data => {
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
    * 获取孩子设备号
    */
    getChildrenDevices(successback, failback, requestid) {
        if(db.get('isLocalTest')) {
            successback({
                "http_code": 200,
                "data": {
                    "devices": [
                        {
                            "cid":1000,
                            "nickname": "aaa",
                            "avatar": "",
                            "device_id":"dev1111",
                            "birthday": "2011-08-12",
                            "gender": 0
                        },
                        {
                            "cid":2000,
                            "nickname": "bbb",
                            "avatar": "",
                            "device_id":"dev2222",
                            "birthday": "2013-12-12",
                            "gender": 1
                        }
                    ]
                }
            });
            return;
        }

        webapi.callAPI('getChildrenDevices', { _request_id: requestid }, data => {
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
    * 获取孩子信息
    */
    getChildInfo(successback, failback, requestid) {
        if(db.get('isLocalTest')) {
            successback({
                'error_code': 0,
                'nickname': 'xxx',
                'avatar': ''
            });
            return ;
        }

        webapi.callAPI('getChildInfo', {_request_id: requestid }, data => {
            if(successback && typeof successback === 'function') {
                if(data['error_code'] === 0) {
                    data.http_code = 200;
                    successback(data);
                } else {
                    if(successback && typeof successback === 'function') {
                        data.http_code = 201;
                        successback(data);
                    }
                }
            }
        }, error => {
            if(failback && typeof failback === 'function') {
                failback(error);
            }
        });
    },

    /**
    * 设置孩子身高
    */
    setChildGrow(grow, successback, failback, requestid) {
        //if(db.get('isLocalTest')) {
            //successback({
                //'error_code': 0,
                //'nickname': 'xxx',
                //'avatar': ''
            //});
            //return ;
        //}

        webapi.callAPI('setChildInfo', Object.assign(grow, { _request_id: requestid }), data => {
            if(successback && typeof successback === 'function') {
                if(data['error_code'] === 0) {
                    data.http_code = 200;
                    successback(data);
                } else {
                    if(successback && typeof successback === 'function') {
                        data.http_code = 201;
                        successback(data);
                    }
                }
            }
        }, error => {
            if(failback && typeof failback === 'function') {
                failback(error);
            }
        });
    }
};

export default indexService;
