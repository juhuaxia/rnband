import React from 'react';
import {Text, View, ScrollView, Image, TouchableOpacity, Alert} from 'react-native';
import IComponent from 'PaiBandRN/src/components/icomponent';
import PageNotice from 'PaiBandRN/src/notice/page';
import styles from 'PaiBandRN/src/style/flowerStyle';
import StylesCommon from 'PaiBandRN/src/style/common';
import TaskItem from 'PaiBandRN/src/components/flower/taskItem';
import FlowerTop from 'PaiBandRN/src/components/flower/flowerTop';
import ExchangeService from 'PaiBandRN/src/services/exchange';
import FlowersService from 'PaiBandRN/src/services/flowers';
import PaiBandService from 'PaiBandRN/src/services/paiband';
import UserSerivice from 'PaiBandRN/src/services/user';
import db from 'PaiBandRN/src/dbs/hashmap';


export default class Exchange extends IComponent{
    cid = db.get('cid');
    prevent = false;
    state = {
        taskList: [],   //所有任务列表
        totalFlower: 0, // 总共小花数量
        empty: false,  //数据是否为空
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
            console.log('获取小花数据失败',err);
        })

        /*
        获取兑换事件列表
         */
        ExchangeService.getListExchange().then((res = {}) => {
            console.log(res);
            let taskList = [];
            //事件列表
            taskList.push({
                title: '',
                type: 0,
                data: res.events&&res.events.reverse()||[],
            })
            //已结算数据
            taskList.push({
                title: this.i18n('exchange_status_cleared'),
                type: 1,
                data: res.cleared||[],
            })
            
            this.setState({taskList})
            this._getEmptyStatus(taskList);
        }).catch(err => {
            this.setState({
                empty: true
            })
            console.log('获取兑换事件列表失败',err);
        })
    }

    //增、删、改 兑换事件
    _saveEdit(data = {}) {
        let {type, task = {}, dataIndex, itemIndex} = data;
        if (type == 'add') {
            this._addTask(task)
        }else if(type == 'delete'){
            this._deleteTask(dataIndex, itemIndex, task)
        }else if(type == 'save'){
            this._modifyTask(dataIndex, itemIndex, task);
        }
    }

    //增加兑换事件
    _addTask(task){
        const {name, flower, cycle, timestamp} = task;
        console.log(task)
        ExchangeService.createExchange({name, flower, cycle, timestamp}).then(res => {
            if (res.http_code == 200) {
                console.log('添加兑换事件成功');
                task.flower = '-' + task.flower;
                task.event_id = res.data.event_id;
                let taskList = this.state.taskList;
                taskList[0].data.unshift(task);
                this.setState({taskList, empty: false})
            }else{
                throw new Error(res);
            }
        }).catch(err => {
            console.log('添加兑换事件失败', err);
            Alert.alert(this.i18n('exchange_tip_failedAdd'));
        })
    } 

    /*
    删除兑换事件
     */
    _deleteTask(dataIndex, itemIndex, task){
        ExchangeService.deleteExchange(task.event_id, task.timestamp).then(res => {
            if (res.http_code == 200) {
                console.log('删除兑换事件成功');
                const taskList = this.state.taskList;
                taskList[dataIndex].data.splice(itemIndex, 1);
                this.setState({taskList});
                this._getEmptyStatus(taskList);
            }else{
                throw new Error(res);
            }
        }).catch(err => {
            console.log('删除兑换事件失败', err);
            Alert.alert(this.i18n('exchange_tip_failedDelete'));
        })
        
    }

    /*
    修改兑换事件
     */
    _modifyTask(dataIndex, itemIndex, task){
        const {event_id, name, flower, cycle, timestamp} = task;
        ExchangeService.updateExchange({event_id, name, flower, cycle, timestamp}).then(res => {
            if (res.http_code == 200) {
                console.log('修改兑换事件成功');
                task.flower = '-' + task.flower;
                const taskList = this.state.taskList;
                taskList[dataIndex].data[itemIndex] = task;
                this.setState({taskList});
            }else{
                throw new Error(res);
            }
        }).catch(err => {
            console.log('修改兑换事件失败', err);
            Alert.alert(this.i18n('exchange_tip_failedModify'));
        })
    } 

    //兑换心愿
    _commitTask = (type, dataIndex, index, cleared_date) => {
        
        const taskList = this.state.taskList;
        let task = taskList[dataIndex].data[index];
        let totalFlower = this.state.totalFlower;
        //task.flower为负数
        totalFlower = totalFlower + parseInt(task.flower);
        task = {...task, status:1, cleared_date};
        if (totalFlower < 0) {
            Alert.alert(this.i18n('exchange_tip_lessFlower'));
            return 
        }
        if (this.prevent) {
            return
        }
        this.prevent = true;
        ExchangeService.clearedExchange(task.event_id, cleared_date).then(res => {
            if (res.http_code == 200) {
                const length = taskList.length;
                console.log('兑换心愿成功');
                taskList[dataIndex].data.splice(index, 1);
                taskList[length - 1].data.unshift(task);
                /*
                简单重复任务完成后立即新建一个，并放在首位
                 */
                if (task.cycle == 5) {
                    taskList[0].data.unshift(task);
                }
                /*
                已完成任务最多只能显示5条
                 */
                taskList[length - 1].data = taskList[length - 1].data.splice(0,5);
                this.setState({taskList,totalFlower});
                // this._asyncFlower(Math.abs(task.flower));
            }else{
                console.log(res)
                throw new Error(res);
            }
            this.prevent = false;
        }).catch(err => {
            this.prevent = false;
            console.log('兑换心愿失败', err);
            Alert.alert(this.i18n('wish_tip_failedExchange'));
        })
    }

    //直接兑换
    _addDirect = (data) => {
        //flower为正数
        const {name, flower, cleared_date} = data;
        ExchangeService.directExchange(name, flower, cleared_date).then(res => {
            if (res.http_code == 200) {
                console.log('直接兑换成功');
                const taskList = this.state.taskList;
                const length = taskList.length;
                data.flower = '-' + data.flower;
                taskList[length - 1].data.unshift(data);
                //取5条数据
                taskList[length - 1].data = taskList[length - 1].data.splice(0,5);
                const totalFlower = this.state.totalFlower + parseInt(data.flower);
                this.setState({taskList, totalFlower, empty: false});
                // this._asyncFlower(Math.abs(flower));
            }else{
               throw new Error(res);
            }
        }).catch(err => {
            console.log('直接兑换失败', err);
            Alert.alert(this.i18n('wish_tip_failedExchange'));
        })
    }


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
    //         action: 'minus_num',
    //     }
    //     PaiBandService.syncWriteFlowers(this.deviceid, flowerinfo).then(res => {
    //         console.log(res)
    //     }).catch(err => {
    //         console.log(err)
    //     })
    // }

    componentDidMount(){
       this._initData()
       this.deviceid = UserSerivice.getDeviceID(this.cid);
       //监听来自Task页面的事件
       this.addSubscriber(PageNotice.GO_BACK, this._saveEdit);
    }

    componentWillUnmount() {
        this.removeSubscriber(PageNotice.GO_BACK, this._saveEdit);
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.scrollViewStyle}>
                    {/*头部组件*/}
                    <FlowerTop from={'exchange'} addDirect={this._addDirect} totalFlower={this.state.totalFlower}/>
                    {
                        this.state.taskList.map((item, index) => {
                            if (item.data.length) {
                                return <TaskItem from={'exchange'} key={index} dataList={item} index={index} commitTask={this._commitTask}/> 
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
