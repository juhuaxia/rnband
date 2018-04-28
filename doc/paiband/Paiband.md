# Paiband - 手环接口文档

目录

[1. 获取孩子和设备列表](#api_1)   
[2. 运动监测](#api_2)   
[3. 运动监测周统计](#api_3)   
[4. 运动监测月统计](#api_4)   
[5. 睡眠监测](#api_5)   
[6. 睡眠监测周统计](#api_6)   
[7. 睡眠监测月统计](#api_7)   
[8. 心率监测](#api_8)   

[9. 专家策略](#api_9)  
[10. 阅读预警提示](#api_10)  
[11. 重新申请运动小贴士](#api_11)  
[12. 重新申请营养小贴士](#api_12)   

[13. 运动目标设定值](#api_13)   
[14. 愿景设定](#api_14)      
[15. 运动目标设定](#api_15)   
[16. 时钟设定](#api_16)   
[17. 添加闹钟](#api_17)   
[18. 修改闹钟](#api_18)   
[19. 删除闹钟](#api_19)   


[20. 成绩单-公共成绩](#api_20)   
[21. 成绩单-成就列表](#api_21)   
[21.1. 成绩单-成就列表-领取每日成就](#api_21.1)   
[21.2. 成绩单-成就列表-领取长期成就](#api_21.2)   
[22. 成绩单-总星星数排行榜](#api_22)      

[23. 定时心率列表](#api_23)   
[24. 定时心率时钟设定](#api_24)   
[25. 添加心率时钟](#api_25)   
[26. 修改心率时钟](#api_26)   
[27. 删除心率时钟](#api_27)

[28. 应用版本记录](#api_28)

[29. 应用管理](#api_29)

[30. 手环解除绑定](#api_30)

[31. 手环版本更新回调](#api_31)

[32.每日睡眠数据](#api_32)   
[33.孩子运动睡眠数据汇总](#api_33)  

[34.获取升级软件包](#api_34) 

[35. 获得抬腕亮屏设置值](#api_35)   
[36. 抬腕亮屏设置](#api_36)  

[37. 获得孩子当前小红花数据](#api_37)   
[38. 奖励/兑换小红花](#api_38)   
[39. 小红花奖励/兑换记录列表](#api_39)  

[40. 帮助中心 - 使用说明](#api_40)  

[41. 恢复出厂设置，获取今天最后一条运动记录](#api_41)  
[42. 指定年月，获取有运动记录的日期](#api_42)  
[43. 运动监测年统计](#api_43)   
[44. 指定年月，获取有睡眠记录的日期](#api_44)   
[45. 睡眠监测年统计](#api_45)   

```
说明：接口需要家长帐号uid，token，appid(纬度的appid), 以及除接口1以外需要孩子帐号cid参数
```

<span id="api_1">1.获取孩子和设备列表</span>

URL

>   baseUrl + '/paiband/paiband/childrenDevice'

参数

> |参数|是否必选|类型|说明|
|:-----   |:-------|:-----|-----|
|uid      |Y       |int   |家长帐号|
|token    |Y       |string   |家长帐号Token|

返回值

>```json
{
    "http_code": 200,
    "data":
    [
        "devices":
        [
            {
                "cid":123,
                "device_id":"devcccc",
                "nickname":"haizi002",
                "avatar":"http://gamecenter.file.putaocdn.com/file/46109f04cfbea73c4bbf8fbd73c77b04cfc581c9.png",
                "gender":1,   // 性别 1男 2 女
                "birthday":"2013-01-28"  // 生日
            },
            {
                "cid":123,
                "device_id":"devcccc",
                "nickname":"haizi003",
                "avatar":"http://gamecenter.file.putaocdn.com/file/46109f04cfbea73c4bbf8fbd73c77b04cfc581c9.png",
                "gender":1,
                "birthday":"2013-01-28"
            },
            ...
        ]
    ]
}
```

<span id="api_2">2.运动监测</span>

URL

>   baseUrl + '/paiband/motion/index'

参数

> |参数|是否必选|类型|说明|
|:-----   |:-------|:-----|-----|
|date    |N       |string   |日期格式yyyy-mm-dd,默认为当前日期|

返回值

>```json
{
    "http_code": 200,
    "data":
    {
        "today":
        {
            "calorie":1230, //消耗的卡路里
            "distance":10002,  //距离，单位米
            "steps": 12333,   //步数
            "target_steps": 10000, //目标步数
            "target_complete": 100 //目标完成度,百分比
        },
        "data":
        [
            {
                "hour": "07",
                "steps": 1000,
                'top': 1  //最高时段
            },
            {
                "hour": "07",
                "steps": 800,
                'top': 2  //第二高时段
            },
            {
                "hour": "07",
                "steps": 100
            },
            {
                "hour": "07",
                "steps": 100
            },
            ...
        ],
        "today_summary": 今日数据汇总
        {
            "active_tips":"你的孩子在X点和X点最为活跃，运动量特别大。", //活跃提示
            "addition_tips":"附加专家提示"
        }，
        "last_update_text": "2小时前更新" //更新时间 - 1.3.10
    }
}
```

<span id="api_3">3.运动监测周统计</span>

URL

>   baseUrl + '/paiband/motion/week'

参数

> |参数|是否必选|类型|说明|
|:-----   |:-------|:-----|-----|
|~~week_end~~ |~~N~~  |~~int~~     |~~该周的结束时间，默认是当前周~~|
|year|N|int|年份，默认为当前日期计算出的年份|
|week|N|int|一年当中的第几周，默认为当前日期计算出的周数|

```
week_end参数说明:
    如当前查看的周数据是20160727-20160802，则查看往前一周的week_end参数则为20160727(这天不包括)
```

返回值

>```json
{
    "http_code": 200,
    "data":
    {
        "data": //周数据，绘制表格用
        [
            {
                "date": "3",  //表示周几
                "steps": 100000,
                "stepsDetail": {
                  "1": 100000, //步行步数
                  "2": 0, //跑步步数
                }
            },
            {
                "date": "7", //表示周日
                "steps": 100000,
                "stepsDetail": {
                  "1": 100000,
                  "2": 0,
                }
            },
            ...
        ],
        "target_steps": 10000, //目标步数
        "summary": //周汇总
        {
            "active_tips":"你的孩子在X点和X点最为活跃，运动量特别大。", //活跃提示
            "addition_tips":"附加专家提示"
        },
        "last_update_text": "3月前更新"
    }
}
```

<span id="api_4">4.运动监测月统计</span>

URL

>   baseUrl + '/paiband/motion/month'

参数

> |参数|是否必选|类型|说明|
|:-----|:-------|:-----|-----|
|~~month_end~~ |~~N~~  |~~int~~     |~~默认当前月,详见运动周参数说明~~|
|year|N|int|年份，默认为当前年份|
|month|N|int|月份，默认为当前月份|

返回值

>```json
{
    "http_code": 200,
    "data":
    {
        "data": //月数据，绘制表格用
        [
            {
                "date": "2016-07-07",
                "steps": 100000,
                "stepsDetail": {
                  "1": 100000, //步行步数
                  "2": 0, //跑步步数
                }
            },
            {
                "date": "2016-07-08",
                "steps": 100000,
                "stepsDetail": {
                  "1": 100000, //步行步数
                  "2": 0, //跑步步数
                }
            },
            ...
        ],
        "target_steps": 10000, //目标步数
        "summary": //月汇总
        {
            "active_tips":"你的孩子在X点和X点最为活跃，运动量特别大。", //活跃提示
            "addition_tips":"附加专家提示"
        },
        "last_update_text": "3月前更新"
    }
}
```

<span id="api_5">5.睡眠监测</span>

URL

>   baseUrl + '/paiband/sleeping/index'

参数

> |参数|是否必选|类型|说明|
|:-----   |:-------|:-----|-----|
|date    |N       |string   |日期格式yyyy-mm-dd,默认为当前日期|

返回值

>```json
{
    "http_code": 200,
    "data":
    {
        "today":
        {
            "sleep_minutes":1000, //睡眠分钟数
            "deep_sleep_time"：1000,  //深度睡眠分钟数
            "awake_count":3,  //醒来次数
            "target_sleep_time": 480,  //目标睡眠分钟数
            "target_complete": 50%,   //完成目标百分比
            "sleep_quality": "睡的一般",   //睡眠质量 - 1.3.10  
            "sleep_start_time":"20:00", //开始睡眠时间
            "sleep_end_time":"08:00" //结束睡眠时间
        },
        "data":
        [
            {
                "start": "12:01",
                "end": "12:50",
                "status":1 //状态 0：深睡 1：浅睡 2：醒着
            },
            {
                "start": "12:01",
                "end": "12:50",
                "status":1
            },
            {
                "start": "12:01",
                "end": "12:50",
                "status":1
            },
            ...
        ],
        "today_summary": 今日数据汇总
        {
            "active_tips":"你的孩子在X点和X点最为活跃，运动量特别大。",
            "addition_tips":"附加专家提示"
        }，
        "last_update_text": "2小时前更新" //更新时间 - 1.3.10
    }
}
```

<span id="api_6">6.睡眠监测周统计</span>

URL

>   baseUrl + '/paiband/sleeping/week'

参数

> |参数|是否必选|类型|说明|
|:-----   |:-------|:-----|-----|
|year |N  |int     |年份，默认当年|
|week |N  |int     |第几周，默认当前周|

返回值

>```json
{
    "http_code": 200,
    "data":
    {
        "target_minutes": 1000, //每日睡眠目标数
        "data": //周数据，绘制表格用
        [
            {
                "date": 4, //表示星期几
                "sleep_minutes": 100000, //睡眠分钟数
                "sleepDetail": [
                    151, //深度睡眠分钟数
                    377 //浅度睡眠分钟数
                ]
            },
            {
                "date": 7, //表示星期几
                "sleep_minutes": 100000, //书面分钟数
                "sleepDetail": [
                    151, //深度睡眠分钟数
                    377 //浅度睡眠分钟数
                ]
            },
            ...
        ],
        "target_sleep_time": 480,  //目标睡眠分钟数
        "summary": //周汇总
        {
            "active_tips":"你的孩子在X点和X点最为活跃，运动量特别大。",
            "addition_tips":"附加专家提示"
        }
    }
}
```

<span id="api_7">7.睡眠监测月统计</span>

URL

>   baseUrl + '/paiband/sleeping/month'

参数

> |参数|是否必选|类型|说明|
|:-----   |:-------|:-----|-----|
|year |N  |int     |年份，默认当年|
|month |N  |int     |月份，默认当前月|

返回值

>```json
{
    "http_code": 200,
    "data":
    {
        "target_minutes": 1000, //每日睡眠目标数
        "data": //月数据，绘制表格用
        [
            {
                "date": "2016-07-07",
                "sleep_minutes": 100000, //睡眠分钟数
                "sleepDetail": [
                    151, //深度睡眠分钟数
                    377 //浅度睡眠分钟数
                ]
            },
            {
                "date": "2016-07-08",
                "sleep_minutes": 100000, //书面分钟数
                "sleepDetail": [
                    151, //深度睡眠分钟数
                    377 //浅度睡眠分钟数
                ]
            },
            ...
        ],
        target_sleep_time": 480,  //目标睡眠分钟数
        "summary": //月汇总
        {
            "active_tips":"你的孩子在X点和X点最为活跃，运动量特别大。",
            "addition_tips":"附加专家提示"
        }
    }
}
```

<span id="api_8">8.心率监测</span>

URL

>   baseUrl + '/paiband/heart/index'

参数

> |参数|是否必选|类型|说明|
|:-----   |:-------|:-----|-----|

返回值

>```json
{
    "http_code": 200,
    "data":
    {
        "today":
        {
            "current_rate":123,   //当前心率
            "percent":60,     //百分比
            "light_motion_minutes":80,       //轻度运动分钟数
            "middle_motion_minutes":160,      //中度运动分钟数
            "severe_motion_time":160,      //重度运动分钟数
            "data":
            [
                {
                    "time":"12:12",  //时间点
                    "rate":80,
                },
                {
                    "time":"16:18",  //时间点
                    "rate":80,
                },
                {
                    "time":"20:20",  //时间点
                    "rate":80,
                },
                ...
            ]
        },
        "today_summary": 今日数据汇总
        {
            "active_tips":"你的孩子在X点和X点最为活跃，运动量特别大。",
            "addition_tips":"附加专家提示",
        }
    }
}
```

<span id="api_9">9.专家策略</span>

URL

>   baseUrl + '/paiband/strategy/index'

参数

> |参数|是否必选|类型|说明|
|:-----   |:-------|:-----|-----|

返回值

>```json
{
    "http_code": 200,
    "data":
    {
        /************调用基础服务接口***************/
        "child": //孩子信息
        {
            "name":"name",
            "age":6,
            "stature":123.9,  //身高，单位厘米
            "weight":"21.2kg",    //同上
            "bmi":20
        },
        /*************************************/
        "motion_index": 今日活力指数
        {
            "today_steps":10000,
            "reference_steps":10000 //参考均值
        }
        "tips":
        {
            "warning_tips": //预警提示，只有在未读状态下显示
            {
                "tips":"预警内容",
                "staus":1 //阅读状态，0：已读，1：未读
            },
            pabulum_tips": {
                "expert_name": "王晨老师",
                "expert_avatar": "",
                "outline": "对于4岁的孩子来说，孩子的身高超过同龄人群，但体型偏胖，保证均衡营养，限制垃圾食品，保证每日优质蛋白及富含钙、维生素D食物的摄入，增加体力活动，多进行户外运动呦！",
                "tips": "【如何适当增加热量摄入】每餐比平时吃一点。"

            },
            "motion_tips": {
                "expert_name": "孙雯老师",
                "expert_avatar": "",
                "outline": "这个阶段孩子的身体柔韧性很好，骨骼肌肉开始慢慢生长，神经学习的能力随着年龄的增长增加。但也非常脆弱，身体协调能力不足，眼和手或眼和脚对协调性尚未发展起来。爱跑、爱跳。运动技巧很生疏，不会控制节奏。\n心理上来说，专注时间短，非常容易分心。缺乏安全感，喜欢依赖大人和大的孩子。\n这时的绝大多数孩子没有集体的概念，以自我为中心；喜欢不停的动，不知疲倦。\n还没产生性别意识；对统一行动和纪律缺乏自制力，但模仿能力很强。",
                "tips": "每天适量活动一小时，养成良好的运动习惯，受益终身。"
            }
        },
        "recommend":  //专家推荐(数据结构待定，可完整HTML等)
        {
            ”aim_at": "偏高、偏胖",
            "strategy_choice": [
                "优化选择",
                "活力运动"
            ],
            "pabulum_choice":
            [
                {
                    "title": "优化选择",
                    "content": "(1) 【该年龄段均衡营养策略】\n在均衡营养的原则下：\n(2)在原有膳食的基础上，适当减少食物的摄入量\n(3)适当减少主食的摄入总量，增加优质蛋白的摄入总量\n(4)不吃高脂食物、垃圾食物（尤其是避免摄入过多食用糖，如全糖饮料、各类糕点等）\n(5)低盐\n(6)增加高钙食物的摄入、增加富含纤维素食物的摄入\n(7)保证丰富的早餐，减少晚餐的摄入、晚餐后不吃零食\n(8)细嚼慢咽"
                },
                {
                    "title": "均衡营养",
                    "content": "(1)多样食物、合理搭配 \n(2)专门烹调、易于消化\n          --食物要专门制作\n          --烹调成易于消化的类型\n          --随着年龄增长逐渐增加食物的种类和数量\n(3)合理的膳食制度：以“一日三餐两点”为宜，每餐用餐时间<30分钟\n(4)培养健康的饮食习惯：养成不偏食、不挑食、少零食、细嚼慢咽、不暴饮暴食、口味清淡的健康饮食习惯\n(5)每日供应至少300毫升牛奶，也不宜超过600毫升/天，摄入过多影响铁的吸收\n(6)无骨鱼或禽、瘦肉100-125克；每天1个鸡蛋\n(8)谷类食物200-250克；大豆及其制品15-20克\n(9)蔬菜  150-200克；水果  50-100克\n(10)每周安排一次富含碘、锌的海产品；每周安排一次富含铁和维生素A的猪肝和富含铁的猪血等食物\n(11)饮用足够的水\n(12)植物油：15克/天；食糖：少于15克蔗糖/天；食盐：2-3克/天"
                }
            ],
            "daily_cookbook": {
                "forbidden_food":
                [
                    {
                        "name": "五花肉",
                        "category": "高脂肪食物",
                        "content": "59克",
                        "calorie": 568,
                        "icon":"",
                        "target": "高脂肪"
                    },
                    {
                        "name": "炸薯条",
                        "category": "垃圾食品食物",
                        "content": "",
                        "calorie": 298,
                        "icon":"",
                        "target": "高脂肪"
                    }
                ],
                "recommend_food":
                [
                    {
                        "name": "冬寒菜",
                        "stars": 1,
                        "category": "高维生素A食物",
                        "content": "1158微克",
                        "calorie": 30,
                        "icon":""
                    },
                    {
                        "name": "草莓",
                        "stars": 1,
                        "category": "高维生素C食物",
                        "content": "47毫克",
                        "calorie": 30,
                        "icon":""
                    }
                ]
            },
            "motion_choice":
            {
                "title": "活力运动",
                "content": "1、适合个体项目，趣味性为主（小朋友注意力时间短，最多保持15秒，所以乐趣很重要），游戏为主，而且要保持多样性。比如：攀岩、小自行车、轮滑、游泳、空手道、跆拳道、武术、跳舞、体操等等。\n2、和其他孩子一起玩耍，家长的参与和互动很重要。\n3、经常变换运动的方式，避免一个方式时间过长。而且多鼓励，表扬，让孩子觉得自豪，兴趣就更大。\n4、家长主动带孩子一起运动，并给予一定的目标，让孩子去完成。少干预少指责，多鼓励多表扬，坚持时间越长越有效果。"
            },
            "daily_motion":
            [
                {
                    "name": "房子打扫",
                    "category": "静止拉伸",
                    "calorie": 1.812,
                    "example": ""
                },
                {
                    "name": "足球",
                    "category": "静止拉伸",
                    "calorie": 3.5636,
                    "example": ""
                }
            ]
        }
    }
}
```

<span id="api_10">10.阅读预警提示</span>

URL

>   baseUrl + '/paiband/strategy/readWarningTips'

参数

> |参数|是否必选|类型|说明|
|:-----   |:-------|:-----|-----|


返回值

>```json
{
    "http_code": 200,
    "data": true
}
```

<span id="api_11">11.重新申请运动小贴士</span>

URL

>   baseUrl + '/paiband/strategy/renewMotionTips'

参数

> |参数|是否必选|类型|说明|
|:-----   |:-------|:-----|-----|


返回值

>```json
{
    "http_code": 200,
    "data":
    {
        "tips": "xxxxxx"
    }
}
```

<span id="api_12">12.重新申请营养小贴士</span>

URL

>   baseUrl + '/paiband/strategy/renewPabulumTips'

参数

> |参数|是否必选|类型|说明|
|:-----   |:-------|:-----|-----|


返回值

>```json
{
    "http_code": 200,
    "data":
    {
        "tips": "xxxxxx"
    }
}
```

<span id="api_13">13.目标设定</span>

URL

>   baseUrl + '/paiband/child/settings'

参数

> |参数|是否必选|类型|说明|
|:-----   |:-------|:-----|-----|


返回值

>```json
{
    "http_code": 200,
    "data":
    {
        "growing_expect":
        {
            "special_tips":["xxx", "xxx"],
            "expect":
            [
                {
                    "content":"xxx",
                    "status":1    //状态 1：已选 0：未选
                },
                {
                    "content":"xxx",
                    "status":1    //状态
                },
                {
                    "content":"xxx",
                    "status":1    //状态
                },
                ...
            ],
        },
        "targets":  //目标设定
        {
            "steps":
            {
                "reference":10000, //参考值
                "self": 10000,     //自己设定值
            },
            "sleeping":
            {
                "reference":10000, //睡眠时间，分钟数
                "self": 10000,     //自己设定值
            }
        },
        consume_food": {
            "consumption": "7.1块",
            "category": "鸡胸肉"
        }
    }
}
```

<span id="api_14">14.愿景设定</span>

URL

>   baseUrl + '/paiband/child/expectSetting'

参数

> |参数|是否必选|类型|说明|
|:-----   |:-------|:-----|-----|
|expect_id|N       |int   |愿景ID|


返回值

>```json
{
    "http_code": 200,
    "data": true
}
```

<span id="api_15">15.目标设定</span>

URL

>   baseUrl + '/paiband/child/targetSetting'

参数

> |参数|是否必选|类型|说明|
|:-----   |:-------|:-----|-----|
|steps    |N       |int   |目标步数|
|sleeping |N       |int   |睡眠目标，分钟|

返回值

>```json
{
    "http_code": 200,
    "data": true
}
```

<span id="api_16">16.时钟设定</span>

URL

>   baseUrl + '/paiband/clock/settings'

参数

> |参数|是否必选|类型|说明|
|:-----   |:-------|:-----|-----|


返回值

>```json
{
    "http_code": 200,
    "data":
    {
        "max_clock_count":8, //最大闹钟数量
        "list":
        [
            {
                "clock_id": 1,
                "category": 1,  //类型 1：起床 2：学习 3：运动 4：睡觉 5：其他
                "time": "07:30",
                "repeat": "00000001", //同闹钟协议
                "is_sync":1     //是否同步到手环 1：同步 0:未同步
            },      
            ...
        ]
    }
}
```

<span id="api_17">17.添加闹钟</span>

URL

>   baseUrl + '/paiband/clock/add'

参数

> |参数|是否必选|类型|说明|
|:-----   |:-------|:-----|-----|
|cycle      |Y       |int   |周期，1：工作日 2：周末 3:每天|
|category   |Y       |int   |类型 1：起床 2：学习 3：运动 4：睡觉 5：其他|
|time  |Y   |string   |闹钟时间|
|repeat  |Y   |string   |同协议二进制|
|is_sync  |Y   |int   |是否同步到手环 1：同步 0:未同步|

返回值

>```json
{
    "http_code": 200,
    "data":
    {
        "clock_id":1
    }
}
```


<span id="api_18">18.修改闹钟</span>

URL

>   baseUrl + '/paiband/clock/modify'

参数

> |参数|是否必选|类型|说明|
|:-----   |:-------|:-----|-----|
|clock_id  |Y   |int   |闹钟ID|
|cycle      |Y       |int   |周期，1：工作日 2：周末 3:每天|
|category   |Y       |int   |类型 1：起床 2：学习 3：运动 4：睡觉 5：其他|
|time  |Y   |string   |闹钟时间|
|repeat  |Y   |string   |同协议二进制|
|is_sync  |Y   |int   |是否同步到手环 1：同步 0:未同步|

返回值

>```json
{
    "http_code": 200,
    "data": true
}
```

<span id="api_19">19.删除闹钟</span>

URL

>   baseUrl + '/paiband/clock/delete'

参数

> |参数|是否必选|类型|说明|
|:-----   |:-------|:-----|-----|
|clock_id  |Y   |int   |闹钟ID|

返回值

>```json
{
    "http_code": 200,
    "data": true
}
```



<span id="api_20">20.成绩单-公共成绩</span>

URL

>   baseUrl + '/paiband/achievement/common'

参数

> |参数|是否必选|类型|说明|
|:-----   |:-------|:-----|-----|


返回值

>```json
{
    "http_code": 200,
    "data":
    {
        "common_level":
        {
            "level": 99, //手环星级
            "next_level_require": 100,  //下一等级升级所需星星数
            "next_level_already_has":70, //下一等级升级已获得星星数
            "total_stars": 1000,  //总星星数
            "today_stars":75    // 今日获得
        }
    }
}
```

<span id="api_21">21.成绩单-成就列表</span>

URL

>   baseUrl + '/paiband/achievement/list'

参数

> |参数|是否必选|类型|说明|
|:-----   |:-------|:-----|-----|
|type     |Y       |string|成就类型，today：今日成就， forever：长期成就|

返回值

>```json
{
    "http_code": 200,
    "data":
    {
        "today_list":
        [
            {
                "achieve_id": 6,
                "title": "酷爱运动小达人",
                "content": "轻、中、重度运动统计达到60分钟",
                "current_value": 0,
                "require_value": 60,
                "status": 1 //成就状态，1:未完成 2:完成未领取 3:完成已领取
            },
            ...
        ]
        "long_term_list":
        [
            {
                "achieve_id": 1,
                "title": "保持活力生活(1)",
                "content": "活力指数在80%以上的天数达到46天",
                "current_value": 46,
                "require_value": 5,
                "section": 1,
                "status": 2
            }，
        ]
    }
}
```

<span id="api_21.1">21.1.成绩单-成就列表-领取每日成就</span>

URL

>   baseUrl + '/paiband/achievement/rewardToday'

参数

> |参数|是否必选|类型|说明|
|:-----   |:-------|:-----|-----|
|achieve_id   |Y   |int|成就ID|

返回值

>```json
{
    "http_code": 200,
    "data":
    {
        "get_stars":1, //获得的星星数
        "level":1,     //当前等级
    }
}
```

<span id="api_21.2">21.2.成绩单-成就列表-领取长期成就</span>

URL

>   baseUrl + '/paiband/achievement/rewardLongTerm'

参数

> |参数|是否必选|类型|说明|
|:-----   |:-------|:-----|-----|
|achieve_id   |Y   |int|成就ID|
|section      |Y   |int|阶段|

返回值

>```json
{
    "http_code": 200,
    "data":
    {
        "get_stars":1, //获得的星星数
        "level":1,     //当前等级
    }
}
```

<span id="api_22">22.成绩单-总星星数排行榜</span>

URL

>   baseUrl + '/paiband/achievement/rank'

参数

> |参数|是否必选|类型|说明|
|:-----   |:-------|:-----|-----|
|rank     |Y       |int   |排名，从该排名往后或者往前加载列表，为负数则往前加载，为正则往后加载|

返回值

>```json
{
    "http_code": 200,
    "data":
    {
        "self":
        {
            "rank": 10,   //自己排名
            "child_name": "孩子昵称",
            "stars": 1000 //总星星数
        }
        "ranks":
        [
            {
                "rank": 1,  //排名
                "child_name": "孩子昵称",
                "stars":1000  //总星星数
            },
            {
                "rank": 2,  //排名
                "child_name": "孩子昵称",
                "stars":900  //总星星数
            },
            ...
        ],
        "overstep":99.1 //超越全国xx%的孩子 - 若该值小于 20，将不显示此类描述 -- 超越全国xx%的小孩，需要H5做判断！
    }
}
```

<span id="api_23">23.定时心率列表</span>

URL

>   baseUrl + '/paiband/timer/heartLog'

参数

> |参数|是否必选|类型|说明|
|:-----   |:-------|:-----|-----|

返回值

>```json
{
    "http_code": 200,
    "data":
    {
        "list":
        [
            {
                "time": "2016-08-18 10:31:23", //测试时间
                "rate": "99",//心率
                "status": 3, //3:定时心率；4：自测心率
                "utime": 1474080949 //time字段对应的时间戳
            },
            {
                "time": "2016-08-17 09:33:11", //测试时间
                "rate": "90",//心率
                "status": 4, //3:定时心率；4：自测心率
                "utime": 1474080949 //time字段对应的时间戳
            },
            ...
        ]
    }
}
```

<span id="api_24">24.定时心率时钟设定</span>

URL

>   baseUrl + '/paiband/timer/settings'

参数

> |参数|是否必选|类型|说明|
|:-----   |:-------|:-----|-----|


返回值

>```json
{
    "http_code": 200,
    "data":
    {
        "max_clock_count":4, //最大时钟数量
        "list":
        [
            {
                "clock_id": 1,
                "time": "07:30"
            },      
            ...
        ]
    }
}
```

<span id="api_25">25.添加心率时钟</span>

URL

>   baseUrl + '/paiband/timer/add'

参数

> |参数|是否必选|类型|说明|
|:-----   |:-------|:-----|-----|
|time  |Y   |string   |闹钟时间|

返回值

>```json
{
    "http_code": 200,
    "data": true
}
```


<span id="api_26">26.修改心率时钟</span>

URL

>   baseUrl + '/paiband/timer/modify'

参数

> |参数|是否必选|类型|说明|
|:-----   |:-------|:-----|-----|
|clock_id  |Y   |int   |闹钟ID|
|time  |Y   |string   |闹钟时间|

返回值

>```json
{
    "http_code": 200,
    "data": true
}
```

<span id="api_27">27.删除心率时钟</span>

URL

>   baseUrl + '/paiband/timer/delete'

参数

> |参数|是否必选|类型|说明|
|:-----   |:-------|:-----|-----|
|clock_id  |Y   |int   |闹钟ID|

返回值

>```json
{
    "http_code": 200,
    "data": true
}
```

<span id="api_28">28.应用版本记录</span>

URL

>   baseUrl + '/paiband/versions/index'

参数

> |参数|是否必选|类型|说明|
|:-----   |:-------|:-----|-----|
|version  |Y   |string   |版本号ID - 当传version时取大于当前版本号的记录 否则 取最新的一条记录|
|type  |Y   |string   |包类型 - 当传type时取最大版本号的一条记录 否则 根据包类型各取最大版本号其中一条记录；【ps：type=M代表固件包，type=R代表软件包】|


返回值

>```json
{
    "http_code": 200,
    "data":
    {
        "list":
        [
            {
                "type": "R",
                "build_id": 1111,
                "versions": "V1.1.1.1",
                "url": "http://www.putao.com/paiband.apk",
                "size":"22KB",
                "isupgrade":0,  //是否强制升级：0非 1强制
                "remark":"升级\t升级\t"  //升级备注
            }, 
             {
                "type": "M",
                "build_id": 1111,
                "versions": "V1.1.1.1",
                "url": "http://www.putao.com/paiband.apk",
                "size":"25KB",
                "isupgrade":0,  //是否强制升级：0非 1强制
                "remark":"升级\t升级\t"  //升级备注                
            }, 
            ...
        ]
    }
}
```

<span id="api_29">29.应用管理</span>

URL

>   baseUrl + '/paiband/paiband/appList'

参数

> |参数|是否必选|类型|说明|
|:-----   |:-------|:-----|-----|


返回值

>```json
{
    "http_code": 200,
    "data":
    {
        "list":
        [
            {
                "name": "酷跑护卫队",
                "icon": "",
                "desc": "",
                "is_login": 0,
                "ios_url": "",
                "android_url": ""                
            },      
            ...
        ]
    }
}
```

<span id="api_30">30.手环解除绑定</span>

URL

>   baseUrl + '/paiband/paiband/unbind'

参数

> |参数|是否必选|类型|说明|
|:-----   |:-------|:-----|-----|


返回值

>```json
{
    "http_code": 200,
    "data":true 
}
```
<span id="api_31">31.手环版本更新回调</span>

URL

>   baseUrl + '/paiband/index/upgrade'

参数

> |参数|是否必选|类型|说明|
|:-----   |:-------|:-----|-----|
|origin_version  |Y   |string   |旧版本|
|new_version  |Y   |string   |新版本|


返回值

>```json
{
    "http_code": 200,
    "data":true 
}
```
<span id="api_32">32.每日睡眠数据</span>

URL

>   baseUrl + '/paiband/sleeping/sleepData'

参数

> |参数|是否必选|类型|说明|
|:-----   |:-------|:-----|-----|
|date  |N   |string   |日期格式：如2016-11-07或20161107，默认今日睡眠|

返回值

>```json
{
    "http_code": 200,
    "data":
    {
            "sleep_minutes":1300, //睡眠分钟数
            "deep_sleep_time"：1000,  //深度睡眠分钟数
            "light_sleep_time":300,  //浅睡眠分钟数
            "target_sleep_time": 1000,  //目标睡眠分钟数
            "sleep_quality":"睡得不错" //睡眠评价
    }
}
```
<span id="api_33">33.孩子运动睡眠数据汇总</span>

URL

>   baseUrl + '/paiband/paiband/dataSummary'

参数

> |参数|是否必选|类型|说明|
|:-----   |:-------|:-----|-----|

返回值

>```json
{
    "http_code": 200,
    "data":
    {
            "activation_time":1300, //激活时间-时间戳
            "used_time"： "5天8小时",  //使用时长分钟数
            "mileage":300,  //累计里程-米
            "avg_steps": 1000,  //每日平均步数
            "good_sleep_days"：1000,  //优质睡眠天数
            "avg_sleep_time":300,  //每日平均睡眠 - 分钟
            "sync_time": 1000,  //同步时间-时间戳
    }
}
```
<span id="api_34">34.获得升级的软件包</span>

URL

>   baseUrl + '/paiband/versions/upgrade'

参数

> |参数|是否必选|类型|说明|
|:-----   |:-------|:-----|-----|
|t  |Y   |int   |参数类型，值为 0 or 1;如为 1 只返回最新的M1;如为 0 检查固件包是不是小于等于传进来的，如是->再检查软件包是不是大于传过来的，如是，则只返回最新M1，否则返回空;如否->返回最新的2个包 M0 M1  （M0固件包；M1软件包）|
|m  |Y   |string   |固件包版本号|
|s  |Y   |string   |软件包版本号|

返回值

>```json
{
    "http_code": 200,
    "data":
    {
        "m":
       {
                "versions": "V1.1.1.1",
                "url": "http://www.putao.com/paiband.apk",
                "size":"25KB",
                "isupgrade":0,  //是否强制升级：0非 1强制
                "remark":"升级\t升级\t"  //升级备注
            },
        "s":
        {
                "versions": "V1.1.1.1",
                "url": "http://www.putao.com/paiband.apk",
                "size":"25KB",
                "isupgrade":0,
                "remark":"升级\t升级\t"             
            }
    }
}
```
<span id="api_35">35.获得抬腕亮屏设置值</span>

URL

>   baseUrl + '/paiband/screens/index'

参数

> |参数|是否必选|类型|说明|
|:-----   |:-------|:-----|-----|

返回值

>```json
{
  "http_code": 200,
  "data": {
    "open_time": "00:00", //开启时间
    "close_time": "23:59", //关闭时间
    "status": 1 //状态：1为开启 0为关闭
  }
}
```
<span id="api_36">36.抬腕亮屏设置</span>

URL

>   baseUrl + '/paiband/screens/settings'

参数

> |参数|是否必选|类型|说明|
|:-----   |:-------|:-----|-----|
|open_time  |Y   |string   |开启时间 - 时间格式：如 23:59，时间范围是：00:00 ~ 23:58|
|close_time  |Y   |string   |关闭时间 - 时间格式：如 23:59|
|status  |Y   |int   |状态：1为开启 0为关闭|

返回值

>```json
{
    "http_code": 200,
    "data":true 
}
```
<span id="api_37">37.获得孩子当前小红花数据</span>

URL

>   baseUrl + '/paiband/flowers/index'

参数

> |参数|是否必选|类型|说明|
|:-----   |:-------|:-----|-----|

返回值

>```json
{
  "http_code": 200,
  "data": {
    "current_num": 0,  //当前小红花数
    "reward_num": 0,  //历史奖励小红花数
    "reward_times": 0,  //奖励次数
    "exchange_num": 0,  //历史兑换小红花数
    "exchange_times": 0 //兑换次数
  }
}
```
<span id="api_38">38.奖励/兑换小红花</span>

URL

>   baseUrl + '/paiband/flowers/settings'

参数

> |参数|是否必选|类型|说明|
|:-----   |:-------|:-----|-----|
|type  |Y   |string   |类型：1奖励 2兑换|
|num  |Y   |int   |奖励/兑换小红花数,小红花范围：1~99|
|remark  |Y   |string   |备注|

返回值

>```json
{
  "http_code": 200,
  "data": {
    "old_num": 313,  //奖励/兑换小红花前的小红花数
    "current_num": 291  //奖励/兑换小红花后的当前小红花数
  }
}
```
<span id="api_39">39.小红花奖励/兑换记录列表</span>

URL

>   baseUrl + '/paiband/flowers/lists'

参数

> |参数|是否必选|类型|说明|
|:-----   |:-------|:-----|-----|
|page  |Y   |int   |页码：默认从第1页开始|
|pagesize  |N  |int   |每页显示条数：默认显示每页20条|

返回值

>```json
{
  "http_code": 200,
  "data": {
    "data": [ //倒序排
      {
        "type": 1,  //类型：1奖励 2兑换
        "num": 10, //奖励或兑换数量
        "old_num": 7,  //之前小红花数
        "remark": "昨天做一件好事", //备注
        "create_time": 1479204404 //时间
      },
      {
        "type": 1,
        "num": 5,
        "old_num": 2,
        "remark": "孩子今天表现好",
        "create_time": 1479118004
      },
      {
        "type": 2,
        "num": 3,
        "old_num": 5,
        "remark": "一起吃大餐",
        "create_time": 1479031604
      },
      {
        "type": 1,
        "num": 3,
        "old_num": 2,
        "remark": "主动帮妈妈洗碗",
        "create_time": 1478945204
      },
      {
        "type": 2,
        "num": 1,
        "old_num": 3,
        "remark": "周日去游乐园",
        "create_time": 1478858804
      },
      {
        "type": 1,
        "num": 3,
        "old_num": 0,
        "remark": "按时睡觉",
        "create_time": 1478772404
      }
    ],
    "page": 1,
    "pagesize": 20,
    "totals": 6
  }
}
```
<span id="api_40">40.帮助中心 - 使用说明</span>

URL

>   baseUrl + '/paiband/help/index'

参数

> |参数|是否必选|类型|说明|
|:-----   |:-------|:-----|-----|
|id  |Y   |int   |使用说明对应的ID|

返回值

>```json
{
  "http_code": 200,
  "data": {
    "title": "test",  //标题
    "url": "http://h5.putao.com/paiband/#!/paibandfaq",  //H5链接
    "content": "test"  //详情
  }
}
```

<span id="api_41">41.恢复出厂设置，获取今天最后一条运动记录</span>

URL

>   baseUrl + '/paiband/paiband/factoryDefault'

参数

> |参数|是否必选|类型|说明|
|:-----   |:-------|:-----|-----|

当天存在运动数据，返回值如下：

>```json
{
  "http_code": 200,
  "data": {
    "motion_data": [
      {
        "motion_time": 1486684900,
        "status": 0,
        "steps": 0
      }
    ]
  }
}
```

当天不存在运动数据，返回值如下：

>```json
{
  "http_code": 200,
  "data": null
}
```

<span id="api_42">42.指定年月，获取有运动记录的日期</span>

URL

>   baseUrl + '/paiband/motion/getMotionDate'

参数

> |参数|是否必选|类型|说明|
|:-----   |:-------|:-----|-----|
|year  |N   |int   |年份, 默认为当年|
|month  |N   |int   |月份， 默认为当月|

返回值如下：

>```json
{
  "http_code": 200,
  "data": [
    {
      "date": "2017-02-09"
    },
    {
      "date": "2017-02-10"
    }
  ]
}
```

<span id="api_43">43.运动监测年统计</span>

URL

>   baseUrl + '/paiband/motion/year'

参数

> |参数|是否必选|类型|说明|
|:-----   |:-------|:-----|-----|
|year|N|int|年份，默认为当前日期计算出的年份|

返回值

>```json
{
    "http_code": 200,
    "data":
    {
        "data": //周数据，绘制表格用
        [
            {
                "date": "2016-03",  //表示年月
                "steps": 100000,
                "stepsDetail": {
                  "1": 100000, //步行步数
                  "2": 0, //跑步步数
                }
            },
            {
                "date": "2016-07",
                "steps": 100000,
                "stepsDetail": {
                  "1": 100000,
                  "2": 0,
                }
            },
            ...
        ],
        "target_steps": 10000, //目标步数
        "summary": //年汇总
        {
            "active_tips":"活跃提示",
            "addition_tips":"附加专家提示"
        },
        "last_update_text": "3月前更新"
    }
}
```

<span id="api_44">44.指定年月，获取有睡眠记录的日期</span>

URL

>   baseUrl + '/paiband/sleeping/getSleepDate'

参数

> |参数|是否必选|类型|说明|
|:-----   |:-------|:-----|-----|
|year  |N   |int   |年份, 默认为当年|
|month  |N   |int   |月份， 默认为当月|

返回值如下：

>```json
{
  "http_code": 200,
  "data": [
    {
      "date": "2017-02-09"
    },
    {
      "date": "2017-02-10"
    }
  ]
}
```

<span id="api_45">45.睡眠监测年统计</span>

URL

>   baseUrl + '/paiband/sleeping/year'

参数

> |参数|是否必选|类型|说明|
|:-----   |:-------|:-----|-----|
|year |N  |int     |年份，默认当年|

返回值

>```json
{
    "http_code": 200,
    "data":
    {
        "target_minutes": 1000, //每日睡眠目标数
        "data": //周数据，绘制表格用
        [
            {
                "date": "2016-05", //表示年月
                "sleep_minutes": 100000, //睡眠分钟数
                "sleepDetail": [
                    151, //深度睡眠分钟数
                    377 //浅度睡眠分钟数
                ]
            },
            {
                "date": "2016-05",
                "sleep_minutes": 100000, //书面分钟数
                "sleepDetail": [
                    151, //深度睡眠分钟数
                    377 //浅度睡眠分钟数
                ]
            },
            ...
        ],
        "target_sleep_time": 480,  //目标睡眠分钟数
        "summary":
        {
            "active_tips":"你的孩子在X点和X点最为活跃，运动量特别大。",
            "addition_tips":"附加专家提示"
        }
    }
}
```