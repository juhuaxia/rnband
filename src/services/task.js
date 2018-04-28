'use strict';
import IService from 'PaiBandRN/src/services/base/iservice';
import webapi from 'PaiBandRN/src/services/webapi';
import paibandService from 'PaiBandRN/src/services/paiband';
import jutils from 'jutils';

class TaskService extends IService {
    /**
    * 获取奖励兑换事件名称
    */
    async getTaskList(type='reward', requestid) {
        try{
            requestid === undefined && (requestid = jutils.makeSimpleGUID());
            const params = Object.assign({ _request_id: requestid }, {type});
            const result = await webapi.asyncCallAPI('getTaskList', params);

            // const result = {
            //     http_code: 200,
            //     data: [
            //         {
            //             name: "按时起床",
            //             category: 1
            //         },
            //         {
            //             name: "完成作业",
            //             category: 2
            //         },
            //         {
            //             name: "获得好成绩",
            //             category: 2
            //         },
            //         {
            //             name: "完成背单词",
            //             category: 2
            //         },
            //         {
            //             name: "完成课外阅读",
            //             category: 2
            //         },
            //         {
            //             name: "完成运动任务",
            //             category: 3
            //         },
            //         {
            //             name: "比赛获得优胜",
            //             category: 3
            //         },
            //         {
            //             name: "按时睡觉",
            //             category: 4
            //         }
            //     ],
            //     elapsed: 2
            // }
            if (result.http_code == 200) {
                return result.data;
            }else{
                throw new Error(result)
            }
        }catch(err){
            throw new Error(err);
        }
    }
    
};

export default new TaskService();
