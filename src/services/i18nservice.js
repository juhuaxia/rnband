'use strict';

import IService from 'PaiBandRN/src/services/base/iservice';
import ServiceNotice from 'PaiBandRN/src/notice/service';

import db from 'PaiBandRN/src/dbs/hashmap';

class I18nSerivice extends IService {
    constructor(lang) {
        super();

        this._lang = lang;
        this._init = false;
    }

    async init() {
        if(this._init) {
            return 'ok';
        }

        if(!this._lang) {
            this._lang = db.get('lang');
        }

        let result;
        try {
            result = require('PaiBandRN/res/lang/multi.json');
            this._info = result;
            this._init = true;
            return 'ok';
        } catch(e) {
            this.sendNotification(ServiceNotice.I18N_INIT_ERROR);
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

    getLang() {
        return this._lang;
    }

    getI18n(id) {
        if(this._info && typeof this._info === 'object') {
            if(typeof id == 'string') {
                return this._info[id][this._lang];
            } else if(id instanceof Array) {
                return id.map(s => this._info[s][this._lang]);
            }
        }
        return id;
    }
}

const _i18n = new I18nSerivice(db.get('lang'));

export default _i18n;
