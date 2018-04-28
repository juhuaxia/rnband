'use strict';

import React from 'react';
import {
    StyleSheet, View, Dimensions, Text, PanResponder, Platform
} from 'react-native';
import Svg, { 
    Line, Path, Polygon, Ellipse, Defs, G, Use, Circle, Rect
} from 'react-native-svg';
import { Text as SvgText } from 'react-native-svg';

import IComponent from 'PaiBandRN/src/components/icomponent';
import COMNotice from 'PaiBandRN/src/notice/component';

const {width, height} = Dimensions.get('window');
const {marginLeft, marginRight} = {
    marginLeft: 15,
    marginRight: 15
};

class ChartBar extends IComponent {
    /**
     * props: {
     *     data: [[100, 200, 3000, ...], [], ...]
     *     xScales: ['', {title:'', show:false}, ...]
     *     legend: [{color: 'xxxx', title: ''}, {}, ...]
     *     indicator: {
     *       title: 'xxx', data: 0
     *     },
     *     yScaleCount?: 3
     *     yScaleStyle?: 'dash' 'solid'
     *     markArea?: {range: [100, 200], color: ''}
     *     target?: {data: 299, backgroundColor: 'xxx', color: 'xxxx', strokeColor: 'xxx'}
     *     barWidth?: 10
     * }
    */
    constructor(props) {
        super(props);

        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onPanResponderGrant: this._handlePanResponderGrant.bind(this),
            onPanResponderReject: this._handlePanResponderReject.bind(this),
            onPanResponderStart: this._handlePanResponderStart.bind(this),
            onPanResponderMove: this._handlePanResponderMove.bind(this),
            onPanResponderRelease: this._handlePanResponderEnd.bind(this),
            onPanResponderTerminate: this._handlePanResponderEnd.bind(this)
        });

        this.state = {
            width: props.width || width,
            height: 180,
            xScales: props.xScales || [],
            yScaleWidth: 40,
            xScaleHeight: 30,
            yScaleCount: props.yScaleCount || 5,
            yScaleStyle: props.yScaleStyle || 'dash',
            yScales: [],
            markArea: Object.assign({
                'show': false,
                'color': 'rgba(0, 0, 255, 0.1)'
            }, props.markArea || {}),
            barData: [], //[[{path: 'xxxx', data: 100}, {}, ...], [], []]
            barWidth: 0,
            legend: props.legend || [], //[{color: 'xxxx', title: ''}, {}, ....]
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.1)'
            }, //{show: true, pos: {x, y}, data: {x, y}}
            target: Object.assign({
                'show': false,
                'backgroundColor': 'red',
                'color': '#FFF',
                'strokeColor': '#ef5361'
            }, props.target || {}), //{show: true, data: '', backgroundColor: 'xxx', color: 'xxxx', strokeColor: 'xxx'}
            indicator: {
                title: props.indicator.title || ' ',
                data: props.indicator.data || 0
            },
            nodata: true
        };
    }

    componentDidMount() {
        this._init(this.props);
    }

    componentWillReceiveProps(nextprops) {
        this._clear();
        this._init(nextprops);
    }

    _clear() {
        this.setState({
            indicator: {
                title: this.props.indicator.title || ' ',
                data: this.props.indicator.data || 0
            }
        });
    }

    _init(props) {
        const datas = props.data; //[[100, 200, 3000, ...], [], .....]
        const maxs = datas.map(item => item.reduce((a, b) => a + b, 0));
        let nodata = true;
        if(Math.max(...maxs) > 0) {
            nodata = false;
        }
        const target = {};
        if(props.target) {
            maxs.push(props.target['data']);
        }
        //const mins = datas.map(item => item[0]);
        const max = maxs.length ? Math.max(...maxs) : this.state.yScaleCount * 100;
        //const min = Math.min(mins);
        const showMaxE = (max / this.state.yScaleCount).toExponential().split('e');
        let showMax = Math.ceil(showMaxE[0]) * Math.pow(10, parseInt(showMaxE[1]));
        if(props.target && (showMax * this.state.yScaleCount == props.target['data'])) {
            showMax = Math.ceil(Number(showMaxE[0]) + 1) * Math.pow(10, parseInt(showMaxE[1]));
        }
        const yscales = new Array(this.state.yScaleCount + 1).fill('').map((v, i) => showMax * i);
        //[0, showMax, showMax * 2, showMax * 3];
        const barData = [];
        const barFullWidth = (this.state.width - marginLeft - marginRight - this.state.yScaleWidth) / this.state.xScales.length;
        const barWidth = Math.min(props.barWidth || barFullWidth * 0.5, 10);
        for(let i = 0; i < datas.length; i++) {
            const arr = [];
            const xpos = (marginLeft + this.state.yScaleWidth + barFullWidth * i + (barFullWidth - barWidth) * 0.5);
            let h = 0;
            for(let j = datas[i].length - 1; j > -1; j--) {
                const ypos = this.state.height - this.state.xScaleHeight - (datas[i][j] * (this.state.height - this.state.xScaleHeight) / showMax / this.state.yScaleCount || 0);
                arr.unshift({
                    path: `M${xpos} ${this.state.height - this.state.xScaleHeight - h} L${xpos} ${ypos - h}`,
                    data: datas[i][j]
                });
                h += datas[i][j] * (this.state.height - this.state.xScaleHeight) / showMax / this.state.yScaleCount || 0;
            }
            barData.push(arr);
        }
        if(props.target) {
            target['show'] = true;
            target['pos'] = this.state.height - this.state.xScaleHeight + 2 - props.target['data'] * (this.state.height - this.state.xScaleHeight) / showMax / this.state.yScaleCount;
        }
        const markArea = {};
        if(props.markArea) {
            markArea['show'] = true;
            markArea['rect'] = {
                'y1': this.state.height - this.state.xScaleHeight - props.markArea.range[0] * (this.state.height - this.state.xScaleHeight) / showMax / this.state.yScaleCount,
                'y2': this.state.height - this.state.xScaleHeight - props.markArea.range[1] * (this.state.height - this.state.xScaleHeight) / showMax / this.state.yScaleCount
            };
        }
        this.setState({
            yScales: yscales,
            xScales: props.xScales || this.state.xScales,
            barData: barData,
            barWidth: barWidth,
            markArea: Object.assign(this.state.markArea, markArea),
            target: Object.assign(this.state.target, target),
            nodata: nodata,
            tooltip: Object.assign(this.state.tooltip, { show: false })
        });
    }

    _pathClickHandler(xidx, yidx) {
        const arr = this.state.barData[xidx];
        const pos_arr = arr[0]['path'].match(/[\d\.]+/g);
        const pos_y = Number(pos_arr[pos_arr.length - 1]) - 10;
        const pos_x = Number(pos_arr[pos_arr.length - 2]);
        const data_x_item = this.state.xScales[xidx];
        let data_x = data_x_item;
        if(typeof data_x_item !== 'string') {
            data_x = data_x_item['title'];
        }
        const data_y = this.state.barData[xidx].map(item => item['data']).join('/');
        this.setState({ tooltip: Object.assign(this.state.tooltip, {
            show: true,
            pos: {x: pos_x, y: pos_y},
            data: {x: data_x, y: data_y}
        }) });
    }

    _handlePanResponderGrant(e) {
        //console.log('TouchGrant', e);
    }

    _handlePanResponderReject(e) {
        //console.log('TouchReject', e);
    }

    _handlePanResponderStart(e) {
        //console.log('Start', e.nativeEvent.locationX, e.nativeEvent.locationY);
        const idx = this._getXScaleIndexByLocationX(e.nativeEvent.locationX);
        this._updateIndicatorByXIdx(idx);
    }

    _handlePanResponderMove(e) {
        //console.log('Move', e);
        //for android RN locationX bug
        const lx = Platform.OS === 'ios' ? e.nativeEvent.locationX : (e.nativeEvent.pageX - 12); 
        const idx = this._getXScaleIndexByLocationX(lx);
        this._updateIndicatorByXIdx(idx);
    }

    _handlePanResponderEnd(e) {
        const idx = this._getXScaleIndexByLocationX(e.nativeEvent.locationX);
        this._updateIndicatorByXIdx(idx);
    }

    _getXScaleIndexByLocationX(lx = 0) {
        const barFullWidth = (this.state.width - marginLeft - marginRight - this.state.yScaleWidth) / this.state.xScales.length;
        const idx = parseInt((lx - marginLeft - this.state.yScaleWidth) / barFullWidth);
        if(idx < 0)
            return 0;
        else if(idx > this.state.barData.length - 1)
            return this.state.barData.length - 1;
        return idx;
    }

    _updateIndicatorByXIdx(idx) {
        const arr = this.state.barData[idx];
        if(arr) {
            const pos_arr = arr[0]['path'].match(/[\d\.]+/g);
            const pos_y = Number(pos_arr[pos_arr.length - 1]) - 10;
            const pos_x = Number(pos_arr[pos_arr.length - 2]);
            const data_x_item = this.state.xScales[idx];
            let data_x = data_x_item;
            if(typeof data_x_item !== 'string') {
                data_x = data_x_item['title'];
            }
            const data_y = this.state.barData[idx].map(item => item['data']).join('/');
            //console.log('update indicator', data_y, data_x);
            this.setState({ 
                indicator: {
                    title: data_y,
                    data: data_x
                } 
            });
        }
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
        //y轴刻度值
        const yScale = this.state.yScales.map((item, index) => {
            return (
                <SvgText stroke="none" fontSize="10" fill='#c2c2c2' strokeWidth="1" x={marginLeft} y={this.state.height - this.state.xScaleHeight + 5 - (index) * sh} key={index} style={{fontFamily: 'PingFangSC-Regular'}}>{item == 0 ? ' ' : item}</SvgText>
            );
        });
        const barFullWidth = (this.state.width - marginLeft - marginRight - this.state.yScaleWidth) / this.state.xScales.length;
        //x轴刻度值
        const xScale = this.state.xScales.map((item, index) => {
            const xpos = (marginLeft + this.state.yScaleWidth + barFullWidth * index + (barFullWidth - this.state.barWidth) * 0.5);
            return (
                <SvgText stroke="none" fontSize="10" fill='#c2c2c2' strokeWidth="1" y={this.state.height - this.state.xScaleHeight + 5} x={xpos} textAnchor="middle" style={{fontFamily: 'PingFangSC-Regular'}} key={index}>{typeof item === 'string' ? item : (item['show'] ? item['title'] : ' ')}</SvgText>
            );
        });
        //特殊值区域
        let markArea = null;
        if(this.state.markArea.show) {
            markArea = (
                <Rect x={marginLeft} y={Math.max(...this.state.markArea.rect)} rx="0" ry="0" width={this.state.width - marginLeft - marginRight} height={Math.abs(this.state.markArea.rect.y1 - this.state.markArea.rect.y2)} fill={this.state.markArea.color}/>
            );
        }
        //数值柱
        const bars = this.state.nodata ? null : (() => {
            const arr = [];
            let item;
            for(let i = 0; i < this.state.barData.length; i++) {
                item = this.state.barData[i];
                for(let j = 0; j < item.length; j++) {
                    arr.push((
                        <Path key={i + j / 10} d={item[j].path} fill="none" stroke={this.state.legend[j]['color']} strokeWidth={this.state.barWidth} strokeLinecap="round"/>
                    ));
                }
            }
            return arr;
        })();
        //目标值
        const target = this.state.target.show ? ([
            <Line x1={marginLeft} y1={this.state.target.pos} x2={this.state.width - marginRight} y2={this.state.target.pos} strokeDasharray="5,5" stroke={this.state.target.strokeColor} strokeWidth="1" key={1}/>,
            <Rect x={this.state.width-38} y={this.state.target.pos-10} rx="10" ry="10" width="33" height="20" fill={this.state.target.backgroundColor} key={2}/>,
            <SvgText stroke="none" fontSize="10" fill={this.state.target.color} textAnchor="middle" x={this.state.width-21} y={this.state.target.pos-6} style={{fontFamily: 'PingFangSC-Regular'}} key={3}>{this.i18n('component_chartbar_target')}</SvgText>
        ]) : null;
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
                pos_x = this.state.yScaleWidth;
            }
            if(this.state.tooltip.pos.y < 50) {
                poly = `${this.state.tooltip.pos.x},${this.state.tooltip.pos.y+10} ${this.state.tooltip.pos.x-8},${this.state.tooltip.pos.y+20} ${this.state.tooltip.pos.x+8},${this.state.tooltip.pos.y+20}`;
                pos_y = this.state.tooltip.pos.y+20;
            }
            return [
                <Rect x={pos_x - 40} y={pos_y} rx="5" ry="5" width="80" height="40" fill={this.state.tooltip.backgroundColor} key={1}/>,
                <Polygon points={poly} fill={this.state.tooltip.backgroundColor} stroke="none" strokeWidth="1" key={2}/>,
                <SvgText stroke="none" fontSize="10" fill="rgba(12,12,12,0.5)" x={pos_x} y={pos_y+5} style={{fontFamily: "PingFangSC-Regular"}} textAnchor="middle" key={3}>{this.state.tooltip.data.x}</SvgText>,
                <SvgText stroke="none" fontSize="10" fill="#000" x={pos_x} y={pos_y+20} style={{fontFamily: "PingFangSC-Regular"}} textAnchor="middle" key={4}>{this.state.tooltip.data.y}</SvgText>
            ];
        })() : null;
        return (
            <View style={styles.chartContainer}>
                <View style={styles.indicatorContainer}>
                    <Text style={[styles.indicatorTitle, {fontSize: 24, marginBottom: 5}]}>{this.state.indicator.title}</Text>
                    <Text style={[styles.indicatorTitle, {color: '#c3c3c3'}]}>{this.state.indicator.data}</Text>
                </View>
                <View style={styles.svgContainer}>
                    <Svg height={this.state.height} width={this.state.width} {...this._panResponder.panHandlers}>
                        <Line x1={marginLeft} y1={this.state.height - this.state.xScaleHeight} x2={this.state.width - marginRight} y2={this.state.height - this.state.xScaleHeight} stroke="#ebebeb" strokeWidth="2" />
                        { yScaleLines }
                        { yScale }
                        { xScale }
                        { markArea }
                        { target }
                        { bars || (
                            <SvgText stroke="none" fontSize="20" fill="rgba(12,12,12,0.5)" x={this.state.width*0.5} y={(this.state.height-this.state.xScaleHeight)*0.4} style={{fontFamily: "PingFangSC-Regular"}} textAnchor="middle">{this.i18n('component_chartbar_nodata')}</SvgText>
                        )}
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
    },
    indicatorContainer: {
        flex: 1,
        marginBottom: 10
    },
    indicatorTitle: {
        textAlign: 'center'
    },
    indicatorData: {
        textAlign: 'center'
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

export default ChartBar;
