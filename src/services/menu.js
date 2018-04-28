'use strict';

import jutils from 'jutils';

import IService from 'PaiBandRN/src/services/base/iservice';
import ServiceNotice from 'PaiBandRN/src/notice/service';

import webapi from 'PaiBandRN/src/services/webapi';

class MenuSerivice extends IService {
    constructor() {
        // console.log('create MenuService');
        super();

        this._menu = null;
        this._init = false;
    }

    async init() {
        if(this._init) {
            return 'ok';
        }

        let result;
        try {
            result = await webapi.asyncCallAPI('getMenuList');
            const menu = [];
            if(result && result.data && result.data.menu) {
                for(let i = 0; i < result.data.menu.length; i++) {
                    let m = result.data.menu[i];
                    let name = 'PaiBand';
                    if(m.location_type === 'h5') {
                        if(/#(.*)/.test(m.location_action)) {
                            name = m.location_action.match(/#(.*)/).pop().split('\/').pop();
                        }
                    } else if(m.location_type === 'local') {
                        name = m.location_action;
                    }
                    menu.push({ name: name, title: m.name, index: i, icon: m.icon });
                }
                this._menu = menu;
                this._init = true;
                console.log('menuService init ok');
                return 'ok';
            }
            throw new Error('MenuService init error: ' + JSON.strigify(result));
        } catch(e) {
            throw e;
        }
    }

    async update() {
        return 'ok';
    }

    async destroy() {
        this._menu = null;
        return 'ok';
    }

    getMenuList() {
        return jutils.clone(this._menu);
    }

    getNameByTitle(title) {
        if(typeof title !== 'string' || !title) {
            return null;
        }
        for(let i = 0; i < this._menu.length; i++) {
            if(this._menu[i].title === title) {
                return this._menu[i]['name'];
            }
        }
        return null;
    }

    getTitleByName(name) {
        if(typeof name !== 'string' || !name) {
            return 'PaiBand';
        }
        for(let i = 0; i < this._menu.length; i++) {
            if(this._menu[i].name === name) {
                return this._menu[i]['title'];
            }
        }
        return null;
    }

    getMenuByTitle(title) {
        if(typeof title !== 'string' || !title) {
            return null;
        }
        for(let i = 0; i < this._menu.length; i++) {
            if(this._menu[i].title === title) {
                return jutils.clone(this._menu[i]);
            }
        }
        return null;
    }

    getMenuByName(name) {
        if(typeof name !== 'string' || !name) {
            return null;
        }
        for(let i = 0; i < this._menu.length; i++) {
            if(this._menu[i].name === name) {
                return jutils.clone(this._menu[i]);
            }
        }
        return null;
    }
}

const _menu = new MenuSerivice();

export default _menu;
