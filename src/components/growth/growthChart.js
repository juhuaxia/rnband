import React from 'react';
import {View, Text} from 'react-native';
import Svg, {Circle, G, Line, Path} from 'react-native-svg';
import {Text as SvgText} from 'react-native-svg';
import styles from 'PaiBandRN/src/style/growthChartStyle';
import Dimensions from 'Dimensions';
import IComponent from 'PaiBandRN/src/components/icomponent';
import {is, fromJS} from 'immutable';
const windowWidth = Dimensions.get('window').width - 24;


export default class GrowthChart extends IComponent {
    static propTypes:{
        recordData: React.PropTypes.Array.isRequired,
    }

    lingLength = [1, 2, 3, 4, 5, 6, 7, 8];//折线图的行
    weightTip = ['50', '100', '150', '200'];//折线图单位提示
    heightTip = ['2\'0"', '4\'0"', '6\'0"', '8\'0"'];//折线图单位提示
    chartBottom = [];//折线图底部的提示
    heightPoint = [];//身高圆点
    weightPoint = [];//体重圆点
    heightPosition = '';//身高位置
    weightPosition = '';//体重位置
    weightConvert = this.i18nLang == 'cn' ? 2 : 1*5/4;
    heightConvert = this.i18nLang == 'cn' ? 1 : 2;
    
    initData(){
        const {recordData} = this.props;
        const recordDataLength = recordData.length;
        const stepWidth = recordDataLength == 1 ? null : (windowWidth - 75)/(recordDataLength - 1);
        recordData.forEach((item, index) => {
            let xPosition;
            /*
            只有一条数据，则居中
             */
            if (recordDataLength == 1) {
                xPosition = 40 + (windowWidth - 75)/2;
            }else{
                xPosition = 40 + stepWidth*index;
            }
            this.heightPoint.push([item.growthHeight.split(' ')[0], xPosition]);
            this.weightPoint.push([parseInt(item.growthWeight), xPosition]);
            if (recordDataLength <= 6) {
                this.chartBottom.push(item.growthTime);
            }else{
                switch(index){
                    case 0: 
                        this.chartBottom.push(item.growthTime);
                        break;
                    case parseInt(recordDataLength/4): 
                        this.chartBottom.push(item.growthTime);
                        break;
                    case parseInt(recordDataLength/2):
                        this.chartBottom.push(item.growthTime);
                        break;
                    case recordDataLength - 1 - parseInt(recordDataLength/4): 
                        this.chartBottom.push(item.growthTime);
                        break;
                    case recordDataLength -1:
                        this.chartBottom.push(item.growthTime);
                        break;
                }
            }
        });

        this._getFttoIn = (item) => {
            const splitarr = item.split('\'');
            let inc;
            if(splitarr.length > 1) {
                inc = splitarr[0]*12 + parseInt(splitarr[1].replace('"', ''));
            }
            return inc || 0
        }

        this.heightPoint.forEach((item, index) => {
            //如果没有身高数据则直接跳过
            /*
            英文模式下，身高范围0-100 in 所以在图表中位置为 实际身高乘以 2
            中文模式下，身高范围0-200 cm 所以在图表中位置为 实际身高
             */
            if (Boolean(item[0])) {
                if (this.heightPoint.length == 1) {
                    this.heightPosition += 'M' + item[1] + ' ' + (240 - this._getFttoIn(item[0]) * this.heightConvert) + ' ' + 'L' + item[1] + ' ' + (240 - this._getFttoIn(item[0]) * this.heightConvert);
                }else if (index == 0) {
                    this.heightPosition += 'M' + item[1] + ' ' + (240 - this._getFttoIn(item[0]) * this.heightConvert) + ' ';
                } else {
                    this.heightPosition += 'L' + item[1] + ' ' + (240 - this._getFttoIn(item[0]) * this.heightConvert) + ' ';
                }
            }
        })
        this.weightPoint.forEach((item, index) => {
            //如果没有体重数据则直接跳过
            /*
            英文模式下，体重范围0-200 lbs 所以在图表中位置为 实际体重
            中文模式下，体重范围0-100 kg 所以在图表中位置为 实际体重乘以 2
             */
            if (Boolean(item[0])) {
                if (this.weightPoint.length == 1) {
                    this.weightPosition += 'M' + item[1] + ' ' + (240 - item[0] * this.weightConvert) + ' ' + 'L' + item[1] + ' ' + (240 - item[0] * this.weightConvert);
                }else if (index == 0) {
                    this.weightPosition += 'M' + item[1] + ' ' + (240 - item[0] * this.weightConvert) + ' ';
                } else {
                    this.weightPosition += 'L' + item[1] + ' ' + (240 - item[0] * this.weightConvert) + ' ';
                }
            }
        })
    }
    componentWillMount() {
        this.initData();
        if (this.i18nLang == 'cn') {
            this.heightTip = ['50', '100', '150', '200'];
            this.weightTip = ['25', '50', '75', '100'];
        }else {
            this.heightTip = ['2\'0"', '4\'0"', '6\'0"', '8\'0"'];
            this.weightTip = ['40', '80', '120', '160'];
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState));
    }
    render() {
        console.log(this.props)
        return (
            <View style={{backgroundColor: '#f5f5f5',}}>
                <View style={styles.svgContainer}>
                    <Svg
                        height="240"
                        width={windowWidth-15}
                    >
                        {/*底部横线*/}
                        <Line
                            x1="15"
                            y1="240"
                            x2={windowWidth}
                            y2="240"
                            stroke="#ebebeb"
                            strokeWidth="2"
                        />
                        <SvgText
                            stroke = "none"
                            fontSize = "10"
                            fill='#c2c2c2'
                            strokeWidth="1"
                            x="15"
                            y="18"
                            style={{fontFamily: 'PingFangSC-Regular'}}
                        >{this.i18n('grwoth_chart_ft')}</SvgText>
                        <SvgText
                            stroke = "none"
                            fontSize = "10"
                            fill='#c2c2c2'
                            strokeWidth="1"
                            x={windowWidth - 28}
                            y="18"
                            style={{fontFamily: 'PingFangSC-Regular'}}
                        >{this.i18n('growth_unit_weight')}</SvgText>
                        {
                            //折线图的行
                            this.lingLength.map((item, index) => {
                                return  <Line
                                            x1="15"
                                            y1={240 - (index + 1) * 25}
                                            x2={windowWidth}
                                            y2={240 - (index + 1) * 25}
                                            stroke = "#ebebeb"
                                            strokeWidth={0.5}
                                            strokeDasharray={[3]}
                                            key={index}
                                        />
                            })
                        }
                        {
                            //折线图左侧的提示
                            this.heightTip.map((item, index) => {
                                return  <SvgText
                                        stroke = "none"
                                        fontSize = "10"
                                        fill='#c2c2c2'
                                        strokeWidth="1"
                                        x="15"
                                        y={240 - (index + 1) * 50}
                                        key={index}
                                        style={{fontFamily: 'PingFangSC-Regular'}}
                                    >{item}</SvgText>
                            })
                        }
                        {
                            //折线图右侧的提示
                            this.weightTip.map((item, index) => {
                                let rightDistance;
                                if (parseInt(item) >= 100) {
                                    rightDistance = windowWidth-34;
                                }else{
                                    rightDistance = windowWidth-28;
                                }
                                return  <SvgText
                                        stroke = "none"
                                        fontSize = "10"
                                        fill='#c2c2c2'
                                        strokeWidth="1"
                                        x={rightDistance}
                                        y={240 - (index + 1) * 50}
                                        key={index}
                                        style={{fontFamily: 'PingFangSC-Regular'}}
                                    >{item}</SvgText>
                            })
                        }
                        {/*身高折线图*/}
                        <Path
                            d={this.heightPosition}
                            fill="none"
                            stroke="#6AE055"
                            strokeWidth="2.5"
                        />
                        {/*体重折线图*/}
                        <Path
                            d={this.weightPosition}
                            fill="none"
                            stroke="#FCB000"
                            strokeWidth="2.5"
                        />
                        {
                            //身高圆点
                            this.heightPoint.length == 1 && this.heightPoint.map((item, index) => {
                                console.log('身高圆点', item)
                                if (item[0]) {
                                    return <Circle
                                                cx={item[1]}
                                                cy={(240-this._getFttoIn(item[0]) * this.heightConvert)}
                                                r="4"
                                                stroke = "#fff"
                                                strokeWidth="1"
                                                fill="#6AE055"
                                                key={index}
                                            />
                                }
                            })
                        }
                        {
                            //体重圆点
                            this.weightPoint.length == 1 && this.weightPoint.map((item, index) => {
                                if (item[0]) {
                                    return  <Circle
                                                cx={item[1]}
                                                cy={(240-item[0] * this.weightConvert)}
                                                r="4"
                                                stroke = "#fff"
                                                strokeWidth="1"
                                                fill="#FCB000"
                                                key={index}
                                            />
                                }
                            })
                        }
                    </Svg>
                    <View style={[styles.chartBottomList, {justifyContent: this.chartBottom.length>1?'space-between':'center'}]}>
                        {
                            //底部日期列表
                            this.chartBottom.map((item, index) => {
                                return  <Text key={index} style={styles.chartBottomText}>{item}</Text>
                            })
                        }
                    </View>
                </View>
                <View style={styles.chartTipsContainer}>
                    <View style={[styles.chartTipsHeightDot, styles.chartTipsDotStyle]}></View>
                    <Text style={styles.chartTipsStyle}>{this.i18n('growth_tip_height')}</Text>
                    <View style={[styles.chartTipsWeightDot, styles.chartTipsDotStyle]}></View>
                    <Text style={styles.chartTipsStyle}>{this.i18n('growth_tip_weight')}</Text>
                </View>
                
            </View>
        )
    }
}
