<template>
  <!-- 禁止鼠标选中 -->
  <div v-if="showmeeting" onselectstart="return false"
    style="-moz-user-select: none;-o-user-select: none;-khtml-user-select: none;-webkit-user-select: none;-ms-user-select: none;user-select: none;">
    <div v-if="shareStatus"
      style="width:15vh;height:20px;position:absolute;text-align: center;color:#fff;left:calc(50% - 5vh);z-index:9;background: rgba(255, 255, 255, 0.3);line-height:20px;border-radius:20px">
      您正在共享屏幕</div>
    <div class="main-video">
      <div class="changesview" @click="changevideoview()">
        <img width="20px" height="20px" :src="pspeak ? require('../assets/webrtcs/yjz.png') :require('../assets/webrtcs/hualang.png')">
        <span style="font-size:14px;">{{pspeak ? '画廊视图' : '演讲者视图'}}</span>
      </div>
      <!-- 共享视图开始 -->
      <div v-if="speak" class="speak">
        <div class="box" ref="box">
          <div class="left">
            <video oncontextmenu="return true;" :style="{ width: '100%' }" autoplay playsinline id="share"></video>
          </div>
          <div class="resize" title="收缩侧边栏">⋮</div>
          <div class="right" style="position:relative;">
            <div class="user-right-vedio" :style="{
                width: speakvideow + 'px',
                margin: '-1% 1% 2% 0',
                position: 'relative',
                height: speakvideoh + 'px',
                backgroundColor: '#000000',
                boxSizing: 'border-box'
              }" v-for="(item, key) in newusers" :key="key" :id="'main' + item.userId" @contextmenu="showMenu">
              <span class="user-right-vedio-title" style="display: none" :id="'s_d' + item.userId">{{ item.displayName }}</span>
              <span :id="'s_name' + item.userId" style="position: absolute; color: white; bottom: 1px; left: 1px">{{ item.displayName }}</span>
              <video oncontextmenu="return true;" :style="{ width: '99.99%', height: '99.95%' }" autoplay playsinline :id="item.userId"></video>
            </div>
            <i v-if="!pspeak&&pagenum!=1" @click="prepage" class="el-icon-arrow-left"
              style="position: absolute;bottom:14%;right:12%;font-size:38px;color:#fff"></i>
            <i v-if="!pspeak&&users.length!==newusers.length" @click="nextpage" class="el-icon-arrow-right"
              style="position: absolute;bottom:14%;right:8%;font-size:38px;color:#fff"></i>
          </div>
        </div>
      </div>

      <!-- 共享视图结束，演讲者视图开始 -->
      <div v-else-if="pspeak" style="width:100%;height:98%;position:relative;">
        <video oncontextmenu="return true;" :style="{ width: '98%',height:'98%',position:'absolute',bottom:'1%',left:'0' }" autoplay playsinline
          id="share"></video>
        <!-- 关闭焦点视图按钮 -->
        <!-- <button v-if="fullScreenState" @click="closeFullScreen"
               style="padding:11px 16px;border-radius:29px;position:fixed; top:11px;right:7%;color:#fff;font-size:14px;background:rgba(0, 0, 0, 0.5);cursor:pointer;border:0;outline:none">关闭焦点视图</button> -->
        <div class="sharename" v-if="!videoStatus" :style="{ width: '79%',height:'100%',background:'#000',color:'#fff' }">{{joininfo.username}}
        </div>
        <div class="pspeak-list" id="pspeak-list-remove"
          :style="{right:pspeakRight+'px',top:pspeakTop+'px',display:users.length == 1 ? 'none' : 'block'}">
          <div class="pspeak-list-title" @click="slide">
            <i :class="slideToggle?'el-icon-arrow-up':'el-icon-arrow-down'" style='color:#fff;'></i>
          </div>
          <div class="pspeak-list-cont">
            <!-- display:borderid == item.userId ? 'none' : 'block' -->
            <div class="mainvideo" v-for="(item, key) in users" :key="key" :id="'main' + item.userId"
              :style="{width:'100%',display:borderid == item.userId ? 'none' : 'block'}">
              <span style="display: none;width:100%;height:112.5px;text-align:center;font-size:12px;line-height:100px;background:black;color:#fff"
                :id="'d' + item.userId">{{ item.displayName }}</span>
              <div style="width:100%;height:112.5px;position:absolute;color:#fff;" :id="'name' + item.userId">
                <span :style="{
                  top: '78%',
                  left:'50%',
                  position:'absolute',
                  fontSize: '18px',
                  backgroundColor:'rgba(0,0,0,0.5)',
                  transform:'translateX(-50%)',
                  padding:'0 10px',
                  borderRadius: '15px'
                }">{{ item.displayName }}</span>
              </div>
              <!-- @dblclick="speakFullScreen(item.userId)" -->
              <video oncontextmenu="return true;" :style="{ width: '200px', height: '112.5px' ,background:'black'}" autoplay playsinline
                :id="item.userId"></video>
            </div>
          </div>
        </div>
      </div>

      <!-- 演讲者视图结束，画廊视图开始 1851.6px-->
      <div v-else class="user-vedio" v-for="(item, key) in newusers" :key="key" :id="'main' + item.userId"
        :style="{ width: uservideow + 'px', height: uservideoh + 'px'}" @contextmenu="showMenu">
        <span class="user-vedio-title" style="display: none" :id="'d' + item.userId">{{ item.displayName }}</span>
        <div class="user-video-name" :style="{ width: uservideow +'px', height: uservideoh +'px'}" :id="'name' + item.userId">
          <!-- <div class="user-video-box" :style="{bottom: '-' + (uservideoh - 30) + 'px',}">
            </div> -->
          <span
            :style="{ fontSize: fontsize + 'px',position:'absolute',bottom:'1.2%',transform:'translateX(-50%)',left:'50%'}">{{ item.displayName }}</span>
        </div>
        <video oncontextmenu="return true;" :style="{ width: '100%', height: '99.98%' }" autoplay playsinline :id="item.userId"
          @dblclick="FullScreenVideo(item.userId)"></video>
      </div>

      <!-- 直播地址 -->
      <div v-if="liveUrl">
        <div class="liveaddree" @click="liveslide">
          直播
          <i :class="liveToggle?'el-icon-caret-top':'el-icon-caret-bottom'" style='color:#fff;font-size:20px;'></i>
        </div>
        <ul class="livecontent">
          <li class="cobyDomObj " data-clipboard-action="copy" @click="copyLink" :data-clipboard-text="liveUrl">复制地址</li>
          <!--  @click="openAddress" -->
          <li class="liveAddress">
            <!-- 打开地址 -->
            <a :href="liveUrl" target="_blank">打开地址</a>
          </li>
          <li class="liveqrcode" @mouseover="mouseOver()" @mouseleave="mouseLeave()">直播二维码</li>
        </ul>
        <div v-if="showQrcode" id="qrcode" ref="qrcode"></div>
      </div>

      <!-- 左右翻页按钮 -->
      <!-- <i v-if="!pspeak&&pagenum!=1&&!speak" @click="prepage" class="el-icon-arrow-left left_page"></i>
      <i v-if="!pspeak&&users.length!==newusers.length&&!speak" @click="nextpage" class="el-icon-arrow-right right_page"></i> -->
      <img v-if="!pspeak&&pagenum!=1&&!speak" @click="prepage" src="../assets/webrtcs/left_page.svg" alt="" class="left_page">
      <img v-if="!pspeak&&users.length!==newusers.length&&!speak" @click="nextpage" src="../assets/webrtcs/right_page.svg" alt="" class="right_page">

    </div>
    <vue-context-menu :contextMenuData="contextMenuData" @hideview="hideview(1)" @openview="openViewVideo">
    </vue-context-menu>

    <!-- 参会者以及控制栏组件 -->
    <peoplelist ref="peoplelist" :video_flag='video_flag' :scene_flag='scene_flag' @Camera="muteLocalCamera" @Audio="muteLocalMic"
      @hidecamera="hidecamera" @sethideshowview="sethideshowview" @showcamera="showcamera"></peoplelist>
    <consolebottom ref="consolebottom" :video_flag='video_flag' :scene_flag='scene_flag' @setqrcode="creatQrCode" @Camera="muteLocalCamera"
      @Audio="muteLocalMic" @leave="leave" @share="share" @changeaudiovideo="changeaudiovideo" @shareScreen="shareScreen"></consolebottom>
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
import consolebottom from '../components/webrtcBottom.vue' //底部组件
import peoplelist from '../components/participants.vue' //参会者组件
import APIUrl from '@/axios/api.url'
import elementResizeDetectorMaker from 'element-resize-detector'
import { post, get } from '@/axios/index'
import '../util/sdk.js' //引入sdk
import { mapState } from 'vuex' //引入vuex
import { MessageBox } from 'element-ui'
import vm from '@/event.js'
import QRCode from 'qrcodejs2' // 引入二维码生成器
export default {
  name: 'webrtc',
  data() {
    return {
      showQrcode: false, // 是否展示二维码
      showlivebox: false,
      liveToggle: false, // 控制直接地址的展示
      slideToggle: false, // 控制小视图展开收起效果
      pspeakTop: 50, //演讲者试图上边距
      pspeakRight: 0, //演讲者试图右边距
      pspeakLeft: 110, //演讲者试图右边距
      pspeak: false, // 默认画廊视图
      sources: [], //共享数据源数组
      changeshare: false, //是否打开选择共享源界面，默认关闭
      speakvideoh: 210, //共享视图视频的高度
      speakvideow: 368, //共享视图视频的高度
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
            btnName: this.HideShowView ? '显示无视频的参会者视图' : '隐藏无视频的参会者视图', // The name of the menu option (菜单名称)
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
      showbb: true,
      video_flag: true, // 主持人关摄像头后控制开关
      scene_flag: true, // 主持人关麦克风后控制开关
      rightwidth: 732,
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
      // 'plist',
      'fullScreenState',
    ]),
    // 计算属性是根据data中已有数据计算来得到新的数据，所以不能赋值，可使用set来解决
    plist: {
      get() {
        return this.$store.state.plist
      },
      set() {},
    },
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

    // 绑定快捷键事件
    document.addEventListener('keydown', this.bindKeycode)
  },

  watch: {
    rightwidth(newv, oldv) {
      // console.log('newv', newv)
    },
    // 监听是否在直播中
    liveUrl(newv, oldv) {
      if (newv) {
        this.liveToggle = true
      }
    },
    shareStatus(newv, oldv) {
      console.log(newv)
      if (newv == 0) {
        this.$refs.consolebottom.bottoms[4].img = require('../assets/webrtcs/share.svg')
        this.$refs.consolebottom.bottoms[4].text = '共享'
      } else {
        this.$refs.consolebottom.bottoms[4].text = '共享中'
        this.$refs.consolebottom.bottoms[4].img = require('../assets/webrtcs/share.svg')
      }
    },
    screenWidth(newv, oldv) {
      // console.log('计算123')
      console.log(newv)
      this.calculation_w_h(newv)
    },
    admin(newv, oldv) {
      console.log(newv, '监听是否是主持人')
      // if (newv == 0 || newv == 3) {
      //   this.$refs.consolebottom.bottoms.splice(5, 2)
      // }
    },
    HideShowView(newv, oldv) {
      this.contextMenuData.menulists[0].btnName = newv ? '显示无视频的参会者视图' : '隐藏无视频的参会者视图'
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
          // console.log(1111111111111)
          this.movingW_H(this.rightwidth, this.closecmarenum)
        }, 1000)
      }
    },
    //监听是否去允许获取参会者列表
    isgetplist(newv, oldv) {
      if (newv) {
        this.getplist()
      }
    },
    // 监听newusers数组的长度变化,如果当前页的没有用户，那么自动返回上一页
    'newusers.length': {
      handler(newv, oldv) {
        // console.log('newlength===', newv)
        if (!newv) {
          this.prepage()
        }
        console.log('人员总数', newv * this.pagenum)
      },
    },
    'users.length': {
      handler(newv, oldv) {
        // console.log('userlength====', newv)
        // 如果users数组长度大于总共显示的个数，那么就显示下一页按钮
        if (newv > this.pagenum * 2) {
          if (this.speak) {
            document.querySelector('.el-icon-arrow-right').style.display = 'block'
          } else {
            document.querySelector('.right_page').style.display = 'block'
          }
        }
      },
    },

    // fullScreenState(newv, oldv) {
    //   console.log(newv)
    //   if (newv == 0) {
    //     this.$store.commit('setfullScreenState', 0)
    //     this.sdk.on('onAudioLevel', (data) => {
    //       var userId = ''
    //       var level = 0
    //       data.forEach((item) => {
    //         if (item.level > level) {
    //           level = item.level
    //           userId = item.userId
    //         }
    //       })
    //       if (level !== 0) {
    //         this.setborder(userId)
    //       }
    //     })
    //   }
    // },
  },
  beforeDestroy() {
    // 销毁快捷键事件，防止全局生效
    document.removeEventListener('keydown', this.bindKeycode)
  },
  destroyed() {
    this.socket.close()
    clearInterval(this.timeoutObj)
    this.timeoutObj = null
    clearInterval(this.serverTimeoutObj)
    this.serverTimeoutObj = null
  },
  mounted() {
    const that = this
    // const { ipcRenderer } = window.require('electron')
    window.onresize = () => {
      console.log('resize')
      return (() => {
        window.screenWidth = document.body.clientWidth
        if (window.screenWidth >= 850) {
          that.screenWidth = window.screenWidth
        }
      })()
    }

    // window.addEventListener('beforeunload', (e) => {
    //   console.log('leave');
    //   that.leave()
    //   return 0
    // })

    // ipcRenderer.on('leave', (event, message) => {
    //   this.leave()
    // })
    // console.log('pagenum', this.pagenum)

    if (that.speak) {
      that.ResizeDetectorMaker()
    }
  },
  methods: {
    // 快捷键事件
    bindKeycode(event) {
      var _this = this
      var e = event || window.event || arguments.callee.caller.arguments[0]
      // 显示与隐藏底部菜单栏，快捷键 ‘空格键’
      if (e.keyCode == 32) {
        // 按 space
        _this.$refs.consolebottom.bottom_img_show = !_this.$refs.consolebottom.bottom_img_show
        if (!_this.$refs.consolebottom.bottom_img_show) {
          document.querySelector('.main-video').style.height = '100vh'
        } else {
          document.querySelector('.main-video').style.height = '90vh'
        }
        // 切换视图，alt+v
      } else if (e.keyCode == 86 && e.altKey) {
        _this.changevideoview()
      }
    },

    // 鼠标移入显示二维码
    mouseOver() {
      this.creatQrCode(this.liveUrl)
      this.showQrcode = true
    },

    // 鼠标移除隐藏二维码
    mouseLeave() {
      this.showQrcode = false
    },

    // 客户端打开直播地址
    openAddress() {
      window.open(this.liveUrl)
    },

    // 生成直播间二维码
    creatQrCode(message, index) {
      this.showQrcode = true
      // DOM元素加载完成后再生成二维码
      this.$nextTick(() => {
        var qrcode = new QRCode(this.$refs.qrcode, {
          text: message, // 需要转换为二维码的内容
          width: 100,
          height: 100,
          colorDark: '#000000',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.H,
        })
      })
    },

    // windows打开子窗口
    opennew() {
      const { ipcRenderer, BrowserWindow } = window.require('electron')
      ipcRenderer.send('opennew', 'peoplelist')
    },

    // 演讲者关闭双击放大视图
    closeFullScreen() {
      this.$store.commit('setfullScreenState', 0)
    },

    // 复制直播间链接
    copyLink() {
      if (this.liveUrl) {
        let _this = this
        // $('.cobyDomObj').addClass('libox').siblings('li').removeClass('libox')
        // $('.cobyDomObj').addClass('libox').siblings('li a').removeClass('libox')
        let clipboardObj = new this.clipboard('.cobyDomObj')
        clipboardObj.on('success', function () {
          _this.$message.success('复制成功')
          _this.invitation = false
          clipboardObj.destroy()
        })
        clipboardObj.on('error', function () {
          _this.$message.success('复制失败')
        })
        _this.showQrcode = false
        _this.$refs.qrcode.innerHTML = ''
      } else {
        alert('没有直播')
      }
    },

    // 上一页
    prepage() {
      this.pagenum--
      console.log(this.pagenum)
      this.newusers = this.users.slice((this.pagenum - 1) * 2, this.pagenum * 2)
      // 如果users数组长度小于总共显示的个数，那么就隐藏下一页按钮

      if (this.users.length <= this.pagenum * 2) {
        if (this.speak) {
          document.querySelector('.el-icon-arrow-right').style.display = 'none'
        } else {
          document.querySelector('.right_page').style.display = 'none'
        }
      } else {
        // 如果users数组长度大于总共显示的个数，那么就显示下一页按钮
        if (this.speak) {
          document.querySelector('.el-icon-arrow-right').style.display = 'block'
        } else {
          document.querySelector('.right_page').style.display = 'block'
        }
      }
      this.closeopensub(this.newusers)
      // 共享翻页情况下动态响应宽高
      this.movingW_H(this.rightwidth, this.closecmarenum)
      this.closecmare.forEach((item) => {
        if (this.HideShowView) {
          this.hidecamera(item)
        } else {
          this.muteCamera(item, 0)
        }
      })
    },

    // 下一页
    nextpage() {
      this.pagenum++
      // 每页显示2个人
      this.newusers = this.users.slice((this.pagenum - 1) * 2, this.pagenum * 2)
      // 如果users数组长度小于总共显示的个数，那么就隐藏下一页按钮
      if (this.users.length <= this.pagenum * 2) {
        if (this.speak) {
          document.querySelector('.el-icon-arrow-right').style.display = 'none'
        } else {
          document.querySelector('.right_page').style.display = 'none'
        }
      } else {
        // 如果users数组长度大于总共显示的个数，那么就显示下一页按钮
        if (this.speak) {
          document.querySelector('.el-icon-arrow-right').style.display = 'block'
        } else {
          document.querySelector('.right_page').style.display = 'block'
        }
      }
      this.closeopensub(this.newusers)
      // 共享翻页情况下动态响应宽高
      this.movingW_H(this.rightwidth, this.closecmarenum)
      this.closecmare.forEach((item) => {
        if (this.HideShowView) {
          this.hidecamera(item)
        } else {
          this.muteCamera(item, 0)
        }
      })
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
            setTimeout(() => {
              this.$message.success(this.screenPublish ? '共享成功' : '已停止共享')
            }, 2000)
          }
        })
      }
    },

    //监听演讲者视图视频div宽度变化
    ResizeDetectorMaker() {
      const _this = this
      const erd = elementResizeDetectorMaker()
      erd.listenTo(document.getElementsByClassName('user-right-vedio'), (element) => {
        _this.$nextTick(() => {
          //监听到事件后执行的业务逻辑
          this.speakvideoh = (9 * element.scrollWidth) / 16
        })
      })
    },

    // 演讲者视图下双击放大
    speakFullScreen(id) {
      if (this.pspeak) {
        this.$store.commit('setfullScreenState', 1)
        // 点击自己
        if (id == this.joininfo.userId) {
          this.closeView()
          setTimeout(() => {
            const dom = document.getElementById('share')
            this.openview(dom)
          }, 300)
          // 点击自己时，隐藏自己的小视图
          document.getElementById(`main${this.joininfo.userId}`).style.display = 'none'
          setTimeout(() => {
            this.users.forEach((item) => {
              if (item.userId != id && item.userId != this.joininfo.userId) {
                // 点击自己时，显示别人的小视图
                document.getElementById(`main${item.userId}`).style.display = 'block'
                document.getElementById(`main${id}`).style.display = 'none'
                this.sdk.configRemoteCameraTrack(item.userId, true, true)
                // 订阅远端音频流
                this.sdk.configRemoteAudio(item.userId, true)
                this.sdk
                  .subscribe(item.userId + '')
                  .then((res) => {
                    var dom = document.getElementById(item.userId)
                    this.sdk.setDisplayRemoteVideo(item.userId, dom, 1)
                  })
                  .catch((err) => {
                    console.log('subscribe失败', err)
                  })
              }
            })
            // 订阅远端相机流
          }, 300)
          // 点击别人
        } else {
          // 点击别人时，显示自己的小视图
          document.getElementById(`main${this.joininfo.userId}`).style.display = 'block'
          setTimeout(() => {
            this.users.forEach((item) => {
              if (item.userId == id) {
                // this.closeopensub(this.users)
                this.sdk.configRemoteCameraTrack(id, true, true)
                // 订阅远端音频流
                this.sdk.configRemoteAudio(id, true)
                this.sdk
                  .subscribe(id + '')
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
                // 点击他人时，隐藏他的小视图
                document.getElementById('main' + id).style.display = 'none'
              } else {
                // 显示除他之外的人
                document.getElementById('main' + item.userId).style.display = 'block'
                // this.subscribe(item)
                this.sdk.configRemoteCameraTrack(item.userId, true, true)
                // 订阅远端音频流
                this.sdk.configRemoteAudio(item.userId, true)
                this.sdk
                  .subscribe(item.userId)
                  .then((res) => {
                    console.log(res)
                  })
                  .catch((err) => {
                    console.log(err)
                  })
              }
            })
          }, 500)
          this.closeView()
          setTimeout(() => {
            const dom = document.getElementById(this.joininfo.userId)
            this.openview(dom)
          }, 300)
        }
      }
    },

    // 画廊视图下双击全屏视图
    FullScreenVideo(id) {
      console.log(id)
      if (this.FullScreenVideostatus) {
        this.FullScreenVideostatus = 0
        const namedom = document.getElementById('name' + id)
        const maindom = document.getElementById('main' + id)
        maindom.style.position = 'relative'
        maindom.style.zIndex = '0'
        namedom.children[0].style.position = 'absolute'
        namedom.children[0].style.left = '50%' // ++
        // namedom.children[0].style.bottom = '-' + (this.uservideoh - 30) + 'px'
        namedom.children[0].style.bottom = '1.2%'
        namedom.children[0].style.transform = 'translateX(-50%)'
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
          maindom.style.top = '0' // ++
          maindom.style.left = '0' // ++
          maindom.style.width = '100%'
          maindom.style.height = '100%'
          maindom.style.zIndex = '999'
          maindom.style.backgroundColor = 'black'
          namedom.style.width = '100%'
          namedom.style.height = '100%'
          namedom.children[0].style.bottom = '1.2%'
          namedom.children[0].style.left = '50%' // ++
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
        this.$store.commit('setfullScreenState', 0)
        this.closeopensub(this.users)
        this.users.forEach((item) => {
          document.getElementById('main' + item.userId).style.display = 'block'
        })
        return
      }
      // 演讲者视图
      if (this.pspeak) {
        console.log('演讲者视图')
        // this.closeView()
        // setTimeout(() => {
        //   const dom = document.getElementById('share')
        //   this.openview(dom)
        // }, 200)

        // 共享视图
        if (this.speak) {
          console.log('打开共享')
          console.log(this.borderid)
          // 如果一开始没人说话，默认展示我自己
          if (!this.borderid) {
            console.log(this.borderid)
            // 显示自己的视图，并打开预览
            document.getElementById('main' + this.joininfo.userId).style.display = 'block'
            this.closeView()
            setTimeout(() => {
              this.openview(document.getElementById(this.joininfo.userId))
            }, 200)
            // 隐藏其他人视图
            this.users.forEach((item) => {
              if (item.userId !== this.joininfo.userId) {
                document.getElementById('main' + item.userId).style.display = 'none'
              }
            })
          } else {
            // 如果有人说话
            this.users.forEach((item) => {
              // 演讲者视图下，去掉边框
              if (!this.pspeak) {
                document.getElementById('main' + item.userId).style.border = 'none'
              }
              if (item.userId == this.borderid && item.userId == this.joininfo.userId) {
                document.getElementById('main' + this.joininfo.userId).style.display = 'block'
                this.closeView()
                setTimeout(() => {
                  this.openview(document.getElementById(this.joininfo.userId))
                }, 300)
              } else if (item.userId == this.borderid && item.userId !== this.joininfo.userId) {
                document.getElementById('main' + this.joininfo.userId).style.display = 'none'
                document.getElementById('main' + this.borderid).style.display = 'block'
                this.subscribe(item)
              } else if (item.userId !== this.borderid) {
                document.getElementById('main' + item.userId).style.display = 'none'
              }
            })
          }
        }
      }

      var userId = this.users[0].userId
      if (this.borderid) {
        userId = this.borderid
      }
      if (userId == this.joininfo.userId && !this.speak) {
        this.closeView()
        setTimeout(() => {
          const dom = document.getElementById('share')
          this.openview(dom)
        }, 200)
        document.getElementById('main' + this.joininfo.userId).style.display = 'none'
      } else if (userId !== this.joininfo.userId && !this.speak) {
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
        }, 300)
        this.closeView()
        setTimeout(() => {
          const dom = document.getElementById(this.joininfo.userId)
          this.openview(dom)
        }, 200)
      }
      this.users.forEach((item, index) => {
        if (item.userId != userId && item.userId != this.joininfo.userId) {
          setTimeout(() => {
            this.subscribe(item)
          }, 300)
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
      }, 200)
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
      }, 800)
    },

    //根据数组长度计算每一个视频窗口的宽高
    calculation_w_h(bodywidth, num = 0) {
      // console.log('计算宽高', bodywidth)
      if (this.FullScreenVideostatus) {
        return
      }
      if (this.newusers.length - num >= 2 && this.newusers.length - num <= 4) {
        var numbers = 2
      } else if (this.newusers.length - num > 4) {
        this.fontsize = 22
        var numbers = 4
      } else {
        var numbers = 1
      }
      // 两个人的时候，视图大一些
      if (this.newusers.length == 2) {
        this.uservideow = (bodywidth * 0.9) / numbers - 15
      } else {
        this.uservideow = (bodywidth * 0.75) / numbers - 15
      }
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
        // console.log('加入onJoin', publisher)
        // this.setplist(publisher)
      })

      this.sdk.on('onLeave', (publisher) => {
        // start :+++翻页情况下动态响应视图
        this.newusers.forEach((item, index) => {
          if (item.userId == publisher.userId) {
            this.newusers.splice(index, 1)
          }
        })
        this.newusers.forEach((item, index) => {
          if (item.userId !== this.joininfo.userId) {
            this.subscribe(item)
          }
        }) // end :+++翻页情况下动态响应视图

        this.removeuserview(publisher)
      })

      // 流发布事件，将该用户新增到推流列表，若该用户已存在推流列表，则进行状态更新
      this.sdk.on('onPublisher', (publisher) => {
        console.log('新增推流onPublisher', publisher)
        // 如果翻页数组长度不满4，那么就将用户添加进去
        if (this.newusers.length < 2) {
          this.newusers.push(publisher)
        } // ++

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
        console.log(this.speak, this.pspeak)
        // 如果在演讲者视图下，共享模式，新加入的用户默认隐藏视图
        if (this.speak && this.pspeak) {
          this.$nextTick(() => {
            document.getElementById('main' + publisher.userId).style.display = 'none'
          })
        } // ++

        if (publisher.streamConfigs[2].state == 'active') {
          this.speak = true
        }
        //  else if (publisher.streamConfigs[2].state == 'inactive') {
        //   this.speak = false
        // }
        if (!this.speak) {
          this.closeView()
          setTimeout(() => {
            this.openview(document.getElementById('share'))
          }, 200)
        }
        if (this.speak) {
          // this.closeopensub(this.newusers)
          // console.log(2222222222222)
          this.movingW_H(this.rightwidth, this.closecmarenum)
        }
      })

      // 结束流发布事件，推流列表删除该用户，移除用户视图，初始化订阅状态
      this.sdk.on('onUnPublisher', (publisher) => {
        this.newusers.forEach((item, index) => {
          if (item.userId == publisher.userId) {
            this.newusers.splice(index, 1)
          }
        })

        this.newusers.forEach((item, index) => {
          if (item.userId !== this.joininfo.userId) {
            console.log(item, '订阅')
            // 有人离开，展示共享屏幕的参会者
            document.getElementById('main' + item.userId).style.display = 'block'
            this.subscribe(item)
          }
        })

        // let obj = this.users.pop()
        // console.log('obj-=========', obj)
        // console.log('newusers-=========', this.newusers)
        // this.newusers.forEach((item, index) => {
        //   if (
        //     item.userId !== obj.userId &&
        //     this.users.length > this.pagenum * 4
        //   ) {
        //     this.newusers.push(obj)
        //   }
        // })
        this.calculation_w_h(document.body.clientWidth) //动态逻辑
        // console.log(3333333333333)
        this.movingW_H(this.rightwidth, this.closecmarenum)
      })

      //音频回调监听
      this.sdk.on('onAudioLevel', (data) => {
        // document.getElementById('main' + this.joininfo.userId).style.border = '1px solid #00ccff';
        // return;
        // console.log(data)
        var userId = ''
        var level = 0
        data.forEach((item) => {
          if (item.level > level) {
            level = item.level
            userId = item.userId
          }
        })
        this.newusers.forEach((item) => {
          if (item.userId !== userId) {
            document.getElementById('main' + item.userId).style.border = 'none'
          }
        })
        // console.log(level)
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
      // this.users.forEach((item, index) => {
      //   if (item.userId !== this.joininfo.userId) {
      //     console.log(item, '订阅')
      //     this.subscribe(item)
      //   }
      // })
      this.calculation_w_h(document.body.clientWidth) //动态逻辑
      // console.log(4444444444444444)
      this.movingW_H(this.rightwidth, this.closecmarenum)
    },

    //根据音频回调设置边框
    setborder(id) {
      if (id == 0) {
        var id = this.joininfo.userId
      }
      if (!this.pspeak) {
        document.getElementById('main' + id).style.border = '1px solid #00ccff'
        this.borderid = id
      } else {
        // console.log('演讲者视图')
        var borderid = this.borderid
        this.borderid = id
        // 如果现在说话的人不是前一个说话的人
        if (id !== borderid) {
          // 共享视图
          if (this.speak) {
            console.log('共享执行')
            // 如果是我说话
            if (id == this.joininfo.userId) {
              // 显示自己的小视图
              document.getElementById('main' + this.joininfo.userId).style.display = 'block'
              this.closeView()
              setTimeout(() => {
                this.openview(document.getElementById(this.joininfo.userId))
              }, 200)
              this.users.forEach((item) => {
                if (item.userId !== this.joininfo.userId) {
                  // 隐藏别人的小视图
                  document.getElementById('main' + item.userId).style.display = 'none'
                }
              })
            } else {
              // 如果说话的人不是我
              // 隐藏自己的小视图
              document.getElementById('main' + this.joininfo.userId).style.display = 'none'
              // 显示别人的小视图
              document.getElementById('main' + id).style.display = 'block'
              this.users.forEach((item) => {
                if (item.userId !== id) {
                  document.getElementById('main' + item.userId).style.display = 'none'
                } else {
                  document.getElementById('main' + item.userId).style.display = 'block'
                  this.subscribe(item)
                }
              })
            }
            return false
          }
          console.log('id===', id, 'borderid===', borderid)
          // 如果当前说话的人是我
          if (id == this.joininfo.userId) {
            this.closeView()
            setTimeout(() => {
              this.openview(document.getElementById('share'))
              document.getElementById('main' + borderid).style.display = 'block'
              // +++
              document.getElementById('main' + this.joininfo.userId).style.display = 'none'
              console.log('隐藏自己', this.joininfo.userId)
              this.users.forEach((item) => {
                if (item.userId == borderid) {
                  this.subscribe(item)
                }
              })
            }, 500)
            // 如果上一个说话的人是我
          } else if (borderid == this.joininfo.userId) {
            this.closeView()
            setTimeout(() => {
              document.getElementById('main' + this.joininfo.userId).style.display = 'block'
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
                      // +++
                      document.getElementById('main' + item.userId).style.display = 'none'
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
            // 如果当前说话的人是别人
            this.closeView()
            setTimeout(() => {
              this.openview(document.getElementById(this.joininfo.userId))
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
            // 小视图的隐藏与显示，id为当前说话的人，borderid为上一个说话的人
            document.getElementById('main' + id).style.display = 'none'
            if (borderid) {
              document.getElementById('main' + borderid).style.display = 'block'
            }
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
              const historyList = JSON.parse(localStorage.getItem('historyList'))
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
          // console.log('入会成功', res)
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
            this.$message.success(this.screenPublish ? '共享成功' : '已停止共享')
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
      if (this.rightwidth >= 453) {
        console.log('重新计算')
        // console.log(5555555555555555)
        this.movingW_H(this.rightwidth, num)
      }
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
      if (this.scene_flag) {
        this.audioStatus = mute ? 0 : 1
        this.sdk.muteLocalMic(mute)
        this.$store.commit('setaudioStatus', this.audioStatus)
      }
    },

    //禁止开放本地视频采集
    muteLocalCamera(mute) {
      if (this.video_flag) {
        this.videoStatus = mute ? 0 : 1
        console.log(mute, 'zhuantai')
        this.sdk.muteLocalCamera(mute)
        if (mute) {
          this.closeView(this.joininfo.userId)
          this.muteCamera(this.joininfo.userId, 0)
          if (this.speak) {
            document.getElementById('s_d' + this.joininfo.userId).style.display = 'block'
            document.getElementById('s_name' + this.joininfo.userId).style.display = 'none'
            document.getElementById(this.joininfo.userId).style.display = 'none'
            document.getElementById('main' + this.joininfo.userId).style.backgroundColor = '#000000'
          } else {
            document.getElementById(this.joininfo.userId).style.display = 'none'
            document.getElementById('name' + this.joininfo.userId).style.display = 'none'
          }
        } else {
          this.muteCamera(this.joininfo.userId, 1)
          // 共享视图下打开小视图
          if (this.speak) {
            const dom = document.getElementById(this.joininfo.userId)
            this.openview(dom)
            // 演讲者视图下打开id为share的video
          } else if (this.pspeak) {
            const dom = document.getElementById('share')
            this.openview(dom)
          } else {
            // 否则根据userId查找
            const dom = document.getElementById(this.joininfo.userId)
            if (this.speak) {
              document.getElementById('s_d' + this.joininfo.userId).style.display = 'none'
              document.getElementById('s_name' + this.joininfo.userId).style.display = 'block'
              document.getElementById(this.joininfo.userId).style.display = 'block'
              document.getElementById('main' + this.joininfo.userId).style.backgroundColor = '#000' // 改成有黑色背景
            } else {
              document.getElementById('d' + this.joininfo.userId).style.display = 'none'
              document.getElementById(this.joininfo.userId).style.display = 'block'
              document.getElementById('name' + this.joininfo.userId).style.display = 'block'
            }
            this.openview(dom)
          }
        }
        this.$store.commit('setvideoStatus', this.videoStatus)
        if (!this.speak) {
          this.calculation_w_h(this.screenWidth)
        }
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
          document.getElementById('main' + uid).style.backgroundColor = '#000000'
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
      let dd = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate()
      let hh = new Date().getHours()
      let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
      let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds()

      return yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss
    },

    // 订阅房间其他人的视频流
    subscribe(v) {
      console.log('订阅', v)
      this.calculation_w_h(document.body.clientWidth) //动态逻辑
      for (var i = 0; i < v.streamConfigs.length; i++) {
        if (v.streamConfigs[i].label === 'sophon_video_camera_large' && v.streamConfigs[i].state === 'active') {
          // 订阅远端相机流
          this.sdk.configRemoteCameraTrack(v.userId, true, true)
          // 订阅远端音频流
          this.sdk.configRemoteAudio(v.userId, true)
          this.sdk
            .subscribe(v.userId)
            .then((res) => {
              console.log('订阅成功', res)
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
        } else if (v.streamConfigs[i].label === 'sophon_video_screen_share' && v.streamConfigs[i].state === 'active') {
          console.log('v======', v)
          setTimeout(() => {
            // 订阅远端屏幕共享流
            this.sdk.configRemoteScreenTrack(v.userId, true)
            this.sdk
              .subscribe(v.userId)
              .then((re) => {
                var dom = document.getElementById('share')
                setTimeout(() => {
                  // console.log(dom)
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
        var wxurl = 'wss://meeting-api.lighos.com/wss?userId=' + userId + '&meetingId=' + meetingId + '&facility=web' + '&type=begin'
      } else if (!this.userListlength || !this.$route.params.length) {
        var wxurl = 'wss://meeting-api.lighos.com/wss?userId=' + userId + '&meetingId=' + meetingId + '&facility=web' + '&type=close'
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
          // console.log(res, 'webrtc参会者')
          if (res.status == 200) {
            this.$store.commit('setisgetplist', 0)
            // this.plist = res.data.participant
            this.$store.commit('setplist', res.data.participant.data)
            this.$refs.peoplelist.isadmin(res.data.participant.data)
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
      // 开关思想：当flag为true时，可以调用方法，如果时主持人关闭，先调用方法，再将flag设为false
      switch (data.type) {
        case 'Hostvideo':
          // console.log(data)
          // 主持人关自己
          if (data.message.userId == this.joininfo.userId) {
            data.message.video ? this.$message.success('主持人已开启您的摄像头') : this.$message.warning('主持人已关闭您的摄像头')
            if (!data.message.video) {
              this.muteLocalCamera(data.message.video ? false : true)
              this.$refs.peoplelist.setplist('save', data.message)
              if (this.admin == 0 || this.admin == 3) {
                this.video_flag = false
              }
            } else {
              this.video_flag = true
              this.muteLocalCamera(data.message.video ? false : true)
              this.$refs.peoplelist.setplist('save', data.message)
            }
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
          // console.log(this.video_flag)
          return
        case 'Hostscene':
          console.log(data)
          if (data.message.userId == this.joininfo.userId) {
            data.message.scene ? this.$message.success('主持人已开启您的麦克风') : this.$message.warning('主持人已关闭您的麦克风')
            if (!data.message.scene) {
              this.muteLocalMic(data.message.scene ? false : true)
              if (this.admin == 0 || this.admin == 3) {
                this.scene_flag = false
              }
            } else {
              this.scene_flag = true
              this.muteLocalMic(data.message.scene ? false : true)
            }
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
          // console.log(666666666666666)
          this.movingW_H(this.rightwidth, this.closecmarenum)
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
          } else if (data.message.userId == this.joininfo.userId) {
            this.muteLocalCamera(data.message.video ? false : true)
          }
          return
        case 'scene':
          // console.log(data)
          if (data.message.userId !== this.joininfo.userId) {
            // this.muteLocalMic(data.message.scene ? false : true)
            this.$refs.peoplelist.setplist('save', data.message)
          } else if (data.message.userId == this.joininfo.userId) {
            this.muteLocalMic(data.message.scene ? false : true)
          }
          return
        case 'share':
          console.log(data)
          if (data.message.userId != this.joininfo.userId) {
            this.speak = data.message.value == 1 ? true : false
            console.log(this.speak, 'socket')
            if (!this.speak) {
              this.pspeak = false
            }
            setTimeout(() => {
              this.closeopensub(this.users)
            }, 1000)
          }
          return
        // 主持人移交权限
        case 'handHost':
          // console.log(data)
          const getHost = JSON.parse(data.getHost)
          const putHost = JSON.parse(data.putHost)
          // console.log('getHost', getHost.userId)
          // console.log('putHost', putHost.userId)
          if (getHost.userId == this.joininfo.userId) {
            if (this.admin == 0) {
              this.$message.success('您已被赋予主持人')
              this.$store.commit('setadmin', 2)
            } else if (this.admin == 3) {
              this.$message.success('您已收回主持人权限')
              this.$store.commit('setadmin', 1)
            }
          } else if (putHost.userId == this.joininfo.userId) {
            console.log(getHost.username)
            if (this.admin == 2) {
              this.$message.success('您已失去主持人权限')
              this.$store.commit('setadmin', 0)
            } else {
              this.$message.success(`${getHost.username}已成为主持人`)
              this.$store.commit('setadmin', 3)
            }
          } else if (putHost.userId !== this.joininfo.userId && getHost.userId !== this.joininfo.userId) {
            this.$message.success(`${getHost.username}已成为新主持人`)
          }
          this.plist.forEach((item, i) => {
            if (item.userId == getHost.userId) {
              this.plist.splice(i, 1)
              this.plist.unshift(getHost)
            } else if (item.userId == putHost.userId) {
              this.plist.splice(i, 1, putHost)
            }
          })
          // console.log(this.plist)
          this.$store.commit('setplist', this.plist)
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
          const transcribeData = JSON.parse(data.message)
          if (transcribeData.userId == this.joininfo.userId && (this.admin !== 1 || this.admin !== 2)) {
            if (transcribeData.transcribe == '1') {
              this.$message.success('您已被赋予录制权限')
            } else {
              this.$message.success('您已被收回录制权限')
            }
          }

          this.plist.forEach((item, i) => {
            if (transcribeData.userId == item.userId) {
              this.plist.splice(i, 1, transcribeData)
            }
          })
          console.log(this.plist)
          this.$store.commit('setplist', this.plist)
          return
        // 移交直播权限
        case 'streaming':
          console.log(data)
          const streamingData = JSON.parse(data.message)

          if (streamingData.userId == this.joininfo.userId && (this.admin !== 1 || this.admin !== 2)) {
            if (streamingData.streaming == '1') {
              this.$message.success('您已被赋予直播权限')
            } else {
              this.$message.success('您已被收回直播权限')
            }
          }
          // this.$store.commit('setisgetplist', 1)
          this.plist.forEach((item, i) => {
            if (streamingData.userId == item.userId) {
              this.plist.splice(i, 1, streamingData)
            }
          })
          console.log(this.plist)
          this.$store.commit('setplist', this.plist)
          return
        // 全体禁言
        case 'allscene':
          console.log(data)
          if (data.message.scene == '0') {
            this.$message.warning('主持人已开启全体禁言')
            this.muteLocalMic(data.message.scene == '1' ? false : true)
            this.scene_flag = false
          } else if (data.message.scene == '1') {
            this.$message.success('主持人已解除全体禁言')
            this.scene_flag = true
            this.muteLocalMic(data.message.scene == '1' ? false : true)
          }
          // 全体禁言关闭麦克风，遍历参会者列表，修改麦克风状态：0/1，再存储到仓库
          this.plist.forEach((item) => {
            if (data.message.scene == '1') {
              item.scene = 1
            } else if (data.message.scene == '0') {
              item.scene = 0
            }
            if (item.userId == this.joininfo.userId) {
              data.message = item
            }
          })
          this.$store.commit('setplist', this.plist)
          // 筛选出自己，传递给子组件
          this.$refs.peoplelist.setplist('save', data.message)
          return
        // 主持人踢出会议室
        case 'remove':
          console.log(data)
          if (data.message.userId == this.joininfo.userId) {
            this.$message.warning('您已被主持人移出会议')
            setTimeout(() => {
              this.leave('exit')
            }, 1500)
          } else {
            this.plist = this.plist.filter((v) => {
              return v.userId !== data.message.userId
            })
          }
          return
      }
    },

    // 共享视图下计算video宽高
    movingW_H(width, nums = 0) {
      console.log(width, nums, '-----')
      console.log('newusers.length===', this.newusers.length)
      if (this.FullScreenVideostatus) {
        return
      }
      if (this.newusers.length - nums >= 2 && this.newusers.length - nums <= 4) {
        var numbers = 2
      } else if (this.newusers.length - nums > 4) {
        this.fontsize = 22
        var numbers = 4
      } else {
        var numbers = 1
      }
      // 演讲者视图下，固定一个人
      if (this.pspeak) {
        var numbers = 1
      }
      this.speakvideow = width / numbers - 8
      this.speakvideoh = (this.speakvideow * 9) / 16 + 8
      console.log(this.speakvideow, numbers, this.speakvideoh)
    },

    // 共享视图并排模式拖动事件
    dragControllerDiv(e) {
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
            var moveLen = resize[i].left + (endX - startX) // （endx-startx）= 移动的距离。resize[i].left + 移动的距离 = 左边区域最后的宽度
            var maxT = box[i].clientWidth - resize[i].offsetWidth // 容器宽度 - 左边区域的宽度 = 右边区域的宽度
            if (moveLen < 945) moveLen = 945 // 左边区域的最小宽度为955px
            if (moveLen > maxT - 362) moveLen = maxT - 362 // 右边区域最小宽度为362px
            resize[i].style.left = moveLen // 设置左侧区域的宽度
            for (let j = 0; j < left.length; j++) {
              left[j].style.width = (moveLen / document.body.clientWidth) * 100 + '%'
              mid[j].style.width = ((box[i].clientWidth - moveLen - 20) / document.body.clientWidth + 0.012) * 100 + '%'
              // mid[j].style.marginTop = '7%'
            }
            var rightw = ((box[i].clientWidth - moveLen - 20) / document.body.clientWidth + 0.012) * 100 + '%' // 值为百分比
            that.rightwidth = box[i].clientWidth - moveLen - 20

            // 动态视图逻辑
            if (box[i].clientWidth - moveLen - 20 > 453) {
              const num = that.HideShowView ? that.closecmarenum : 0
              console.log('right的宽度', box[i].clientWidth - moveLen - 20)
              that.movingW_H(box[i].clientWidth - moveLen - 20, num)
            } else if (box[i].clientWidth - moveLen - 20 <= 453) {
              that.speakvideow = 366
              that.speakvideoh = 208
            }
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
          if (this.pspeakTop + rmlent > 0 && rmlent + domh + 10 < document.documentElement.clientHeight) {
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
  min-width: 1000px;
  min-height: 765px;
  height: 90vh;
  position: relative;
  margin: 0 auto;
  /* margin-top: 5.5vh; */
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
}
.libox {
  color: #00ccff !important;
}
.main-video .sharename {
  position: absolute;
  top: 0;
  left: 10.4%;
  text-align: center;
  line-height: 20;
  font-size: 40px;
}
.left_page {
  position: absolute;
  top: 50%;
  left: 0;
  z-index: 99;
  font-size: 50px;
  color: #fff;
  cursor: pointer;
  opacity: 0.7;
  display: block;
  width: 40px;
}
.right_page {
  position: absolute;
  top: 50%;
  right: 0;
  z-index: 99;
  font-size: 50px;
  color: #fff;
  cursor: pointer;
  opacity: 0.7;
  display: block;
  width: 40px;
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
  height: 98%;
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
  margin: 0 2px;
}
/*拖拽区鼠标悬停样式*/
.resize:hover {
  color: #444444;
}
.right {
  height: 100%;
  float: left;
  width: 19%;
  display: flex;
  align-content: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  flex-wrap: wrap;
}

.user-right-vedio-title {
  display: none;
  /* padding: 10% 0; */
  color: white;
  text-align: center;
  font-size: 1.25rem;
  /* height: 8vh;
  line-height: 14.5vh; */
  position: absolute;
  top: 46%;
  left: 50%;
  transform: translateX(-50%);
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
  top: 1.5%;
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
  /* 一个人的视图高度是116.5 */
  max-height: 582.5px;
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
  top: 1.5%;
  left: 22px;
  color: #fff;
  text-align: center;
  line-height: 44px;
  cursor: pointer;
  font-size: 14px;
  padding-left: 5px;
}
.livecontent {
  width: 109px;
  height: 110px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 14px;
  z-index: 99999;
  position: absolute;
  top: 60px;
  left: 22px;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  padding-bottom: 3px;
}
.livecontent li {
  cursor: pointer;
  font-size: 14px;
}
.livecontent li a {
  text-decoration: none;
  color: #fff;
}
.livecontent li a:hover {
  color: #00ccff;
}
.livecontent li:hover {
  color: #00ccff;
}
/* 直播二维码样式 */
#qrcode {
  width: 110px;
  height: 110px;
  background-color: #fff;
  border-radius: 14px;
  z-index: 99999;
  position: absolute;
  top: 60px;
  left: 135px;
  display: inline-block;
  box-sizing: border-box;
}
#qrcode img {
  width: 100px;
  /* 设置白色背景色 */
  background-color: #fff;
  /* 利用padding的特性，挤出白边 */
  padding: 6px;
  border-radius: 14px;
}
</style>
