# paiband

> 手环RN版本
> 当前版本v1.3.11 build-20170302v1

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8081
react-native run-ios
react-native run-android

# build for production with minification
npm run build
npm run build-ios
npm run build-android
```
## 版本切换
1. `yarn remove`
2. `yarn install`
3. `react-native upgrade`
4. `react-native link react-native-svg`

参考[react-native-svg文档](https://github.com/react-native-community/react-native-svg)

## 视觉稿

[http://code.putao.io/ui/pt_weidu_for_web.git](http://code.putao.io/ui/pt_weidu_for_web.git)

## 接口文档

[http://code.putao.io/suowei/paiband_doc/src/master](http://code.putao.io/suowei/paiband_doc/src/master)
[http://cc.ptdev.cn/index.php?s=/child&page_id=228](http://cc.ptdev.cn/index.php?s=/child&page_id=228)

## android模拟器调试
按照官方文档android环境搭建(http://facebook.github.io/react-native/releases/0.39/docs/getting-started.html#content)：
1. 安装java sdk(https://www.java.com/en/download/mac_download.jsp)
2. 安装android studio
3. 安装android sdk (**version 23.0.1**)
4. 设置bash环境变量~/.zshrc或者~/.bash_profile等
   export ANDROID_HOME=~/Library/Android/sdk
   export PATH=${PATH}:${ANDROID_HOME}/emulator
   export PATH=${PATH}:${ANDROID_HOME}/tools
   export PATH=${PATH}:${ANDROID_HOME}/platform-tools
5. 启动android模拟器
   emulator -avd Nexus_5X_API_25_x86
6. react-native run-ios
7. android下的debug菜单快捷键为command+m

## 打包
* 运行`npm run build`即可对ios android进行编译打包，生成的文件在目录`dist`下面。
* `dist`目录下面为主版本号对应的目录跟一个`vinfo.json`文件
* 主版本号为`src/config.js`中`version`字段指定.格式固定为`主版本号 build-编译号`
* `vinfo.json`具体可以参考`doc`目录下热更新的文档
* `dist`中主版本号目录下有ios.buildVersion.zip android.buildVersion.zip以及两个json文件，json文件为两个zip的md5值
* ***注意：打包前需要将`src/config`中的`isLocalTest`置为`false`***

## 部署
将打包后的`dist`下的所有文件覆盖到指定的各环境下的静态服务器目录即可
