'use strict';

import React, {Component, PropTypes} from 'react';
import {StyleSheet, View, Text, Image, Dimensions, PixelRatio, PanResponder} from 'react-native';
import {is, fromJS} from 'immutable';
class PickerAndroidItem extends Component{

	static propTypes = {
		value: PropTypes.any,
		label: PropTypes.any
	};

	constructor(props, context){
		super(props, context);
	}

	render() {
		return null;
	}

};

export default class PickerAndroid extends Component{

	static Item = PickerAndroidItem;

	static propTypes = {
		//picker's style
		pickerStyle: View.propTypes.style,
		//picker item's style
		itemStyle: Text.propTypes.style,
		//picked value changed then call this function
		onValueChange: PropTypes.func,
		//default to be selected value
		selectedValue: PropTypes.any
	};

	constructor(props, context){
		super(props, context);
		this.didUnMount = false;
		this.state = this._stateFromProps(this.props);
	}

	componentWillReceiveProps(nextProps){
		this.setState(this._stateFromProps(nextProps));
	}

	shouldComponentUpdate(nextProps, nextState, context){
		return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
	}

	_stateFromProps(props){
		let selectedIndex = 0;
		let items = [];
		let pickerStyle = props.pickerStyle;
		let itemStyle = props.itemStyle;
		let onValueChange = props.onValueChange;
		React.Children.forEach(props.children, (child, index) => {
			child.props.value === props.selectedValue && ( selectedIndex = index );
			items.push({value: child.props.value, label: child.props.label});
		});
		this.index = selectedIndex;
		return {
			selectedIndex,
			items,
			pickerStyle,
			itemStyle,
			onValueChange
		};
	}

	_move(dy){
		let index = this.index;
		this.middleHeight = Math.abs(-index * 40 + dy);
		let upMarginTop = (3 - index) * 30 + dy * .75;
		let middleMarginTop = -index * 40 + dy;
		let downMarginTop = (-index - 1) * 30 + dy * .75;
		if (isNaN(upMarginTop)) {
			this.index = this.state.selectedIndex;
			return
		}

		this.up && this.up.setNativeProps({
			style: {
				marginTop: upMarginTop,
			},
		});
		this.middle && this.middle.setNativeProps({
			style: {
				marginTop: middleMarginTop,
			},
		});
		this.down && this.down.setNativeProps({
			style: {
				marginTop: downMarginTop,
			},
		});
	}

	_moveTo(index){
		let _index = this.index;
		let diff = _index - index;
		let marginValue;
		let that = this;
		if(diff && !this.isMoving) {
			marginValue = diff * 40;
			this._move(marginValue);
			this.index = index;
			this._onValueChange();
		}
	}

	moveTo(index){
		this._moveTo(index);
	}

	moveUp(){
		this._moveTo(Math.max(this.state.items.index - 1, 0));
	}

	moveDown() {
		this._moveTo(Math.min(this.index + 1, this.state.items.length - 1));
	}

	_handlePanResponderMove(evt, gestureState){
		//console.log(this.requset)
		if (this.requset) {
			this.index = this.middleHeight % 40 >= 20 ? Math.ceil(this.middleHeight / 40) : Math.floor(this.middleHeight / 40);
			cancelAnimationFrame(this.requset);
			this.requset = null;
		}
		//this.MoveEndRequest && cancelAnimationFrame(this.MoveEndRequest)
		let dy = gestureState.dy;
		if(this.isMoving) {
			return;
		}
		this._judjeStatus(dy)
	}
	_handlePanResponderRelease(evt, gestureState){
		console.log('释放手指')
		if(this.isMoving) {
			return;
		}

		let dy = gestureState.dy;
		let vy = gestureState.vy;
		//this.isMoving = true;
		if (Math.abs(vy*20) > 0.1) {
			this._moveIng(dy, vy*20);
		}else{
			this._endOfMove(dy);
		}
	}

	_moveIng(dy, vy){
		this.requset = requestAnimationFrame(() => {
			dy += vy;
			vy *= 0.95;
			this._judjeStatus(dy);
			this._moveIng(dy, vy);
			if (Math.abs(vy) <= 1) {
				cancelAnimationFrame(this.requset);
				this._endOfMove(dy);
			}
		})
	}
	_judjeStatus(dy){
		// turn down
		if(dy > 0) {
			this._move(dy > this.index * 40 ? this.index * 40 : dy);
		}else{
			this._move(dy < (this.index - this.state.items.length + 1) * 40 ? (this.index - this.state.items.length + 1) * 40 : dy);
		}
	}

	_startOfMove(evt, gestureState){
		return false
	}

	_endOfMove(dy){
		let middleHeight = this.middleHeight;
		let index = middleHeight % 40 >= 20 ? Math.ceil(middleHeight / 40) : Math.floor(middleHeight / 40);
		this.index = index;
		this._move(0);
		this._onValueChange();
		//this.isMoving = false;
		// if (Math.abs(index*40 - middleHeight) <= 1) {
		// 	this.index = index;
		// 	this._move(0);
		// 	this._onValueChange();
		// 	this.isMoving = false;
		// }else{

		// 	let director = middleHeight % 40 >= 20 ? -1 : 1;
		// 	this.MoveEndRequest = requestAnimationFrame(() => {
		// 		dy += director;
		// 		this._move(dy);
		// 		this._endOfMove(dy);
		// 		console.log(index*40 - middleHeight)
		// 		if (Math.abs(index*40 - middleHeight) <= 1) {
		// 			this.index = index;
		// 			cancelAnimationFrame(this.MoveEndRequest);
		// 			this._move(0);
		// 			this._onValueChange();
		// 			this.isMoving = false;
		// 		}
		// 	})
		// }
		
	}

	componentWillMount(){
		this._panResponder = PanResponder.create({
			onStartShouldSetPanResponder: (evt, gestureState) => true,
      		onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
			onMoveShouldSetPanResponder: (evt, gestureState) => true,
			onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
			onPanResponderRelease: this._handlePanResponderRelease.bind(this),
			onPanResponderMove: this._handlePanResponderMove.bind(this)
		});
		this.isMoving = false;
		this.index = this.state.selectedIndex;
	}

	componentWillUnmount(){
		this.didUnMount = true;
		this.requset && cancelAnimationFrame(this.requset);
		//this.MoveEndRequest && cancelAnimationFrame(this.MoveEndRequest);
	}

	_renderItems(items){
		//value was used to watch the change of picker
		//label was used to display 
		let upItems = [], middleItems = [], downItems = [];
		items.forEach((item, index) => {

			upItems[index] = <Text
								key={'up'+index}
								style={[styles.upText, this.state.itemStyle]}
								onPress={() => {
									this._moveTo(index);
								}} >
								{item.label}
							</Text>;

			middleItems[index] = <Text
									key={'mid'+index}
									style={[styles.middleText, this.state.itemStyle]}>{item.label}
								</Text>;

			downItems[index] = <Text
									key={'down'+index}
									style={[styles.downText, this.state.itemStyle]}
									onPress={() => {
										this._moveTo(index);
									}} >
									{item.label}
								</Text>;

		});
		return { upItems, middleItems, downItems, };
	}

	_onValueChange(){
		var curItem = this.state.items[this.index];
		if (curItem instanceof Object && this.state.onValueChange) {
			this.state.onValueChange(curItem.value, this.index);
		}
	}

	render(){
		let index = this.state.selectedIndex;
		let length = this.state.items.length;
		let items = this._renderItems(this.state.items);

		let upViewStyle = {
			marginTop: (3 - index) * 30, 
			height: length * 30, 
		};
		let middleViewStyle = {
			marginTop:  -index * 40, 
		};
		let downViewStyle = {
			marginTop: (-index - 1) * 30, 
			height:  length * 30, 
		};
		
		return (
			//total to be 90*2+40=220 height
			<View style={[styles.container, this.state.pickerStyle]} {...this._panResponder.panHandlers}>

				<View style={styles.up}>
					<View style={[styles.upView, upViewStyle]} ref={(up) => { this.up = up }} >
						{ items.upItems }
					</View>
				</View>

				<View style={styles.middle}>
					<View style={[styles.middleView, middleViewStyle]} ref={(middle) => { this.middle = middle }} >
						{ items.middleItems }
					</View>
				</View>

				<View style={styles.down}>
					<View style={[styles.downView, downViewStyle]} ref={(down) => { this.down = down }} >
						{ items.downItems }
					</View>
				</View>

			</View>
		);
	}

};

let width = Dimensions.get('window').width;
let height = Dimensions.get('window').height;
let ratio = PixelRatio.get();
let styles = StyleSheet.create({

	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		//this is very important
		backgroundColor: null,
		overflow: 'hidden',
	},
	up: {
		height: 90,
		backgroundColor: '#fff',
		overflow: 'hidden',
	},
	upView: {
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	upText: {
		paddingTop: 0,
		height: 30,
		fontSize: 20,
		color: '#000',
		opacity: .5,
		paddingBottom: 0,
		marginTop: 0,
		marginBottom: 0,
	},
	middle: {
		height: 40,
		width: width,
		overflow: 'hidden',
		borderColor: '#aaa',
		borderTopWidth: 1 / PixelRatio.get(),
		borderBottomWidth: 1 / PixelRatio.get(),

	},
	middleView: {
		justifyContent: 'flex-start',
		alignItems: 'center',

	},
	middleText: {
		paddingTop: 0,
		height: 40,
		color: '#000',
		fontSize: 28,
		paddingBottom: 0,
		marginTop: 0,
		marginBottom: 0,
	},
	down: {
		height: 90,
		backgroundColor: '#fff',
		overflow: 'hidden',
	},
	downView: {
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	downText: {
		paddingTop: 0,
		height: 30,
		fontSize: 16,
		color: '#000',
		opacity: .5,
		paddingBottom: 0,
		marginTop: 0,
		marginBottom: 0,
	}
});
