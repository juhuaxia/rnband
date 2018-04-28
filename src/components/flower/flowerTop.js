import React from 'react'
import {Text, View, Modal, Image, TouchableOpacity, TextInput, Alert} from 'react-native'
import IComponent from 'PaiBandRN/src/components/icomponent'
import COMNotice from 'PaiBandRN/src/notice/component'
import PageNotice from 'PaiBandRN/src/notice/page'
import styles from 'PaiBandRN/src/style/flowerTopStyle'
import StylesCommon from 'PaiBandRN/src/style/common'
import { is, fromJS} from 'immutable'


export default class FlowerTop extends IComponent{
    static propTypes = {
        from: React.PropTypes.string.isRequired, //flower || wish
        addDirect: React.PropTypes.func.isRequired, //直接奖励回调函数
        totalFlower: React.PropTypes.number.isRequired, //总共小花数量
    }
    state = {
        modalVisible: false, //model状态
        awardNum: '', // 奖励数量
        awardDetail: '', // 奖励详情
        modalTipImg: require('PaiBandRN/res/images/flowerreward_alert_img.png'), //弹出框图片
    }
    
    //跳转任务编辑页面
    _goToTask = () => {
        this.sendNotification(PageNotice.PAGE_SELECT_SUBPAGE, {
            title: this.props.from == 'rewards' ? this.i18n('flower_btn_newtask') : this.i18n('flower_task_create'),
            name: 'task',
            data: {from: this.props.from, clockNum: this.props.clockNum},
        });
    }
    //跳转小花介绍页面
    _goToFlowerExplain = () => {
        this.sendNotification(PageNotice.PAGE_SELECT_SUBPAGE, {
            title: this.i18n('flower_top_ask'),
            name: 'flowerExplain',
            data: {},
        });
    }
    //关闭model同时数据初始化
    _closeModel = () => {
        this.setState({
            modalVisible: false,
            awardDetail: '',
            awardNum: '',
        })
    }
    //点击提交按钮
    _confirm = () => {
        console.log(this.props)
        if (!this.state.awardNum || parseInt(this.state.awardNum) <= 0) {
            Alert.alert(this.i18n('task_tip_errorFlower'))
            return
        }else if (this.props.from == 'exchange' && parseInt(this.state.awardNum) > this.props.totalFlower) {
            Alert.alert(this.i18n('exchange_tip_lessFlower'));
            return
        }

        let awardDetail;
        if (!this.state.awardDetail) {
            awardDetail = this.i18n('flower_input_textarea');
        }else{
            awardDetail = this.state.awardDetail;
        }

        const newData = {
            name: awardDetail,
            flower: this.state.awardNum,
            status: 1,
            cleared_date: this.getDate('-'),
        }
        this.props.addDirect(newData);
        //初始化数据
        this.setState({
            modalVisible: false,
            awardDetail: '',
            awardNum: '',
        })
    }
    //格式化小花数量，如果超过10000，则转换为xx万形式
    _formatNum = (num = 0) => {
        if (num < 10000 || this.i18nLang == 'en') {
            return num
        }else if (this.i18nLang == 'cn') {
            return (num/10000).toFixed(1) + '万'
        }
    }
    //格式化输入内容
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
        this.setState({
            awardNum: num.toString()
        })
    }
    componentWillMount() {
        //直接奖励弹框顶部图片
        if(this.props.from == 'exchange'){
            this.setState({
                modalTipImg: require('PaiBandRN/res/images/exchange_alert_img.png')
            })
        }
    }
    componentDidMount(){
        
    }

    componentWillUnmount() {
        
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState));
    }

    componentWillUpdate(nextProps, nextState) {
        
    }

    render() {
        return (
            <View style={styles.taskList}>
                <View style={[styles.descContainer, StylesCommon.common_card]}>
                    {/*头部小花图片*/}
                    <View style={styles.descHeader}>
                        <Image source={require('PaiBandRN/res/images/flowerreward_icon.png')} style={styles.descHeaderImg}></Image>
                    </View>
                    {/*头部小花数量*/}
                    <View style={styles.descNum}>
                        <Text style={styles.descTextNum}>{this._formatNum(this.props.totalFlower)}</Text>
                        <Text style={styles.descTextType}>{this.i18n('flower_unit_flower')}</Text>
                    </View>
                    {/*什么是小花*/}
                    <TouchableOpacity style={styles.descWhatContainer} onPress={this._goToFlowerExplain}>
                        <Image source = {require('PaiBandRN/res/images/question_icon.png')} style={styles.aboutFlowerImg}/>
                        <Text style={styles.aboutFlowerText}>{this.i18n('flower_top_ask')}</Text>
                    </TouchableOpacity>
                    {/*新建、直接奖励按钮*/}
                    <View style={styles.descFooter}>
                        <TouchableOpacity style={[styles.descFooterOpacity, styles.descFooterLeft]} onPress={this._goToTask}>
                            <Text style={[styles.descFooterText, this.i18nLang=='en'?styles.enStyle:null]}>{this.props.from == 'rewards' ? this.i18n('flower_btn_newtask') : this.i18n('flower_task_create')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.descFooterOpacity} onPress={() => this.setState({modalVisible: true})}>
                            <Text style={[styles.descFooterText, this.i18nLang=='en'?styles.enStyle:null]}>{this.props.from == 'rewards' ? this.i18n('flower_btn_directlyReward') : this.i18n('flower_exchange_directly')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {/*直接奖励弹框*/}
                <Modal
                    animationType = {'fade'}
                    transparent={true}
                    onRequestClose={() => {}}
                    visible={this.state.modalVisible}>
                    <View style={styles.awardBackView}>
                        <View style={[styles.awardContainer, StylesCommon.common_card]}>
                            {/*关闭按钮*/}
                            <TouchableOpacity style={styles.closeModel} onPress={this._closeModel}>
                                <Image source={require('PaiBandRN/res/images/menu_red_close_icon_n.png')}></Image>
                            </TouchableOpacity>
                            <View style={styles.awardImgView}>
                                <Image style={styles.awardImg} source={this.state.modalTipImg}></Image>
                            </View>
                            {/*输入框*/}
                            <View style={styles.awardInputContainer}>
                                <TextInput
                                    style={styles.awardNumInput}
                                    underlineColorAndroid={"transparent"}
                                    placeholder={this.i18n('flower_top_inputnum')}
                                    keyboardType={'numeric'}
                                    onChangeText={(awardNum) => this._inputNum(awardNum)}
                                    value={this.state.awardNum.toString()}
                                />
                                <Text style={styles.awardText}>{this.i18n('flower_unit_flower')}</Text>  
                            </View>
                            {/*奖励内容*/}
                            <View style={styles.awardTextArea}>
                                <TextInput
                                    style={styles.awardTextAreaInput}
                                    underlineColorAndroid={"transparent"}
                                    placeholder={this.i18n('flower_input_textarea')}
                                    multiline={true}
                                    onChangeText={(awardDetail) => this.setState({awardDetail})}
                                />
                            </View>
                            {/*确认按钮*/}
                            {
                                parseInt(this.state.awardNum) || parseInt(this.state.awardNum)==0?<TouchableOpacity onPress={this._confirm}>
                                <View style={[styles.saveEdit, {opacity: 1}]}>
                                    <Text style={styles.saveEditText}>OK</Text>
                                </View>
                            </TouchableOpacity>:<View>
                                <View style={[styles.saveEdit, {opacity: 0.2}]}>
                                    <Text style={styles.saveEditText}>OK</Text>
                                </View>
                            </View>
                            }
                            
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}
