<template>
  <div class="mbg">
    <div class="menubg"></div>
    <header>
      <div style="margin-left:26%">
        <img src="../assets/webrtcs/meetlogo.png" alt="" style="width:155px;height:57px;">
      </div>
      <!-- 退出按钮 -->
      <div class="logout">
        <img :src="userinfo.avatar" alt="">
        <!-- 下拉菜单 -->
        <el-dropdown @command="handleCommand" placement="bottom-start">
          <span class="el-dropdown-link">
            <span style="margin-left:20px;">{{userinfo.username}}</span>
          </span>
          <el-dropdown-menu>
            <el-dropdown-item @click="logout" command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

      </div>
    </header>

    <div class="index">
      <!-- 四个图标 -->
      <ul class="list">
        <li @click="openmeet()">
          <div class="newMeet">
            <img src="../assets/webrtcs/shexiangji.png" alt="">
          </div>
          <span>新会议</span>
        </li>
        <li @click="joinDialog = true">
          <div style="width:44%;">
            <img src="../assets/webrtcs/add.png" alt="">
          </div>
          <span>加入</span>
        </li>
        <li @click="$router.push('/resermeet/meetDetails:'+id)">
          <div style="width:43%;">
            <img src="../assets/webrtcs/yuyue.png" alt="">
          </div>
          <span>预约</span>
        </li>
        <li @click="$router.push('/setup/setpersonal')">
          <div style="width:49%;">
            <img src="../assets/webrtcs/shezhi.png" alt="">
          </div>
          <span>设置</span>
        </li>
      </ul>

      <!-- 加入会议 -->
      <el-dialog title="加入会议" :visible.sync="joinDialog" width="30%" top="30vh" center>
        <el-form :label-position="labelPosition" label-width="80px" style="text-align: center">
          <el-form-item label class="index-el-form-item">
            <el-autocomplete v-model="meetingId" style="width:90%;" class="inline-input" @blur.stop="saveLocal($event.target)"
              :fetch-suggestions="querySearch" placeholder="会议ID" @select="handleSelect">
            </el-autocomplete>
          </el-form-item>

          <el-form-item label class="index-el-form-item">
            <el-input class="index-input" :placeholder="userinfo.username" v-model="username"></el-input>
          </el-form-item>
          <el-form-item class="index-el-form-item-radio">
            <el-checkbox v-model="radio_audio" label="1">不自动连接语音</el-checkbox>
          </el-form-item>
          <el-form-item class="index-el-form-item-radio">
            <el-checkbox v-model="radio_video" label="2">保持摄像头关闭</el-checkbox>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="hideJoinDialog" round>取 消</el-button>
          <el-button type="primary" style="
              background-color: #00ccff !important;
              border-color: #00ccff !important;
            " @click="joinmeet" round>
            确 定
          </el-button>
        </span>
      </el-dialog>

      <!-- 我的安排 -->
      <div class="anpai" v-if="upcoming.length">
        <div class="top">我的安排</div>
        <div class="meet_content" v-for="item in upcoming" :key="item.id">
          <div class="content_left">
            <div style="display:flex">
              <h4>{{item.meetTopic }}
              </h4>
              <span v-if="item.state=='已结束'"
                style="margin-left:10px;font-size:16px;padding:3px 10px;border:1px solid #f1f1f1;border-radius:20px;font-weight:400;color:#999">{{ item.state }}</span>
              <span v-else-if="item.state=='进行中'"
                style="margin-left:10px;font-size:16px;padding:3px 10px;border:1px solid #f1f1f1;border-radius:20px;font-weight:400;color:red">{{ item.state }}</span>
              <span v-else
                style="margin-left:10px;font-size:16px;padding:3px 10px;border:1px solid #f1f1f1;border-radius:20px;font-weight:400;color:#00ccff">{{ item.state }}</span>
            </div>

            <div>会议号：{{ item.meetingId }}</div>
            <!-- 不是同一天的会议显示日期 -->
            <div v-if="item.startYm<item.stopYm">
              时间：{{ item.startYm }}&nbsp;&nbsp;&nbsp;{{ item.start }}——{{ item.stopYm }}&nbsp;&nbsp;&nbsp;{{ item.stop }}
            </div>
            <!-- 否则只显示时间 -->
            <div v-else>时间：{{ item.start }}-{{ item.stop }}</div>
          </div>
          <div class="content_right">
            <div class="btn">
              <button class="edit" @click="showEditDialog(item.meetingId)">
                编辑
              </button>
              <button class="start" @click="startMeet(item.meetingId)">
                开始
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- <el-divider style="color:red;"><div style="width:50px;height:50px;border:1px solid red;transform:rotate(45deg);border-left-color:transparent;border-top-color:transparent;"></div></el-divider> -->

      <div class="anpai" style="width:100%;" v-if="!upcoming.length">
        <div class="top" style="margin-bottom:11px;">我的安排</div>
        <div class="null_data">
          <img src="../assets/null_data.svg" alt="">
        </div>
      </div>
      <!-- <button id="btnn" @click="opennew">打开子窗口</button> -->

      <!-- 编辑会议 -->
      <el-dialog class="editmeet" title="编辑会议" width="37%" center :visible.sync="EditDialogVisible">
        <el-form ref="form" :model="formData" label-width="80px">
          <el-form-item label="会议主题">
            <el-input v-model="formData.meetTopic"></el-input>
          </el-form-item>
          <el-form-item label="开始日期" style="text-align: center">
            <el-col :span="15">
              <el-date-picker type="date" placeholder="选择日期" v-model="formData.startDate" style="width: 100%" value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-col>
            <el-col class="line" :span="2" style="text-align: center">&nbsp;&nbsp;</el-col>
            <el-col :span="7" style="margin-left: 37px">
              <el-time-picker placeholder="选择时间" v-model="formData.startTime" style="width: 100%" value-format="HH:mm">
              </el-time-picker>
            </el-col>
          </el-form-item>

          <el-form-item label="结束日期" style="text-align: center">
            <el-col :span="15">
              <el-date-picker type="date" placeholder="选择日期" v-model="formData.stopDate" style="width: 100%" value-format="yyyy-MM-dd"
                @change="endchange(formData.stopDate,formData.startDate)"></el-date-picker>
            </el-col>
            <el-col class="line" :span="2" style="text-align: center">&nbsp;&nbsp;</el-col>
            <el-col :span="7" style="margin-left: 37px">
              <el-time-picker placeholder="选择时间" v-model="formData.stopTime" style="width: 100%" value-format="HH:mm">
              </el-time-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="密码" style="width:'50%;">
            <el-input v-model="formData.pwd" type="password" placeholder="可不填"></el-input>
          </el-form-item>
          <el-form-item label="选项">
            <el-checkbox label="允许在主持人入会前加入" name="type" v-model="formData.beforeHost" :checked="formData.beforeHost">
            </el-checkbox>
            <!-- <br />
            <el-checkbox label="使用个人会议号" name="type" v-model="formData.oneself" :checked="formData.oneself">
            </el-checkbox>
            <br /> -->
          </el-form-item>

          <!-- 按钮 -->
          <!-- <el-form-item>
            <el-button @click="EditDialogVisible = false" round>取消</el-button>
            <el-button type="primary" @click="updateMeet(formData.id)" round>编辑</el-button>
          </el-form-item> -->

        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="EditDialogVisible = false" round>取 消</el-button>
          <el-button style="
              background-color: #00ccff !important;
              border-color: #00ccff !important;
            " type="primary" @click="updateMeet(formData.id)" round>
            确 定
          </el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import APIUrl from '@/axios/api.url'
import { post, get } from '@/axios/index'
import { Message, Dialog, Button } from 'element-ui'
import people from '../components/participants'
export default {
  data() {
    return {
      id: '', // 会议列表第一项的id值
      show: true,
      centerDialogVisible: false,
      joinDialog: false, // 显示加入会议
      meetingId: '',
      username: '',
      radio_audio: true,
      radio_video: false,
      labelPosition: 'top',
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        host: false,
        part: true,
        type: [],
        resource: '',
        desc: '',
        pwd: '',
      },
      meetlist: [], // 会议列表
      upcoming: [], // 我的安排会议列表展示
      EditDialogVisible: false, // 展示编辑会议
      // 编辑会议信息列表
      formData: {
        meetTopic: '', // 会议主题
        startDate: '', // 会议开始日期
        startTime: '', // 会议开始时间
        stopDate: '', // 会议结束日期
        stopTime: '', // 会议结束时间
        host: true,
        part: false,
        radio: '', // 电脑音频
        scene: '', // 音频设置
        pwd: '', // 会议密码
        beforeHost: '', // 主持人入会前加入
        oneself: '', // 会议id
        meetDeatil: {}, // 会议详情
        id: '',
      },
      historyList: [], // 存放会议id
      userListlength: '', // 实时在线用户列表长度
    }
  },
  created() {
    if (!this.userinfo.length) {
      const userinfo = JSON.parse(window.localStorage.getItem('userinfo'))
      this.$store.commit('setuserinfo', userinfo)
    }
    this.getMeetList()
  },
  mounted() {
    if (JSON.parse(localStorage.getItem('historyList'))) {
      this.historyList = JSON.parse(localStorage.getItem('historyList'))
    }
  },
  computed: {
    ...mapState(['userinfo', 'token', 'videoStatus', 'audioStatus']),
  },
  methods: {

    handleCommand(type) {
      if (type == 'logout') {
        this.logout()
      }
    },
    // 时间选择事件
    endchange(stop, start) {
      if (start && stop < start) {
        this.$message({
          message: '会议结束时间不得早于开始时间',
          type: 'error',
        })
        stop = ''
      }
    },
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

    // 保存会议id历史记录数组
    saveLocal(e) {
      console.log(e.value)
      if (e.value) {
        // 存储正确会议到历史记录
        this.historyList.unshift({ value: e.value })
        // 历史记录去重
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
    // 隐藏加入会议
    hideJoinDialog() {
      this.joinDialog = false
      this.username = ''
      this.meetingId = ''
    },

    // 退出登录
    logout() {
      this.$confirm('您确定要退出吗?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          const apiurl = APIUrl.util.logout
          // const token = localStorage.getItem('token')
          post(apiurl, {
            phone: this.userinfo.phone,
          })
            .then((res) => {
              console.log('退出登录', res)
              if (res.status == 200) {
                localStorage.removeItem('token')
                localStorage.removeItem('userinfo')
                localStorage.removeItem('historyList')
                this.$message.success('已退出登录')
                this.$router.push({
                  name: 'index',
                })
              }
            })
            .catch((err) => {
              console.log('退出登录失败', err)
            })
        })
        .catch((error) => {
          console.log(error)
          this.$message({
            type: 'info',
            message: '已取消操作',
          })
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

    //开始会议
    openmeet() {
      this.$loading({
        lock: true,
        text: '入会中···',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      const DescribeChannelUsers = APIUrl.util.DescribeChannelUsers
      post(DescribeChannelUsers, {
        ChannelId: this.userinfo.meetingId,
      }).then((res) => {
        if (res.status == 200) {
          this.userListlength = res.data.UserList.length
          const apiurl = APIUrl.util.openMeet
          post(apiurl, {
            userId: this.userinfo.userId,
            startTime: this.getTime(),
            meetingId: this.userinfo.meetingId,
            token: this.userinfo.token,
          }).then((res) => {
            if (res.status == 200) {
              this.join()
            } else if (res.status == 4003) {
              window.localStorage.setItem('token', res.token)
              this.userinfo.token = res.token
              this.$store.commit('setuserinfo', this.userinfo)
              // this.openmeet()
            } else {
              this.$message.error(res.message)
            }
          })
        }
      })
    },

    // 加入会议
    joinmeet() {
      this.joinDialog = true
      if (!this.meetingId || !this.username) {
        this.$message.error('请完整填写信息')
        return
      }

      // const uid = this.createCode()
      // console.log(this.radio_audio,this.radio_video);
      this.$router.push({
        name: 'webrtc',
        params: {
          channelId: this.meetingId,
          username: this.username,
          userId: this.userinfo.userId,
          video: this.radio_video ? 0 : 1,
          scene: this.radio_audio ? 0 : 1,
          type: 2,
        },
      })
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

    //加入会议
    join() {
      // console.log(this.radio_audio,this.radio_video);
      this.$router.push({
        name: 'webrtc',
        params: {
          channelId: this.userinfo.meetingId,
          username: this.userinfo.username,
          userId: this.userinfo.userId,
          video: 1,
          scene: 0,
          type: 1,
          facility: 'web',
          length: this.userListlength,
        },
      })
    },

    // 获取会议列表
    getMeetList() {
      const getMeetList = APIUrl.util.getMeetList
      post(getMeetList, {
        userId: this.userinfo.userId,
        type: 'all',
        timestamp: this.getTime(),
      }).then((res) => {
        console.log('获取会议列表', res)
        if (res.status == 200) {
          this.meetlist = res.data.meetings
          // this.meetId = this.meetlist[0].id;
          // 默认展示会议列表前三项
          this.upcoming = this.meetlist.slice(0, 3)
          this.id = res.data.meetings[0].id

          // navigator.mediaDevices.enumerateDevices().then((devices) => {
          //   console.log('devices======', devices)
          //   const audiolist = devices.filter((v) => {
          //     return v.kind == 'audiooutput'
          //   })
          //   console.log(audiolist)
          // })
        }
      })
    },

    // 显示编辑会议框
    showEditDialog(id) {
      const newmeetlist = this.meetlist.filter((v) => {
        return v.meetingId == id
      })
      const newmeet = newmeetlist[0]
      // 不是主持人无权限编辑会议
      // if (newmeet.meetHost !== this.userinfo.username) {
      //   this.$message.warning("您没有权限哦");
      //   return false;
      // }
      // 如果会议正在进行中，无法编辑会议
      if (newmeet.state == '进行中') {
        this.$message.warning('会议正在进行中，您无法编辑会议了哦')
        return false
      }

      console.log('接收', id)
      this.EditDialogVisible = true
      const getMyInfo = APIUrl.util.getMyInfo
      post(getMyInfo, {
        meetingId: id,
        timestamp: this.getTime(),
      }).then((res) => {
        console.log('会议详情', res)
        if (res.status == 200) {
          this.meetDeatil = res.data
          this.formData.meetTopic = this.meetDeatil.meetTopic
          this.formData.startDate = this.meetDeatil.startYm
          this.formData.startTime = this.meetDeatil.start
          this.formData.stopDate = this.meetDeatil.stopYm
          this.formData.stopTime = this.meetDeatil.stop
          this.formData.pwd = this.meetDeatil.meetPwd
          this.formData.beforeHost = this.meetDeatil.tailStatus ? true : false
          this.formData.oneself =
            this.meetDeatil.meetingId == this.userinfo.meetingId ? true : false
          this.formData.id = this.meetDeatil.id
        }
      })
    },

    // 编辑会议
    updateMeet(id) {
      console.log(id)
      const updateMeet = APIUrl.util.updateMeet
      // console.log(this.meetId);
      // console.log(this.userinfo.username);
      post(updateMeet, {
        id: this.formData.id,
        meetTopic: this.formData.meetTopic,
        meetHost: this.userinfo.username,
        startTime: this.formData.startDate + ' ' + this.formData.startTime,
        stopTime: this.formData.stopDate + ' ' + this.formData.stopTime,
        meetPwd: this.formData.meetPwd,
        tailStatus: this.formData.beforeHost ? 1 : 0,
        timestamp: this.getTime(),
      }).then((res) => {
        console.log('修改会议详情', res)
        if (res.status == 200) {
          this.getMeetList()
          this.$message.success(res.message)
          this.EditDialogVisible = false
        } else {
          this.$message.warning(res.message)
        }
      })
    },

    // 开始我的安排会议
    startMeet(id) {
      const newmeetlist = this.meetlist.filter((v) => {
        return v.meetingId == id
      })
      const newmeet = newmeetlist[0]
      if (newmeet.state == '已结束') {
        this.$message.warning('该会议已结束,赶紧去安排新会议吧')
        return false
      }
      if (newmeet.state == '未开始') {
        this.$message.warning('该会议未开始哦')
        return false
      }
      const openMeet = APIUrl.util.openMeet
      post(openMeet, {
        userId: this.userinfo.userId,
        startTime: this.getTime(),
        meetingId: newmeet.meetingId,
        timestamp: this.getTime(),
      }).then((res) => {
        console.log('开始会议', res)
        if (res.status == 200) {
          this.$router.push({
            name: 'webrtc',
            params: {
              channelId: newmeet.meetingId,
              username: this.userinfo.username,
              userId: newmeet.userId,
              video: this.videoStatus,
              scene: this.audioStatus,
              type: 1,
            },
          })
        } else if (res.status == 4003) {
          window.localStorage.setItem('token', res.token)
          this.userinfo.token = res.token
          this.$store.commit('setuserinfo', this.userinfo)
          // this.openmeet()
        } else {
          this.$message.error('开启会议失败！')
        }
      })
    },
  },
}
</script>

<style lang='less' scoped>
.menubg {
  background-color: white;
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

.mbg {
  width: 100%;
  height: 100vh;
  min-width: 1000px;
  display: flex;
  justify-content: center;
  // align-items: center;
  position: relative;
  header {
    width: 100%;
    height: 83px;
    background: #ffffff;
    box-shadow: 0px 3px 9px 0px rgba(0, 0, 0, 0.05);
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    .logout {
      margin-left: 33.5%;
      span {
        font-size: 16px;
        color: #666;
        cursor: pointer;
      }
      .logoutspan {
      }
      img {
        width: 60px;
        height: 60px;
        border-radius: 100%;
        vertical-align: middle;
      }
    }
  }
  .index {
    width: 50%;
    display: flex;
    // justify-content: space-around;
    flex-direction: column;
    align-items: center;
    position: relative;
    margin-top: 8%;
    .list {
      width: 86%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      li {
        background-color: #00ccff;
        color: #fff;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        border-radius: 10px;
        cursor: pointer;
        @media screen and (max-width: 700px) {
          width: 70px;
          height: 70px;
        }
        @media screen and (min-width: 701px) and (max-width: 1200px) {
          width: 90px;
          height: 90px;
        }
        @media screen and (min-width: 1201px) and (max-width: 1620px) {
          width: 110px;
          height: 110px;
        }
        @media screen and (min-width: 1621px) {
          width: 135px;
          height: 135px;
        }
        .newMeet {
          height: 33%;
        }
        div {
          width: 45%;
          height: 45%;
          margin-top: 14%;
          box-sizing: border-box;
          img {
            width: 100%;
            height: 100%;
          }
        }
        span {
          font-size: 20px;
          @media screen and (max-width: 700px) {
            font-size: 12px !important;
          }
          @media screen and (min-width: 701px) and (max-width: 1100px) {
            font-size: 14px !important;
          }
          @media screen and (min-width: 1101px) and (max-width: 1520px) {
            font-size: 16px !important;
          }
          @media screen and (min-width: 1521px) {
            font-size: 20px !important;
          }
        }
      }
    }

    .anpai {
      width: 95%;
      // height: 580px;
      background: #ffffff;
      border: 1px solid #caf4ff;
      box-shadow: 0px 6px 12px 1px rgba(153, 153, 153, 0.06);
      border-radius: 10px;
      margin-top: 6%;
      .top {
        width: 100%;
        height: 5vh;
        line-height: 5vh;
        background: #f6fcff;
        border-radius: 10px 10px 0 0;
        font-size: 23px;
        font-family: 'Microsoft YaHei';
        font-weight: 400;
        color: #343434;
        margin-bottom: 35px;
        box-sizing: border-box;
        text-align: center;
        color: #333;
      }

      .meet_content {
        height: 13vh;
        display: flex;
        padding-left: 5%;
        margin-bottom: 3%;
        .content_left {
          flex: 5;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          h4 {
            font-size: 20px;
            color: #333;
            // height: 30px;
            // line-height: 30px;
            overflow: hidden; /*超出部分隐藏*/
            white-space: nowrap;
            text-overflow: ellipsis;
            box-sizing: border-box;
            display: block;
            max-width: 332px;
            @media screen and (max-width: 700px) {
              font-size: 14px !important;
            }
            @media screen and (min-width: 701px) and (max-width: 1100px) {
              font-size: 16px !important;
            }
            @media screen and (min-width: 1101px) and (max-width: 1520px) {
              font-size: 18px !important;
            }
            @media screen and (min-width: 1521px) {
              font-size: 20px !important;
            }
          }
          div {
            font-size: 18px;
            color: #333;
            @media screen and (max-width: 700px) {
              font-size: 12px !important;
            }
            @media screen and (min-width: 701px) and (max-width: 1100px) {
              font-size: 14px !important;
            }
            @media screen and (min-width: 1101px) and (max-width: 1520px) {
              font-size: 16px !important;
            }
            @media screen and (min-width: 1521px) {
              font-size: 18px !important;
            }
          }
        }
        .content_right {
          flex: 3;
          display: flex;
          justify-content: space-around;
          align-items: center;
          .btn {
            width: 12vw;
            height: 0.8vh;
            display: flex;
            justify-content: center;
            align-items: center;
            .edit,
            .start {
              background: #ffffff;
              border: 1px solid #9a9a9a;
              border-radius: 1.3vw;
              cursor: pointer;
              outline: none;
              font-size: 16px;
              @media screen and (max-width: 1200px) {
                width: 43px;
                height: 23px;
                font-size: 12px !important;
              }
              @media screen and (min-width: 1201px) and (max-width: 1620px) {
                width: 57px;
                height: 30px;
                font-size: 16px !important;
              }
              @media screen and (min-width: 1621px) {
                width: 88px;
                height: 40px;
                font-size: 18px !important;
              }
            }

            .edit {
              color: #666;
            }

            .start {
              color: #fff;
              margin-left: 22px;
              background-color: #00ccff;
              border: 0;
            }
          }
        }
      }

      .null_data {
        text-align: center;
        height: 200px;
        padding: 20px 0;
        img {
          width: 11vw;
          height: 11vw;
        }
      }
    }

    // dialog弹框
    .el-dialog {
      .el-form {
        .el-form-item {
          .el-form-item__content {
            margin-left: 160px;
            .el-button {
              &:nth-child(1) :hover {
                background-color: #00ccff;
                color: #fff;
              }
              &:nth-child(2) {
                background-color: #00ccff;
                color: #fff;
                border: 0;
              }
            }
          }
        }
        /deep/.index-el-form-item-radio {
          margin-left: 30px !important;
        }
      }
    }
    /deep/.el-dialog--center .el-dialog__body {
      padding: 25px 25px 5px !important;
    }
    /deep/.el-dialog__wrapper {
      .el-dialog {
        @media screen and (min-width: 300px) and (max-width: 1319px) {
          width: 590px !important;
          height: 500px !important;
        }
        @media screen and (min-width: 1320px) {
          width: 590px !important;
          height: 500px !important;
        }
        &:nth-child(2) {
          @media screen and (min-width: 1730px) {
            width: 590px !important;
            height: 500px !important;
          }
        }
      }
    }
  }
}
</style>
