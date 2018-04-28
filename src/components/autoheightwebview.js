'use strict'
import React, { Component } from 'react';
import {WebView} from "react-native";

const script = `
<script>
    window.onload = function() {
        document.title = document.documentElement.scrollHeight;
        window.location.hash = 1;
    };
</script>
`;
const style = `
<style>
body, html {
    font-size: 16px;
    font-family: Helvetica, 'Hiragino Sans GB', 'Microsoft Yahei', '微软雅黑', Arial, sans-serif;
    color: #313131;
    margin: 0;
    padding: 0;
    border: 0;
}
</style>
`;
class AutoHeightWebView extends Component
{
	constructor(props) {
        super(props);

        this.state = {
            Height:0,
            content: props.html || ''
        };
    }
    componentWillReceiveProps(nextprops) {
        this.setState({
            content: nextprops.html || ''
        });
    }
    onNavigationChange(event) {
        if (event.title) {
            const htmlHeight = Number(event.title) //convert to number
            this.setState({Height:htmlHeight});
        }

     }
    render () {
        const html = `
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=0">
                ${style}
            </head>
            <body>
                ${this.state.content}
                ${script}
            </body>
        </html>
        `;
    	return (
            <WebView
                scrollEnabled={false}
                source={{html, baseUrl: 'paiband://webview.content'}} 
                style={{height: this.state.Height, backgroundColor: 'transparent'}}
      			javaScriptEnabled ={true}
                automaticallyAdjustContentInsets={false}
      			onNavigationStateChange={this.onNavigationChange.bind(this)}>
			</WebView>
        );
    }
}

export default AutoHeightWebView;
