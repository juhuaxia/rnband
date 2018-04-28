import { StyleSheet, PixelRatio,Dimensions } from 'react-native'
let windowWidth = Dimensions.get('window').width;
export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"#ebebeb",
        marginTop: 64
    },
    sportChartPageContent:{
        flex:1,
        paddingBottom: 10,
    },
    sportDataSelectWrap:{
        justifyContent:"center",
        paddingTop: 10,
        marginBottom:10,
        paddingBottom:0,
        flexDirection:"row"
    },
    sportDataList:{
        flex:1,
        alignItems:"center",
    },
    typeSelected: {
        borderBottomWidth: 2,
        borderColor: "#6735A5"
    },
    /**
     * 图表样式
     */
    svgContainer: {
        backgroundColor: 'white',
        paddingTop: 40,
    },
    chart: {
        width: windowWidth,
        height: 300,
    },
    chartBottomList: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginLeft: 45,
        marginRight:15,
        marginTop: 10
    },
    chartBottomText: {
        minWidth: 24,
        textAlign: 'center',
        fontSize: 10,
        color: "#c2c2c2",
        fontFamily: 'PingFangSC-Regular'
    },
    /**
     * 图标走路跑步提示
     */
    chartTipsContainer: {
        backgroundColor: '#fff',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingTop: 13,
        paddingBottom: 18,
    },
    chartTipsDotStyle: {
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    chartTipsWalkDot: {
        height: 10,
        width: 10,
        borderRadius: 50,
        marginRight: 5,
        backgroundColor: '#ff9c0c',
    },
    chartTipsRunDot: {
        height: 10,
        width: 10,
        borderRadius: 5,
        marginRight: 5,
        backgroundColor: '#ffe96c',
    },
    chartTipsStyle: {
        fontSize: 12,
        marginLeft:5,
        marginRight:15,
        color: '#959595',
        fontFamily: 'PingFangSC-Regular',
    },
    detailsStepWrap:{
        alignItems: 'center',
        flexDirection:"row",
        backgroundColor:"#fff"
    },
    detailsStep:{
        flex:1,
        alignItems:"center",
    },
    detailsStepTextUp:{
        fontSize:32,
        color:"#000"
    },
    detailsStepTextDown:{
        fontSize:12,
        color:"#000",
    },
    detailsStepTip:{
        marginLeft:15,
        paddingTop:16,
        paddingBottom:16,
        marginRight:15,
        borderTopWidth:1,
        borderColor:"#e1e1e1",
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"center"
    },
});
