import { Dimensions, StyleSheet } from 'react-native';

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
    calendar:{
        height:height,
        width:width,
        position:'absolute',
        top:0,
        left:0,
        height:288,
    },
    calendar_mask:{
        flex:1,
        backgroundColor:'#333',
        opacity:.5
    },
    calendar_box:{
        height:288,
        width:width,
        position:'absolute',
        left:0,
        top:-288,
    },
    calendar_foot:{
        height:44,
        width:width,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'#fff'
    },
    calendar_foot_inner:{
        width:width-30,
        borderTopWidth:1,
        borderStyle:'solid',
        borderTopColor:'#ededed',
        flex:1,
        backgroundColor:'#fff',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection:'row',
    },
    calendar_touch:{
        flex:1,
        backgroundColor:'transparent'
    },
    calendar_summaryicon:{
        width:20,
        height:20,
    },
    calendar_summarytext:{
        fontSize:16,
        color:'#8b49f6',
        marginLeft:10
    }
})

export default styles;
