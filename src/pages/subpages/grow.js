import React from 'react';
import {Text, View, TouchableOpacity, ScrollView, Alert, Image} from 'react-native';
import Svg, {Circle, G, Path} from 'react-native-svg';
import {Text as SvgText} from 'react-native-svg';
import styles from 'PaiBandRN/src/style/growStyle';
import StylesCommon from 'PaiBandRN/src/style/common';
import IComponent from 'PaiBandRN/src/components/icomponent';
import PageNotice from 'PaiBandRN/src/notice/page';
import Recommend from 'PaiBandRN/src/components/recommend';
import ExpertService from 'PaiBandRN/src/services/expert';
import PaiBandService from 'PaiBandRN/src/services/paiband';

export default class Growth extends IComponent {
    harr = ["消瘦","偏瘦","标准","偏胖","肥胖"]; //BMI状态列表
    harrColor = ["#E91E63","#FF9933","#37C222","#FF9933","#E91E63"]; //BMI状态对应颜色
    didUnmount = false; //解决安卓手机下组件卸载与异步请求冲突的bug
    rcordMaxLenght = 5; //最近记录显示条数，默认5条，点击查看全部，则显示所有

    state = {
        recentRecord: [], //最近记录
        BMINumber: null, //BMI数值
        BMIStatus: 0, //BMI状态值
        BMITip: null,  //当前孩子的BMI状态提示
        rotateNum: null, //图表旋转角度
    }
    constructor(props) {
        super(props);
    }
    /**
     * 获取身高体重数据
     */
    initData(){
        /**
         * 同时获取身高体重数据，所有数据获取完之后进行处理
         */
        Promise.all([ExpertService.getHeightRecords(), ExpertService.getWeightRecords()])
        .then(data => {
            if (this.didUnmount) return;
            console.log('后台数据:', data)
            let heightRecords = data[0].data||[];
            let weightRecords = data[1].data||[];
            heightRecords.reverse();
            weightRecords.reverse();
            let timeList = [];
            let heightTimeList = [];
            let weightTimeList = [];
            heightRecords.forEach(item => {
                heightTimeList.push(item.time);
                if(!timeList.includes(item.time)){
                    timeList.push(item.time)
                }
            })

            weightRecords.forEach(item => {
                weightTimeList.push(item.time);
                if(!timeList.includes(item.time)){
                    timeList.push(item.time)
                }
            })
            timeList = timeList.sort((a, b) => {
                return Number(b.split('/').join('')) - Number(a.split('/').join(''))
            })

            /**
             * 判断数据是否存在，不存在以 --kg || --cm 显示
             */
            const recordArr = [];
            for (let i = 0; i < timeList.length; i++) {
                let recordObj = {
                    growthHeight: heightTimeList.includes(timeList[i])? this.fixedData(heightRecords[heightTimeList.indexOf(timeList[i])].height, 'height'): '-- ',
                    growthWeight: weightTimeList.includes(timeList[i])? this.fixedData(weightRecords[weightTimeList.indexOf(timeList[i])].weight, 'weight') + ' ' + this.i18n('growth_unit_weight') : '-- ' + this.i18n('growth_unit_weight'), 
                    growthTime: this._formateTimeList(timeList[i])
                };
                recordArr.push(recordObj);
            }
            //需要从体重最后一条数据获取BMI值，为最新BMI值
            const lastWeightRecord = weightRecords[0];
            if (lastWeightRecord) {
                const status = parseInt(lastWeightRecord.status) + 1 || 0;
                this.setState({
                    recentRecord: recordArr,
                    BMINumber: lastWeightRecord.bmi,
                    BMIStatus: status,
                    BMITip: this.harr[status],
                    rotateNum: (status - 2)*50,
                });
            }else{
                this.setState({
                    recentRecord: recordArr,
                    BMINumber: '',
                    BMIStatus: 0,
                    BMITip: this.i18n('data_status_empty'),
                    rotateNum: 0,
                });
            }
        }).catch(err => {
            if (this.didUnmount) return;
            console.log(err)
            Alert.alert(this.i18n('common_net_disconnect'), this.i18n('growth_tip_errorGetData'));
        })
    }
     
    //身高体重数据转换
    fixedData(data, type){
        if (this.i18nLang == 'en') {
            //将小数转换为整数后进行运算
            if (type == 'height') {
                let indata = Math.round(data*100/254*100/100)
                let ft = Math.floor(indata/12);
                let inc = indata % 12;
                data = ft + '\'' + inc + '"';
                //data = ().toFixed(1);
                //data = (Math.round(data*100/254*100)/100).toFixed(1);
            }else if(type == 'weight'){
                data = (Math.round(data*100/454*1000/100)).toFixed(1);
                //data = (Math.round(data*100/454*1000)/100).toFixed(1);
            }
            return data
        }else {
            data = parseFloat(data).toFixed(1);
            return data 
        }
    }

    _formateTimeList(time){
        if (this.i18nLang == 'cn') {
            return time
        }else{
            let splitTime = time.split('/');
            splitTime.push(splitTime.shift());
            return splitTime.join('/');
        }
    }

    /**
     * 跳转成长曲线页
     */
    _goGrowthLine = () => {
        this.sendNotification(PageNotice.PAGE_SELECT_SUBPAGE, {
            title: this.i18n('growth_btn_curve'),
            name: 'growthLine',
            data: this.state.recentRecord,
        });
    }
    /*
    记录身高体重数据
     */
    _recordHeightWeight = () => {
        PaiBandService.showGrowSetting().then(res => {
            if (this.didUnmount) return;
            this.initData();
        }).catch(err => {
            if (this.didUnmount) return;
            console.log(err);
        })
    }

    componentDidMount() {
        this.initData();
    }

    componentWillUnmount(){
        this.didUnmount = true;
    }

    render() {
        return (
            <View style={styles.growthContainer}>
                <ScrollView style={styles.scrollViewStyle}>
                    <View style={[styles.headerContainer, StylesCommon.common_card]}>
                    {
                        this.i18nLang == 'cn' ? <View style={styles.bmiContainer}>
                            <View style={styles.svgContainer}>
                                <View style={styles.svgRadius}>
                                    <Svg height="200" width="200">
                                        {
                                            this.harr.map((item, index) => {
                                                return <G rotate={(index-2)*50} origin="100, 100" key={index}>
                                                    <Path d="M100 100 L53 0 L147 0" fill={this.harrColor[index]}/>
                                                    <SvgText x="87" y="8" fill="#fff" fontFamily="PingFangSC-Medium">{item}</SvgText>
                                                </G>
                                            })
                                        }
                                        <Circle
                                            cx="100"
                                            cy="100"
                                            r="68"
                                            fill="#f8f8f8"
                                        />
                                        <G rotate={this.state.rotateNum} origin="100, 100">
                                            <Circle
                                                cx="100"
                                                cy="100"
                                                r="60"
                                                fill="#6735A5"
                                            />
                                            <Path d="M100 33 L95 42 L105 42" fill="#6735A5"/>
                                        </G>
                                    </Svg>
                                    <View style={styles.tipContainer}>
                                        <Text style={styles.tipTop}>{this.state.BMITip}</Text>
                                        <Text style={styles.tipBmi}>BMI {this.state.BMINumber}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.bmiComputedContainer}>
                                <Text style={styles.bmiComputed}>BMI=体重(kg)÷身高(m</Text>
                                <Text style={styles.bmiNumber}>2</Text>
                                <Text style={styles.bmiComputed}>)</Text>
                            </View>
                            <View style={styles.BIMcontainer}>
                                <Text style={styles.BMIDescription}>
                                BMI即身体质量指数，国际上常用于衡量人的胖瘦程度以及是否健康，是一个中立而可靠的标准
                                </Text>
                            </View>
                        </View> : <View style={styles.EnTopImg}>
                            <Image source={require('PaiBandRN/res/images/notlogin_img_1.png')}></Image>
                        </View>
                        
                    }

                        <View style={styles.LinkContainer}>
                            <TouchableOpacity onPress={this._recordHeightWeight}>
                                <Text style={styles.LinkTextStyle}>{this.i18n('navigator_title_growth')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this._goGrowthLine}>
                                <Text style={styles.LinkTextStyle}>{this.i18n('growth_btn_curve')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* 最近记录列表 */}
                    <View style={[styles.recentlyRecord, StylesCommon.common_card]}>
                        {
                            this.state.recentRecord.map((item, index) => {
                                if (index < this.rcordMaxLenght) {
                                    return <View key={index} style={styles.recentlyList}>
                                        <Text style={styles.timeText}>{item.growthTime}</Text>
                                        <View style={styles.heightWeight}>
                                            <Text style={[styles.heightWeightStyle, styles.heightStyle]}>{item.growthHeight}</Text>
                                            <Text style={styles.heightWeightStyle}>{item.growthWeight}</Text>
                                        </View>
                                    </View>
                                }
                            })
                        }
                        {/*查看全部，显示所有数据后隐藏*/}
                        {
                            this.state.recentRecord.length > 5 && this.state.recentRecord.length !== this.rcordMaxLenght?<TouchableOpacity style={styles.showAllList} onPress={this._goGrowthLine}>
                                <Text style={styles.showAllListText}>{this.i18n('growth_btn_viewMore')}</Text>
                            </TouchableOpacity> : null
                        }
                    </View>
                    {
                        this.i18nLang == 'cn' ? <Recommend type={"growth"}></Recommend> : null
                    }
                </ScrollView>
            </View>
        )
    }
}
