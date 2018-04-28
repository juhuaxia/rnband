'use strict';

import React from 'react';

class PageFactory {
    constructor() {
        this._currentPage = '';
    }

    createPage(name, props) {
        this._currentPage = name;
        switch(name) {
            case '':
            case 'home':
                return React.createElement(require('PaiBandRN/src/pages/home').default, props);
            case 'func':
                return React.createElement(require('PaiBandRN/src/pages/func').default, props);
            case 'sport':
                return React.createElement(require('PaiBandRN/src/pages/subpages/sport').default, props);
            case 'sleep':
                return React.createElement(require('PaiBandRN/src/pages/subpages/sleep').default, props);
            case 'heart':
                return React.createElement(require('PaiBandRN/src/pages/subpages/heart').default, props);
            // case 'clock':
            //     return React.createElement(require('PaiBandRN/src/pages/subpages/clock').default, props);
            // case 'oldflower':
            //     return React.createElement(require('PaiBandRN/src/pages/subpages/oldflowers').default, props);
            case 'rewards':
                return React.createElement(require('PaiBandRN/src/pages/subpages/rewards').default, props);
            case 'exchange':
                return React.createElement(require('PaiBandRN/src/pages/subpages/exchange').default, props);
            case 'cleared':
                return React.createElement(require('PaiBandRN/src/pages/subpages/cleared').default, props);
            case 'task':
                return React.createElement(require('PaiBandRN/src/pages/subpages/task').default, props);
            case 'taskList':
                return React.createElement(require('PaiBandRN/src/pages/subpages/taskList').default, props);
            case 'flowerExplain':
                return React.createElement(require('PaiBandRN/src/pages/subpages/flowerExplain').default, props);
            // case 'security':
            //     return React.createElement(require('PaiBandRN/src/pages/subpages/safeDistance').default, props);
            case 'grow':
                return React.createElement(require('PaiBandRN/src/pages/subpages/grow').default, props);
            case 'growthLine':
                return React.createElement(require('PaiBandRN/src/pages/subpages/growthLine').default, props);
            case 'sportChart':
                return React.createElement(require('PaiBandRN/src/pages/subpages/sportChartPage').default, props);
            case 'sleepChart':
                return React.createElement(require('PaiBandRN/src/pages/subpages/sleepChartPage').default, props);
            case 'heartSet':
                return React.createElement(require('PaiBandRN/src/pages/subpages/heartSet').default, props);
            case 'test':
                return React.createElement(require('PaiBandRN/src/pages/subpages/test').default, props);
        }
    }

    get currentPage() {
        return this._currentPage;
    }
}

export default new PageFactory();
