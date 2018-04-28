import React from 'react';
import { StyleSheet, Text, Image, ScrollView, View,Dimensions,TouchableOpacity } from 'react-native';
import Svg, { Line, Path, Ellipse,Defs,G,Use,Circle,Rect} from 'react-native-svg';
import { Text as SvgText } from 'react-native-svg';
//import SleepChart from 'PaiBandRN/src/components/sleep/sleepchart';
import SleepChart from 'PaiBandRN/src/components/charts/bar1';
import PageNotice from 'PaiBandRN/src/notice/page';
import IComponent from 'PaiBandRN/src/components/icomponent';
import DescriptionBox from 'PaiBandRN/src/components/descriptionBox';
import sleepService from 'PaiBandRN/src/services/sleep';
import styles from 'PaiBandRN/src/style/sleepChartPage'
import StylesCommon from 'PaiBandRN/src/style/common';

let windowWidth = Dimensions.get('window').width;

export default class SleepChartPage extends IComponent{

    constructor(props) {
        super(props);

        this.state = {
            chartData: {
                data: [],
                xScales: ['Mon', 'Tue', 'Wen', 'Thu','Fri','Sat','Sun']
            },
            type: 'week',
            quality: 0,
            avg_sleep: 0
        };

        const now = new Date();
        this._selectDate = props.data ? props.data.date : [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/');
        this._selectMonth = props.data ? props.data.month : this._selectDate.split('/')[1];
    }

    componentDidMount(){
        this._seeAnalysis(this.state.type);
    }

    goHome() {
        this.sendNotification(PageNotice.PAGE_HOME);
    }

    _seeAnalysis(type){
        const today = new Date(this._selectDate),
            day = today.toLocaleDateString().replace(/\//g,'-');
            month = today.getMonth()+1,
            year = today.getFullYear(),
            week = this._getTheWeek();
        this.setState({
            type:type,
            chartData:{
                data: [],
                xScales: this._getXScales(type, year, month, week)
            },
            distance:0,
            avg_step:0
        }, () => {
            switch(type){
                case 'year':
                    this._getYearSleepData(year);
                    break;
                case 'month':
                    this._getMonthSleepData(year, month);
                    break;
                case 'week':
                    this._getWeekSleepData(year, week);
                    break;
            }
        })
    }

    _getXScales(type, y, m, w) {
        if(type === 'week') {
            return ['Mon', 'Tue', 'Wen', 'Thu','Fri','Sat','Sun'];
        } else if(type === 'month') {
            if (y < 1000) {
                y += 1900;
            }
            const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            
            //判断是否为闰年，针对2月的天数进行计算
            if (Math.round(y / 4) == y / 4) {
                days[1] = 29;
            } else {
                days[1] = 28;
            }
            const arr = [];
            for(let i = 0; i < days[month -1]; i++){
                i % 6 == 0 ?  arr.push(month + '/' + (i + 1)) : arr.push({title: month + '/' + (i + 1), show: false});
            }
            return arr;
        } else if(type === 'year') {
            return ['Jan', 'Feb', 'Mar', 'Apr', 'May','Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        }
    }

    _getWeekSleepData(year, week) {
        sleepService.getWeek(year, week).then(data => {
            console.log('getWeekSleepData', data);
            // if(data.http_code == 200){
            if(!data || this.state.type != 'week') {
                return ;
            }

            const datas = [];
            const xScales = this.state.chartData.xScales;
            for(let i = 0; i < xScales.length; i++) {
                datas.push([0, 0]);
            }
            for(let i = 0; i < data.data.length; i++) {
                const item = data.data[i];
                datas[parseInt(item['date']) - 1] = [item['sleepDetail'][1], item['sleepDetail'][0]];
            }
            this.setState({
                chartData: {
                    data: datas,
                    xScales: xScales
                },
                quality: data.complete_days,
                avg_sleep: data.avg_sleep_time
            });
            // }
        }).catch(e => {
            console.log('sleepService getWeek error', e);
        });
    }

    _getMonthSleepData(year,month) {
        sleepService.getMonth(year, month).then(data => {
            console.log('getMonthSleepData', data);
            // if(data.http_code == 200){
            if(!data || this.state.type != 'month') {
                return ;
            }

            const datas = [];
            const xScales = this.state.chartData.xScales;
            for(let i = 0; i < xScales.length; i++) {
                datas.push([0, 0]);
            }
            for(let i = 0; i < data.data.length; i++) {
                const item = data.data[i];
                const date = item['date'].split('-').pop();
                datas[parseInt(date) - 1] = [item['sleepDetail'][1], item['sleepDetail'][0]];
            }
            this.setState({
                chartData: {
                    data: datas,
                    xScales: xScales
                },
                quality: data.complete_days,
                avg_sleep: data.avg_sleep_time
            });
            // }
            console.log('getMonthSleepData', data);
        }).catch(e => {
            console.log('sleepService getMonth error', e);
        });
    }

    _getYearSleepData(year) {
        sleepService.getYear(year).then(data => {
            console.log('getYearSleepData', data);
            // if(data.http_code == 200){
            if(!data || this.state.type != 'year') {
                return ;
            }

            const datas = [];
            const xScales = this.state.chartData.xScales;
            for(let i = 0; i < xScales.length; i++) {
                datas.push([0, 0]);
            }
            for(let i = 0; i < data.data.length; i++) {
                const item = data.data[i];
                const date = item['date'].split('-').pop();
                datas[parseInt(date) - 1] = [item['sleepDetail'][1], item['sleepDetail'][0]];
            }
            this.setState({
                chartData: {
                    data: datas,
                    xScales: xScales
                },
                quality: data.complete_days,
                avg_sleep: data.avg_sleep_time
            });
            // }
        }).catch(e => {
            console.log('sleepService getYear error', e);
        });
    }

    _getTheWeek() {
        var totalDays = 0;
        now = new Date();
        years = now.getYear()
        if (years < 1000)
            years += 1900
        var days = new Array(12);
            days[0] = 31;
            days[1] = 28;
            days[2] = 31;
            days[3] = 30;
            days[4] = 31;
            days[5] = 30;
            days[6] = 31;
            days[7] = 31;
            days[8] = 30;
            days[9] = 31;
            days[10] = 30;
            days[11] = 31;
        
        //判断是否为闰年，针对2月的天数进行计算
        if (Math.round(now.getYear() / 4) == now.getYear() / 4) {
            days[1] = 29
        } else {
            days[1] = 28
        }
    
        if (now.getMonth() == 0) {
            totalDays = totalDays + now.getDate();
        } else {
            var curMonth = now.getMonth();
            for (var count = 1; count <= curMonth; count++) {
                totalDays = totalDays + days[count - 1];
            }
            totalDays = totalDays + now.getDate();
        }
        //得到第几周
        var week = Math.ceil(totalDays / 7);
        return week;
    }

    render() {
        return (
            <ScrollView
                ref={(scrollView) => { _scrollView = scrollView; }}
                automaticallyAdjustContentInsets={false}
                style={styles.container}>
                <View style={StylesCommon.common_gap}/>
                <View style={[StylesCommon.common_card, styles.sleepChartPageContent]}>
                    <View style={styles.dataSelectWrap}>
                        <View style={styles.dataList}>
                            <TouchableOpacity style={[
                                {height: 30, width: 50, alignItems: 'center'},
                                this.state.type === 'week' ? styles.select_ed : {}
                            ]} onPress={()=>this._seeAnalysis('week')}>
                                <Text style={{lineHeight: 26, fontSize:16, color:'#000'}}>{this.i18n('calendar_week')}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.dataList}>
                            <TouchableOpacity style={[
                                {height: 30, width: 50, alignItems: 'center'},
                                this.state.type === 'month' ? styles.select_ed : {}
                            ]} onPress={()=>this._seeAnalysis('month')}>
                                <Text style={{lineHeight: 26, fontSize:16, color:'#000'}}>{this.i18n('calendar_month')}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.dataList}>
                            <TouchableOpacity style={[
                                {height: 30, width: 50, alignItems: 'center'},
                                this.state.type === 'year' ? styles.select_ed : {}
                            ]} onPress={()=>this._seeAnalysis('year')}>
                                <Text style={{lineHeight: 26, fontSize:16, color:'#000'}}>{this.i18n('calendar_year')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                     {/*里程消耗*/}
                    <View style={styles.detailsStepWrap}>
                        <Image style={{marginLeft: 33}} source={require('PaiBandRN/res/images/sleep_icon.png')}/>
                        <View style={styles.detailsStep}>
                            <Text style={[styles.detailsStepTextDown, {opacity: 0.5}]}>{this.i18n('sleepstat_data_quality')}</Text>
                            <View style={{flexDirection: "row", alignItems: "flex-end"}}>
                                <Text style={styles.detailsStepTextUp}>{this.state.quality}</Text>
                                <View style={{width: 8}}/>
                                <Text style={styles.detailsStepTextDown}>{this.i18n('sleepstat_unit_day')}</Text>
                            </View>
                        </View>
                        <View style={styles.detailsStep}>
                            <Text style={[styles.detailsStepTextDown, {opacity: 0.5}]}>{this.i18n('sleepstat_data_average')}</Text>
                            <View style={{flexDirection: "row", alignItems: "flex-end"}}>
                                <Text style={styles.detailsStepTextUp}>{this.state.avg_sleep}</Text>
                                <View style={{width: 8}}/>
                                <Text style={styles.detailsStepTextDown}>{this.i18n('sleepstat_unit_hours')}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={StylesCommon.common_gap}/>
                <View style={[StylesCommon.common_card, {paddingTop: 20, paddingBottom: 20}]}>
                    <SleepChart
                        width={windowWidth-24}
                        data={this.state.chartData.data}
                        xScales={this.state.chartData.xScales}
                        yScaleCount={5}
                        legend={[
                            {color: '#F3E9FF', title: this.i18n('sleep_chart_light')},
                            {color: '#6735A5', title: this.i18n('sleep_chart_deep')}
                        ]}
                        indicator={{title: this.i18n('sleepstat_chart_indicator'), data: 0}}
                        >
                    </SleepChart>
                    {/*
                    <SleepChart
                        sleepWeekPoint={this.state.weekSleepDate && this.state.weekSleepDate.data}
                        sleepMonthPoint={this.state.monthSleepDate && this.state.monthSleepDate.data}
                        sleepYearPoint={this.state.yearSleepDate && this.state.yearSleepDate.data}
                        sleepTypes = {this.state.datachange}
                        >
                    </SleepChart>
                    */}
                </View>
                <View style={StylesCommon.common_gap}/>
            </ScrollView>
        )
    }
}
