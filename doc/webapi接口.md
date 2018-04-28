# paiband文档库

#### 一、文档目录

*   [接口](./Paiband)


#### 二、关于该文档的约定（待完善）

###### 1.所有接口必须携带参数device_id

###### 2.api接口域名

接口文档都是以 baseUrl + uri 的形式描述的接口连接。

其中，baseUrl具体如下：

开发环境：

>   国内：http://api-paiband.ptdev.cn/
>   海外：http://api-paiband-en.ptdev.cn/

测试环境：

>   国内：http://api-paiband-test.ptdev.cn/
>   海外：http://api-paiband-en-test.ptdev.cn/

生产环境环境：

>   国内：http://api-paiband.putao.com/
>   海外：http://api-paiband-en.putao.com/ 

###### 3.部分接口请求必须携带接口签名参数sign

sign计算规则如下：

```php
/**
 * @param $data array 所有参数组成的数组
 * @param $secretKey string 秘钥
 * @return string 签名字符串的值
 */
function createSign($data =[], $secretKey){
	ksort($data);
	$sign = md5(http_build_query($data) . $secretKey);
	return $sign;
}
```


**Sign 计算DEMO**


参数字段：

	user_id,competition_id,map_id,score,game_time

例如参数json为：

>```json
{
	"user_id" : 123,
	"competition_id" : 234,
	"map_id"	: 345,
	"score"		: 10,
	"game_time"	: 20,
}
```

按照关键字/Key升序排序后变成：

>```json
{
	"competition_id" : 234,
	"game_time"	: 20,
	"map_id"	: 345,
	"score"		: 10,
	"user_id" : 123,
}
```

转化成 http_query 格式：

	competition_id=234&game_time=20&map_id=345&score=10&user_id=123

拼接secret字串（ 'ToYcEnTeR\_sIgN\-SeCrEtKeY\_8000' ），变成：

	competition_id=234&game_time=20&map_id=345&score=10&user_id=123ToYcEnTeR_sIgN-SeCrEtKeY_8000

对上述字符串进行md5加密，即为sign值，以上述参数为例，计算结果为：

	sign = 16eeaf7ff217551d26c531aae34f50bb

最终提交参数：

>```json
{
	"user_id" : 123,
	"competition_id" : 234,
	"map_id"	: 345,
	"score"		: 10,
	"game_time"	: 20,
	"sign"		: '16eeaf7ff217551d26c531aae34f50bb'
}
```

###### 4.返回值格式及常见返回码意义

结果正确时：

```json
{
    "http_code" : 200,
    "data" : {
        "key" : "value"
    }
}
```

结果错误时：

```json
{
    "http_code" : 10001,
    "msg" : "这句话描述了错误原因"
}
```

常见返回值状态：

|http_code | msg |
|:---- |:---- |
| 200 | 处理成功 |
| 10001 | 必要参数不全 |
| 10002 | 参数指向宿主资源不存在，如修改id=1的记录某字段，数据库不存在id=1的记录 |
| 10003 | 信息不匹配 |
| 30001 | 数据库执行环节保存失败，需重新操作 |
| 30002 | 剩余量不足【递减操作 |
| 30003 | 已保存或新增，重复操作 |
| 50001 | 不可重复操作 |
| 50002 | 验证信息错误/一次性验证重复 |
| 60001 | 无此操作权限 |
| 60002 | 设备未激活（绘本） |
| 80001 | 未传sign参数或device_id参数 |
| 80002 | sign验证失败 |
| 90000 | 【9系列为支付验证相关】未支付 |
| 90001 | 支付验证失败 |
| 90002 | 订单创建失败 |
| 90003 | 转入退款 |
| 90004 | 已关闭（未支付） |
| 90005 | 已撤销（刷卡支付） |
| 90006 | 支付失败，如银行返回失败等 |
| 90201 | 用户支付中 |