export default {
  DOMAIN: 'http://www.baidu.com',
  baseURL: 'https://meeting-api.lighos.com',
  /* Util API */
  util: {  
    image:                      '/util/image.html',                 // 图片上传
    send_sms:                   '/api/login/send_sms',              // 发送验证码
    GetAliyunAuthInfo:          '/api/login/GetAliyunAuthInfo',     // 获取加入凭证
    leave:                      '/api/meet/overMeet',               // 离开会议
    getParticipant:             '/api/meet/getParticipant',         // 获取参会者
    updatePropety:              '/api/meet/updateProperty',         // 更新个人用户信息
    captchaLogin:               '/api/login/captchaLogin',          // 验证码登陆
    feedBack:                   '/api/login/feedBack',              // 反馈
    openMeet:                   '/api/meet/openMeet',               // 开始会议
    logout:                     '/api/login/logout',                // 推出登陆
    activepush:                 '/api/socket/activepush',           // 发送消息
    meetInvite:                 '/api/meet/meetInvite',             // 邀请信息
    userLogin:                  '/api/login/userLogin',             // 密码登录
    createmeet:                 '/api/meet/createmeet',             // 安排会议
    updateAvatar:               '/api/login/updateAvatar',          // 修改头像
    updateUserName:             '/api/login/updateUserName',        // 修改昵称
    updatePwd:                  '/api/login/updatePwd',             // 修改密码
    sendEmail:                  '/api/login/sendEmail',             // 发送邮件
    verifyEmail:                '/api/login/verifyEmail',           // 校验邮箱
    updateEmail:                '/api/login/updateEmail',           // 修改邮箱地址
    getMeetList:                '/api/meet/getMeetList',            // 获取会议列表
    delMeet:                    '/api/meet/delMeet',                // 删除会议
    updateMeet:                 '/api/meet/updateMeet',             // 修改会议详情
    getMyInfo:                  '/api/login/getMyInfo',             // 获取会议详情
    getUserSet:                 '/api/login/getUserSet',            // 获取个人设置
    updateUserSet:              '/api/login/updateUserSet',         // 修改个人设置
    StartMPUTask:               '/api/rtmp/StartMPUTask',           //开启录制/推流
    StopMPUTask:                '/api/rtmp/StopMPUTask',            //停止录制/推流
    register:                   '/api/login/register',              // 注册用户
    giveMeetHost:               '/api/meet/giveMeetHost',           // 赋予(获取)主持人权限
    account:                    '/api/login/account',               // 绑定轻直播账号
    DescribeChannelUsers:       '/api/channel/DescribeChannelUsers',// 查询频道实时在线用户列表
    giveTran:                   '/api/meet/giveTran',               // 赋予(获取) 录制/直播权限
    searchPar:                  '/api/meet/searchPar',              // 搜索参会者
  },
};
