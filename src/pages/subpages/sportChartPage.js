import React from 'react';
import { StyleSheet,ScrollView, Image, Text, View,Dimensions,TouchableOpacity } from 'react-native';
import Svg, { Line, Path, Ellipse,Defs,G,Use,Circle,Rect} from 'react-native-svg';
import { Text as SvgText } from 'react-native-svg';

import IComponent from 'PaiBandRN/src/components/icomponent';
import COMNotice from 'PaiBandRN/src/notice/component';
import PSComponent from 'PaiBandRN/src/components/pscomponent';
import PageNotice from 'PaiBandRN/src/notice/page';
import DescriptionBox from 'PaiBandRN/src/components/descriptionBox';
import SportChart from 'PaiBandRN/src/components/charts/bar1';
import StylesCommon from 'PaiBandRN/src/style/common';

import sportService from 'PaiBandRN/src/services/sport';
import styles from 'PaiBandRN/src/style/sportChartPage';

import Utils from 'PaiBandRN/src/utils';

const windowWidth = Dimensions.get('window').width;

export default class SportChartPage extends IComponent {

    constructor(props) {
        super(props);

        this.state = {
            chartData: {
                data: [],
                xScales: ['Mon', 'Tue', 'Wen', 'Thu','Fri','Sat','Sun']
            },
            type:'week',
            distance:0,
            avg_step:0
        };

        const now = new Date();
        this._selectDate = props.data ? props.data.date : [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/');
        this._selectMonth = props.data ? props.data.month : this._selectDate.split('/')[1];
    }

    componentDidMount() {
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
                    this._getYearSportData(year);
                    break;
                case 'month':
                    this._getMonthSportData(year,month);
                    break;
                case 'week':
                    this._getWeekSportData(year,week);
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

    _getWeekSportData(year,week) {
        sportService.getWeekSportData(year,week).then(data => {
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
                datas[parseInt(item['date']) - 1] = [item['stepsDetail']['1'], item['stepsDetail']['2']];
            }
            this.setState({
                chartData: {
                    data: datas,
                    xScales: xScales
                },
                distance: (data.distance/1000).toFixed(2),
                avg_step: data.avg_steps
            });
            // }
            console.log('getWeekSportData', data);
        }).catch(e => {
            console.log('sportService getWeek error', e);
        });
    }

    _getMonthSportData(year,month) {
        sportService.getMonthSportData(year,month).then(data => {
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
                datas[parseInt(date) - 1] = [item['stepsDetail']['1'], item['stepsDetail']['2']];
            }
            this.setState({
                chartData: {
                    data: datas,
                    xScales: xScales
                },
                distance: (data.distance/1000).toFixed(2),
                avg_step: data.avg_steps
            });
            // }
            console.log('getMonthSportData', data);
        }).catch(e => {
            console.log('sportService getMonth error', e);
        });
    }

    _getYearSportData(year) {
        sportService.getYearSportData(year).then(data => {
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
                datas[parseInt(date) - 1] = [item['stepsDetail']['1'], item['stepsDetail']['2']];
            }
            this.setState({
                chartData: {
                    data: datas,
                    xScales: xScales
                },
                distance: (data.distance/1000).toFixed(2),
                avg_step: data.avg_steps
            });
            // }
            console.log('getYearSportData', data);
        }).catch(e => {
            console.log('sportService getYear error', e);
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
                <View style={[StylesCommon.common_card, styles.sportChartPageContent]}>
                    <View style={styles.sportDataSelectWrap}>
                        <View style={styles.sportDataList}>
                            <TouchableOpacity style={[
                                {height: 30, width: 50, alignItems: 'center'},
                                this.state.type === 'week' ? styles.typeSelected : {}
                            ]} onPress={()=>this._seeAnalysis('week')} >
                                <Text style={{lineHeight: 26, fontSize:16, color:'#000'}}>{this.i18n('calendar_week')}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.sportDataList}>
                            <TouchableOpacity style={[
                                {height: 30, width: 50, alignItems: 'center'},
                                this.state.type === 'month' ? styles.typeSelected : {}
                            ]} onPress = {()=>this._seeAnalysis('month')} >
                                <Text style={{lineHeight: 26, fontSize:16, color:'#000'}}>{this.i18n('calendar_month')}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.sportDataList}>
                            <TouchableOpacity style={[
                                {height: 30, width: 50, alignItems: 'center'},
                                this.state.type === 'year' ? styles.typeSelected : {}
                            ]} onPress = {()=>this._seeAnalysis('year')} >
                                <Text style={{lineHeight: 26, fontSize:16, color:'#000'}}>{this.i18n('calendar_year')}</Text>
                            </TouchableOpacity>
                        </View>
                         {/*里程消耗*/}
                    </View>
                    <View style={styles.detailsStepWrap}>
                        <Image style={{marginLeft: 33}} source={require('PaiBandRN/res/images/step_icon.png')}/>
                        <View style={styles.detailsStep}>
                            <Text style={[styles.detailsStepTextDown, {opacity: 0.5}]}>{this.i18n('sportstat_data_distance')}</Text>
                            <View style={{flexDirection: "row", alignItems: "flex-end"}}>
                                <Text style={styles.detailsStepTextUp}>{Number(Utils.km2mi(this.state.distance).toFixed(2))}</Text>
                                <View style={{width: 8}}/>
                                <Text style={styles.detailsStepTextDown}>{this.i18nLang=='en'?'mi':'km'}</Text>
                            </View>
                        </View>
                        <View style={styles.detailsStep}>
                            <Text style={[styles.detailsStepTextDown, {opacity: 0.5}]}>{this.i18n('sportstat_data_average')}</Text>
                            <View style={{flexDirection: "row", alignItems: "flex-end"}}>
                                <Text style={styles.detailsStepTextUp}>{this.state.avg_step}</Text>
                                <View style={{width: 8}}/>
                                <Text style={styles.detailsStepTextDown}>{this.i18n('sportstat_data_unit')}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={StylesCommon.common_gap}/>
                {/*chart*/}
                <View style={[StylesCommon.common_card, {paddingTop: 20, paddingBottom: 20}]}>
                    <SportChart
                        width={windowWidth-24}
                        data={this.state.chartData.data}
                        xScales={this.state.chartData.xScales}
                        yScaleCount={5}
                        //markArea={{range: [100, 300], color: 'rgba(79,176,198,0.1)'}}
                        legend={[{color: '#C2AEDB', title: this.i18n('sport_chart_walk')}, {color: '#6735A5', title: this.i18n('sport_chart_run')}]}
                        indicator={{title: this.i18n('sportstat_chart_indicator'), data: 0}}
                        //target={{data: 100}}
                        >
                    </SportChart>
                </View>
                <View style={StylesCommon.common_gap}/>
            </ScrollView>
        )
    }
}
