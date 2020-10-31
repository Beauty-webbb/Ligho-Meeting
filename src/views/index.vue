<template>
  <div>
    <div class="bg"></div>
    <div class="index-main">
      <el-row class="btn">
        <el-button type="primary" plain class="join-btn" @click="join_meeting()">加入会议</el-button>
      </el-row>
      <el-row class="btn">
        <el-button type="primary" plain class="login-btn" @click="login_meeting()">登陆 / 注册</el-button>
      </el-row>
    </div>

    <!-- 加入会议 -->
    <el-dialog title="加入会议" :visible.sync="centerDialogVisible" width="30%" top="30vh" center>
      <el-form :label-position="labelPosition" label-width="80px" style="text-align: center;">
        <el-form-item label class="index-el-form-item">
          <!-- <el-input class="index-input" placeholder="会议ID" v-model="meetingId"></el-input> -->
          <el-autocomplete v-model="meetingId" style="width:90%;" class="inline-input" @blur.stop="saveLocal($event.target)"
            :fetch-suggestions="querySearch" placeholder="会议ID" @select="handleSelect">
          </el-autocomplete>
        </el-form-item>
        <el-form-item label class="index-el-form-item">
          <el-input class="index-input" placeholder="您的姓名" v-model="username"></el-input>
        </el-form-item>
        <el-form-item class="index-el-form-item-radio">
          <el-checkbox v-model="radio_audio" label="1">不自动连接语音</el-checkbox>
        </el-form-item>
        <el-form-item class="index-el-form-item-radio">
          <el-checkbox v-model="radio_video" label="2">保持摄像头关闭</el-checkbox>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="hideDialog" round>取 消</el-button>
        <el-button type="primary" @click="join()" style="background-color: #00CCFF !important;border-color: #00CCFF !important;" round>
          确
          定
        </el-button>
      </span>
    </el-dialog>

    <!-- 验证码登录 -->
    <el-dialog title="验证码登录" :visible.sync="centerDialogVisiblelogin" width="30%" top="30vh" center>
      <el-form :label-position="labelPosition" label-width="80px" style="text-align: center;">
        <el-form-item label class="index-el-form-item">
          <el-input class="index-input" placeholder="手机号" v-model="mobile"></el-input>
        </el-form-item>
        <el-form-item label class="index-el-form-item code" style="position:relative;">
          <el-input class="index-input" placeholder="验证码" v-model="code">
            <template slot="append">
              <span v-show="showCount" @click="send_sms">验证码</span>
              <span class="again" v-show="!showCount">{{count}}秒后重试</span>
            </template>
          </el-input>
          <a href="#" style="position:absolute;top:40px;right:42px;text-decoration: none;color:#00ccff;" @click="changeDialog">密码登录</a>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="hideDialog" round>取 消</el-button>
        <el-button type="primary" @click="login()" style="background-color: #00CCFF !important;border-color: #00CCFF !important;" round>
          确
          定
        </el-button>
      </span>
    </el-dialog>

    <!-- 密码登录 -->
    <el-dialog title="密码登录" :visible.sync="centerDialogPasswordlogin" width="30%" top="30vh" center>
      <el-form :label-position="labelPosition" label-width="80px" style="text-align: center;">
        <el-form-item label class="index-el-form-item">
          <el-input class="index-input" placeholder="手机号" v-model="mobile"></el-input>
        </el-form-item>
        <el-form-item label class="index-el-form-item" style="position:relative;">
          <el-input class="index-input" placeholder="密码" v-model="password" type="password">
            <!-- <template slot="append">
              <span @click="send_sms()">验证码</span>
            </template>-->
          </el-input>
          <a href="#" style="position:absolute;top:40px;right:35px;text-decoration: none;color:#00ccff;"
            @click="centerDialogVisiblelogin=true">验证码登录</a>
          <a href="#" style="position:absolute;top:40px;left:35px;text-decoration: none;color:#00ccff;" @click="centerDialogRegister=true">免费注册</a>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="hideDialog('form2')" round>取 消</el-button>
        <el-button type="primary" @click="Passwordlogin()" style="background-color: #00CCFF !important;border-color: #00CCFF !important;" round>
          确
          定
        </el-button>
      </span>
    </el-dialog>

    <!-- 身份验证 -->
    <el-dialog title="身份验证" :visible.sync="IdDialogVisiblelogin" width="30%" top="30vh" center>
      <el-form :label-position="labelPosition" label-width="80px" style="text-align: center;">
        <el-form-item label class="index-el-form-item">
          <el-input class="index-input" placeholder="手机号" v-model="mobile"></el-input>
        </el-form-item>
        <el-form-item label class="index-el-form-item code" style="position:relative;">
          <el-input class="index-input" placeholder="验证码" v-model="code">
            <template slot="append">
              <span v-show="showCount" @click="send_sms">验证码</span>
              <span class="again" v-show="!showCount">{{count}}秒后重试</span>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="hideDialog" round>取 消</el-button>
        <el-button type="primary" @click="IdLogin()" style="background-color: #00CCFF !important;border-color: #00CCFF !important;" round>
          确
          定
        </el-button>
      </span>
    </el-dialog>

    <!-- 注册 -->
    <el-dialog title="注册" :visible.sync="centerDialogRegister" width="30%" top="30vh" center>
      <el-form :label-position="labelPosition" label-width="80px" style="text-align: center;" :model='form' :rules='rules'>
        <el-form-item label class="index-el-form-item" prop='mobile'>
          <el-input class="index-input" placeholder="手机号" v-model="form.mobile"></el-input>
        </el-form-item>

        <el-form-item label class="index-el-form-item" style="position:relative;" prop='password'>
          <el-input style="position:relative;" class="index-input" placeholder="密码" v-model="form.password" type="password">
          </el-input>
        </el-form-item>
        <el-form-item label class="index-el-form-item" style="position:relative;" prop='code'>
          <el-input style="position:relative;" class="index-input" placeholder="验证码" v-model="form.code" type="password">
          </el-input>
          <span class="send_sms" v-show="showCount" @click="register_sms">发送验证码</span>
          <span class="again_code" v-show="!showCount">{{count}}秒后重试</span>
          <a href="#" style="position:absolute;top:40px;right:42px;text-decoration: none;color:#00ccff;" @click="toLogin">已有账号?去登录</a>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="hideDialog('form')" round>取 消</el-button>
        <el-button type="primary" @click="Register" style="background-color: #00CCFF !important;border-color: #00CCFF !important;" round>
          注册
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import APIUrl from '@/axios/api.url'
import { post, get } from '@/axios/index'
import '../util/sdk.js' //引入sdk
export default {
  name: 'index',
  data() {
    return {
      centerDialogVisible: false, // 加入会议
      centerDialogVisiblelogin: false, // 验证码登录
      centerDialogPasswordlogin: false, // 密码登录
      centerDialogRegister: false, // 注册
      labelPosition: 'top',
      mobile: '',
      password: '',
      code: '',
      meetingId: '',
      username: '',
      radio_audio: true,
      radio_video: false,
      login_status: true,
      sdk: {},
      IdDialogVisiblelogin: false, // 身份验证
      form: {
        mobile: '',
        password: '',
        code: '',
      },
      rules: {
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: '请输入合法的手机号码',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 8,
            max: 12,
            message: '长度在8 ~ 12个字符',
            trigger: 'blur',
          },
        ],
      },
      historyList: [], // 存放会议id的数组
      count: '', // 倒计时数字
      showCount: true, // 是否展示验证码倒计时
      timer: null,
      joindata: {},
    }
  },
  created() {
    this.sdk = new AliRtcEngine()
    this.init()
    this.ambient()
  },
  mounted() {
    if (JSON.parse(localStorage.getItem('historyList'))) {
      this.historyList = JSON.parse(localStorage.getItem('historyList'))
    }
    const { ipcRenderer } = window.require('electron')
    ipcRenderer.on('leave', (event, message) => {
      this.$loading({
        lock: true,
        text: message,
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
    })
    ipcRenderer.on('joinmeet', (event, message) => {
      this.centerDialogVisible = true
      this.joindata.token = message.token
      this.joindata.pwd = message.pwd
      this.meetingId = message.meetingId
    })
  },
  methods: {
    querySearch(queryString, cb) {
      var restaurants = this.historyList
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        )
      }
    },
    saveLocal(e) {
      console.log(e.value)
      if (e.value) {
        // 存储正确卡号到历史信息
        this.historyList.unshift({ value: e.value })
        // 历史消息去重
        var hash = {}
        this.historyList = this.historyList.reduce((item, next) => {
          hash[next.value] ? '' : (hash[next.value] = true && item.push(next))
          return item
        }, [])
        if (this.historyList.length > 10) {
          this.historyList.pop()
        }
        localStorage.setItem('historyList', JSON.stringify(this.historyList))
      }
    },
    handleSelect(item) {
      console.log(this.meetingId)
    },
    changeDialog() {
      this.centerDialogVisiblelogin = false
      this.centerDialogPasswordlogin = true
    },
    hideDialog() {
      this.centerDialogVisiblelogin = false
      this.centerDialogPasswordlogin = false
      this.IdDialogVisiblelogin = false
      this.centerDialogRegister = false
      this.centerDialogVisible = false
    },

    // 验证码倒计时
    sendCode() {
      const time_count = 59
      if (!this.timer) {
        this.count = time_count
        this.showCount = false // 点击改变v-show的状态
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= time_count) {
            this.count-- // 递减
          } else {
            this.showCount = true
            clearInterval(this.timer) // 清除定时器
            this.timer = null
          }
        }, 1000)
      }
    },

    //注册用户发送验证码
    register_sms() {
      if (!this.form.mobile || !this.form.password) {
        this.$message.error('请填写完整内容')
        return
      }
      this.sendCode()
      const send_sms_api = APIUrl.util.send_sms
      post(send_sms_api, {
        phone: this.form.mobile,
      }).then((res) => {
        if (res.status == 200) {
          this.$message.success(res.message)
        } else {
          this.$message.error(res.message)
        }
      })
    },

    // 用户注册
    Register() {
      if (!this.form.mobile || !this.form.password || !this.form.code) {
        this.$message.error('请填写完整内容')
        return false
      }
      const register = APIUrl.util.register
      post(register, {
        phone: this.form.mobile,
        pwd: this.form.password,
        code: this.form.code,
        timestamp: this.getTime(),
      }).then((res) => {
        console.log('注册', res)
        if (res.status == 200) {
          this.$message.success('注册成功')
          this.centerDialogRegister = false
          this.centerDialogVisiblelogin = true
        } else {
          this.$message.error(res.message)
        }
      })
    },

    toLogin() {
      this.centerDialogPasswordlogin = true
      this.centerDialogRegister = false
    },

    //初始化
    init() {
      const token = window.localStorage.getItem('token')
      const authinf = window.localStorage.getItem('joininfo')
      const authinfo = JSON.parse(authinf)
      if (authinfo) {
        this.$router.push({
          name: 'webrtc',
        })
      }
      if (token) {
        this.$router.replace({
          name: 'menu',
        })
      }
    },

    //检查环境是否支持
    ambient() {
      // 检测当前环境是否支持sdk
      this.sdk
        .isSupport()
        .then((re) => {
          // console.log('初始化结果',re)
          this.getdevice()
        })
        .catch((error) => {
          console.log('检测失败', error)
        })
    },

    //默认获取音视频数据
    getdevice() {
      this.sdk
        .getDevices()
        .then((str) => {
          // console.log('设备', str),
          //先指定默认摄像头以及音频
          const video = str.videoDevices
          const audio = str.audioDevices
          // console.log(video,video[0],audio,audio.length);
          if (video.length == 0 || audio.length == 0) {
            this.$notify.error({
              title: '错误',
              message: '您没有可用的音视频设备',
            })
            return
          }
          // 视频设备切换
          this.sdk.setVideoProfile(
            {
              width: 1280,
              height: 720,
              frameRate: 30,
              maxBitrate: 5000000,
            },
            1
          )
          this.sdk.currentCamera = {
            deviceId: video[0].deviceId,
          }
          //音频设备切换
          this.sdk.currentAudioCapture = {
            deviceId: audio[0].deviceId,
          }
          //获取可用分辨率
          // this.sdk
          //   .getAvailableResolutions(video[0].deviceId)
          //   .then((re) => {
          //     console.log(re);
          //     //指定使用的音视频设备

          //   })
          //   .catch((error) => {
          //     console.log(error.message)
          //   })
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 加入会议
    join_meeting() {
      this.centerDialogVisible = true
    },
    // 登录
    login_meeting() {
      this.centerDialogPasswordlogin = true
    },

    //发送验证码
    send_sms() {
      if (!this.mobile) {
        this.$message.error('请填写手机号！')
        return
      }
      // 验证码倒计时
      this.sendCode()
      const send_sms_api = APIUrl.util.send_sms
      post(send_sms_api, {
        phone: this.mobile,
      }).then((res) => {
        if (res.status == 200) {
          this.$message.success(res.message)
        } else {
          this.$message.error(res.message)
        }
      })
    },

    //加入会议
    join() {
      if (!this.meetingId || !this.username) {
        alert('请完整填写信息')
        return
      }
      const uid = this.createCode()
      // console.log(this.radio_audio,this.radio_video);
      this.joindata.channelId = this.meetingId
      this.joindata.username = this.username
      this.joindata.userId = uid
      this.joindata.video = this.radio_video ? 0 : 1
      this.joindata.scene = this.radio_audio ? 0 : 1
      this.joindata.type = 2
      this.joindata.facility = 'web'

      this.$router.push({
        name: 'webrtc',
        params: this.joindata,
      })
    },

    //随机生成userid
    createCode() {
      var code = ''
      var codeLength = 8 //验证码的长度
      var random = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9) //随机数
      for (var i = 0; i < codeLength; i++) {
        //循环操作
        var index = Math.floor(Math.random() * 9) //取得随机数的索引（0~10）
        code += random[index] //根据索引取得随机数加到code上
      }
      return code //把code值赋给验证码
    },

    //获取当前时间，并定义格式
    getTime() {
      let yy = new Date().getFullYear()
      let mm = new Date().getMonth() + 1
      mm = mm < 10 ? '0' + mm : mm
      let dd =
        new Date().getDate() < 10
          ? '0' + new Date().getDate()
          : new Date().getDate()
      let hh = new Date().getHours()
      let mf =
        new Date().getMinutes() < 10
          ? '0' + new Date().getMinutes()
          : new Date().getMinutes()
      let ss =
        new Date().getSeconds() < 10
          ? '0' + new Date().getSeconds()
          : new Date().getSeconds()

      return yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss
    },

    // 验证码登录
    login() {
      if (!this.mobile || !this.code) {
        this.$message.error('请填写手机号和验证码！')
        return
      }
      const apiurl = APIUrl.util.captchaLogin
      post(apiurl, {
        phone: this.mobile,
        code: this.code,
        unique: this.createCode(),
        form: 'app',
        type: 1,
      })
        .then((res) => {
          console.log(res)
          if (res.status == 401) {
            this.$message.error(res.message)
          } else if (res.status == 200) {
            this.$store.commit('setuserinfo', res.data)
            window.localStorage.setItem('userinfo', JSON.stringify(res.data))
            this.$store.commit('setToken', res.data.token)
            window.localStorage.setItem('token', res.data.token)
            this.$message.success('登录成功！')
            setTimeout(() => {
              this.$router.replace({
                name: 'menu',
              })
            }, 500)
          } else if (res.status == 402) {
            var checkinfo = {
              phone: this.mobile,
              code: this.code,
            }
            this.$message.error(res.message)
            setTimeout(() => {
              this.$confirm(
                '您将退出其他设备，在此设备登录, 是否继续?',
                '提示',
                {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning',
                }
              )
                .then(() => {
                  const apiurl = APIUrl.util.captchaLogin
                  post(apiurl, {
                    phone: this.mobile,
                    code: checkinfo.code,
                    unique: this.createCode(),
                    form: 'app',
                    type: 2,
                  })
                    .then((res) => {
                      console.log('type2', res)
                      if (res.status == 200) {
                        this.$store.commit('setuserinfo', res.data)
                        window.localStorage.setItem(
                          'userinfo',
                          JSON.stringify(res.data)
                        )
                        this.$store.commit('setToken', res.data.token)
                        window.localStorage.setItem('token', res.data.token)
                        this.$message.success('登录成功！')
                        setTimeout(() => {
                          this.$router.replace({
                            name: 'menu',
                          })
                        }, 500)
                      }
                    })
                    .catch((err) => {
                      console.log('type2错误', err)
                    })
                })
                .catch((err) => {
                  console.log(err)
                  this.$message({
                    type: 'info',
                    message: '已取消',
                  })
                })
            }, 1000)
          }
        })
        .catch((err) => {
          console.log('登录失败', err)
        })
    },

    // 密码登录
    Passwordlogin() {
      if (!this.mobile || !this.password) {
        this.$message.error('请填写手机号和密码！')
        return
      }
      const apiurl = APIUrl.util.userLogin
      post(apiurl, {
        phone: this.mobile,
        pwd: this.password,
        unique: this.createCode(),
        form: 'app',
        timestamp: this.getTime(),
      })
        .then((res) => {
          // console.log('密码登录', res)
          // console.log(this.password)
          if (res.status == 200) {
            // 添加密码
            res.data.password = this.password
            console.log('个人信息====', res.data)
            // 存储个人信息
            this.$store.commit('setuserinfo', res.data)
            localStorage.setItem('userinfo', JSON.stringify(res.data))
            // 存储token
            this.$store.commit('setToken', res.data.token)
            localStorage.setItem('token', res.data.token)
            this.$message.success('登录成功！')
            setTimeout(() => {
              this.$router.replace({
                name: 'menu',
              })
            }, 300)
          } else if (res.status == 402) {
            this.$message.error(res.message)
            setTimeout(() => {
              this.$confirm(
                '您将退出其他设备，在此设备登录, 是否继续?',
                '提示',
                {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning',
                }
              )
                .then(() => {
                  // this.centerDialogVisiblelogin = true;
                  this.centerDialogPasswordlogin = false
                  this.IdDialogVisiblelogin = true
                })
                .catch((err) => {
                  console.log(err)
                  this.$message({
                    type: 'info',
                    message: '已取消',
                  })
                })
            }, 500)
          } else {
            this.$message.error(res.message)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    // 身份验证
    IdLogin() {
      const apiurl = APIUrl.util.captchaLogin
      post(apiurl, {
        phone: this.mobile,
        code: this.code,
        unique: this.createCode(),
        form: 'app',
        type: 2,
      })
        .then((res) => {
          // console.log('type2', res)
          if (res.status == 200) {
            this.$store.commit('setuserinfo', res.data)
            window.localStorage.setItem('userinfo', JSON.stringify(res.data))
            this.$store.commit('setToken', res.data.token)
            window.localStorage.setItem('token', res.data.token)
            this.$message.success('登录成功！')
            setTimeout(() => {
              this.$router.replace({
                name: 'menu',
              })
            }, 500)
          } else {
            this.$message.error(res.message)
          }
        })
        .catch((err) => {
          console.log('type2错误', err)
        })
    },
  },
}
</script>

<style>
.bg {
  background-image: url('../assets/bg.png');
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -10;
  zoom: 1;
  background-repeat: no-repeat;
  background-size: cover;
  -webkit-background-size: cover;
  -o-background-size: cover;
  background-position: center 0;
}

.index-main {
  width: 700px;
  height: 300px;
  position: fixed;
  left: 50%;
  top: 50%;
  z-index: 11;
  /*设定这个div的margin-top的负值为自身的高度的一半,margin-left的值也是自身的宽度的一半的负值.*/
  /*宽为400,那么margin-top为-200px*/
  /*高为200那么margin-left为-100px;*/
  margin: -200px 0 0 -350px;
  padding-top: 100px;
}

.btn {
  width: 50%;
  margin: 2rem auto;
}

.join-btn {
  width: 100%;
  height: 55px;
  border-radius: 55px !important;
  background-color: #00ccff !important;
  color: white !important;
  border: none !important;
  box-shadow: 1px 3px 13px 0px #f1f1f1;
  font-size: 18px !important;
}

.login-btn {
  width: 100%;
  height: 55px;
  border-radius: 55px !important;
  color: #0099ff !important;
  background-color: #e6faff !important;
  border: none !important;
  box-shadow: 1px 3px 13px 0px #f1f1f1;
  font-size: 18px !important;
}

.index-input {
  width: 90% !important;
}

.el-input__inner {
  height: 45px !important;
  border-radius: 45px !important;
}

.code .el-input__inner {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

.code .el-input-group__append {
  border-top-right-radius: 45px !important;
  border-bottom-right-radius: 45px !important;
  cursor: pointer !important;
}
.actvie {
  cursor: not-allowed;
}

.index-el-form-item-radio {
  text-align: left;
  margin-left: 18px;
  margin-bottom: 0 !important;
}

.el-checkbox__inner {
  border-radius: 14px !important;
}

.el-checkbox__input.is-checked .el-checkbox__inner {
  border-radius: 14px !important;
  border-color: #00ccff !important;
  background-color: #00ccff !important;
}

.el-checkbox__input.is-checked + .el-checkbox__label {
  color: #00ccff !important;
}
.send_sms,
.again_code {
  position: absolute;
  bottom: 2px;
  right: 24px;
  font-size: 12px;
  color: #c0c0c0;
  cursor: pointer;
}
.again_code {
  cursor: not-allowed;
}
.again {
  cursor: not-allowed;
}
</style>
