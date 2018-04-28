import React from 'react';
import {Text, View, ScrollView, Image, TouchableOpacity, TextInput, Platform, Switch, Alert} from 'react-native';
import Svg, {Circle} from 'react-native-svg';
import IComponent from 'PaiBandRN/src/components/icomponent';
import PageNotice from 'PaiBandRN/src/notice/page';
import styles from 'PaiBandRN/src/style/taskStyle';
import StylesCommon from 'PaiBandRN/src/style/common';
import Picker from 'PaiBandRN/src/components/picker';
import SwitchAndroid from 'PaiBandRN/src/components/SwitchAndroid';
const SwitchCross = Platform.OS === 'ios' ? Switch : SwitchAndroid;
import TaskService from 'PaiBandRN/src/services/task';


export default class Reward extends IComponent{
    isNewTask = true;  //是否是新建任务
    showCloclSet = true;  //小花任务显示闹钟按钮，心愿任务隐藏闹钟
    dataIndex = 0;  //编辑已存在任务所在整体的索引，用来返回给上一级
    itemIndex = 0;  //编辑已存在任务的具体索引
    event_id = null; //编辑任务ID
    
    state = {
        taskNameList: [], //任务列表
        name: '',  //任务名称
        category: '',//任务分类
        awardNum: '',  //奖励小花数量
        selectRepeatIndex: 0,  //已选择重复类型的index
        clockStatus: false,  //闹钟是否开启
        hour: '00',  //小时
        minute: '00',  //分钟
        pickerVisible: false, //picker是否显示
    }
    /*
    初始化数据，获取任务名称列表
     */
    _initData(){
        let type;
        if (this.props.data && this.props.data.from == 'exchange') {
            type = 'exchange';
        }else{
            type = 'reward';
        }
        
        TaskService.getTaskList(type).then(res => {
            this.setState({
                taskNameList: res,
            })
        }).catch(err => {
            console.log(err)
        })
    }

    /*
    选择重复类型
     */
    _selectRepeatType(index){
        if (index == 0) {
            this.setState({
                selectRepeatIndex: index,
                clockStatus: false,
            })
        }else{
            this.setState({
                selectRepeatIndex: index
            })
        }
    }
    /*
    闹钟是否打开
     */
    _changeClockStatus = () => {
        if (this.state.selectRepeatIndex == 0 || this.state.selectRepeatIndex == 4) {
            Alert.alert(this.i18n('task_tip_repeatClock'));
            this.setState({
                clockStatus: this.state.clockStatus,
            })
            return
        }else if(this.isNewTask && this.props.data.clockNum >= 8){
            Alert.alert(this.i18n('flower_max_clock'));
            this.setState({
                clockStatus: this.state.clockStatus,
            })
            return
        }else if(!this.isNewTask && !this.props.data.task.clock_time && this.props.data.clockNum >= 8){
            Alert.alert(this.i18n('flower_max_clock'));
            this.setState({
                clockStatus: this.state.clockStatus,
            })
            return
        }

        this.setState({
            clockStatus: !this.state.clockStatus,
        })
    }
    /*
    选择任务
     */
    _selectTask(index){
        this.setState({
            name: this.state.taskNameList[index].name,
            category: this.state.taskNameList[index].category,
        })
    }
    //保存任务。分为三种类型：新建。修改，删除
    _saveEdit = (type) => {
        let task = {}
        /*
        如果是保存任务，那么任务名称，小花数量必须填写
        */
        if (type == 'save') {
            const awardNum = this.state.awardNum.toString().replace('-', '');
            if (!this.state.name) {
                Alert.alert(this.i18n('task_tip_errorTask'));
                return
            }else if(!parseInt(awardNum) || /\D/g.test(awardNum)){
                Alert.alert(this.i18n('task_tip_errorFlower'))
                return
            }else if(parseInt(this.state.awardNum) > 99){
                Alert.alert(this.i18n('flower_tip_maxNum'));
                return
            }
        }
        //如果是新任务，则type 为 add
        if (type == 'save') {
            task = {
                name: this.state.name,
                category: this.state.category,
                flower: this.state.awardNum.toString().replace('-', ''),
                cycle: this.repeatType[this.state.selectRepeatIndex].cycle,
                repeat: this.repeatType[this.state.selectRepeatIndex].repeat,
                timestamp: this.gettimestamp(),
            }
            let editType;
            if (!this.isNewTask) {
                editType = 'save';
                Object.assign(task, {event_id: this.event_id})
            }else{
                editType = 'add';
            }
            if (this.state.clockStatus) {
                Object.assign(task, {time: this.state.hour + ':' + this.state.minute})
            }
            //点击保存按钮，返回上一页，返回数据
            this.sendNotification(PageNotice.GO_BACK, {type: editType, task, dataIndex: this.dataIndex, itemIndex: this.itemIndex});
        }else if(type == 'delete'){
            task = {
                event_id: this.event_id,
                timestamp: this.gettimestamp(),
            }
            this.sendNotification(PageNotice.GO_BACK, {type, task, dataIndex: this.dataIndex, itemIndex: this.itemIndex});
        }
    }
    //跳转任务列表选择页面
    _showTaskList = () => {
        this.sendNotification(PageNotice.PAGE_SELECT_SUBPAGE, {
            title: this.i18n('flower_task_select'),
            name: 'taskList',
            data: {nameList: this.state.taskNameList},
        });
    }
    //格式化输入内容，兑换事件为负数
    _inputNum = (num) => {
        if (num) {
            num = num.replace(/\D/gi, '');
            num = num ? parseInt(num) : '';
            if (num && num > 99) {
                num = 99;
            }
        }else{
            num = '';
        }
        if (this.props.data && this.props.data.from == 'exchange') {
            num = num ? '-' + num : '';
        }
        this.setState({
            awardNum: num.toString()
        })
    }
    /*
    输入奖励事件名称
     */
    _inputName = (name) => {
        this.setState({
            name,
            category: 5,
        })
    }
    /*
    显示picker 
     */
    _showPicker = () => {
        if (!this.state.clockStatus) {
            return
        }
        this.setState({
            pickerVisible: true,
        })
    }
    /*
    选择时间
     */
    selectTime = (hour, minute) => {
        this.setState({
            pickerVisible: false,
            hour,
            minute,
        })
    }

    _getRepeatIndex(cycle){
        for (let i = 0; i < this.repeatType.length; i++) {
            if (this.repeatType[i].cycle == parseInt(cycle)) {
                return i   
            }
        }
    }

    componentWillMount() {
        const data = this.props.data || {};
        /*
        小花和兑换心愿页面重复类型和闹钟状态分开处理
        */
        if (data.from == 'exchange') {
            this.repeatType = [{
                type: this.i18n('task_repeat_repeat'), 
                cycle: 5,
                repeat: '11111110',
            },{
                type: this.i18n('task_repeat_onlyonce'), 
                cycle: 4,
                repeat: '00000000',
            }];
            this.showCloclSet = false;
        }else{
            this.showCloclSet = true;
        }
        //如果为true则为编辑任务，初始化数据
        if ('task' in data) {
            const task = data.task;
            this.isNewTask = false;
            this.dataIndex = data.dataIndex;
            this.itemIndex = data.itemIndex;
            this.event_id = task.event_id;
            let clockStatus = false;
            let hour = '00';
            let minute = '00';
            //如果任务有闹钟，则获取闹钟数据
            if (task.clock_time) {
                clockStatus = true;
                const timeArr = task.clock_time.split(':');
                hour = timeArr[0];
                minute = timeArr[1];
            }
            this.setState({
                name: task.name,
                category: task.category,
                awardNum: task.flower,
                selectRepeatIndex: this._getRepeatIndex(task.cycle),
                clockStatus,
                hour,
                minute,
            })
        }
    }



    componentDidMount(){
        this._initData();
        
        //监听来自任务名称选择页面的数据
       this.addSubscriber(PageNotice.SELECT_TASK, this._selectTask);
    }
    componentWillUnmount() {
        this.removeSubscriber(PageNotice.SELECT_TASK, this._selectTask);
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.scrollViewStyle}>
                    {/*头部输入奖励事件*/}
                    <View style={[styles.inputTask, StylesCommon.common_card]}>
                        <TextInput
                            style={[styles.inputComponent, {height: this.state.name ? 80 : 50}]}
                            placeholder={this.props.data.from == 'exchange'?this.i18n('task_input_exchangeTask'):this.i18n('task_input_rewardTask')}
                            underlineColorAndroid={"transparent"}
                            onChangeText={this._inputName}
                            multiline={true}
                            value={this.state.name}
                        />
                        {
                            //如果是新建事件，则显示任务列表选择按钮
                            !this.state.name ? <View style={styles.inputTaskDetail} >
                                <View style={styles.recommendContainer}>
                                    {
                                        this.state.taskNameList[0] ? <TouchableOpacity style={styles.recommendTask} onPress={this._selectTask.bind(this, 0)}>
                                            <Text 
                                                style={styles.recommendTaskText}
                                                numberOfLines={1}
                                            >
                                                {this.state.taskNameList[0].name}
                                            </Text>
                                        </TouchableOpacity>:null
                                    }
                                    {
                                        this.state.taskNameList[1] ? <TouchableOpacity style={styles.recommendTask} onPress={this._selectTask.bind(this, 1)}>
                                            <Text 
                                                style={styles.recommendTaskText}
                                                numberOfLines={1}
                                            >
                                                {this.state.taskNameList[1].name}
                                            </Text>
                                        </TouchableOpacity>:null
                                    }
                                </View>
                                {
                                    this.state.taskNameList.length ? <TouchableOpacity style={styles.showTaskTypes} onPress={this._showTaskList}>
                                        <Svg height="28" width='40'>
                                            <Circle cx={13} cy={15} r="1.5" fill="#F2253E"/>
                                            <Circle cx={20} cy={15} r="1.5" fill="#F2253E"/>
                                            <Circle cx={27} cy={15} r="1.5" fill="#F2253E"/>
                                        </Svg>
                                    </TouchableOpacity>:null
                                }
                            </View> : null
                        }
                        
                    </View>
                    {/*输入奖励小花数量*/}
                    <View style={[styles.selectNumber, StylesCommon.common_card]}>
                        <Text style={styles.commonTextStyle}>{this.i18n('flower_task_reward')}</Text>
                        <View style={styles.awardView}>
                            <Image style={styles.awardImg} source={require('PaiBandRN/res/images/flowerreward_icon.png')}></Image>
                        </View>
                        <TextInput
                            style={[styles.commonTextStyle, styles.awardNum]}
                            underlineColorAndroid={"transparent"}
                            onChangeText={(awardNum) => this._inputNum(awardNum)}
                            keyboardType={'numeric'}
                            placeholder={this.i18n('flower_top_inputnum')}
                            value={this.state.awardNum.toString()}
                        />  
                    </View>
                    {/*重复类型*/}
                    <View style={[styles.repeatContainer, StylesCommon.common_card]}>
                        {
                            this.repeatType.map((item, index) => {
                                return <TouchableOpacity onPress={this._selectRepeatType.bind(this, index)} key={index} style={styles.repeatItem}>
                                    <View>
                                        <Text style={styles.commonTextStyle}>
                                            {item.type}
                                        </Text>
                                    </View>
                                    {
                                        this.state.selectRepeatIndex == index ? <Image style={styles.selectRepeatImg} source={require('PaiBandRN/res/images/select_icon.png')}></Image> : null
                                    }
                                </TouchableOpacity>
                            })
                        }
                    </View>
                    {
                        //是否显示闹钟设置
                        this.showCloclSet? <View style={[styles.clockContainer, StylesCommon.common_card]}>
                            <TouchableOpacity onPress={this._showPicker}>
                                <View style={[styles.selectTime, {opacity: this.state.clockStatus ? 1: 0.2}]}>
                                    <Image source={require('PaiBandRN/res/images/alarm_icon.png')}></Image>
                                    <Text style={styles.timeText}>{this.translateTime(this.state.hour+':'+this.state.minute)}</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={styles.clockSwitch}>
                                <SwitchCross value={this.state.clockStatus} onValueChange={this._changeClockStatus}></SwitchCross>
                            </View>
                        </View> : null
                    }
                    {/*底部保存删除按钮*/}
                    <View style={styles.footerContainer}>
                        {
                            //新建任务只有保存按钮
                            !this.isNewTask ? <TouchableOpacity style={styles.deleteTask} onPress={this._saveEdit.bind(this, 'delete')}>
                                <Text style={styles.deleteTaskText}>{this.i18n('flower_task_Remove')}</Text>
                            </TouchableOpacity> : null
                        }
                        <TouchableOpacity style={styles.saveEdit} onPress={this._saveEdit.bind(this, 'save')}>
                            <Text style={styles.saveEditText}>{this.i18n('flower_task_Save')}</Text>
                        </TouchableOpacity>
                    </View>
                    {/*picker组件*/}
                    <Picker status={this.state.pickerVisible} cancle={() => {this.setState({pickerVisible: false})}} confirm={this.selectTime} selectHouer={this.state.hour} selectMinute={this.state.minute}/>
                </ScrollView>
            </View>
        );
    }
}
