datasets目录下为数据集，其中的topics.js和users.js分别定义了话题和用户的Schema。  
<br>
controllers目录下为处理各种请求的controller，其中  
auth-controller.js: 处理登录与注册的请求，接收数据为用户名与密码，返回注册（登录）成功的用户的某些信息。  
<br>
modify-controller.js: 处理修改用户信息的请求，接收数据为用户名，密码，个性签名（未填则默认为'这个家伙很懒，什么个性签名也没留下'），上传的图片（头像），返回更新后的用户的某些信息，并在app.js中收到响应后跳转到'/'路由；  
<br>
topics-controller.js: 处理发表话题(postTopic函数)，获取所有话题（getTopics函数），特定话题pv数+1（pvPlus函数），编辑话题（edit函数与editFinished函数），删除话题（delete函数），添加评论（addComment函数），回复评论（addReply函数），收藏话题的请求（collectTopic函数）。  
<br>
userinfo-controller.js: 处理查看用户个人信息的请求，接收用户名，返回该用户的相应信息。
