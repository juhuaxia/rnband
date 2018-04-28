import React from 'react';
import {StyleSheet, Text, View, Modal, Image, TouchableOpacity} from 'react-native';
import IComponent from 'PaiBandRN/src/components/icomponent';
import {is, fromJS} from 'immutable';


export default class AsyncTip extends IComponent{
    static propTypes = {
        from: React.PropTypes.string,
        addDirect: React.PropTypes.Function,
        totalFlower: React.PropTypes.number,
    }
    constructor(props){
        super(props);
        this.state = {
          
        }

    }
    componentWillMount() {
        
    }

    componentDidMount(){
        
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState));
    }

    componentWillUpdate(nextProps, nextState) {
        
    }

    componentWillUnmount() {
        
    }
    render() {
        return (
            <Modal
	            animationType = {'fade'}
	            transparent={true}
	            onRequestClose={() => {}}
	            visible={this.props.status}>
	        	{/*背景*/}
	            <View style={styles.coverBack}>
	            {
	            	/*
	            	整体分为同步前和同步后
	            	 */
	            	this.props.type == 'beforeAasync' ? <View style={styles.commonAlertStyle}>
	            		<Image style={styles.flowerImg} source={require('PaiBandRN/res/images/floweralert_icon.png')}></Image>
	            		<Text style={styles.commonTextStyle}>小花数量有变化，快同步给手环</Text>
	            		<View style={styles.buttonContainer}>
	            			<TouchableOpacity onPress={this.props.cancle}>
	            				<Text style={styles.buttonStyle}>稍后再说</Text>
	            			</TouchableOpacity>
	            			<TouchableOpacity onPress={this.props.asyncflower}>
	            				<View style={styles.confirmButtonContainer}>
	            					<Text style={[styles.buttonStyle, styles.confirmButton]}>立即同步</Text>
	            				</View>
	            			</TouchableOpacity>
	            		</View>
	            	</View> : <View style={styles.commonAlertStyle}>
	            		<Text style={styles.flowerNum}>{this.props.flower}</Text>
	            		<Image  style={styles.smallFlower} source={require('PaiBandRN/res/images/flowerreward_icon.png')}></Image>
	            		<Text style={styles.commonTextStyle}>{this.props.flower}朵小花已发送成功了</Text>
	            		<TouchableOpacity onPress={this.props.cancle}>
            				<View style={styles.successButtonContainer}>
            					<Text style={styles.successButton}>OK</Text>
            					
            				</View>
	            		</TouchableOpacity>
	            	</View>
	            	
	            }
	            </View>
	        </Modal>
        );
    }
}


const styles = StyleSheet.create({
	coverBack: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.5)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	commonAlertStyle: {
		minHeight: 240,
		width: 260,
		backgroundColor: '#fff',
		borderRadius: 8,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 30,
	},
	flowerImg: {
		marginBottom: 30,
	},
	commonTextStyle: {
		fontSize: 16,
		marginBottom: 20,

	},
	buttonContainer: {
		flexDirection: 'row',
		
	},
	buttonStyle: {
		height: 40,
		width: 106,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: '#F2253E',
		lineHeight: 40,
		textAlign: 'center',
		fontSize: 16,
		fontFamily: 'PingFangSC-Medium',
		color: '#F2253E',
	},
	confirmButtonContainer: {
		backgroundColor: '#F2253E',
		borderWidth: 1,
		borderColor: '#F2253E',
		borderRadius: 20,
		marginLeft: 16,
	},
	confirmButton: {
		color: '#fff',
		backgroundColor: 'rgba(0,0,0,0)',
	},
	flowerNum: {
		fontFamily: 'PingFangSC-Medium',
		fontSize: 41,
	},
	smallFlower: {
		width: 25,
		height: 25,
		marginBottom: 20,
	},
	successButtonContainer: {
		width: 212,
		height: 40,
		backgroundColor: '#F2253E',
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
	},
	successButton: {
		fontSize: 16,
		fontFamily: 'PingFangSC-Medium',
		color: '#fff',
		backgroundColor: 'rgba(0,0,0,0)',
	},
})

