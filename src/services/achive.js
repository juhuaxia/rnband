'use strict';

import webapi from 'PaiBandRN/src/services/webapi';

const achiveService = {
    /**
    * 获取成就数据
    */
    getCommonData(successback, failback, requestid) {
        webapi.callAPI('getAchiveCommon', { _request_id: requestid }, data => {
            if(successback && typeof successback === 'function') {
                successback(data);
            }
        }, error => {
            if(failback && typeof failback === 'function') {
                failback(error);
            }
        });
    }, 
    getListData(achivetype,successback, failback, requestid) {
        webapi.callAPI('getAchiveList', { type: achivetype , _request_id: requestid }, data => {
            if(successback && typeof successback === 'function') {
                successback(data);

            }
        }, error => {
            
            if(failback && typeof failback === 'function') {
                failback(error);
                
            }
        });
    },
    getRankData(ranktype,successback, failback, requestid) {
        webapi.callAPI('getAchiveRank', { rank: ranktype, _request_id: requestid }, data => {
            if(successback && typeof successback === 'function') {
                successback(data);
            }
        }, error => {
            if(failback && typeof failback === 'function') {
                failback(error);
            }
        });
    },
    getAchiveToday(idnum,successback, failback, requestid) {
        webapi.callAPI('getRewardToday', { achieve_id: idnum, _request_id: requestid }, data => {
            if(successback && typeof successback === 'function') {
                successback(data);
            }
        }, error => {
            if(failback && typeof failback === 'function') {
                failback(error);
            }
        });
    },
     getAchiveLongTime(idnum,sectionlevel,successback, failback, requestid) {
        webapi.callAPI('getrewardLongTerm', { achieve_id: idnum, section: sectionlevel, _request_id: requestid }, data => {
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
export default achiveService;
