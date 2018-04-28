import { StyleSheet, PixelRatio,Dimensions } from 'react-native'
export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"#ebebeb",
        marginTop: 64
    },
    sleepChartPageContent:{
        flex:1,
        paddingBottom:10,
    },
    dataSelectWrap:{
        justifyContent:"center",
        paddingTop:10,
        marginBottom:10,
        paddingBottom:0,
        flexDirection:"row"
    },
    dataList:{
        flex:1,
        alignItems:"center",
    },
    detailsStepWrap:{
        alignItems: 'center',
        flexDirection:"row",
        backgroundColor:"#fff",
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
    select_ed:{
        borderBottomWidth: 2,
        borderColor: "#6735A5"
    },
    select_default:{
        color:"#666",
        fontSize:14,
    },
});
