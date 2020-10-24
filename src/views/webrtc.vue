<template>
  <div v-if="showmeeting">
    <div v-if="shareStatus"
      style="width:15vh;height:20px;position:absolute;text-align: center;color:#fff;left:calc(50% - 5vh);z-index:9;background:red;line-height:20px;border-radius:20px">
      您正在共享屏幕</div>
    <div class="main-video">
      <div class="changesview" @click="changevideoview()">
        <img width="20px" height="20px" :src="pspeak ? require('../assets/webrtcs/yjz.png') :require('../assets/webrtcs/hualang.png')">
        <span style="font-size:14px;">{{pspeak ? '演讲者视图' : '画廊视图'}}</span>
      </div>
      <!-- 共享视图开始 -->
      <div v-if="speak" class="speak">
        <div class="box" ref="box">
          <div class="left">
            <video oncontextmenu="return true;" :style="{ width: '100%' }" autoplay playsinline id="share"></video>
          </div>
          <div class="resize" title="收缩侧边栏">⋮</div>
          <div class="right">
            <div class="user-right-vedio" :style="{
                width: '98%',
                margin: '1% 0',
                position: 'relative',
                height: speakvideoh + 'px',
                backgroundColor: '#000000',
              }" v-for="(item, key) in users" :key="key" :id="'main' + item.userId" @contextmenu="showMenu">
              <span class="user-right-vedio-title" style="display: none" :id="'s_d' + item.userId">{{ item.displayName }}</span>
              <span :id="'s_name' + item.userId" style="position: absolute; color: white; bottom: 1px; left: 1px">{{ item.displayName }}</span>
              <video oncontextmenu="return true;" :style="{ width: '100%', height: '100%' }" autoplay playsinline :id="item.userId"></video>

            </div>
          </div>
        </div>
      </div>
      <!-- 共享视图结束，演讲者视图开始 -->
      <div v-else-if="pspeak" style="width:100%;height:100%">
        <video oncontextmenu="return true;" :style="{ width: '100%',height:'100%' }" autoplay playsinline id="share"></video>
        <div class="sharename" v-if="!videoStatus" :style="{ width: '79%',height:'100%',background:'#000',color:'#fff' }">{{joininfo.username}}</div>
        <div>
          <div class="pspeak-list" id="pspeak-list-remove" :style="{right:pspeakRight+'px',top:pspeakTop+'px'}">
            <div class="pspeak-list-title" @click="slide">
              <i :class="slideToggle?'el-icon-arrow-up':'el-icon-arrow-down'" style='color:#fff;'></i>
            </div>
            <div class="pspeak-list-cont">
              <div class="mainvideo" v-for="(item, key) in users" :key="key" :id="'main' + item.userId"
                :style="{width:'100%',display:borderid == item.userId ? 'none' : 'block'}">
                <span style="display: none;width:100%;height:112.5px;text-align:center;font-size:12px;line-height:100px;background:black;color:#fff"
                  :id="'d' + item.userId">{{ item.displayName }}</span>
                <div style="width:100%;height:112.5px;position:absolute;color:#fff;" :id="'name' + item.userId">
                  <span :style="{
                  bottom: '3px',
                  left:'62px',
                  position:'absolute',
                  fontSize: '22px',
                  backgroundColor:'rgba(0,0,0,0.5)'
                }">{{ item.displayName }}</span>
                </div>
                <video oncontextmenu="return true;" :style="{ width: '200px', height: '112.5px' ,background:'black'}" autoplay playsinline
                  :id="item.userId"></video>
              </div>

              <!-- 上下翻页按钮 -->
              <!-- <div style="text-align:center;">
                <i @click="prepage" class="el-icon-arrow-up up" style="color:#fff;"></i>
                <i @click="nextpage" class="el-icon-arrow-down down" style="margin-left:10px;color:#fff;"></i>
              </div> -->
            </div>
          </div>
        </div>

      </div>
      <!-- 演讲者视图结束，画廊视图开始 1851.6px-->
      <div v-else :style="{maxWidth: '1851.6px',display:'flex'}">
        <div class="user-vedio" v-for="(item, key) in newusers" :key="key" :id="'main' + item.userId"
          :style="{ width: uservideow + 'px', height: uservideoh + 'px' }" @contextmenu="showMenu">
          <span class="user-vedio-title" style="display: none" :id="'d' + item.userId">{{ item.displayName }}</span>
          <div class="user-video-name" :style="{ width: uservideow + 'px', height: uservideoh + 'px' }" :id="'name' + item.userId">
            <div class="user-video-box" :style="{bottom: '-' + (uservideoh - 30) + 'px',}">
              <span :style="{ fontSize: fontsize + 'px',}">{{ item.displayName }}</span>
            </div>
          </div>

          <video oncontextmenu="return true;" :style="{ width: '100%', height: '100%' }" autoplay playsinline :id="item.userId"
            @dblclick="FullScreenVideo(item.userId)"></video>
        </div>
      </div>

      <!-- 直播地址 -->
      <div v-if="liveUrl">
        <div class="liveaddree" @click="liveslide">
          直播
          <i :class="liveToggle?'el-icon-caret-top':'el-icon-caret-bottom'" style='color:#fff;font-size:20px;'></i>
        </div>
        <ul class="livecontent">
          <li class="cobyDomObj" data-clipboard-action="copy" @click="copyLink" :data-clipboard-text="liveUrl">复制地址</li>
          <li>
            <a :href="liveUrl" target="_blank">打开地址</a>
          </li>
          <li>直播二维码</li>
        </ul>
      </div>

      <i v-if="!pspeak" @click="prepage" class="el-icon-arrow-left"></i>
      <i v-if="!pspeak" @click="nextpage" class="el-icon-arrow-right"></i>

    </div>
    <vue-context-menu :contextMenuData="contextMenuData" @hideview="hideview(1)" @openview="openViewVideo">
    </vue-context-menu>
    <!-- 参会者以及控制栏组件 -->
    <peoplelist ref="peoplelist" @Camera="muteLocalCamera" @Audio="muteLocalMic" @hidecamera="hidecamera" @sethideshowview="sethideshowview"
      @showcamera="showcamera"></peoplelist>
    <consolebottom ref="consolebottom" @Camera="muteLocalCamera" @Audio="muteLocalMic" @leave="leave" @share="share"
      @changeaudiovideo="changeaudiovideo" @shareScreen="shareScreen"></consolebottom>
    <!-- 密码输入框 -->
    <el-dialog title="请会议输入密码" :visible.sync="pwdinput" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" width="30%"
      center>
      <el-form label-position="top" label-width="80px" style="text-align: center">
        <el-form-item label="" class="index-el-form-item">
          <el-input class="index-input" placeholder="密码" v-model="pwd"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="alileave()">取 消</el-button>
        <el-button type="primary" @click="pwdjoin()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 屏幕共享 -->
    <el-dialog title="您正在进行屏幕共享" :visible.sync="changeshare" :close-on-click-modal="false" :close-on-press-escape="false" :destroy-on-close="true"
      :show-close="true" width="80%" center>
      <div style="width:100%" class="sharemain">
        <el-row>
          <el-col :span="6" v-for="(item, index) in sources" :key="index">
            <el-card :body-style="{ padding: '0px' }">
              <img src="../assets/webrtcs/sharebg.jpeg" class="image" :id="'img'+index">
              <video oncontextmenu="return true;" :style="{ width: '100%' ,display:'none'}" autoplay playsinline :id="'share'+index"></video>
              <div style="padding: 14px;">
                <!-- <span>{{item.name}}</span> -->
                <div class="bottom clearfix">
                  <time class="time">{{item.name}}</time>
                </div>
                <el-button @click="webkitGetUserMedia(item.id,index,0)" size="mini">预览</el-button>
                <el-button @click="webkitGetUserMedia(item.id,index,1)" size="mini">共享</el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-dialog>

  </div>
</template>

<script>
// const { ipcRenderer } = window.require("electron"); //渲染进程与主进程通讯方法
import consolebottom from '../components/webrtcBottom.vue' //底部组件
import peoplelist from '../components/participants.vue' //参会者组件
import APIUrl from '@/axios/api.url'
import elementResizeDetectorMaker from 'element-resize-detector'
import { post, get } from '@/axios/index'
import '../util/sdk.js' //引入sdk
import { mapState } from 'vuex' //引入vuex
import { MessageBox } from 'element-ui'
export default {
  name: 'webrtc',
  data() {
    return {
      showlivebox: false,
      liveToggle: false, // 控制直接地址的展示
      slideToggle: false, // 控制小视图展开收起效果
      pspeakTop: 50, //演讲者试图上边距
      pspeakRight: 0, //演讲者试图右边距
      pspeak: false, // 默认画廊视图
      sources: [], //共享数据源数组
      changeshare: false, //是否打开选择共享源界面，默认关闭
      speakvideoh: 111, //共享视图视频的高度
      speak: false, //是否显示共享视图
      users: [], //参会者视频dom数组
      screenWidth: 0, //屏幕宽度
      uservideow: 0, //视频宽度
      uservideoh: 0, //视频高度
      sdk: {}, //webrtc sdk
      joininfo: {}, //加入会议接收到的信息
      showmeeting: false, //是否显示会议界面
      gslb: ['https://rgslb.rtc.aliyuncs.com'], //阿里加入会议固定域名参数
      Fullloading: {}, //是否加载全屏loading
      authinfo: {}, //加入会议的凭证
      audioPublish: true, //是否推流音频
      cameraPublish: true, //是否推流视频
      screenPublish: false, //是否推共享流
      audioStatus: 1, //音频状态，1开，0关
      videoStatus: 1, //视频状态，1开，0关
      socket: {}, //socket  对象
      lockReconnect: false, // 是否真正建立连接
      hearttimeout: 15000, // 15秒一次心跳
      timeoutObj: null, // 心跳倒计时
      serverTimeoutObj: null, // 心跳超时倒计时
      timeoutnum: null, // 断开，重连倒计时
      // contextmenu data (菜单数据)
      contextMenuData: {
        // the contextmenu name(@1.4.1 updated)
        menuName: 'demo',
        // The coordinates of the display(菜单显示的位置)
        axis: {
          x: null,
          y: null,
        },
        // Menu options (菜单选项)
        menulists: [
          {
            fnHandler: 'hideview', // Binding events(绑定事件)
            icoName: 'fa fa-home fa-fw', // icon (icon图标 )
            btnName: this.HideShowView
              ? '显示无视频的参会者视图'
              : '隐藏无视频的参会者视图', // The name of the menu option (菜单名称)
          },
          // {
          //   fnHandler: "openview", // Binding events(绑定事件)
          //   icoName: "fa fa-home fa-fw", // icon (icon图标 )
          //   btnName: "全屏显示", // The name of the menu option (菜单名称)
          // },
        ],
      },
      closecmare: [], //关闭摄像头的userid数组
      pwdinput: false, //是否显示密码输入
      pwd: '', //会议密码
      fontsize: 22, //字体
      userinfo: {}, // 个人信息
      FullScreenVideostatus: 0, //是否全屏
      borderid: '', //边框id
      newusers: [], // 翻页的小视图数组
      pagenum: 1, // 当前页码
      userListlength: '', // 实时在线用户列表长度
    }
  },
  computed: {
    ...mapState([
      'admin',
      'HideShowView',
      'pclosecmare',
      'closecmarenum',
      'shareStatus',
      'isgetplist',
      'liveUrl',
      'plist',
    ]),
  },
  components: {
    consolebottom,
    peoplelist,
  },
  created() {
    this.openFullScreen2('入会中...')
    // 提示用户是否全屏体验
    // this.openalert()
    this.calculation_w_h(document.body.clientWidth) //动态逻辑
    this.sdk = new AliRtcEngine()
    this.init()
    this.callBackInit()
    this.userinfo = JSON.parse(localStorage.getItem('username'))
    this.newusers = this.users.slice(0, 2)

    // console.log('pagenum', this.pagenum)
    if (this.pagenum == 1) {
      document.querySelector('.el-icon-arrow-left').style.display = 'none'
    }
  },

  watch: {
    liveUrl(newv, oldv) {
      if (newv) {
        this.liveToggle = true
      }
    },
    shareStatus(newv, oldv) {
      console.log(newv)
      if (newv == 0) {
        this.$refs.consolebottom.bottoms[4].img = require('../assets/webrtcs/share.png')
        this.$refs.consolebottom.bottoms[4].text = '共享'
      } else {
        this.$refs.consolebottom.bottoms[4].text = '停止共享'
        this.$refs.consolebottom.bottoms[4].img = require('../assets/webrtcs/share.png')
      }
    },
    screenWidth(newv, oldv) {
      this.calculation_w_h(newv)
    },
    admin(newv, oldv) {
      console.log(newv, '监听是否是主持人')
      // if (newv == 0 || newv == 3) {
      //   this.$refs.consolebottom.bottoms.splice(5, 2)
      // }
    },
    HideShowView(newv, oldv) {
      this.contextMenuData.menulists[0].btnName = newv
        ? '显示无视频的参会者视图'
        : '隐藏无视频的参会者视图'
    },
    pclosecmare(newv, oldv) {
      var that = this
      newv.forEach((item) => {
        that.muteCamera(item, 0)
      })
    },
    speak(newv, oldv) {
      if (newv) {
        setTimeout(() => {
          this.dragControllerDiv()
          this.ResizeDetectorMaker()
        }, 1000)
      }
    },
    //监听是否去允许获取参会者列表
    isgetplist(newv, oldv) {
      if (newv) {
        this.getplist()
      }
    },
  },
  destroyed() {
    this.socket.close()
    clearInterval(this.timeoutObj)
    this.timeoutObj = null
    clearInterval(this.serverTimeoutObj)
    this.serverTimeoutObj = null
  },
  mounted() {
    // if (this.pagenum == 1) {
    //   document.querySelector('.el-icon-arrow-left').style.display = 'none'
    // }
    const that = this
    const { ipcRenderer } = window.require('electron')
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth
        if (window.screenWidth >= 850) {
          that.screenWidth = window.screenWidth
        }
      })()
    }
    ipcRenderer.on('leave', (event, message) => {
      this.leave()
    })
    if (this.speak) {
      this.ResizeDetectorMaker()
    }
  },
  methods: {
    copyLink() {
      if (this.liveUrl) {
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
      } else {
        alert('没有直播')
      }
    },
    // 上一页
    prepage() {
      this.pagenum--
      if (this.pagenum == 1) {
        document.querySelector('.el-icon-arrow-left').style.display = 'none'
      }
      this.newusers = this.users.slice((this.pagenum - 1) * 1, this.pagenum * 1)
      var sum = 0 // 计算总人数
      sum += this.newusers.length * this.pagenum
      // 累计显示人数小于数组长度则显示右按钮
      if (sum < this.users.length) {
        document.querySelector('.el-icon-arrow-right').style.display = 'block'
      }
      var userId = this.users[0].userId
      if (this.borderid) {
        userId = this.borderid
      }
      if (userId == this.joininfo.userId) {
        this.closeView()
        setTimeout(() => {
          const dom = document.getElementById(userId)
          this.openview(dom)
        }, 300)
      } else {
        // this.unSubscribe(userId)
        setTimeout(() => {
          // 订阅远端相机流
          this.sdk.configRemoteCameraTrack(userId, true, true)
          // 订阅远端音频流
          this.sdk.configRemoteAudio(userId, true)
          this.sdk
            .subscribe(userId)
            .then((res) => {
              var dom = document.getElementById('share')
              this.sdk.setDisplayRemoteVideo(userId, dom, 1)
              this.closecmare.forEach((item, key) => {
                if (item == userId) {
                  this.muteCamera(userId, 0)
                  if (this.HideShowView) {
                    this.hidecamera(userId)
                    this.sethideshowview(this.closecmarenum)
                  }
                }
              })
            })
            .catch((err) => {
              console.log('subscribe失败', err)
            })
        }, 500)
        this.closeView()
        setTimeout(() => {
          const dom = document.getElementById(this.joininfo.userId)
          this.openview(dom)
        }, 300)
      }

      this.newusers.forEach((item, index) => {
        if (item.userId != userId && item.userId != this.joininfo.userId) {
          // this.unSubscribe(item.userId)
          setTimeout(() => {
            this.subscribe(item)
          }, 500)
        }
      })
      // this.closeopensub(this.newusers)
    },

    // 下一页
    nextpage() {
      this.pagenum++
      console.log(this.pagenum)
      if (this.pagenum !== 1) {
        document.querySelector('.el-icon-arrow-left').style.display = 'block'
      }
      // 每页显示1个人
      this.newusers = this.users.slice((this.pagenum - 1) * 1, this.pagenum * 1)
      var sum = 0
      sum += this.newusers.length * this.pagenum
      // console.log(sum)
      // 累计显示人数等于数组长度则隐藏右按钮
      if (sum == this.users.length) {
        document.querySelector('.el-icon-arrow-right').style.display = 'none'
      }
      var userId = this.users[0].userId
      if (this.borderid) {
        userId = this.borderid
      }
      if (userId == this.joininfo.userId) {
        // this.closeView()
        // setTimeout(() => {
        //   const dom = document.getElementById('share')
        //   this.openview(dom)
        // }, 300)
      } else {
        // this.unSubscribe(userId)
        setTimeout(() => {
          // 订阅远端相机流
          this.sdk.configRemoteCameraTrack(userId, true, true)
          // 订阅远端音频流
          this.sdk.configRemoteAudio(userId, true)
          this.sdk
            .subscribe(userId)
            .then((res) => {
              var dom = document.getElementById(userId)
              this.sdk.setDisplayRemoteVideo(userId, dom, 1)
              this.closecmare.forEach((item, key) => {
                if (item == userId) {
                  this.muteCamera(userId, 0)
                  if (this.HideShowView) {
                    this.hidecamera(userId)
                    this.sethideshowview(this.closecmarenum)
                  }
                }
              })
            })
            .catch((err) => {
              console.log('subscribe失败', err)
            })
        }, 500)
        this.closeView()
        setTimeout(() => {
          const dom = document.getElementById(this.joininfo.userId)
          this.openview(dom)
        }, 300)
      }

      this.newusers.forEach((item, index) => {
        if (item.userId != userId && item.userId != this.joininfo.userId) {
          // this.unSubscribe(item.userId)
          setTimeout(() => {
            this.subscribe(item)
          }, 500)
        }
      })
      // this.closeopensub(this.newusers)
    },

    // 提示用户全屏
    openalert() {
      MessageBox.alert('为了更好的体验建议全屏浏览器', '是否全屏浏览器', {
        confirmButtonText: '确定',
      })
        .then(() => {
          this.full()
        })
        .catch(() => {})
    },

    // 全屏事件
    full() {
      var docElm = document.documentElement
      //W3C
      if (docElm.requestFullscreen) {
        docElm.requestFullscreen()
      }
      //FireFox
      else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen()
      }
      //Chrome等
      else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen()
      }
      //IE11
      else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen()
      }
    },

    // 小视图展开收起
    slide() {
      $('.pspeak-list-cont').slideToggle(500)
      // 隐藏昵称
      this.users.forEach((v) => {
        $('#name' + v.userId).slideToggle(500)
      })
      this.slideToggle = !this.slideToggle
    },

    // 直播地址展开收起
    liveslide() {
      $('.livecontent').slideToggle(300)
      this.liveToggle = !this.liveToggle
    },

    // web端屏幕共享
    shareScreen() {
      console.log(123) // 如果支持屏幕共享（阿里sdk）
      if (this.sdk.isSupportScreenShare()) {
        // let stream = null
        const message = this.screenPublish ? 0 : 1
        const apiurl = APIUrl.util.activepush
        post(apiurl, {
          userId: this.joininfo.userId,
          meetingId: this.joininfo.channelId,
          message,
          type: 'share',
        }).then((res) => {
          if (res.status == 200) {
            this.screenPublish = !this.screenPublish
            this.$store.commit('setshareStatus', this.screenPublish)

            this.alistopstream()
            setTimeout(() => {
              this.alipushstream()
            }, 300)

            this.$message.success(
              this.screenPublish ? '共享成功' : '已停止共享'
            )
          }
        })
      }
    },

    //监听演讲者视图视频div宽度变化
    ResizeDetectorMaker() {
      const _this = this
      const erd = elementResizeDetectorMaker()
      erd.listenTo(
        document.getElementsByClassName('user-right-vedio'),
        (element) => {
          _this.$nextTick(() => {
            //监听到事件后执行的业务逻辑
            this.speakvideoh = (9 * element.scrollWidth) / 16
          })
        }
      )
    },

    //全屏视图
    FullScreenVideo(id) {
      if (this.FullScreenVideostatus) {
        this.FullScreenVideostatus = 0
        const namedom = document.getElementById('name' + id)
        const maindom = document.getElementById('main' + id)
        maindom.style.position = 'relative'
        maindom.style.zIndex = '0'
        namedom.children[0].style.position = 'relative'
        namedom.children[0].style.bottom = '-' + (this.uservideoh - 30) + 'px'
        this.calculation_w_h(document.body.clientWidth, this.closecmarenum) //动态逻辑
        maindom.style.width = this.uservideow + 'px'
        maindom.style.height = this.uservideoh + 'px'
        namedom.style.width = this.uservideow + 'px'
        namedom.style.height = this.uservideoh + 'px'
      } else {
        if (this.pspeak) {
        } else {
          const maindom = document.getElementById('main' + id)
          const namedom = document.getElementById('name' + id)
          maindom.style.position = 'fixed'
          maindom.style.width = '100%'
          maindom.style.height = '100%'
          maindom.style.zIndex = '999'
          maindom.style.backgroundColor = 'black'
          namedom.style.width = '100%'
          namedom.style.height = '100%'
          namedom.children[0].style.bottom = '20px'
          namedom.children[0].style.position = 'absolute'
          this.FullScreenVideostatus = 1
        }
      }
    },

    // 切换视图模式
    changevideoview() {
      this.pspeak = this.pspeak ? false : true
      // 画廊视图
      if (!this.pspeak) {
        console.log(this.users, 'list')
        this.closeopensub(this.users)
        return
      }
      // 演讲者视图
      if (this.pspeak && this.users.length == 1) {
        this.closeView()
        setTimeout(() => {
          const dom = document.getElementById('share')
          this.openview(dom)
        }, 300)
        // 如果参会者列表只有自己，小视图不显示
        // this.users.forEach((v) => {
        //   if (v.userId == this.joininfo.userId) {
        //     // console.log(document.getElementById('main' + v.userId))
        //     // 隐藏视图
        //     document.getElementById('main' + v.userId).style.display = 'none'
        //     // console.log(document.getElementById(v.userId))
        //     document.getElementById(v.userId).style.display = 'none'
        //   }
        // })
      }

      var userId = this.users[0].userId
      if (this.borderid) {
        userId = this.borderid
      }
      if (userId == this.joininfo.userId) {
        this.closeView()
        setTimeout(() => {
          const dom = document.getElementById('share')
          this.openview(dom)
        }, 300)
      } else {
        // this.unSubscribe(userId)
        setTimeout(() => {
          // 订阅远端相机流
          this.sdk.configRemoteCameraTrack(userId, true, true)
          // 订阅远端音频流
          this.sdk.configRemoteAudio(userId, true)
          this.sdk
            .subscribe(userId)
            .then((res) => {
              var dom = document.getElementById('share')
              this.sdk.setDisplayRemoteVideo(userId, dom, 1)
              this.closecmare.forEach((item, key) => {
                if (item == userId) {
                  this.muteCamera(userId, 0)
                  if (this.HideShowView) {
                    this.hidecamera(userId)
                    this.sethideshowview(this.closecmarenum)
                  }
                }
              })
            })
            .catch((err) => {
              console.log('subscribe失败', err)
            })
        }, 500)
        this.closeView()
        setTimeout(() => {
          const dom = document.getElementById(this.joininfo.userId)
          this.openview(dom)
        }, 300)
      }

      this.users.forEach((item, index) => {
        if (item.userId != userId && item.userId != this.joininfo.userId) {
          // this.unSubscribe(item.userId)
          setTimeout(() => {
            this.subscribe(item)
          }, 500)
        }
      })

      this.closecmare.forEach((item) => {
        if (this.HideShowView) {
          this.hidecamera(item)
        } else {
          this.muteCamera(item, 0)
        }
      })

      setTimeout(() => {
        this.removediv('pspeak-list-remove')
      }, 300)
    },

    //获取可用桌面捕获的资源
    async desktopCapturer() {
      const { desktopCapturer } = window.require('electron')
      const sources = await desktopCapturer.getSources({
        types: ['window', 'screen'],
      })
      this.sources = sources
      this.changeshare = true
    },

    //获取媒体流，共享
    webkitGetUserMedia(id, index, type) {
      if (!type) {
        document.getElementById('img' + index).style.display = 'none'
        document.getElementById('share' + index).style.display = 'block'
      }
      navigator.webkitGetUserMedia(
        {
          audio: false,
          video: {
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: id,
              minWidth: 1280,
              maxWidth: 1280,
              minHeight: 720,
              maxHeight: 720,
            },
          },
        },
        (stream) => {
          console.log('stream===========', stream)
          if (type) {
            const VideoTracks = stream.getVideoTracks()[0]
            console.log('VideoTracks=======', VideoTracks)
            this.share(1, VideoTracks)
          } else {
            document.getElementById('share' + index).srcObject = stream
          }
        },
        (error) => {
          console.log(error)
        }
      )
    },

    showMenu() {
      event.preventDefault()
      var x = event.clientX
      var y = event.clientY
      // Get the current location
      this.contextMenuData.axis = {
        x,
        y,
      }
    },

    hideview(e) {
      // console.log(this.HideShowView);
      this.$store.commit('setHideShowView', this.HideShowView ? 0 : 1)
      setTimeout(() => {
        this.$refs.peoplelist.hidevideo()
      }, 500)
    },

    //根据数组长度计算每一个视频窗口的宽高
    calculation_w_h(bodywidth, num = 0) {
      if (this.FullScreenVideostatus) {
        return
      }
      if (this.users.length - num >= 2 && this.users.length - num <= 4) {
        var numbers = 2
      } else if (this.users.length - num > 4) {
        this.fontsize = 22
        var numbers = 4
      } else {
        var numbers = 1
      }
      this.uservideow = (bodywidth * 0.98) / numbers - 15
      this.uservideoh = (this.uservideow * 9) / 16 + 1
    },

    //全屏显示
    openViewVideo() {
      const { ipcRenderer } = window.require('electron')
      ipcRenderer.send('openViewVideo', { path: 'video' })
    },

    //开启全屏loading
    openFullScreen2(title) {
      this.Fullloading = this.$loading({
        lock: true,
        text: title,
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
    },

    //会议初始化
    init() {
      this.joininfo = this.$route.params
      if (!this.joininfo || !this.sdk) {
        alert('进入失败，请检查是否信息的完整性')
        return
      }
      if (!this.joininfo || !this.joininfo.userId) {
        const joininfo = JSON.parse(window.localStorage.getItem('joininfo'))
        if (!joininfo) {
          this.$router.replace({
            name: 'index',
          })
          this.Fullloading.close() //关闭loading
          return
        }
        this.joininfo = joininfo
      }
      this.videoStatus = this.joininfo.video
      this.audioStatus = this.joininfo.scene
      this.$store.commit('setaudioStatus', this.joininfo.video)
      this.$store.commit('setvideoStatus', this.joininfo.scene)
      //用户基本信息存缓存
      window.localStorage.setItem('joininfo', JSON.stringify(this.joininfo))
      //获取会议基本信息，并加入会议
      this.getauthinfo()
      // this.Fullloading.close(); //关闭loading
      //是否默认摄像头和音频
      this.users.push({
        displayName: this.joininfo.username,
        userId: this.joininfo.userId,
      })
      if (this.joininfo.video) {
        setTimeout(() => {
          this.showmeeting = true
        }, 500)
      }
    },

    // 回调接口初始化
    callBackInit() {
      this.sdk.on('onJoin', (publisher) => {
        // console.log('加入', publisher)
        // this.setplist(publisher)
      })
      this.sdk.on('onLeave', (publisher) => {
        console.log(publisher.displayName + '离开了会议')
        this.removeuserview(publisher)
      })
      // 流发布事件，将该用户新增到推流列表，若该用户已存在推流列表，则进行状态更新
      this.sdk.on('onPublisher', (publisher) => {
        var videopush = 1
        this.users.forEach((item, index) => {
          if (item.userId == publisher.userId) {
            this.unSubscribe(publisher.userId)
            videopush = 0
          }
        })
        if (videopush) {
          this.users.push(publisher)
        }
        this.subscribe(publisher)
      })
      // 结束流发布事件，推流列表删除该用户，移除用户视图，初始化订阅状态
      this.sdk.on('onUnPublisher', (publisher) => {
        // this.removeuserview(publisher);
        // this.unSubscribe(publisher.userId);
        this.users.forEach((item, index) => {
          if (item.userId == 's' + publisher.userId) {
            this.users.splice(index, 1)
          }
        })
        this.users.forEach((item, index) => {
          if (item.userId !== this.joininfo.userId) {
            console.log(item, '订阅')
            this.subscribe(item)
          }
        })
        this.calculation_w_h(document.body.clientWidth) //动态逻辑
      })

      //音频回调监听
      this.sdk.on('onAudioLevel', (data) => {
        var userId = ''
        var level = 0
        data.forEach((item) => {
          if (item.level > level) {
            level = item.level
            userId = item.userId
          }
        })
        if (level !== 0) {
          this.setborder(userId)
        }
      })
    },

    //取消/打开订阅
    closeopensub(data) {
      data.forEach((item, index) => {
        if (item.userId !== this.joininfo.userId) {
          // this.unSubscribe(item.userId);
          setTimeout(() => {
            this.subscribe(item)
          }, 500)
        } else {
          this.closeView()
          setTimeout(() => {
            var dom = document.getElementById(this.joininfo.userId)
            this.openview(dom)
          }, 500)
        }
      })
      this.calculation_w_h(document.body.clientWidth) //动态逻辑
    },

    //移除参会者视频dom
    removeuserview(publisher) {
      console.log(this.users, 'canhuizhe')
      this.users.forEach((item, index) => {
        if (item.userId == publisher.userId) {
          this.users.splice(index, 1)
        }
        if (item.userId == 's' + publisher.userId) {
          this.users.splice(index, 1)
        }
      })
      this.users.forEach((item, index) => {
        if (item.userId !== this.joininfo.userId) {
          console.log(item, '订阅')
          this.subscribe(item)
        }
      })
      this.calculation_w_h(document.body.clientWidth) //动态逻辑
    },

    //根据音频回调设置边框
    setborder(id) {
      if (id == 0) {
        id = this.joininfo.userId
      }
      if (!this.pspeak) {
        if (this.borderid) {
          document.getElementById('main' + this.borderid).style.border = 'none'
        }
        document.getElementById('main' + id).style.border = '1px solid #00ccff'
        this.borderid = id
      } else {
        var borderid = this.borderid
        this.borderid = id
        if (id !== borderid) {
          if (id == this.joininfo.userId) {
            this.closeView()
            // this.unSubscribe(borderid);
            setTimeout(() => {
              this.openview(document.getElementById('share'))
              // 小视图也要显示，所以注释
              // document.getElementById('main' + borderid).style.display = 'block'
              this.users.forEach((item) => {
                if (item.userId == borderid) {
                  this.subscribe(item)
                }
              })
            }, 500)
          } else if (borderid == this.joininfo.userId) {
            this.closeView()
            // this.unSubscribe(id);
            setTimeout(() => {
              document.getElementById(
                'main' + this.joininfo.userId
              ).style.display = 'block'
              this.openview(document.getElementById(this.joininfo.userId))
              this.users.forEach((item) => {
                if (item.userId == id) {
                  // 订阅远端相机流
                  this.sdk.configRemoteCameraTrack(id, true, true)
                  // 订阅远端音频流
                  this.sdk.configRemoteAudio(id, true)
                  this.sdk
                    .subscribe(id)
                    .then((res) => {
                      var dom = document.getElementById('share')
                      this.sdk.setDisplayRemoteVideo(id, dom, 1)
                      this.closecmare.forEach((item, key) => {
                        if (item == id) {
                          this.muteCamera(id, 0)
                          if (this.HideShowView) {
                            this.hidecamera(id)
                            this.sethideshowview(this.closecmarenum)
                          }
                        }
                      })
                    })
                    .catch((err) => {
                      console.log('subscribe失败', err)
                    })
                }
              })
            }, 500)
          } else {
            // this.unSubscribe(id);
            // this.unSubscribe(borderid);
            setTimeout(() => {
              this.users.forEach((item) => {
                if (item.userId == borderid) {
                  this.subscribe(item)
                }
              })
              // 订阅远端相机流
              this.sdk.configRemoteCameraTrack(id, true, true)
              // 订阅远端音频流
              this.sdk.configRemoteAudio(id, true)
              this.sdk
                .subscribe(id)
                .then((res) => {
                  var dom = document.getElementById('share')
                  this.sdk.setDisplayRemoteVideo(id, dom, 1)
                  this.closecmare.forEach((item, key) => {
                    if (item == id) {
                      this.muteCamera(id, 0)
                      if (this.HideShowView) {
                        this.hidecamera(id)
                        this.sethideshowview(this.closecmarenum)
                      }
                    }
                  })
                })
                .catch((err) => {
                  console.log('subscribe失败', err)
                })
            }, 500)
          }
        }
      }
      // setTimeout(()=>{
      //     var domvideo = document.getElementById(this.borderid);
      //     var stream = domvideo.captureStream();
      //     console.log(stream.clone())
      //     const { ipcRenderer } = window.require("electron");
      //     ipcRenderer.send("sendstream",stream.clone());
      //   },1000)
    },

    //离开会议
    leave(type) {
      this.openFullScreen2('正在离开会议...')
      const apiurl = APIUrl.util.leave
      post(apiurl, {
        userId: this.joininfo.userId,
        meetingId: this.joininfo.channelId,
        facility: 'web',
        type: type,
        stopTime: this.getTime(),
      })
        .then((res) => {
          if (res.status == 200) {
            this.sdk.leaveChannel().then(
              () => {
                localStorage.removeItem('joininfo')
                localStorage.removeItem('authinfo')
                // this.sdk.muteLocalCamera = true
                this.closeView(this.joininfo.userId)
                this.Fullloading.close() //关闭loading
                this.$router.replace({
                  name: 'index',
                })
              },
              (error) => {
                console.log(error.message)
              }
            )
          }
        })
        .catch((error) => {
          console.log(error)
          this.Fullloading.close() //关闭loading
        })
    },

    //阿里sdk退出会议
    alileave() {
      this.sdk.leaveChannel().then(
        () => {
          localStorage.removeItem('joininfo')
          localStorage.removeItem('authinfo')
          this.$router.replace({
            name: 'index',
          })
        },
        (error) => {
          console.log(error.message)
        }
      )
    },

    //带密码加入会议
    pwdjoin() {
      this.joininfo.pwd = this.pwd
      window.localStorage.setItem('joininfo', JSON.stringify(this.joininfo))
      this.getauthinfo()
    },

    //获取阿里云加入会议频道凭证
    getauthinfo() {
      console.log(this.joininfo)
      const DescribeChannelUsers = APIUrl.util.DescribeChannelUsers
      post(DescribeChannelUsers, {
        ChannelId: this.joininfo.channelId,
      }).then((res) => {
        // console.log(res)
        if (res.status == 200) {
          this.userListlength = res.data.UserList.length
          const apiurl = APIUrl.util.GetAliyunAuthInfo
          post(apiurl, this.joininfo).then((res) => {
            if (res.status == 200) {
              this.pwdinput = false
              this.authinfo = res.data
              this.alijoin()
            } else if (res.status == 401 && res.data == '密码错误') {
              this.pwdinput = true
              this.$message.error('请输入会议密码')
            } else {
              this.$message.error(res.data)
              // 过滤错误的会议号
              const historyList = JSON.parse(
                localStorage.getItem('historyList')
              )
              let newlist = historyList.filter((item) => {
                return item.value !== this.joininfo.channelId
              })
              // 重新存储到本地
              localStorage.setItem('historyList', JSON.stringify(newlist))

              setTimeout(() => {
                window.localStorage.setItem('joininfo', null)

                this.Fullloading.close() //关闭loading
                this.$router.replace({
                  name: 'index',
                })
              }, 1000)
            }
            // console.log(res);
          })
        }
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

    //阿里云接口加入会议
    alijoin() {
      this.sdk
        .joinChannel(
          {
            userid: this.authinfo.userId,
            channel: this.authinfo.channelId,
            appid: this.authinfo.appId,
            nonce: this.authinfo.nonce,
            timestamp: this.authinfo.timestamp,
            gslb: this.gslb,
            token: this.authinfo.token,
          },
          this.joininfo.username
        )
        .then((res) => {
          console.log('入会成功', res)
          this.Fullloading.close() //关闭loading
          this.sdk.setVideoProfile(
            {
              width: 1280,
              height: 720,
              frameRate: 30,
              maxBitrate: 5000000,
            },
            1
          )
          this.alipushstream() //开始推流
          this.initwebsocket() //初始化socket
          setTimeout(() => {
            this.$store.commit('setisgetplist', 1)
          }, 800)
        })
        .catch((error) => {
          console.log('加入房间失败', error)
        })
    },

    //关闭无视频的参会者视图
    hidecamera(uid) {
      const dom = document.getElementById('main' + uid)
      dom.style.display = 'none'
      // console.log(uid,dom);
    },

    // 客户端共享屏幕
    share(type = 0, stream = null) {
      if (!type && !this.screenPublish) {
        this.desktopCapturer()
        return
      }
      const message = this.screenPublish ? 0 : 1
      const apiurl = APIUrl.util.activepush
      post(apiurl, {
        userId: this.joininfo.userId,
        message: message,
        meetingId: this.joininfo.channelId,
        type: 'share',
      })
        .then((res) => {
          if (res.status == 200) {
            this.changeshare = false
            this.screenPublish = !this.screenPublish
            this.$store.commit('setshareStatus', this.screenPublish)
            this.alistopstream()
            setTimeout(() => {
              this.sdk.setExternalMediaTrack(stream, 2)
              this.alipushstream()
            }, 1000)
            this.$message.success(
              this.screenPublish ? '共享成功' : '已停止共享'
            )
          } else if (res.status == 401) {
            this.$message.error('已有参会者正在共享，您无法发起共享')
          } else {
            this.$message.error(res.message)
          }
        })
        .catch((error) => {
          this.$message.error(error)
        })
    },

    //开启无视频的参会者视图
    showcamera(uid) {
      const dom = document.getElementById('main' + uid)
      dom.style.display = 'block'
    },

    //修改开启或隐藏视图状态
    sethideshowview(data) {
      const num = this.HideShowView ? data : 0
      this.calculation_w_h(document.body.clientWidth, num)
    },

    // 音视频推流发布
    alipushstream() {
      this.sdk.configLocalAudioPublish = this.audioPublish
      this.sdk.configLocalCameraPublish = this.cameraPublish
      this.sdk.configLocalScreenPublish = this.screenPublish
      this.sdk.enableAudioVolumeIndicator = true
      this.sdk
        .publish()
        .then((res) => {
          console.log('推流成功')
          setTimeout(() => {
            this.muteLocalMic(this.audioStatus ? false : true)
            this.muteLocalCamera(this.videoStatus ? false : true)
          }, 200)
        })
        .catch((error) => {
          console.log('[推流失败]' + error, 'danger')
        })
    },

    // 停止推流
    alistopstream() {
      this.sdk.unPublish().then(
        () => {
          console.log('停止推流成功！')
        },
        (error) => {
          console.log(error.message)
        }
      )
    },

    // 切换视频方法
    changeaudiovideo(video, audio, Resolutions) {
      this.alistopstream()
      if (video) {
        this.sdk.currentCamera = {
          deviceId: video,
        }
        this.sdk.setVideoProfile(
          {
            width: Resolutions.width,
            height: Resolutions.height,
            frameRate: 30,
            maxBitrate: 5000000,
          },
          1
        )
      }
      if (audio) {
        this.sdk.currentAudioCapture = {
          deviceId: audio,
        }
      }
      setTimeout(() => {
        this.alipushstream()
      }, 300)
    },

    // 修改参会者列表
    updateProperty() {
      const apiurl = APIUrl.util.updatePropety
      post(apiurl, {
        userId: this.joininfo.userId,
        meetingId: this.joininfo.channelId,
        video: this.videoStatus,
        scene: this.audioStatus,
      })
        .then((res) => {
          console.log(res)
        })
        .catch((error) => {
          console.log(error, '更新参会者列表失败')
        })
    },

    // 禁止开放本地音频采集
    muteLocalMic(mute) {
      this.audioStatus = mute ? 0 : 1
      this.sdk.muteLocalMic(mute)
      this.$store.commit('setaudioStatus', this.audioStatus)
      // this.updateProperty();
    },

    //禁止开放本地视频采集
    muteLocalCamera(mute) {
      this.videoStatus = mute ? 0 : 1
      console.log(mute, 'zhuantai')
      this.sdk.muteLocalCamera(mute)
      if (mute) {
        this.closeView(this.joininfo.userId)
        this.muteCamera(this.joininfo.userId, 0)
        if (this.speak) {
          document.getElementById('s_d' + this.joininfo.userId).style.display =
            'block'
          document.getElementById(
            's_name' + this.joininfo.userId
          ).style.display = 'none'
          document.getElementById(this.joininfo.userId).style.display = 'none'
          document.getElementById(
            'main' + this.joininfo.userId
          ).style.backgroundColor = '#000000'
        } else {
          document.getElementById(this.joininfo.userId).style.display = 'none'
          document.getElementById('name' + this.joininfo.userId).style.display =
            'none'
        }
      } else {
        this.muteCamera(this.joininfo.userId, 1)
        // 演讲者视图下打开id为share的video
        if (this.pspeak) {
          const dom = document.getElementById('share')
          this.openview(dom)
        } else {
          // 否则根据userId查找
          const dom = document.getElementById(this.joininfo.userId)
          if (this.speak) {
            document.getElementById(
              's_d' + this.joininfo.userId
            ).style.display = 'none'
            document.getElementById(
              's_name' + this.joininfo.userId
            ).style.display = 'block'
            document.getElementById(this.joininfo.userId).style.display =
              'block'
            document.getElementById(
              'main' + this.joininfo.userId
            ).style.backgroundColor = ''
          } else {
            document.getElementById('d' + this.joininfo.userId).style.display =
              'none'
            document.getElementById(this.joininfo.userId).style.display =
              'block'
            document.getElementById(
              'name' + this.joininfo.userId
            ).style.display = 'block'
          }
          this.openview(dom)
        }
      }
      this.$store.commit('setvideoStatus', this.videoStatus)
      if (!this.speak) {
        this.calculation_w_h(this.screenWidth)
      }
      // this.updateProperty();
    },

    // 隐藏其他人的视频
    muteCamera(uid, message) {
      if (message) {
        if (this.speak) {
          document.getElementById('s_d' + uid).style.display = 'none'
          document.getElementById('s_name' + uid).style.display = 'block'
          document.getElementById(uid).style.display = 'block'
          document.getElementById('main' + uid).style.backgroundColor = ''
        } else {
          document.getElementById('d' + uid).style.display = 'none'
          document.getElementById(uid).style.display = 'block'
          document.getElementById('name' + uid).style.display = 'block'
        }
      } else {
        if (this.speak) {
          document.getElementById('s_d' + uid).style.display = 'block'
          document.getElementById('s_name' + uid).style.display = 'none'
          document.getElementById(uid).style.display = 'none'
          document.getElementById('main' + uid).style.backgroundColor =
            '#000000'
        } else {
          document.getElementById('d' + uid).style.display = 'block'
          document.getElementById(uid).style.display = 'none'
          document.getElementById('name' + uid).style.display = 'none'
        }
      }
    },

    // 获取当前时间，并定义格式
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

    // 订阅房间其他人的视频流
    subscribe(v) {
      console.log('订阅', v)
      this.calculation_w_h(document.body.clientWidth) //动态逻辑
      for (var i = 0; i < v.streamConfigs.length; i++) {
        if (
          v.streamConfigs[i].label === 'sophon_video_camera_large' &&
          v.streamConfigs[i].state === 'active'
        ) {
          // 订阅远端相机流
          this.sdk.configRemoteCameraTrack(v.userId, true, true)
          // 订阅远端音频流
          this.sdk.configRemoteAudio(v.userId, true)

          this.sdk
            .subscribe(v.userId)
            .then((res) => {
              var dom = document.getElementById(v.userId)
              this.sdk.setDisplayRemoteVideo(v.userId, dom, 1)
              this.closecmare.forEach((item, key) => {
                if (item == v.userId) {
                  this.muteCamera(v.userId, 0)
                  if (this.HideShowView) {
                    this.hidecamera(v.userId)
                    this.sethideshowview(this.closecmarenum)
                  }
                }
              })
            })
            .catch((err) => {
              console.log('subscribe失败', err)
            })
        } else if (
          v.streamConfigs[i].label === 'sophon_video_screen_share' &&
          v.streamConfigs[i].state === 'active'
        ) {
          setTimeout(() => {
            // 订阅远端屏幕共享流
            this.sdk.configRemoteScreenTrack(v.userId, true)
            this.sdk
              .subscribe(v.userId)
              .then((re) => {
                var dom = document.getElementById('share')
                setTimeout(() => {
                  console.log(dom)
                  this.sdk.setDisplayRemoteVideo(v.userId, dom, 2)
                }, 500)
              })
              .catch((error) => {
                console.log('[subscribe失败]' + error.message, 'danger')
              })
          }, 1000)
        }
      }
    },

    // 取消订阅该用户所有的流。
    unSubscribe(uid) {
      this.sdk.unSubscribe(uid).then(
        () => {
          console.log('取消订阅成功')
        },
        (error) => {
          console.log(error.message)
        }
      )
    },

    // 关闭本地预览
    closeView() {
      this.sdk
        .stopPreview()
        .then(() => {
          // const id = 'd' + this.joininfo.userId
          // document.getElementById(id).style.display = 'block';
        })
        .catch((err) => {
          console.log(err)
        })
    },

    //初始化weosocket
    initwebsocket() {
      let userId = this.joininfo.userId
      let meetingId = this.joininfo.channelId
      if (this.userListlength || this.$route.params.length) {
        var wxurl =
          'wss://meeting-api.lighos.com/wss?userId=' +
          userId +
          '&meetingId=' +
          meetingId +
          '&facility=web' +
          '&type=begin'
      } else if (!this.userListlength || !this.$route.params.length) {
        var wxurl =
          'wss://meeting-api.lighos.com/wss?userId=' +
          userId +
          '&meetingId=' +
          meetingId +
          '&facility=web' +
          '&type=close'
      }

      this.socket = new WebSocket(wxurl)
      this.socket.onmessage = this.websocketonmessage
      this.socket.onopen = this.websocketonopen
      this.socket.onerror = this.websocketonerror
      this.socket.onclose = this.websocketonclose
    },

    websocketonopen() {
      this.heartbeat() // 连接成功,开启心跳
    },

    websocketonclose(e) {
      console.log('断开连接', e)
    },

    // 心跳检测
    heartbeat() {
      let _this = this
      _this.timeoutObj && clearInterval(_this.timeoutObj)
      _this.serverTimeoutObj && clearInterval(_this.serverTimeoutObj)
      _this.timeoutObj = setInterval(() => {
        // 成功连接时，发送心跳消息
        if (_this.socket.readyState == 1) {
          _this.socket.send('web_ping')
        } else {
          // 否则重连
          if (!this.logout) {
            _this.reconnect()
          }
        } // 超时关闭倒计时
        _this.serverTimeoutObj = setInterval(() => {
          // _this.socket.close()
        }, _this.hearttimeout)
      }, _this.hearttimeout)
    },

    // websocket重连
    reconnect() {
      let that = this
      if (that.lockReconnect) {
        return
      }
      that.lockReconnect = true // 一直重连，设置重连延迟避免请求过多
      that.timeoutnum && clearTimeout(that.timeoutnum)
      that.timeoutnum = setTimeout(() => {
        that.net_close = true
        that.initwebsocket()
        that.lockReconnect = false
      }, 5000)
    },

    websocketonerror() {
      this.reconnect() //连接建立失败重连
    },

    // 获取参会者列表
    getplist() {
      // console.log(this.isgetplist)
      if (!this.isgetplist) {
        return
      }
      const joininf = window.localStorage.getItem('joininfo')
      const joininfo = JSON.parse(joininf)
      const apiurl = APIUrl.util.getParticipant
      post(apiurl, { meetingId: joininfo.channelId })
        .then((res) => {
          console.log(res, 'webrtc参会者')
          if (res.status == 200) {
            this.$store.commit('setisgetplist', 0)
            // this.plist = res.data.participant
            this.$store.commit('setplist', res.data.participant)
            this.$refs.peoplelist.isadmin(res.data.participant)
          }
        })
        .catch((error) => {
          console.log(error, '获取参会者列表错误')
        })
    },

    //websocket接收事件
    websocketonmessage(e) {
      const data = JSON.parse(e.data)
      // console.log(data)
      switch (data.type) {
        case 'Hostvideo':
          console.log(data)
          if (data.message.userId == this.joininfo.userId) {
            this.muteLocalCamera(data.message.video ? false : true)
            this.$refs.peoplelist.setplist('save', data.message)
          } else {
            this.$refs.peoplelist.setplist('save', data.message)
            this.muteCamera(data.message.userId, data.message.video)
          }
          if (!data.message.video) {
            this.closecmare.push(data.message.userId)
          } else {
            this.closecmare.forEach((item, index) => {
              if (item == data.message.userId) {
                this.closecmare.splice(index, 1)
              }
            })
          }
          return
        case 'Hostscene':
          if (data.message.userId == this.joininfo.userId) {
            this.muteLocalMic(data.message.scene ? false : true)
          }
          this.$refs.peoplelist.setplist('save', data.message)
          return
        case 'over':
          this.alileave()
          return
        case 'join':
          if (data.message.userId !== this.joininfo.userId) {
            this.$refs.peoplelist.setplist('add', data.message)
            if (!data.message.video) {
              this.closecmare.push(data.message.userId)
            }
          }
          return
        case 'leave':
          this.$refs.peoplelist.setplist('exit', data.message)
          return
        case 'video':
          console.log(data)
          if (data.message.userId !== this.joininfo.userId) {
            // this.muteLocalCamera(data.message.video ? false : true)
            this.muteCamera(data.message.userId, data.message.video)
            this.$refs.peoplelist.setplist('save', data.message)
            if (!data.message.video) {
              this.closecmare.push(data.message.userId)
            } else {
              this.closecmare.forEach((item, index) => {
                if (item == data.message.userId) {
                  this.closecmare.splice(index, 1)
                }
              })
            }
          }
          return
        case 'scene':
          if (data.message.userId !== this.joininfo.userId) {
            // this.muteLocalMic(data.message.scene ? false : true)
            this.$refs.peoplelist.setplist('save', data.message)
          }
          return
        case 'share':
          if (data.message.userId != this.joininfo.userId) {
            this.speak = data.message.value == 1 ? true : false
            setTimeout(() => {
              this.closeopensub(this.users)
            }, 1000)
          }
          return
        // 主持人移交权限
        case 'handHost':
          console.log(data)
          // 如果id等于我自己，分为两种情况：1.别人给我，2.我收回别人
          if (data.message.userId == this.joininfo.userId) {
            // 如果我的admin为0，则代表别人给我
            if (this.admin == 0) {
              if (data.message.value == '1') {
                this.$message.success('您的主持人权限被收回')
                this.$store.commit('setadmin', 0)
              } else if (data.message.value == '0') {
                this.$message.success('您已被赋予主持人')
                this.$store.commit('setadmin', 2)
              }
              // 如果我的admin为1或3，则代表我收回别人的权限
            } else if (this.admin == 1 || this.admin == 3) {
              this.$message.success('您已收回主持人权限')
              this.$store.commit('setadmin', 1)
            }
            // 如果收到id不是我，则更新参会者列表
          } else if (data.message.userId !== this.joininfo.userId) {
            this.plist.forEach((v) => {
              if (v.userId == data.message.userId) {
                if (data.message.value == '0') {
                  this.$message.success(v.username + '已称为主持人')
                  this.$store.commit('setisgetplist', 1)
                } else {
                  this.$message.success(v.username + '已收回主持人权限')
                }
              }
            })
          }
          this.$store.commit('setisgetplist', 1)
          return
        // 会议超时退出
        case 'timepermit':
          console.log(data)
          this.$message.warning('已超出会议时长限制,您将被强制退出会议')
          setTimeout(() => {
            this.alileave()
          }, 2000)
          return
        // 移交录制权限
        case 'transcribe':
          console.log(data)
          if (data.message.userId == this.joininfo.userId) {
            // this.getplist()
            if (data.message.vaule == '1') {
              this.$message.success('您已被赋予录制权限')
            } else {
              this.$message.success('您已被收回录制权限')
            }
          }
          this.$store.commit('setisgetplist', 1)
          return
        // 移交直播权限
        case 'streaming':
          console.log(data)
          if (
            data.message.userId == this.joininfo.userId &&
            (this.admin !== 1 || this.admin !== 2)
          ) {
            if (data.message.value == '1') {
              this.$message.success('您已被赋予直播权限')
            } else {
              this.$message.success('您已被收回直播权限')
            }
          }
          this.$store.commit('setisgetplist', 1)
          // this.getplist()
          return
      }
    },

    dragControllerDiv() {
      var that = this
      var resize = document.getElementsByClassName('resize')
      var left = document.getElementsByClassName('left')
      var mid = document.getElementsByClassName('right')
      var box = document.getElementsByClassName('box')
      for (let i = 0; i < resize.length; i++) {
        // 鼠标按下事件
        resize[i].onmousedown = function (e) {
          //颜色改变提醒
          resize[i].style.background = '#818181'
          var startX = e.clientX
          // 鼠标拖动事件
          document.onmousemove = function (e) {
            resize[i].left = startX
            var endX = e.clientX
            var moveLen = resize[i].left + (endX - startX) // （endx-startx）=移动的距离。resize[i].left+移动的距离=左边区域最后的宽度
            var maxT = box[i].clientWidth - resize[i].offsetWidth // 容器宽度 - 左边区域的宽度 = 右边区域的宽度
            if (moveLen < 700) moveLen = 700 // 左边区域的最小宽度为32px
            if (moveLen > maxT - 150) moveLen = maxT - 150 //右边区域最小宽度为150px
            resize[i].style.left = moveLen // 设置左侧区域的宽度
            for (let j = 0; j < left.length; j++) {
              left[j].style.width =
                (moveLen / document.body.clientWidth) * 100 + '%'
              mid[j].style.width =
                ((box[i].clientWidth - moveLen) / document.body.clientWidth +
                  0.012) *
                  100 +
                '%'
            }
            var rigthw =
              ((box[i].clientWidth - moveLen) / document.body.clientWidth +
                0.012) *
              100
          }
          // 鼠标松开事件
          document.onmouseup = function (evt) {
            //颜色恢复
            resize[i].style.background = 'rgba(214,214,214,0.1)'
            document.onmousemove = null
            document.onmouseup = null
            resize[i].releaseCapture && resize[i].releaseCapture() //当你不在需要继续获得鼠标消息就要应该调用ReleaseCapture()释放掉
          }
          resize[i].setCapture && resize[i].setCapture() //该函数在属于当前线程的指定窗口里设置鼠标捕获
          return false
        }
      }
    },

    //拖动事件
    removediv(id) {
      var dom = document.getElementById(id)
      dom.onmousedown = (e) => {
        // console.log(e)
        var startX = e.clientX + this.pspeakRight
        var startY = e.clientY - this.pspeakTop
        document.onmousemove = (e) => {
          var endX = e.clientX
          var endY = e.clientY
          var rmlenr = startX - endX
          var rmlent = endY - startY
          var domh = dom.offsetHeight
          if (this.pspeakRight + rmlenr > 0) {
            this.pspeakRight = rmlenr
          }
          if (
            this.pspeakTop + rmlent > 0 &&
            rmlent + domh + 10 < document.documentElement.clientHeight
          ) {
            this.pspeakTop = rmlent
          }
        }
        // 鼠标松开事件
        document.onmouseup = function (evt) {
          document.onmousemove = null
          document.onmouseup = null
          dom.releaseCapture && resize[i].releaseCapture() //当你不在需要继续获得鼠标消息就要应该调用ReleaseCapture()释放掉
        }
        dom.setCapture && resize[i].setCapture() //该函数在属于当前线程的指定窗口里设置鼠标捕获
        return false
      }
    },
  },
}
</script>

<style>
body {
  background-color: #333 !important;
}

.main-video {
  width: 99%;
  /* min-width: 1500px; */
  /* border: 1px red solid; */
  height: 84vh;
  position: relative;
  margin: 0 auto;
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
}
.main-video .sharename {
  position: absolute;
  top: 0;
  left: 10.4%;
  text-align: center;
  line-height: 20;
  font-size: 40px;
}
.el-icon-arrow-left {
  position: absolute;
  top: 50%;
  left: -8px;
  z-index: 99;
  font-size: 50px;
  color: #fff;
  cursor: pointer;
  opacity: 0.7;
}
.el-icon-arrow-right {
  position: absolute;
  top: 50%;
  right: -9px;
  z-index: 99;
  font-size: 50px;
  color: #fff;
  cursor: pointer;
  opacity: 0.7;
}
.user-vedio {
  width: 241.7px;
  height: 136px;
  background-color: black;
  /* border: 1px solid red; */
  margin-bottom: 0.5%;
  margin-left: 0.5%;
}

.user-vedio-title {
  color: white;
  font-size: 2rem;
  /* border: 1px solid red; */
  width: 100%;
  height: 55%;
  text-align: center;
  padding-top: 24%;
}

.user-video-name {
  /* border: 1px red solid; */
  position: fixed;
  text-align: center;
  color: white;
  font-size: 18px;
}
.user-video-box {
  position: relative;
}

.user-video-name span {
  /* border: 1px solid red; */
  padding: 0 3vh;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 8vh;
  /* position: absolute; */
  overflow: hidden; /*超出部分隐藏*/
  white-space: nowrap; /*禁止换行*/
  text-overflow: ellipsis; /*省略号*/
  box-sizing: border-box;
  display: block;
  margin: 0 auto;
  width: 276px;
  /* left: 43%; */
}
.speech_view {
  position: fixed;
  top: 10vh;
  right: 0;
  width: 20vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.speak {
  /* border: 1px solid red; */
  width: 100%;
  height: 100%;
  position: relative;
}
.box {
  width: 100%;
  height: 100%;
}

.left {
  width: 80%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  float: left;
  display: flex;
  /* border: 1px solid red; */
}
.resize {
  cursor: col-resize;
  float: left;
  position: relative;
  top: 45%;
  background-color: rgba(214, 214, 214, 0.1);
  border-radius: 5px;
  width: 0.6%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  background-size: cover;
  background-position: center;
  font-size: 0.32rem;
  color: white;
}
/*拖拽区鼠标悬停样式*/
.resize:hover {
  color: #444444;
}
.right {
  /* border: 1px solid red; */
  height: 100%;
  float: left;
  width: 19%;
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  flex-flow: column;
}

.user-right-vedio-title {
  display: none;
  padding: 10% 0;
  color: white;
  text-align: center;
  font-size: 1.25rem;
  height: 8vh;
  line-height: 8vh;
}
.username {
  position: absolute;
  left: 35%;
  bottom: 5%;
  color: white;
  font-size: 1.5rem;
  background-color: rgba(204, 204, 204, 0.7);
  border-radius: 8vh;
  padding: 0 5vh;
}

#view {
  position: absolute;
  top: 3vh;
  right: 1vw;
  width: 132px;
  height: 44px;
  border-radius: 22px;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 5px;
  cursor: pointer;
  z-index: 9999999;
}
#view span {
  font-size: 16px;
  color: #fff;
}
.image {
  width: 100%;
}
.clearfix {
  height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.sharemain {
  max-height: 600px;
  height: 50vh;
  overflow: auto;
}
.main-video .changesview {
  width: 102px;
  color: #fff;
  height: 40px;
  padding: 0 5px;
  position: absolute;
  right: 0px;
  top: 0px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 40px;
  z-index: 1;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.main-video .changesview:hover {
  cursor: pointer;
}
.main-video .pspeak-list {
  position: absolute;
  width: 200px;
  top: 50px;
  right: 0px;
}
.main-video .pspeak-list:hover {
  cursor: pointer;
}
.pspeak-list-title {
  width: 100%;
  height: 20px;
  line-height: 20px;
  text-align: right;
  padding-right: 15px;
  background-color: rgba(0, 0, 0, 0.8);
  box-sizing: border-box;
}
.pspeak-list-cont {
  width: 100%;
  max-height: 233px;
  overflow-y: auto;
  position: relative;
}
.pspeak-list-cont::-webkit-scrollbar {
  display: none;
}
.pspeak-list-cont .mainvideo {
  /* max-height: 116.5px;
  overflow: hidden; */
}
.pspeak-list-cont .pages {
  font-size: 12px;
  padding: 3px 5px;
  background-color: #00ccff;
  color: #fff;
  text-align: center;
  border-radius: 5px;
}
.el-pagination span {
  background: #00ccff;
  color: #fff;
  padding: 0 4px;
  border-radius: 5px;
}
.liveaddree {
  width: 105px;
  height: 44px;
  border-radius: 22px;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99999;
  position: absolute;
  top: 0;
  left: 22px;
  color: #fff;
  text-align: center;
  line-height: 44px;
  cursor: pointer;
}
.livecontent {
  width: 104px;
  height: 110px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 14px;
  z-index: 99999;
  position: absolute;
  top: 47px;
  left: 22px;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}
.livecontent li {
  cursor: pointer;
}
.livecontent li a {
  text-decoration: none;
  color: #fff;
}
.livecontent li:hover {
  color: #00ccff;
}
</style>
