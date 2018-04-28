import React from 'react';
import {Text, View, ScrollView, Image, TouchableOpacity, Alert} from 'react-native';
import IComponent from 'PaiBandRN/src/components/icomponent';
import PageNotice from 'PaiBandRN/src/notice/page';
import styles from 'PaiBandRN/src/style/flowerStyle';
import StylesCommon from 'PaiBandRN/src/style/common';
import TaskItem from 'PaiBandRN/src/components/flower/taskItem';
import FlowerTop from 'PaiBandRN/src/components/flower/flowerTop';
import RewardService from 'PaiBandRN/src/services/reward';
import FlowersService from 'PaiBandRN/src/services/flowers';
import PaiBandService from 'PaiBandRN/src/services/paiband';
import UserSerivice from 'PaiBandRN/src/services/user';
import db from 'PaiBandRN/src/dbs/hashmap';
const workday = [1, 2, 3, 4, 5];

export default class Reward extends IComponent{
    cid = db.get('cid');
    prevent = false;
    todayCycle = workday.includes(new Date().getDay()) ? 1 : 2;
    state = {
        taskList: [],   //所有任务列表
        totalFlower: 0,  //总共的小花数量
        empty: false,  //数据是否为空
        clockNum: 0,
        hiddenClock: 0,
    }
    constructor(props){
        super(props);
    }
    //初始化数据
    _initData(){
        /*
        获取小花数据
         */
        FlowersService.getFlowers().then(res => {
            this.setState({
                totalFlower: res.current_num
            })
        }).catch(err => {
            console.log('获取小花数据失败', err);
        })

        /*
        获取奖励事件列表，保留已结算事件
         */
        const timestamp = this.gettimestamp();
        RewardService.getListsReward(timestamp).then((res = {}) => {
            console.log(res);
            let taskList = [];
            //当天数据
            taskList.push({
                title: this.i18n('flower_date_today'),
                type: 0,
                data: res.today&&res.today.reverse()||[],
            })
            //历史数据
            if (res.history instanceof Object) {
                Object.entries(res.history).forEach(item => {
                    taskList.push({
                        title: item[0],
                        type: 0,
                        data: item[1].reverse(),
                    })
                })
            }
            //已结算数据
            taskList.push({
                title: this.i18n('navigator_title_clearing'),
                type: 1,
                data: res.cleared||[],
            })
            let hiddenClock = 0;
            if (res.hidden instanceof Array) {
                res.hidden.forEach(item => {
                    if (item.clock_time) {
                        hiddenClock ++;
                    }
                })
            }
            this.setState({taskList, hiddenClock});
            this._getClockNum(taskList);
            this._getEmptyStatus(taskList);
        }).catch(err => {
            this.setState({
                empty: true
            })
            console.log('获取奖励事件列表失败',err);
        })
        
    }

    //增、删、改 奖励事件
    _saveEdit(data = {}) {
        let {type, task = {}, dataIndex, itemIndex} = data;
        if (type == 'add') {
            this._addTask(task)
        }else if(type == 'delete'){
            this._deleteTask(dataIndex, itemIndex, task);
        }else if(type == 'save'){
            this._modifyTask(dataIndex, itemIndex, task);
        }
    }

    //增加奖励事件
    _addTask(task){
        console.log('添加奖励',task);
        RewardService.createReward(task).then(res => {
            if (res.http_code == 200) {
                console.log('添加奖励事件成功');
                Object.assign(task, {event_id: res.data.event_id, clock_time: task.time});
                if ((task.cycle==1||task.cycle==2)&&(this.todayCycle != task.cycle)) {
                    if (task.clock_time) {
                        this.setState({
                            hiddenClock: ++ this.state.hiddenClock
                        })
                    }
                }else {
                    let taskList = this.state.taskList;
                    taskList[0].data.unshift(task);
                    let clockNum = this.state.clockNum;
                    if (task.clock_time) {
                        clockNum ++;
                    }
                    this.setState({taskList, empty: false, clockNum});
                }
            }else{
                console.log(res)
                throw new Error(res);
            }
        }).catch(err => {
            console.log('添加奖励事件失败', err);
            Alert.alert(this.i18n('reward_tip_failedAdd'));
        })
    } 

    /*
    删除奖励事件
     */
    _deleteTask(dataIndex, itemIndex, task){
        RewardService.deleteReward(task.event_id, task.timestamp).then(res => {
            if (res.http_code == 200) {
                console.log('删除奖励事件成功');
                let taskList = this.state.taskList;
                let deleteTask = taskList[dataIndex].data.splice(itemIndex, 1);
                let clockNum = this.state.clockNum;
                if(deleteTask[0].clock_time){
                    clockNum --;
                }
                this.setState({taskList, clockNum});
                this._getEmptyStatus(taskList);
            }else{
                console.log(res);
                throw new Error(res);
            }
        }).catch(err => {
            console.log('删除奖励事件失败', err);
            Alert.alert(this.i18n('reward_tip_failedDelete'));
        })
        
    }
    /*
    修改奖励事件
     */
    _modifyTask(dataIndex, itemIndex, task){
        console.log('修改任务', task)
        RewardService.updateReward(task).then(res => {
            if (res.http_code == 200) {
                console.log('修改奖励事件成功');
                this._initData();
                
                // let taskList = this.state.taskList;
                // let modified = taskList[dataIndex].data[itemIndex];
                // console.log(modified, task);
                // if ((task.cycle==1||task.cycle==2)&&(this.todayCycle != task.cycle)) {
                   
                // }else {
                //     task.clock_time = task.time;
                //     taskList[dataIndex].data[itemIndex] = task;
                //     this.setState({taskList});
                    
                // }
            }else{
                console.log(res);
                throw new Error(res);
            }
        }).catch(err => {
            Alert.alert(this.i18n('reward_tip_failedModify'));
            console.log('修改奖励事件失败', err);
        })
    } 

    //提交任务，完成、未完成
    _commitTask = (type, dataIndex, index, cleared_date) => {
        if (this.prevent) {
            return
        }
        this.prevent = true;
        let taskList = this.state.taskList;
        let task = taskList[dataIndex].data[index];
        let totalFlower = this.state.totalFlower;
        let status;
        //任务失败
        if (type == 'failed') {
            status = '0';
            task = {...task, status, cleared_date};
        }else{
            //完成简单重复任务后立即新建一个同样的任务
            status = '1';
            task = {...task, status, cleared_date};
            totalFlower = totalFlower + parseInt(task.flower);
        }

        RewardService.clearReward(task.event_id, cleared_date, status).then(res => {
            if (res.http_code == 200) {
                console.log('提交任务成功', res);
                taskList[dataIndex].data.splice(index, 1);
                taskList = this._pushClearedTask(taskList, task);
                /*
                简单重复任务完成后立即新建一个，并放在首位
                 */
                if (task.cycle == 5) {
                    taskList[0].data.unshift(task);
                }
                this.setState({taskList, totalFlower});
            }else{
                console.log(res)
                throw new Error(res);
            }
            this.prevent = false;
        }).catch(err => {
            this.prevent = false;
            console.log('提交任务失败', err);
        })
    }

    //任务提交后放入已结算列表，根据创建日期，放入相应位置，最近的日期放最前面
    _pushClearedTask(taskList, task){
        let clearedArr = taskList[taskList.length - 1].data;
        const taskDate = parseInt(task.cleared_date.replace(/-/gi,''));
        if (clearedArr.length == 0) {
            clearedArr.push(task);
        }else if(taskDate >= parseInt(clearedArr[0].cleared_date.replace(/-/gi,''))){
            clearedArr.unshift(task);
        }else if(taskDate < parseInt(clearedArr[clearedArr.length-1].cleared_date.replace(/-/gi,''))){
            clearedArr.push(task);
        }else{
            for (let i = 0; i < clearedArr.length; i++) {
                const clearedItemDate = parseInt(clearedArr[i].cleared_date.replace(/-/gi,''));
                
                if(clearedItemDate >= taskDate){
                    clearedArr.splice(i, 0, task);
                }
            }
        }
        /*
        已完成任务最多只能显示5条
         */
        taskList[taskList.length - 1].data = clearedArr.splice(0, 5);
        return taskList

    }

    //直接奖励小花
    _addDirect = (data) => {
        console.log(data)
        const {name, flower, cleared_date} = data;
        RewardService.directReward(name, flower, cleared_date).then(res => {
            if (res.http_code == 200) {
                console.log('直接奖励小花成功');
                let taskList = this.state.taskList;
                const length = taskList.length;
                taskList[length - 1].data.unshift(data);
                //取5条数据
                taskList[length - 1].data = taskList[length - 1].data.splice(0,5);
                const totalFlower = this.state.totalFlower + parseInt(flower);
                this.setState({taskList, totalFlower, empty: false})
                // this._asyncFlower(Math.abs(flower));
            }else{
                console.log(res);
                throw new Error(res);
            }
        }).catch(err => {
            console.log('直接奖励小花失败', err);
            Alert.alert(this.i18n('reward_tip_rewardFailed'));
        })
    }

    //检测数据是否为空
    _getEmptyStatus(taskList){
        let length = 0;
        taskList.forEach(item => {
            length += item.data.length;
        })
        if (length > 0) {
            this.setState({
                empty: false
            })
        }else{
            this.setState({
                empty: true
            })
        }
    }

    //获取当天闹钟数量
    _getClockNum(taskList){
        let todayDate = taskList[0]['data'];
        let clockNum = 0;
        todayDate.forEach(item => {
            if (item.clock_time) {
                clockNum ++;
            }
        })
        this.setState({clockNum});
    }
    /*
    同步小花
     */
    // _asyncFlower(flower){
    //     if (!this.deviceid) {
    //         this.deviceid = UserSerivice.getDeviceID(this.cid);
    //     }
    //     const flowerinfo = {
    //         cur_num: this.state.totalFlower,
    //         nullm: flower,
    //         action: 'add_num',
    //     }
    //     PaiBandService.syncWriteFlowers(this.deviceid, flowerinfo).then(res => {
    //         console.log(res)
    //     }).catch(err => {
    //         console.log(err)
    //     })
    // }

    componentDidMount(){
        this._initData();
        this.deviceid = UserSerivice.getDeviceID(this.cid);
        //监听编辑任务页面的数据
        this.addSubscriber(PageNotice.GO_BACK, this._saveEdit);
    }

    componentWillUnmount() {
        this.removeSubscriber(PageNotice.GO_BACK, this._saveEdit);
    }

    render() {
        let totalClock = this.state.clockNum + this.state.hiddenClock;
        return (
            <View style={styles.container}>
                <ScrollView style={styles.scrollViewStyle}>
                    {/*公共头部*/}
                    <FlowerTop clockNum={totalClock} from={'rewards'} addDirect={this._addDirect} totalFlower={this.state.totalFlower}/>
                    {
                        //所有的任务列表
                        this.state.taskList.map((item, index) => {
                            if (item.data.length) {
                                return <TaskItem clockNum={totalClock} from={'rewards'} key={index} dataList={item} index={index} commitTask={this._commitTask}/> 
                            }
                        })
                    }
                    {
                        this.state.empty ? <View style={styles.emptyTip}>
                            <Image style={styles.emptyTipImg} source={require('PaiBandRN/res/images/empty_icon.png')}></Image>
                            <Text style={styles.emptyTipText}>{this.i18n('flower_tip_nothing')}</Text>
                        </View>:null
                    }
                </ScrollView>
            </View>
        );
    }
}
