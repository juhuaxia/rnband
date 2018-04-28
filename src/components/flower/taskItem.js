import React from 'react';
import {Text, View, Image, TouchableOpacity} from 'react-native';
import IComponent from 'PaiBandRN/src/components/icomponent';
import PageNotice from 'PaiBandRN/src/notice/page';
import styles from 'PaiBandRN/src/style/taskItemStyle';
import StylesCommon from 'PaiBandRN/src/style/common';


export default class TaskItem extends IComponent{
    static propTypes = {
        from: React.PropTypes.string.isRequired, //标记来自flower、wish页面
        dataList: React.PropTypes.object.isRequired, //数据列表
        index: React.PropTypes.number.isRequired, //任务所在类索引
        commitTask: React.PropTypes.func.isRequired, //点击完成、未完成任务回调函数
    }
    
    //获取当天可以获得的小花数量
    _getTodayNum(todayList){
        let num = 0;
        todayList.forEach(item => {
            num += parseInt(item.flower)
        })
        return num
    }

    _editTask(data, dataIndex, itemIndex, editAble){
        if (!editAble) return;

        //点击任务，跳转任务页面，需要传递四个参数：任务数据、来自哪个页面、类索引、所在类索引
        this.sendNotification(PageNotice.PAGE_SELECT_SUBPAGE, {
            title: this.i18n('event_title_name'),
            name: 'task',
            data: {task: data, from: this.props.from, dataIndex, itemIndex, clockNum: this.props.clockNum},
        });
    }

    _getRepeatName(cycle){
        for (let i = 0; i < this.repeatType.length; i++) {
            if(this.repeatType[i].cycle == parseInt(cycle)){
                return this.repeatType[i].type
            }
        }
    }

    _formateDate(title){
        if (title.indexOf('-') !== -1) {
            return title.replace(/-/gi, '/')
        }else{
            return title
        }
    }

    _commitTask = (type, index, date) => {
        //获取当天时间  格式 yyyy-mm-dd
        if (date == this.i18n('flower_date_today') || !date) {
            date = this.getDate('-'); 
        }
        this.props.commitTask(type, this.props.index, index, date);
    }
    
     //跳转历史记录
    _goToFinish = () => {
        this.sendNotification(PageNotice.PAGE_SELECT_SUBPAGE, {
            title: this.props.from=='exchange' ?this.i18n('exchange_status_cleared'):this.i18n('navigator_title_clearing'),
            name: 'cleared',
            data: {from: this.props.from},
        });
    }
    componentDidMount(){
       
    }

    componentWillUnmount() {
        
    }

    render() {
        const {title, type, data} = this.props.dataList;
        const today = title == this.i18n('flower_date_today');
        const editAble = today || (this.props.from == 'exchange');
        return (
            <View style={styles.taskList}>
                {
                    title ? <View style={styles.dateTip}>
                        <Text style={[styles.dateTipText, {color: title == this.i18n('flower_date_today') ? '#F2253E': '#000', opacity: type == 1 ? 0.4: 1}]}>{this._formateDate(title)}</Text>
                    </View>:null
                }
                
                {
                    //如果是当天数据。显示可以获取的小花数量
                    today ? <View style={styles.dayNumTip}>
                        <Text style={styles.dayNumTipText}>{this.i18n('flower_num_canGet')}</Text>
                        <Text style={styles.dayNumTipData}> {this._getTodayNum(data)}</Text>
                        <Image style={styles.dayNumTipImg} source={require('PaiBandRN/res/images/flowerreward_icon.png')}></Image>
                    </View> : null
                }
                {
                    data.map((item, index) => {
                        //判断未完成任务和已完成任务
                        if (type == 0) {
                            return <TouchableOpacity 
                                activeOpacity={editAble ? 0.2:1} 
                                key={index} 
                                style={[styles.taskItemContainer,{minHeight: type == 0 ? 114:91}, StylesCommon.common_card]} 
                                onPress={this._editTask.bind(this, item, this.props.index, index, editAble)}
                                >
                                {/*任务头部*/}
                                <View style={styles.taskCommonStyle}>
                                    <View style={styles.taskHeaderStyle}>
                                        <Text style={styles.taskName}>{item.name}</Text>
                                    </View>
                                    <View style={styles.taskHeaderStyle}>
                                        <Text style={styles.awardFlower}>{item.flower}</Text>
                                        <Image style={styles.taskFlowerImg} source={require('PaiBandRN/res/images/flowerreward_icon.png')}></Image>
                                    </View>
                                </View>
                                {/*任务内容*/}
                                <View style={[styles.taskCommonStyle, styles.taskSetsStatus]}>
                                    <View style={styles.taskSets}>
                                        {
                                            //如果设置时间，则显示时间提示
                                            item.clock_time ? <View style={styles.taskSetsCommon}>
                                                <Image style={styles.taskSetsImg} source={require('PaiBandRN/res/images/clock_icon.png')}></Image>
                                                <Text style={styles.taskSetsText}>{this.translateTime(item.clock_time)}</Text>
                                            </View> : null
                                        }
                                        <View style={styles.taskSetsCommon}>
                                                <Image style={styles.taskSetsImg} source={require('PaiBandRN/res/images/mark_icon.png')}></Image>
                                                <Text style={styles.taskSetsText}>{this._getRepeatName(item.cycle)}</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.taskCommonStyle, styles.submitContainer]}>
                                        {
                                            //简单重复任务没有未完成按钮
                                            item.cycle != 5 && this.props.from =='rewards' ? <TouchableOpacity onPress={this._commitTask.bind(this, 'failed', index, title)}>
                                                <Text style={styles.submitTask}>{this.i18n('flower_status_incomplete')}</Text>
                                            </TouchableOpacity> : null
                                        }
                                        <TouchableOpacity onPress={this._commitTask.bind(this, 'complete', index, title)}>
                                            <Text style={styles.submitTask}>{this.props.from == 'rewards' ? this.i18n('flower_status_complete') : this.i18n('wish_btn_exchange')}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View> 
                            </TouchableOpacity>
                        }else{
                            return <View key={index} style={[styles.taskItemContainer, {minHeight : type == 0 ? 114 : 91}, StylesCommon.common_card]}>
                                <View style={styles.taskCommonStyle}>
                                    {/*头部*/}
                                    <View style={styles.taskHeaderStyle}>
                                        <Text style={styles.taskName}>{item.name}</Text>
                                    </View>
                                    <View style={styles.taskHeaderStyle}>
                                        <Text style={styles.awardFlower}>{item.flower}</Text>
                                        <Image style={styles.taskFlowerImg} source={require('PaiBandRN/res/images/flowerreward_icon.png')}></Image>
                                    </View>
                                </View>
                                {/*已完成任务*/}
                                <View style={[styles.taskCommonStyle, styles.finishTaskItem]}>
                                    <Text style={styles.finishTaskItemLeft}>
                                        {this._formateDate(item.cleared_date)}
                                    </Text>
                                    <Text style={[styles.finishTaskItemRight, {color: item.status==1?'#000':'#F2253E'}]}>
                                        {item.status==1?this.i18n('flower_status_completed'):this.i18n('flower_status_incomplete')}
                                    </Text>
                                </View>
                            </View>
                        }
                    }) 
                }
                {
                    //已完成任务超过5条显示加载更多按钮
                    (type == 1) &&(data.length > 4)?<TouchableOpacity style={[styles.showMore, StylesCommon.common_card]} onPress={this._goToFinish}>
                        <Text style={styles.showMoreText}>{this.i18n('btn_name_more')}</Text>
                    </TouchableOpacity> : null
                }
            </View>
        );
    }
}
