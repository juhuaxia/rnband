'use strict';

import React from 'react';
import {
    StyleSheet, View, Dimensions, Text, Image
} from 'react-native';
import Svg, { 
    Line, Path, Polygon, Ellipse, Defs, G, Use, Circle, Rect
} from 'react-native-svg';
import { Text as SvgText } from 'react-native-svg';
import { Image as SvgImage } from 'react-native-svg';

import IComponent from 'PaiBandRN/src/components/icomponent';
import COMNotice from 'PaiBandRN/src/notice/component';

const {width, height} = Dimensions.get('window');

class ChartCircle extends IComponent {
    /**
     * props: {
     *     radius: 50,
     *     start: '',
     *     end: ''
     * }
    */
    constructor(props) {
        super(props);

        this.state = {
            radius: props.radius || 100,
            start: props.start || '20:00',
            end: props.end || '08:00'
        };
    }

    componentDidMount() {
        this._init(this.props);
    }

    componentWillReceiveProps(nextprops) {
        this._init(nextprops);
    }

    _init(props) {
        const newState = {};
        props.radius && (newState['radius'] = props.radius);
        props.start && (newState['start'] = props.start);
        props.end && (newState['end'] = props.end);
        this.setState(newState);
    }

    _calcAngleByTime(time) {
        const ts = time.split(':');
        let tn = parseInt(ts[0]) + parseInt(ts[1]) / 60;
        if(tn > 18) {
            return (tn - 24) *  Math.PI / 6;
        }
        tn > 12 && (tn -= 12);
        return tn *  Math.PI / 6;
    }

    render() {
        const r = this.state.radius;
        const ar = r - 5;
        const s_ang = this._calcAngleByTime(this.state.start);
        const sx = (r + ar * Math.sin(s_ang)).toFixed(2);
        const sy = (r - ar * Math.cos(s_ang)).toFixed(2); 
        const rx = this.state.radius - 5;
        const ry = this.state.radius - 5;
        const xAxisRotation = 0;
        const sweepFlag = 1;
        const e_ang = this._calcAngleByTime(this.state.end);
        const largeArcFlag = e_ang - s_ang > Math.PI ? 1 : 0;
        const x = (r + ar * Math.sin(e_ang)).toFixed(2);
        const y = (r - ar * Math.cos(e_ang)).toFixed(2);
        const p = `M ${sx} ${sy} A ${rx} ${ry} ${xAxisRotation} ${largeArcFlag} ${sweepFlag} ${x} ${y}`;
        let scaleP = '';
        for(let i = 1; i < 13; i++) {
            const an = Math.PI * 2 * i / 12;
            const ra1 = r - 15;
            const x1 = (r + ra1 * Math.sin(an)).toFixed(2);
            const y1 = (r - ra1 * Math.cos(an)).toFixed(2);
            const ra2 = r - 20;
            const x2 = (r + ra2 * Math.sin(an)).toFixed(2);
            const y2 = (r - ra2 * Math.cos(an)).toFixed(2);
            scaleP += `M${x1} ${y1} L${x2} ${y2} `;
        }
        return (
            <View style={styles.chartContainer}>
                <View style={styles.svgContainer}>
                    <Svg height={this.state.radius*2} width={this.state.radius*2}>
                        <Circle cx={this.state.radius} cy={this.state.radius} r={this.state.radius} fill="rgba(0,0,0,0.04)"/>
                        <Circle cx={this.state.radius} cy={this.state.radius} r={this.state.radius-10} fill="#FFF"/>
                        <Path d={scaleP} fill="none" stroke="rgba(0,0,0,0.16)" strokeWidth="2" strokeLinecap="round"/>
                        <SvgText 
                            x={(r+ar* Math.sin(Math.PI*4/3)).toFixed(2)}
                            y={(r-ar* Math.cos(Math.PI*4/3)-8).toFixed(2)}
                            fill="rgba(0,0,0,0.16)"
                            textAnchor="middle"
                            >{8}</SvgText>
                        <Path d={p} fill="none" stroke="#6730A8" strokeWidth="10" strokeLinecap="round"/>
                    </Svg>
                </View>
                <Image style={{position:'absolute', left: Number(sx-3), top: Number(sy-3), width: 6, height: 6}} source={require('PaiBandRN/res/images/home_moon_icon.png')}/>
                <Image style={{position:'absolute', left: Number(x-3), top: Number(y-3), width: 6, height: 6}} source={require('PaiBandRN/res/images/home_sun_icon.png')}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    chartContainer: {
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
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    chartLegendDot: {
        width: 10,
        height: 10,
        backgroundColor: '#FFF',
    },
    chartLegendTitle: {
        marginLeft: 10,
        height: 24,
        lineHeight: 24,
        textAlign: 'left',
        color: '#000',
        fontSize: 12
    }
});

export default ChartCircle;
