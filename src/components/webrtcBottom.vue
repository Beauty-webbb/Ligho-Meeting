<template>
  <div class="bottom-main" @mouseover="mouseOver()" @mouseleave="mouseLeave()">
    <div class="bottom-content" v-if="bottom_img_show">
      <div class="bottom-img">
        <div v-for="(item, key) in bottoms" :key="key" style="text-align: center;">
          <img @click="webrtcbottom(item.type)" :src="item.img" />
        </div>
      </div>
      <!-- 底部文字 -->
      <div class="bottomtext" style="text-align: center">
        <h3 v-for="(item, key) in bottoms" :key="key" style="margin: 0; color: white; font-size: 14px">
          {{ item.text }}
        </h3>
      </div>
    </div>

    <el-dialog title="您需要做的操作是？" :visible.sync="leave" :modal="false" width="30%" center>
      <span slot="footer" class="dialog-footer">
        <el-button @click="leavemeet('exit')">离开会议</el-button>
        <el-button type="primary" @click="leavemeet('over')" v-if="admin==1||admin==2" style="background:#00ccff;border:0;">结束会议
        </el-button>
      </span>
    </el-dialog>

    <!-- 会议邀请信息 -->
    <el-dialog class="invita" title="邀请他人加入会议" :visible.sync="invitation" :close-on-click-modal="false" :close-on-press-escape="false"
      :show-close="true" :modal="false" top="30vh" width="45%" left>
      <el-row :gutter="20" class="invitation">
        <el-col :span="3">
          <div class="invitation-left">会议主题：</div>
        </el-col>
        <el-col :span="16">
          <div class="invitation-right">
            {{ invitationdata.meetTopic }}
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="invitation">
        <el-col :span="3">
          <div class="invitation-left">会议链接：</div>
        </el-col>
        <el-col :span="16">
          <div class="invitation-right">
            {{ invitationdata.joinMeetUrl }}
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="invitation">
        <el-col :span="3">
          <div class="invitation-left">开始时间：</div>
        </el-col>
        <el-col :span="16">
          <div class="invitation-right">
            {{ invitationdata.startTime }}
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="invitation">
        <el-col :span="3">
          <div class="invitation-left">会议ID：</div>
        </el-col>
        <el-col :span="16">
          <div class="invitation-right">
            {{ invitationdata.meetingId }}
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="invitation">
        <el-col :span="3">
          <div class="invitation-left">会议密码：</div>
        </el-col>
        <el-col :span="16">
          <div class="invitation-right">
            {{ invitationdata.meetPwd ?invitationdata.meetPwd:'无密码'}}
          </div>
        </el-col>
      </el-row>

      <div style="width: 100%; text-align: center; margin-top: 5vh">
        <el-button type="primary" style="background:#00ccff;border:0;" round data-clipboard-action="copy" class="cobyDomObj" :data-clipboard-text="'会议链接：' +invitationdata.joinMeetUrl
          " @click="copyLink">
          复制邀请链接</el-button>

        <el-button round data-clipboard-action="copy" class="cobyDomObj" :data-clipboard-text="
            '会议主题：' +
            invitationdata.meetTopic +
            '\r\n会议链接：' +
            invitationdata.joinMeetUrl +
            '\r\n开始时间：' +
            invitationdata.startTime +
            '\r\n会议ID：' +
            invitationdata.meetingId+
            '\r\n会议密码：' +
            invitationdata.meetPwd
          " @click="copyLink">
          复制邀请信息</el-button>
      </div>
    </el-dialog>

    <!-- 设置信息 -->
    <el-dialog title="设置" :visible.sync="isconfig" :modal="false" width="60%" top="15vh" center>
      <!-- <span>需要注意的是内容是默认不居中的</span> -->
      <div class="config-main">
        <div class="config-main-left">
          <div class="config-main-left-title" v-for="(item,index) in configdata" :key="index" :id="'select'+item.id" @click="selecttab(item.id)">
            {{item.title}}
          </div>
        </div>
        <div class="config-main-right">
          <!-- 视频设置-->
          <div style="width:100%;" v-if="select == 0">
            <div style="width:100%;height:35vh">
              <video oncontextmenu="return true;" :style="{ width: '100%',height:'100%'}" autoplay playsinline id="video"></video>
            </div>
            <div style="width:68%;display:flex;justify-content: space-around;align-content: center;margin:10px auto;line-height:3;">
              摄像头： <el-select v-model="video" :placeholder="videoplaceholder">
                <el-option v-for="(item,index) in videodata" :key="index" :label="item.label" :value="item.deviceId">
                </el-option>
              </el-select>
              <div style="margin-left:20px;">
                分辨率： <el-select v-model="Resolutionval" :placeholder="Resolutionplaceholder">
                  <el-option v-for="(item,index) in Resolutionsdata" :key="index" :label="item.width+' x '+item.height" :value="index">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div style="margin:40px 0 0;text-align: center;">
              <el-button type="primary" round @click="configbtn" style="border:0;background:#00ccff;">确定</el-button>
            </div>
          </div>
          <!-- 音频设置-->
          <div style="width:100%;text-align:center;padding-top:30px" v-if="select == 1">
            麦克风： <el-select v-model="audio" :placeholder="audioplaceholder" style="width:80%">
              <el-option v-for="(item,index) in audiodata" :key="index" :label="item.label" :value="item.deviceId">
              </el-option>
            </el-select><br>
            <div style="margin-top:20px;">
              扬声器： <el-select v-model="output" :placeholder="outputplaceholder" style="width:80%">
                <el-option v-for="(item,index) in outputlist" :key="index" :label="item.label" :value="item.deviceId">
                </el-option>
              </el-select>
            </div>

            <div style="margin:40px 0 0;text-align: center;">
              <el-button type="primary" round @click="configbtn" style="border:0;background:#00ccff;">确定</el-button>
            </div>
          </div>
          <!-- 录制设置 -->
          <div style="width:100%;text-align:center;padding-top:30px" v-if="select==2">
            画质设置： <el-select ref="definition" v-model="definition" :placeholder="definitionplaceholder" :value="definition" style="width:80%">
              <el-option v-for="(item) in definitionlist" :key="item.id" :label="item.label" :value="item.id">
              </el-option>
            </el-select>
            <div class="task">
              最大窗格数： <el-select ref="task" v-model="TaskProfile" :placeholder="TaskProfileplaceholder" style="width:80%">
                <el-option v-for="(item) in TaskProfilelist" :key="item.id" :label="item.label" :value="item.id">
                </el-option>
              </el-select>
            </div>
            <div style="margin:40px 0 0;text-align: center;">
              <el-button type="primary" round @click="setDefinition" style="border:0;background:#00ccff;">确定</el-button>
            </div>
          </div>

          <!-- 直播设置 -->
          <div style="width:100%;text-align:center;padding-top:30px" v-if="select==3">
            画质设置： <el-select ref="livedefinition" v-model="livedefinition" :placeholder="livedefinitionplaceholder" style="width:80%">
              <el-option v-for="(item) in livedefinitionlist" :key="item.id" :label="item.label" :value="item.id">
              </el-option>
            </el-select>
            <div class="task">
              最大窗格数： <el-select ref="livetask" v-model="liveTaskProfile" :placeholder="liveTaskProfileplaceholder" style="width:80%">
                <el-option v-for="(item) in liveTaskProfilelist" :key="item.id" :label="item.label" :value="item.id">
                </el-option>
              </el-select>
            </div>
            <div style="margin:40px 0 0;text-align: center;">
              <el-button type="primary" round @click="setlive" style="border:0;background:#00ccff;">确定</el-button>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 直播推流地址选择 -->
    <el-dialog title="请选择直播推流地址" :visible.sync="livaAdd" :modal="false" width="40%" top="15vh" center @close='closeDialog'>
      使用自己的推流地址：<el-input style="width:75%" v-model="input" placeholder="请输入推流地址"></el-input>
      <div style="margin-top:20px;margin-left:57px;">
        轻直播地址：<el-checkbox class="checkbox" v-model="livechecked">轻直播地址</el-checkbox>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="livaAdd = false">取 消</el-button>
        <el-button style="background:#00ccff;border:0" type="primary" @click="startlive">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 录制倒计时 -->
    <span class="countdown" v-if="count">{{count}}</span>
    <!-- <audio ref="audio" src="" autoplay></audio> -->
  </div>
</template>

<script>
import { mapState } from 'vuex' //引入vuex
import APIUrl from '@/axios/api.url'
import { post, get } from '@/axios/index'
import vm from '@/event.js'
import '../util/sdk.js' //引入sdk

export default {
  data() {
    return {
      showCount: true, // 是否展示验证码倒计时
      count: '', // 倒计时数字
      sdk: {}, //webrtc sdk
      invitation: false,
      bottom_img_show: true,
      leave: false,
      joininfo: {},
      bottoms: [
        {
          img: require('../assets/webrtcs/video.png'),
          type: 'video',
          text: '摄像头',
        },
        {
          img: require('../assets/webrtcs/audio.png'),
          type: 'audio',
          text: '音频',
        },
        {
          img: require('../assets/webrtcs/yaoqing.png'),
          type: 'invitation',
          text: '邀请',
        },
        {
          img: require('../assets/webrtcs/canhuizhe.png'),
          type: 'chz',
          text: '参会者',
        },
        {
          img: require('../assets/webrtcs/share.png'),
          type: 'share',
          text: '共享',
        },
        {
          img: require('../assets/webrtcs/rec.png'),
          type: 'rec',
          text: '录制',
        },
        {
          img: require('../assets/webrtcs/zhibo.png'),
          type: 'live',
          text: '直播',
        },
        {
          img: require('../assets/webrtcs/set.png'),
          type: 'set',
          text: '设置',
        },
        {
          img: require('../assets/webrtcs/out.png'),
          type: 'leave',
          text: '退出',
        },
      ],
      invitationdata: {},
      isconfig: false,
      select: 0, //默认选中项
      configdata: [
        { title: '视频设置', id: 0 },
        { title: '音频设置', id: 1 },
        { title: '录制设置', id: 2 },
        { title: '直播设置', id: 3 },
      ],
      videodata: [],
      audiodata: [],
      Resolutionsdata: [],
      Resolutionplaceholder: '请选择分辨率',
      videoplaceholder: '请选择摄像头',
      audioplaceholder: '请选择麦克风设备',
      outputplaceholder: '请选择扬声器设备',
      definitionplaceholder: '请选择画质',
      livedefinitionplaceholder: '请选择画质',
      Resolutionval: '',
      video: '',
      audio: '',
      output: '', // 扬声器设备
      rec: {
        TaskProfile: 9,
        definition: '720P',
      },
      recstatus: 0, // 录制状态
      TaskId: '',
      liveTaskId: '',
      definition: '', // 画质默认值
      livedefinition: '', // 直播画质默认值
      definitionlist: [
        { id: 1, label: '高清' },
        { id: 2, label: '超清' },
        { id: 3, label: '原画' },
      ],
      livedefinitionlist: [
        { id: 1, label: '高清' },
        { id: 2, label: '超清' },
        { id: 3, label: '原画' },
      ], // 直播清晰度设置
      TaskProfile: '', // 宫格数默认值
      liveTaskProfile: '', // 直播宫格数默认值
      TaskProfileplaceholder: '请选择最大宫格数',
      liveTaskProfileplaceholder: '请选择最大宫格数',
      TaskProfilelist: [
        { id: 1, label: '一格' },
        { id: 2, label: '二格' },
        { id: 3, label: '四格' },
        { id: 4, label: '九格' },
      ],
      liveTaskProfilelist: [
        { id: 1, label: '一格' },
        { id: 2, label: '二格' },
        { id: 3, label: '四格' },
        { id: 4, label: '九格' },
      ], // 直播窗格数设置
      livaAdd: false, // 是否展示dislog
      live: 0, // 直播状态
      livedata: {
        TaskProfile: 9,
        definition: '720P',
      }, // 直播默认数据
      input: '', // 用户自己的推流地址
      livechecked: true, // 是否使用默认推流地址
      num: '', // 录制次数

      liveId: '', // 直播账号
      livepwd: '', // 直播密码
      userinfo: {}, // 个人信息
      outputlist: [], // 扬声器设备
      Fullloading: {}, //是否加载全屏loading
    }
  },
  created() {
    this.sdk = new AliRtcEngine()
    const joininf = window.localStorage.getItem('joininfo')
    const TaskId = window.localStorage.getItem('TaskId')
    const liveTaskId = window.localStorage.getItem('liveTaskId')
    this.joininfo = JSON.parse(joininf)
    this.userinfo = JSON.parse(localStorage.getItem('userinfo'))
    this.liveId = this.userinfo.livemobile
    this.livepwd = this.userinfo.livepassword
    if (TaskId) {
      this.TaskId = TaskId
      this.recstatus = 1
      this.bottoms[5].img = require('../assets/webrtcs/recing.png')
    }
    if (liveTaskId) {
      this.liveTaskId = liveTaskId
      this.live = 1
      this.bottoms[6].img = require('../assets/webrtcs/zhiboing.png')
    }
    this.getinvitation()

    // 8秒后隐藏底部工具栏
    // setTimeout(() => {
    //   $('.bottom-content').stop().fadeTo(800, 0)
    // }, 8000)
    // if (this.admin == 0 || this.admin == 3) {
    //   this.bottoms.splice(5, 2)
    //   this.$nextTick(() => {
    //     document.querySelector('.bottom-img').style.width = '25%'
    //     document.querySelector('.bottomtext').style.width = '50vh'
    //   })
    // } 
    // else {
      
    //   document.querySelector('.bottom-img').style.width = '65vh'
    //   document.querySelector('.bottomtext').style.width = '65vh'
    // }
  },
  watch: {
    outputindex(newv, ildv) {
      console.log(newv)
    },
    videoStatus(newv, oldv) {
      if (newv == 0) {
        this.bottoms[0].img = require('../assets/webrtcs/closevideo.png')
      } else {
        this.bottoms[0].img = require('../assets/webrtcs/video.png')
      }
    },
    audioStatus(newv, oldv) {
      if (newv == 0) {
        this.bottoms[1].img = require('../assets/webrtcs/audioclose.png')
      } else {
        this.bottoms[1].img = require('../assets/webrtcs/audio.png')
      }
    },
    shareStatus(newv, oldv) {
      if (newv == 0) {
        this.bottoms[4].img = require('../assets/webrtcs/share.png')
        this.bottoms[4].text = '共享'
      } else {
        this.bottoms[4].text = '停止共享'
        this.bottoms[4].img = require('../assets/webrtcs/share.png')
      }
    },
    video(newv, oldv) {
      this.Resolutions(newv)
    },
    recstatus(newv, oldv) {
      if (newv == 0) {
        this.bottoms[5].img = require('../assets/webrtcs/rec.png')
        this.bottoms[5].text = '录制'
      } else {
        this.bottoms[5].img = require('../assets/webrtcs/recing.png')
        this.bottoms[5].text = '停止录制'
      }
    },
    live(newv, oldv) {
      if (newv == 0) {
        this.bottoms[6].img = require('../assets/webrtcs/zhibo.png')
        this.bottoms[6].text = '直播'
      } else {
        this.bottoms[6].img = require('../assets/webrtcs/liveplaying.gif')
        this.bottoms[6].text = '停止直播'
      }
    },
    // admin(newv, oldv) {
    //   if (this.admin == 0 || this.admin == 3) {
    //     this.bottoms.splice(5, 2)
    //     this.$nextTick(() => {
    //       document.querySelector('.bottom-img').style.width = '25%'
    //       document.querySelector('.bottomtext').style.width = '50vh'
    //     })
    //   } 
    //   // else {
    //   //   document.querySelector('.bottom-img').style.width = '65vh'
    //   //   document.querySelector('.bottomtext').style.width = '65vh'
    //   // }
    // },
  },
  computed: {
    ...mapState([
      'videoStatus',
      'audioStatus',
      'admin',
      'shareStatus',
      'plist',
    ]),
  },
  methods: {
    //开启全屏loading
    openFullScreen2(title) {
      this.Fullloading = this.$loading({
        lock: true,
        text: title,
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
    },

    // 录制倒计时效果
    sendCode() {
      const time_count = 3
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

    // 清空推流框
    closeDialog() {
      this.input = ''
      this.livechecked = false
    },

    // 移入
    mouseOver() {
      // this.bottom_img_show = true;
      // $('.bottom-main').stop().fadeIn(800)
      // 设置透明度，切换显示与隐藏
      // $('.bottom-content').stop().fadeTo(700, 1)
    },

    // 移出
    mouseLeave() {
      // this.bottom_img_show = false;
      // $('.bottom-main').stop().fadeOut(800)
      // 设置透明度，切换显示与隐藏
      // $('.bottom-content').stop().fadeTo(800, 0)
    },

    opennew() {
      const { ipcRenderer, BrowserWindow } = window.require('electron')
      ipcRenderer.send('opennew', 'peoplelist')
    },

    //点击事件
    webrtcbottom(type) {
      if (type == 'chz') {
        // this.$store.commit('setpeoplelist', true)
        this.opennew()
      } else if (type == 'video') {
        this.send_msg('video', this.videoStatus)
        this.$emit('Camera', this.videoStatus ? true : false)
      } else if (type == 'audio') {
        this.send_msg('scene', this.audioStatus)
        this.$emit('Audio', this.audioStatus ? true : false)
      } else if (type == 'leave') {
        this.leave = true
      } else if (type == 'invitation') {
        // this.$store.commit('setinvitation',true);
        this.invitation = true
      } else if (type == 'share') {
        this.$emit('share')
        // this.$emit('shareScreen')
      } else if (type == 'set') {
        this.isconfig = true
        setTimeout(() => {
          this.selecttab(this.select)
          this.getDevices()
          this.getDefinition()
        }, 100)
      } else if (type == 'rec') {
        this.startrec()
      } else if (type == 'live') {
        if (this.live) {
          this.stoplive()
        } else {
          // 非主持人限制录制和直播
          // if (!this.admin || this.admin == 3) {
          //   this.$message.warning('您无直播权限')
          //   return false
          // }

          // 非主持人限制录制和直播
          this.plist.forEach((v) => {
            if (v.userId == this.joininfo.userId) {
              if (!v.streaming) {
                this.$message.warning('您无直播权限')
              }
            }
          })
          this.livaAdd = true
        }
      }
    },

    // 获取录制清晰度
    getDefinition() {
      if (!this.definition) {
        this.definition = this.definitionlist[1].id
        this.definitionplaceholder = this.definitionlist[1].label
      }
      if (!this.TaskProfile) {
        this.TaskProfile = this.TaskProfilelist[3].id
        this.TaskProfileplaceholder = this.TaskProfilelist[3].label
      }
      if (!this.livedefinition) {
        this.livedefinition = this.livedefinitionlist[1].id
        this.livedefinitionplaceholder = this.livedefinitionlist[1].label
      }
      if (!this.liveTaskProfile) {
        this.liveTaskProfile = this.liveTaskProfilelist[3].id
        this.liveTaskProfileplaceholder = this.liveTaskProfilelist[3].label
      }
    },

    // 录制设置信息
    setDefinition() {
      const updateUserSet = APIUrl.util.updateUserSet
      if (this.$refs.definition.selectedLabel == '高清') {
        var defini = '1080P'
      } else if (this.$refs.definition.selectedLabel == '超清') {
        var defini = '720P'
      } else {
        var defini = '360P'
      }
      if (this.$refs.task.selectedLabel == '一格') {
        var task = 1
      } else if (this.$refs.task.selectedLabel == '二格') {
        var task = 2
      } else if (this.$refs.task.selectedLabel == '四格') {
        var task = 4
      } else {
        var task = 9
      }
      // console.log(defini, task)
      this.rec.TaskProfile = task
      this.rec.definition = defini
      post(updateUserSet, {
        userId: this.joininfo.userId,
        definition: defini,
        task_profile: task,
      }).then((res) => {
        // console.log('修改个人设置', res)
        if (res.status == 200) {
          if (defini == '1080P') {
            this.definitionplaceholder = '高清'
          } else if (defini == '720P') {
            this.definitionplaceholder = '超清'
          } else {
            this.definitionplaceholder = '原画'
          }
          if (task == 1) {
            this.TaskProfileplaceholder = '一格'
          } else if (task == 2) {
            this.TaskProfileplaceholder = '二格'
          } else if (task == 4) {
            this.TaskProfileplaceholder = '四格'
          } else {
            this.TaskProfileplaceholder = '九格'
          }
          // this.definitionplaceholder = defini
          // this.TaskProfileplaceholder = task
          this.$message.success(res.message)
          this.isconfig = false
        } else {
          this.$message.error(res.message)
        }
      })
    },

    // 直播设置信息
    setlive() {
      const updateUserSet = APIUrl.util.updateUserSet
      if (this.$refs.livedefinition.selectedLabel == '高清') {
        var defini = '1080P'
      } else if (this.$refs.livedefinition.selectedLabel == '超清') {
        var defini = '720P'
      } else {
        var defini = '360P'
      }
      if (this.$refs.livetask.selectedLabel == '一格') {
        var task = 1
      } else if (this.$refs.livetask.selectedLabel == '二格') {
        var task = 2
      } else if (this.$refs.livetask.selectedLabel == '四格') {
        var task = 4
      } else {
        var task = 9
      }
      // console.log(defini, task)
      this.livedata.TaskProfile = task
      this.livedata.definition = defini
      post(updateUserSet, {
        userId: this.joininfo.userId,
        definition: defini,
        task_profile: task,
      }).then((res) => {
        // console.log('修改个人设置', res)
        if (res.status == 200) {
          if (defini == '1080P') {
            this.livedefinitionplaceholder = '高清'
          } else if (defini == '720P') {
            this.livedefinitionplaceholder = '超清'
          } else {
            this.livedefinitionplaceholder = '原画'
          }
          if (task == 1) {
            this.liveTaskProfileplaceholder = '一格'
          } else if (task == 2) {
            this.liveTaskProfileplaceholder = '二格'
          } else if (task == 4) {
            this.liveTaskProfileplaceholder = '四格'
          } else {
            this.liveTaskProfileplaceholder = '九格'
          }
          // this.definitionplaceholder = defini
          // this.TaskProfileplaceholder = task
          this.$message.success(res.message)
          this.isconfig = false
        } else {
          this.$message.error(res.message)
        }
      })
    },

    //开启录制
    startrec() {
      if (this.num >= 2) {
        this.$message.warning('单场会议只能录制一次哦')
        return false
      }
      // 非主持人限制录制和直播
      this.plist.forEach((v) => {
        if (v.userId == this.joininfo.userId) {
          if (!v.transcribe) {
            this.$message.warning('您无录制权限')
            return false
          }
        }
      })
      // if (!this.admin || this.admin == 3) {
      //   this.$message.warning('您无录制权限')
      //   return false
      // }
      this.recstatus = this.recstatus ? 0 : 1
      if (this.recstatus) {
        this.sendCode()
        this.rec.ChannelId = this.joininfo.channelId
        this.rec.userId = this.joininfo.userId
        var data = this.rec
        var apiurl = APIUrl.util.StartMPUTask
      } else {
        var data = { TaskId: this.TaskId }
        var apiurl = APIUrl.util.StopMPUTask
      }
      post(apiurl, data).then((res) => {
        console.log('录制', res)
        if (res.status == 200) {
          this.num++
          if (this.recstatus) {
            this.$message.success('已开启录制')
            window.localStorage.setItem('TaskId', res.data.TaskId)
            this.TaskId = res.data.TaskId
          } else {
            this.$message.success('已停止录制')
            window.localStorage.removeItem('TaskId')
          }
        } else {
          this.$message.error(res.message)
        }
      })
    },

    // 开启直播
    startlive() {
      console.log(this.admin)
      this.livaAdd = false
      if (this.input) {
        this.livedata.StreamURL = this.input
      }
      if (this.liveId && this.livepwd) {
        this.livedata.livemobile = this.liveId
        this.livedata.livepassword = this.livepwd
      }
      if (!this.input && !this.livechecked) {
        this.$message.warning('请选择推流地址')
        this.livaAdd = true
      } else if (this.input && this.livechecked) {
        this.$message.warning('只能选择一个推流地址哦')
        this.livaAdd = false
      }
      var apiurl = APIUrl.util.StartMPUTask
      this.livedata.ChannelId = this.joininfo.channelId
      this.livedata.userId = this.joininfo.userId
      this.livedata.type = this.livechecked ? 'program' : ''
      var data = this.livedata
      console.log(data)
      // this.openFullScreen2('直播加载中……')
      post(apiurl, data).then((res) => {
        console.log('直播', res)
        if (res.status == 200) {
          // this.Fullloading.close()
          this.live = 1
          this.$message.success('已开启直播')
          this.$store.commit('setliveUrl', res.data.qr_code_url)
          window.localStorage.setItem('liveTaskId', res.data.TaskId)
          this.TaskId = res.data.TaskId
          this.$alert(res.data.qr_code_url, '您的直播间地址：', {
            confirmButtonText: '确定',
            callback: (action) => {
              console.log(action)
            },
          })
        } else if (res.status == 401) {
          this.$message.warning(res.data)
        }
      })
    },
    // transcribe  录制
    // streaming  直播
    // 停止直播
    stoplive() {
      // console.log(this.liveTaskId)
      this.liveTaskId = localStorage.getItem('liveTaskId')
      var data = { TaskId: this.liveTaskId }
      var apiurl = APIUrl.util.StopMPUTask
      post(apiurl, data)
        .then((res) => {
          console.log('停止直播', res)
          if (res.status == 200) {
            this.live = 0
            this.$store.commit('setliveUrl', '')
            this.$message.success('已停止直播')
            window.localStorage.removeItem('liveTaskId')
          } else {
            this.$message.success(res.message)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    //打开视频预览
    openview(dom) {
      this.sdk
        .startPreview(dom)
        .then((res) => {
          console.log('打开预览成功')
        })
        .catch((error) => {
          console.log('预览失败', error.message)
        })
    },

    //获取音视频设备
    getDevices() {
      this.sdk
        .getDevices()
        .then((res) => {
          // console.log('res', res)
          this.videodata = res.videoDevices
          this.audiodata = res.audioDevices

          if (!this.video) {
            this.video = res.videoDevices[0].deviceId
            this.videoplaceholder = res.videoDevices[0].label
          }
          if (!this.audio) {
            this.audio = res.audioDevices[0].deviceId
            this.audioplaceholder = res.audioDevices[0].label
          }
        })
        .catch((error) => {
          console.log(error, '获取音视频错误')
        })

      // 获取输出设备
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        console.log('devices======', devices)
        this.outputlist = devices.filter((v) => {
          return v.kind == 'audiooutput'
        })
        if (!this.output) {
          this.output = this.outputlist[0].deviceId
          this.outputplaceholder = this.outputlist[0].label
        }
        console.log(this.outputlist)
      })
    },

    //获取分辨率
    Resolutions(deviceId) {
      this.sdk
        .getAvailableResolutions(deviceId)
        .then((re) => {
          this.Resolutionsdata = re
          this.Resolutionplaceholder = re[0].width + ' x ' + re[0].height
          this.Resolutionval = 0
        })
        .catch((error) => {
          console.log(error.message)
        })
    },

    configbtn() {
      // const deviceinfo = this.outputlist.find(
      //   (v) => v.deviceId == this.outputindex
      // )
      // // 指定输出设备
      // let stream = await navigator.mediaDevices.getUserMedia({
      //   video: false,
      //   audio: deviceinfo,
      // })
      // this.$refs.audio.srcObject = stream
      // 切换音视频设备
      this.$emit(
        'changeaudiovideo',
        this.video,
        this.audio,

        this.Resolutionsdata[this.Resolutionval]
      )
      this.isconfig = false
    },

    //切换选项卡
    selecttab(id) {
      this.select = id
      var data = []
      this.configdata.forEach((item, index) => {
        if (item.id !== id) {
          data.push(item.id)
        }
      })
      this.cssactive(id, data)

      if (id == 0) {
        setTimeout(() => {
          this.openview(document.getElementById('video'))
        }, 200)
      }
    },

    //动态替换选中后的样式
    cssactive(id, data) {
      data.forEach((element) => {
        document
          .getElementById('select' + element)
          .setAttribute('class', 'config-main-left-title')
      })
      const dom = document.getElementById('select' + id)
      dom.setAttribute('class', 'config-main-left-title active')
    },

    //获取邀请信息
    getinvitation() {
      const apiurl = APIUrl.util.meetInvite
      post(apiurl, { meetingId: this.joininfo.channelId })
        .then((res) => {
          console.log('邀请信息', res)
          if (res.status == 200) {
            this.invitationdata = res.data
          } else {
            this.$message.error(res.message)
          }
        })
        .catch((error) => {
          this.$message.error(error)
        })
    },

    //发送消息
    send_msg(type, message) {
      if (type == 'video') {
        vm.$emit('videostatus', message ? 0 : 1)
      } else if (type == 'scene') {
        vm.$emit('scenestatus', message ? 0 : 1)
      }
      const apiurl = APIUrl.util.activepush
      post(apiurl, {
        userId: this.joininfo.userId,
        message: message ? 0 : 1,
        meetingId: this.joininfo.channelId,
        type: type,
      })
        .then((res) => {
          console.log(res)
        })
        .catch((error) => {
          this.$message.error(error)
        })
    },

    //离开会议
    leavemeet(type) {
      if (type == 'over') {
        this.send_msg('over', 0)
      }
      this.$emit('leave', type)
    },

    //一键复制
    copyLink() {
      let _this = this
      let clipboardObj = new this.clipboard('.cobyDomObj')
      clipboardObj.on('success', function () {
        _this.$message.success('复制成功')
        _this.invitation = false
        clipboardObj.destroy()
      })
      clipboardObj.on('error', function () {
        _this.$message.success('复制失败')
      })
    },
  },
}
</script>

<style lang='less'>
.bottom-main {
  position: fixed;
  left: 0;
  bottom: 1vh;
  /* border: 1px solid red; */
  width: 100%;
  height: 8vh;
}
.bottom-img {
  width: 65vh;
  background: rgba(0, 0, 0, 0.5);
  margin: 0 auto;
  height: 100%;
  border-radius: 8vh;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
  padding: 6px 0;
}
.bottomtext {
  width: 64vh;
  margin: 0 auto;
  height: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: center;
  justify-content: space-around;
  margin-top: 3px;
  h3 {
    &:nth-child(1) {
      margin-right: -6px !important;
    }
    &:nth-child(3) {
      margin-right: -5px !important;
    }
    &:nth-child(n + 5) {
      margin-right: 3px !important;
    }
  }
}
.bottom-img img {
  width: 5vh;
  margin: 0 1vh;
  cursor: pointer;
  transition: all 0.3s;
}
.bottom-img img:hover {
  // 鼠标悬停放大样式，配合过渡一起使用才有效果
  transform: scale(1.15);
}
.bottom-img div:nth-child(7) {
  img {
    // width: 47px;
    // display: block;
    border-radius: 100%;
    background-color: #00ccff !important;
  }
}

.invitation-left {
  /* border: 1px solid red; */
  font-weight: 400;
  font-size: 16px;
  color: #666;
}
.invitation-right {
  /* border: 1px solid red; */
  font-weight: 600;
  font-size: 16px;
  color: #333;
}
.invitation {
  margin: 2vh 0;
}
.config-main {
  border: 1px solid rgba(0, 0, 0, 0.2);
  height: 55vh;
  display: flex;
}
.config-main-left {
  border-right: 1px solid rgba(0, 0, 0, 0.2);
  width: 20%;
}
.config-main-right {
  width: 80%;
}
.config-main-right .task {
  margin-top: 20px;
  margin-left: -10px;
}
.config-main-left-title {
  width: 100%;
  /*border: 1px solid red;*/
  padding: 5px 0;
  text-align: center;
  font-weight: 700;
  font-size: 18px;
  color: black;
  margin: 10px 0;
}
.config-main-left-title:hover {
  cursor: pointer;
}
.active {
  background-color: #00ccff;
  color: white;
}
/deep/.el-dialog__wrapper {
  .el-dialog {
    @media screen and (min-width: 100px) and (max-width: 1319px) {
      width: 585px !important;
      height: 576px !important;
    }
    @media screen and (min-width: 1320px) {
      width: 585px !important;
      height: 576px !important;
    }
  }
  .invita {
    /deep/.el-dialog__header {
      background: #f7f7f7 !important;
      padding-right: 47px;
      /deep/.el-dialog__title {
        margin-left: 20px !important;
      }
    }
  }
}
.countdown {
  position: absolute;
  bottom: 34vh;
  left: 48%;
  font-size: 255px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 700;
}
</style>
