'use strict';

import PSComponent from 'PaiBandRN/src/components/pscomponent';

import i18nService from 'PaiBandRN/src/services/i18nservice';

class IComponent extends PSComponent {
    constructor(props) {
        super(props);
        this.repeatType = [{
            type: this.i18n('task_repeat_repeat'), 
            cycle: 5,
            repeat: '11111110',
        },{
            type: this.i18n('task_repeat_everyday'), 
            cycle: 3,
            repeat: '11111110',
        },{
            type: this.i18n('task_repeat_everyworkday'), 
            cycle: 1,
            repeat: '11111000',
        },{
            type: this.i18n('task_repeat_everyweekend'), 
            cycle: 2,
            repeat: '00000110',
        },{
            type: this.i18n('task_repeat_onlyonce'), 
            cycle: 4,
            repeat: '00000000',
        }];
    }

    init() {
    }

    update() {
    }

    destroy() {

    }

    //将24小时制转换成上下午制
    translateTime(time){
        if (this.i18nLang == 'en') {
            const timeArr = time.split(':');
            if (parseInt(timeArr[0]) > 12) {
                const hour = ('0' + (parseInt(timeArr[0]) - 12)).substr(-2);
                return hour + ':' + timeArr[1] + ' PM';
            }else{
                return time + ' AM';
            }
        }else{
            return time;
        }
    } 

    //获取当天日期
    getDate(split){
        const newDate = new Date();
        const year = newDate.getFullYear();
        const month = ('0' + (newDate.getMonth() + 1)).substr(-2);
        const day = ('0' + newDate.getDate()).substr(-2);
        return [year, month, day].join(split);
    }

    //当地时间转UTC时间戳
    /*
    1、关于时间转换的原因：因为服务器只有一个，而国家有很多，为了统一标准，以世界标准时间为准进行转换。
    2、转换的方式为：Date.UTC(年月日时分秒)--1970年1月1日到格林尼治当前时间的毫秒数
    3、结果为：本地时间毫秒数 + 时区*60*60*1000(东加西减)
    4、结果分析：换算出来的结果分为两种： 1、标准时间的日期和本地日期是一致的  2、时间戳是本地时间 + 时区差
     */
    gettimestamp(){
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const timestamp = Math.round(Date.UTC(year,month,day,hours,minutes,seconds)/1000);
        return timestamp
    }

    i18n(id) {
        return i18nService.getI18n(id);
    }

    get i18nLang() {
        return i18nService.getLang();
    }
}

export default IComponent;
