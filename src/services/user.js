'use strict';

import jutils from 'jutils';

import IService from 'PaiBandRN/src/services/base/iservice';
import ServiceNotice from 'PaiBandRN/src/notice/service';

import webapi from 'PaiBandRN/src/services/webapi';
import db from 'PaiBandRN/src/dbs/hashmap';

class UserSerivice extends IService {
    constructor(cid) {
        super();

        this._cid = cid;
        this._info = null;
        this._init = false;
    }

    async init() {
        if(this._init) {
            return 'ok';
        }

        if(!this._cid) {
            this._cid = db.get('cid');
        }

        let result;
        try {
            const requestid = jutils.makeSimpleGUID();
            result = await webapi.asyncCallAPI('getChildrenDevices', { _request_id: requestid });
            this._info = result;
            this._init = true;
            console.log('userService  init ok');
            return 'ok';
        } catch(e) {
            this.sendNotification(ServiceNotice.USERINFO_INIT_ERROR);
            throw e;
        }
    }

    async update() {
        return 'ok';
    }

    async destroy() {
        this._info = null;
        return 'ok';
    }

    getAvatar(cid) {
        if(this._info && this._info.data && this._info.data.devices) {
            const children = this._info.data.devices;
            for(let i = 0; i < children.length; i++) {
                if(children[i].cid == (cid || this._cid)) {
                    return children[i].avatar;
                }
            }
        }
        return null;
    }

    getGender(cid) {
        if(this._info && this._info.data && this._info.data.devices) {
            const children = this._info.data.devices;
            for(let i = 0; i < children.length; i++) {
                if(children[i].cid == (cid || this._cid)) {
                    return children[i].gender;
                }
            }
        }
        return null;
    }

    getBirthday(cid) {
        if(this._info && this._info.data && this._info.data.devices) {
            const children = this._info.data.devices;
            for(let i = 0; i < children.length; i++) {
                if(children[i].cid == (cid || this._cid)) {
                    return children[i].birthday;
                }
            }
        }
        return null;
    }

    getAge(cid) {
        if(this._info && this._info.data && this._info.data.devices) {
            const children = this._info.data.devices;
            for(let i = 0; i < children.length; i++) {
                if(children[i].cid == (cid || this._cid)) {
                    const today =  new Date();
                    const now = [today.getFullYear(), today.getMonth() + 1, today.getDate()];
                    const birth = children[i].birthday.split('-');
                    if((now[1] - birth[1] == 0 && now[2] - birth[2] < 0) ||(now[1] - birth[1] < 0)) {
                        return now[0] - birth[1] - 1;
                    }
                    return now[0] - birth[1];
                }
            }
        }
        return null;
    }

    getDeviceID(cid) {
        if(this._info && this._info.data && this._info.data.devices) {
            const children = this._info.data.devices;
            for(let i = 0; i < children.length; i++) {
                if(children[i].cid == (cid || this._cid)) {
                    return children[i].device_id;
                }
            }
        }
        return null;
    }

    getNickname(cid) {
        if(this._info && this._info.data && this._info.data.devices) {
            const children = this._info.data.devices;
            for(let i = 0; i < children.length; i++) {
                if(children[i].cid == (cid || this._cid)) {
                    return children[i].nickname;
                }
            }
        }
        return null;
    }
}

const _user = new UserSerivice(db.get('cid'));

export default _user;
