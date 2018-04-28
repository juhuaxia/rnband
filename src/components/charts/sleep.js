'use strict';

import React from 'react';
import {
    StyleSheet, View, Dimensions, Text
} from 'react-native';
import Svg, { 
    Line, Path, Polygon, Ellipse, Defs, G, Use, Circle, Rect
} from 'react-native-svg';
import { Text as SvgText } from 'react-native-svg';

import utils from 'PaiBandRN/src/utils';

import IComponent from 'PaiBandRN/src/components/icomponent';
import COMNotice from 'PaiBandRN/src/notice/component';

const {width, height} = Dimensions.get('window');
const {marginLeft, marginRight} = {
    marginLeft: 15,
    marginRight: 15
};

class ChartSleep extends IComponent {
    /**
     * props: {
     *     data: [{range: ['23:00', '01:00'], data: 0}, {}, ...]
     *     legend: [{color: 'xxxx', title: ''}, {}, ....]
     * }
    */
    constructor(props) {
        super(props);

        this.state = {
            width: props.width || width,
            height: 180,
            xScales: ['8:00PM', {show: false, title: '10:00PM'}, '12:00AM', {show: false, title: '2:00PM'}, '4:00AM', {show: false, title: '6:00PM'}, '8:00AM'],
            yScaleLeftWidth: 20,
            yScaleRightWidth: 20,
            xScaleHeight: 30,
            yScaleCount:  6,
            yScaleStyle: 'dash',
            data: [], //[[{rect: {x1, x2}, data: 100, color}, {}, ...], [], []]
            legend: props.legend || [], //[{color: 'xxxx', title: ''}, {}, ....]
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.1)'
            } //{show: true, pos: {x, y}, data: {x, y}}
        };
    }

    componentDidMount() {
        this._init(this.props);
    }

    componentWillReceiveProps(nextprops) {
        this._init(nextprops);
    }

    _init(props) {
          //data: [{range: ['23:00', '01:00'], data: 0}, {}, ...]
        const datas = [];
        let data;
        for(let i = 0; i < props.data.length; i++) {
            data = props.data[i];
            datas.push({
                range: data.range,
                pos: {
                    x1: this._calcTimePercent(data.range[0]),
                    x2: this._calcTimePercent(data.range[1])
                },
                data: ((this._calcTimeMinutes(data.range[1]) - this._calcTimeMinutes(data.range[0])) / 60).toFixed(1),
                color: this.state.legend[data.data]['color']
            });
        }
        this.setState({
            data: datas,
        });
    }

    //距离20:00的分钟数
    _calcTimeMinutes(time) {
        const time_arr = time.split(':');
        const time_h = parseInt(time_arr[0]);
        const time_m = parseInt(time_arr[1]);
        if(time_h > 12) {
            return ((time_h - 20) * 60 + time_m);
        } else {
            return (240 + time_h * 60 + time_m);
        }
    }

    //占20:00~08:00的时间比
    _calcTimePercent(time) {
        const total_minutes = 720; //晚8点到早8点，共12个小时720分钟
        const time_arr = time.split(':');
        const time_h = parseInt(time_arr[0]);
        const time_m = parseInt(time_arr[1]);
        if(time_h > 12) {
            return ((time_h - 20) * 60 + time_m) / 720;
        } else {
            return (240 + time_h * 60 + time_m) / 720;
        }
    }

    _pathClickHandler(idx) {
        const data = this.state.data[idx];
        const pos_y = 55;
        const pos_x = marginLeft + this.state.yScaleLeftWidth + (this.state.width - marginLeft - marginRight - this.state.yScaleLeftWidth - this.state.yScaleRightWidth) * (data.pos.x1 + data.pos.x2) * 0.5;
        const data_x = utils.formatTime(data.range[0]);
        const data_y = (Math.abs(data.pos.x1 - data.pos.x2) * 12).toFixed(1) + 'hours';
        this.setState({ tooltip: Object.assign(this.state.tooltip, {
            show: true,
            pos: {x: pos_x, y: pos_y},
            data: {x: data_x, y: data_y}
        }) });
    }

    render() {
        const sh = (this.state.height - this.state.xScaleHeight) / this.state.yScaleCount;
        //横向刻长线
        const yScaleLines = new Array(this.state.yScaleCount).fill('').map((item, index) => {
            let line;
            if(this.state.yScaleStyle === 'dash') {
                line = <Line x1={marginLeft} y1={this.state.height - this.state.xScaleHeight + 2 - (index + 1) * sh} x2={this.state.width - marginRight} y2={this.state.height - this.state.xScaleHeight + 2 - (index + 1) * sh} stroke="#ebebeb" strokeWidth="1" strokeDasharray="5,5" key={index}/>
            } else {
                line = <Line x1={marginLeft} y1={this.state.height - this.state.xScaleHeight + 2 - (index + 1) * sh} x2={this.state.width - marginRight} y2={this.state.height - this.state.xScaleHeight + 2 - (index + 1) * sh} stroke="#ebebeb" strokeWidth="1" key={index}/>
            }
            return line;
        });
        const barFullWidth = (this.state.width - marginLeft - marginRight - this.state.yScaleLeftWidth - this.state.yScaleRightWidth) / ((this.state.xScales.length - 1) || 1);
        //x轴刻度值
        const xScale = this.state.xScales.map((item, index) => {
            const xpos = marginLeft + this.state.yScaleLeftWidth + barFullWidth * index;
            return ([
                <SvgText stroke="none" fontSize="10" fill='#c2c2c2' strokeWidth="1" y={this.state.height - this.state.xScaleHeight + 5} x={xpos} textAnchor="middle" style={{fontFamily: 'PingFangSC-Regular'}} key={index}>{typeof item === 'string' ? item : (item['show'] ? item['title'] : ' ')}</SvgText>,
                ((typeof item === 'string' || item['show']) ? <Line x1={xpos} y1={this.state.height - this.state.xScaleHeight} x2={xpos} y2={this.state.height - this.state.xScaleHeight + 5} stroke="#ebebeb" strokeWidth="2"/> : null)
            ]);
        });
        //数值柱
        const bars = (() => {
            const arr = [];
            let item;
            for(let i = 0; i < this.state.data.length; i++) {
                item = this.state.data[i];
                arr.push(
                    <Rect x={marginLeft + this.state.yScaleLeftWidth + (this.state.width - marginLeft - marginRight - this.state.yScaleLeftWidth - this.state.yScaleRightWidth) * item.pos.x1} y="60" rx="0" ry="0" width={(this.state.width - marginLeft - marginRight - this.state.yScaleLeftWidth - this.state.yScaleRightWidth) * (item.pos.x2 - item.pos.x1)} height={this.state.height - this.state.xScaleHeight - 60} fill={item.color} onPress={() => this._pathClickHandler(i)} key={i}/>
                );
            }
            return arr;
        })();
        //图例
        const legend = this.state.legend.map((item, index) => {
            return (
                <View style={styles.chartLegend} key={index}>
                    <View style={[styles.chartLegendDot, {backgroundColor: this.state.legend[index]['color']}]}></View>
                    <Text style={styles.chartLegendTitle}>{this.state.legend[index]['title']}</Text>
                </View>
            );
        });
        for(let i = legend.length; i < 4; i++) {
            legend.push((
                <View style={styles.chartLegend} key={i}>
                    <View style={[styles.chartLegendDot, {backgroundColor: 'transparent'}]}></View>
                    <Text style={styles.chartLegendTitle}>{''}</Text>
                </View>
            ));
        }
        //数值汽泡
        const tooltip = this.state.tooltip.show ? (() => {
            let poly = `${this.state.tooltip.pos.x},${this.state.tooltip.pos.y} ${this.state.tooltip.pos.x-8},${this.state.tooltip.pos.y-10} ${this.state.tooltip.pos.x+8},${this.state.tooltip.pos.y-10}`;
            let pos_x = this.state.tooltip.pos.x;
            let pos_y = this.state.tooltip.pos.y-50;
            if(this.state.tooltip.pos.x > this.state.width - 40) {
                pos_x = this.state.width - 40;
            } else if(this.state.tooltip.pos.x < 40) {
                pos_x = marginLeft + this.state.yScaleLeftWidth;
            }
            if(this.state.tooltip.pos.y < 50) {
                poly = `${this.state.tooltip.pos.x},${this.state.tooltip.pos.y+10} ${this.state.tooltip.pos.x-8},${this.state.tooltip.pos.y+20} ${this.state.tooltip.pos.x+8},${this.state.tooltip.pos.y+20}`;
                pos_y = this.state.tooltip.pos.y+20;
            }
            return [
                <Rect x={pos_x - 40} y={pos_y} rx="5" ry="5" width="80" height="40" fill={this.state.tooltip.backgroundColor} key={1}/>,
                <Polygon points={poly} fill={this.state.tooltip.backgroundColor} stroke="none" strokeWidth="1" key={2}/>,
                <SvgText stroke="none" fontSize="10" fill="rgba(12,12,12,0.5)" x={pos_x} y={pos_y+5} style={{fontFamily: "PingFangSC-Regular"}} textAnchor="middle" key={3}>{this.state.tooltip.data.x}</SvgText>,
                <SvgText stroke="none" fontSize="10" fill="#000" x={pos_x} y={pos_y+20} style={{fontFamily: "PingFangSC-Medium"}} textAnchor="middle" key={4}>{this.state.tooltip.data.y}</SvgText>
            ];
        })() : null;
        return (
            <View style={styles.chartContainer}>
                <View style={styles.svgContainer}>
                    <Svg height={this.state.height} width={this.state.width}>
                        <Line x1="15" y1={this.state.height - this.state.xScaleHeight} x2={this.state.width - 15} y2={this.state.height - this.state.xScaleHeight} stroke="#ebebeb" strokeWidth="2" />
                        { yScaleLines }
                        { xScale }
                        { bars }
                        { tooltip }
                    </Svg>
                </View>
                <View style={styles.chartLegends}>
                    { legend }
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    chartContainer: {
        height: 220
    },
    svgContainer: {
    },
    chartLegends: {
        marginLeft: 30,
        marginRight: 30,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    chartLegend: {
        flex: 0,
        flexDirection: 'row',
        alignItems: 'center'
    },
    chartLegendDot: {
        width: 10,
        height: 10,
        backgroundColor: '#FFF',
    },
    chartLegendTitle: {
        marginLeft: 5,
        marginRight: 10,
        //height: 24,
        //lineHeight: 24,
        textAlign: 'left',
        color: '#000',
        fontSize: 12
    }
});

export default ChartSleep;
