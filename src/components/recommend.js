import React, {Component} from 'react'
import {Text, View, Image,} from 'react-native'
import { is, fromJS} from 'immutable'
import StylesCommon from 'PaiBandRN/src/style/common';
import styles from 'PaiBandRN/src/style/recommendStyles'
import IComponent from 'PaiBandRN/src/components/icomponent';
import ExpertService from 'PaiBandRN/src/services/expert'

export default class Recommend extends IComponent {
    Proptypes:{
        type:React.Proptypes.String,
    }
    constructor(props) {
        super(props);
        this.state = {
            recommendData: {},
            didUnmount: false, //解决组件卸载与异步请求冲突的bug
        }
    }
    /**
     * 选择不同的提示类型，运动／食物
     */
    chhoseShowTips(data){
        const {type} = this.props;
        let newObj;
        ExpertService.getStrategy().then(res => {
            if (this.state.didUnmount) return;
            let data = res.data;
            if (data&&data.tips) {
                try{
                    /**
                     * 根据props传递过来的数据类型，分别赋值食物与运动数据
                     */
                    if (type === 'growth') {
                        const {expert_name, expert_avatar, outline, tips} = data.tips.pabulum_tips;
                        newObj = {expert_name, expert_avatar, outline, tips};
                        newObj.expert_type = '营养专家';
                        newObj.tomorrowTips = '明日食物推荐';
                        //推荐内容
                        newObj.recommend = data.recommend.daily_cookbook.recommend_food[0] || {}
                    }else{
                        const {expert_name, expert_avatar, outline, tips} = data.tips.motion_tips;
                        newObj = {expert_name, expert_avatar, outline, tips};
                        newObj.expert_type = '运动专家';
                        newObj.tomorrowTips = '明日运动推荐';
                        //推荐内容
                        newObj.recommend = data.recommend.daily_motion[0] || {};
                        newObj.motionContent = data.recommend.motion_choice.content;
                    }
                    
                    this.setState({recommendData: newObj})  
                }catch(e){
                    console.error('error',e);
                }
            }
        }).catch(err => {
            if (this.state.didUnmount) return;
            console.error(err)
        })  
    }

    getDataStatus(){
        for (let key in this.state.recommendData) {
            return true
        }
        return false
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }

    componentWillUnmount(){
        this.state.didUnmount = true;
    }

    render() {
        /**
         * 专家推荐模块所有信息
         */
        const recommendData = this.state.recommendData || {};
        /**
         * 明日推荐详情
         */
        const recommend = recommendData.recommend || {};
        /*
        数据为空不显示
         */
        const dataStatus = this.getDataStatus();

        return (
            <View style={[StylesCommon.common_card, styles.recommendBack]}>
            {
                dataStatus? 
                <View style={styles.recommendContainer}>
                    <View style={styles.headerStyleContainer}>
                        <Text style={styles.headerStyle}>专家推荐</Text>
                    </View>
                    <View style={styles.exportDetail}>
                        <View style={styles.exportImgContainer}>
                            <Image source={{uri:recommendData.expert_avatar}} style={styles.exportImg}></Image>
                        </View>
                        <View>
                            <Text style={styles.exportName}>{recommendData.expert_name}</Text>
                            <Text style={styles.exportType}>{recommendData.expert_type || '运动专家'}</Text>
                        </View>
                    </View>
                    <View>
                        <Text style={[styles.exportName, styles.exportOutline]}>{recommendData.outline}</Text>
                    </View>
                    <View style={styles.foodrecommend}>
                        <Image source={{uri: recommend.icon}} style={[styles.foodrecommendBack]} resizeMode={'cover'} onLoad={(a) => {
                            console.log(recommend.icon)
                        }}>
                        </Image>
                        <View style={styles.tomorrowFoodView}>
                            <Text style={styles.tomorrowFood}>{recommendData.tomorrowTips}</Text>
                        </View>
                    </View>
                    <View style={[styles.foodInfo, styles.exportOutline]}>
                        <View style={styles.foodInfoTitle}>
                            <Text style={styles.foodName}>{recommend.name}</Text>
                            <Text style={styles.foodCommonStyle}>{recommend.category}</Text>
                            <View style={styles.DashLine}></View>
                        </View>
                        {
                            this.props.type === 'growth'? <View>
                                <View style={styles.foodCommonTextContainer}>
                                    <Text style={styles.foodCommonStyle}>热量</Text>
                                    <Text style={styles.foodCommonStyle}>{recommend.calorie}千卡</Text>
                                </View>
                                <View style={styles.foodCommonTextContainer}>
                                    <Text style={styles.foodCommonStyle}>蛋白质</Text>
                                    <Text style={styles.foodCommonStyle}>{recommend.content}</Text>
                                </View>
                                <View style={styles.foodCommonTextContainer}>
                                    <Text style={styles.foodCommonStyle}>每百克营养成分</Text>
                                    <Text></Text>
                                </View>
                                <View style={styles.foodCommonTextContainer}>
                                    <Text style={styles.foodCommonStyle}>食物吸收率因人而异，仅供参考</Text>
                                    
                                </View>
                            </View>: <View style={styles.foodCommonTextContainer}>
                                        <Text style={styles.foodCommonStyle}>{recommendData.motionContent}</Text>
                                    </View>
                        }
                    </View>
                </View>:
                <View style={styles.recommendContainer}>
                    <View style={styles.headerStyleContainer}>
                        <Text style={styles.headerStyle}>{this.i18n('component_recommend_title')}</Text>
                    </View>
                    <View style={styles.exportDetail}>
                        <View>
                            <Text style={styles.emptyTip}>{this.i18n('component_recommend_nodata')}</Text>
                        </View>
                    </View>
                </View>
            }
            </View>
        )
    }
    componentDidMount(){
        ExpertService.getStrategy().then(data => {
            this.chhoseShowTips(data.data);
        }).catch(e => {
            console.log(JSON.stringify(e));
        });
    }
}
