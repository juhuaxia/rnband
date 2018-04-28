'use strict';

import React from 'react';
import {
    StyleSheet, View, Dimensions, Text
} from 'react-native';
import Svg, { 
    Line, Path, Polygon, Ellipse, Defs, G, Use, Circle, Rect
} from 'react-native-svg';

import IComponent from 'PaiBandRN/src/components/icomponent';
import COMNotice from 'PaiBandRN/src/notice/component';

const {width, height} = Dimensions.get('window');

class ChartCircle extends IComponent {
    /**
     * props: {
     *     radius: 50,
     *     percent: 0.1
     * }
    */
    constructor(props) {
        super(props);

        this.state = {
            radius: props.radius || 100,
            percent: props.percent || 0
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
        if(props.radius) {
            newState['radius'] = props.radius;
        }
        if(props.percent !== undefined) {
            newState['percent'] = props.percent > 1 ? 1 : props.percent;
        }
        this.setState(newState);
    }

    render() {
        const r = this.state.radius;
        const sx = this.state.radius;
        const sy = 5;
        const rx = this.state.radius - 5;
        const ry = this.state.radius - 5;
        const xAxisRotation = 0;
        const largeArcFlag = this.state.percent > 0.5 ? 1 : 0;
        const sweepFlag = 1;
        const ang = this.state.percent * 2 * Math.PI;
        const ar = r - 5;
        const x = ar + ar * Math.sin(ang) + 5;
        const y = ar - ar * Math.cos(ang) + 5;
        const p = `M ${sx} ${sy} A ${rx} ${ry} ${xAxisRotation} ${largeArcFlag} ${sweepFlag} ${x} ${y}`;
        return (
            <View style={styles.chartContainer}>
                <View style={styles.svgContainer}>
                    <Svg height={this.state.radius*2} width={this.state.radius*2}>
                        <Circle cx={this.state.radius} cy={this.state.radius} r={this.state.radius} fill="rgba(0,0,0,0.04)"/>
                        <Circle cx={this.state.radius} cy={this.state.radius} r={this.state.radius-10} fill="#FFF"/>
                        <Path d={p} fill="none" stroke="#6730A8" strokeWidth="10" strokeLinecap="round"/>
                    </Svg>
                </View>
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
