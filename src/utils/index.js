'use strict';

class Utils {
    //年-月-日->指定格式
    static formatDate(d, format = 'mm-dd-yy') {
        const date = d.split('-');
        const f = format.split('-');
        return f.map(v => {
            if(v == 'mm') {
                return date[1];
            } else if(v == 'dd') {
                return date[2];
            } else if(v == 'yy') {
                return date[0];
            }
        }).join('-');
    }

    //24小时->12小时 
    static formatTime(t = '00:00') {
        const time = t.split(':');
        const h = parseInt(time[0]);
        if(h == 0 || h == 24) {
            return '12:' + time[1] + 'AM';
        } else if(h < 12) {
            return h +':' + time[1] + 'AM';
        } else if(h == 12) {
            return '12:' + time[1] + 'PM';
        } else {
            return h - 12 + ':' + time[1] + 'PM';
        }
        return t;
    }

    //千米->英里
    static km2mi(km) {
        return km / 1.609344;
    }

    //厘米->英尺
    static cm2ft(cm) {
        return cm / 30.48;
    }

    //千克->磅
    static kg2lbs(kg) {
        return kg / 0.454;
    }
}

export default Utils;
