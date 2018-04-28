import { StyleSheet } from 'react-native'
import Dimensions from 'Dimensions'
let windowWidth = Dimensions.get('window').width;

export default StyleSheet.create({
    growthContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    /**
     * 图表样式
     */
    svgContainer: {
        backgroundColor: 'white',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        marginTop: 12,
    },
    chart: {
        width: windowWidth - 30,
        height: 300,
    },
    chartBottomList: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
        paddingRight: 15,
        marginTop: 10,
    },
    chartBottomText: {
        fontSize: 10,
        color: "#000",
        fontFamily: 'PingFangSC-Regular',
        
    },
    /**
     * 图标身高体重提示
     */
    chartTipsContainer: {
        backgroundColor: '#fff',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        paddingTop: 13,
        paddingBottom: 18,
        paddingLeft: 30,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
    },
    chartTipsDotStyle: {
        height: 8,
        width: 8,
        marginRight: 8,
    },
    chartTipsHeightDot: {
        backgroundColor: '#6AE055',

    },
    chartTipsWeightDot: {
        backgroundColor: '#FCB000',
    },
    chartTipsStyle: {
        fontSize: 10,
        color: '#121212',
        opacity: 0.8,
        marginRight: 20,
        fontFamily: 'PingFangSC-Regular',
    },
    /**
     * 最近记录
     */
    headerStyleContainer: {
        paddingLeft: 20,
        backgroundColor: '#fff',
        marginTop: 12,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    headerStyle: {
        fontSize: 14,
        color: '#646464',
        paddingTop: 20,
        paddingBottom: 10,
        backgroundColor: 'rgba(255,255,255,0)',
    },
});