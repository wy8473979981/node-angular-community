# node-angular-blog
##基于MongoDB+AngularJS+ExpressJS+Node.js做的一个简单的社区站点  

![pic1](http://a.hiphotos.baidu.com/image/pic/item/5d6034a85edf8db1eb0d3fe00123dd54564e7416.jpg)
![pic2](http://d.hiphotos.baidu.com/image/pic/item/72f082025aafa40f38c68d59a364034f78f01935.jpg)
![pic3](http://d.hiphotos.baidu.com/image/pic/item/6609c93d70cf3bc74cbc1d6fd900baa1cc112af1.jpg)

##移动端样子有点丑
![pic4](http://a.hiphotos.baidu.com/image/pic/item/d833c895d143ad4ba1e907448a025aafa50f066a.jpg)  
##个人信息页
![pic5](http://a.hiphotos.baidu.com/image/pic/item/d31b0ef41bd5ad6e35ddb76989cb39dbb6fd3c09.jpg)

###app目录下：
&nbsp;&nbsp;&nbsp;css中存放css文件  
&nbsp;&nbsp;&nbsp;images中存放图片资源  
&nbsp;&nbsp;&nbsp;js中存放angular的主要文件以及初始化angular模块的app.js  
&nbsp;&nbsp;&nbsp;edit中存放重新编辑话题的视图edit.html以及对应的控制器edit.js（只有作者可以重新编辑话题）  
&nbsp;&nbsp;&nbsp;login中存放登录的视图login.html以及对应的控制器login.js  
&nbsp;&nbsp;&nbsp;main中存放首页视图main.html以及main.js  
&nbsp;&nbsp;&nbsp;modify中存放修改个人信息视图modify.html以及modify.js  
&nbsp;&nbsp;&nbsp;postTopic中存放发表话题视图postTopic.html以及postTopic.js  
&nbsp;&nbsp;&nbsp;register中存放注册视图register.html以及register.js  
&nbsp;&nbsp;&nbsp;showTopic中存放显示话题详情视图showTopic.html以及showTopic.js（此页中只有作者能看到编辑话题与删除话题的按钮并实现相应功能）  
&nbsp;&nbsp;&nbsp;unread中存放未读消息视图unread.html以及unread.js  
&nbsp;&nbsp;&nbsp;userInfo中存放用户个人信息视图userInfo.html以及userInfo.js（只有本人才能看到收藏的话题）  
###server/datasets目录下
&nbsp;&nbsp;&nbsp;定义数据集的js文件  
###server/controllers目录下
&nbsp;&nbsp;&nbsp;对用户登录注册进行处理的后端文件auth-controller.js  
&nbsp;&nbsp;&nbsp;对修改用户信息进行处理的后端文件modify-controller.js  
&nbsp;&nbsp;&nbsp;对获取话题发表话题重新编辑话题等各种请求进行处理的后端文件topic-controller.js  
&nbsp;&nbsp;&nbsp;对未读消息进行设置和处理的后端文件unread-controller.js  
&nbsp;&nbsp;&nbsp;对与用户个人信息相关的请求进行处理的后端文件userInfo-controller.js  
###uploads目录下
&nbsp;&nbsp;&nbsp;用户上传的头像文件
###index.html
&nbsp;&nbsp;&nbsp;ng-view嵌在index.html里，index.html除了ng-view之外是导航栏
###server.js
&nbsp;&nbsp;&nbsp;服务器的设置，以及路由的设置
###package.json
项目的依赖包，顺便，由于是一边开发一边导入需要的包，所以没有及时更新package.json，该文件里并没有包含所有依赖
