import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    'drawer': false, //是否显示参会者列表
    'token': '', //请求头
    'videoStatus': 1, //摄像头状态
    'audioStatus': 1, //音频状态
    'shareStatus': 0, //共享状态
    'userinfo': {}, //自己用户数据
    'admin': 0, //是否是主持人
    'prohibit': {
      'video': 0,
      'audio': 0
    }, //是否禁止操作音频
    'isgetplist': 0, //是否去拿列表
    'HideShowView': 0, //是否隐藏参会者视图
    'pclosecmare': [], //刚进入是否存在关闭摄像头的用户
    'closecmarenum': 0, //关闭摄像头用户的数量
    'liveUrl':'', // 直播间地址
    'plist':[], // 参会者列表
    'fullScreenState':0
  },
  mutations: {
    setpeoplelist(state, v) {
      state.drawer = v;
    },
    setToken(state, v) {
      state.token = v;
    },
    setvideoStatus(state, v) {
      state.videoStatus = v;
    },
    setaudioStatus(state, v) {
      state.audioStatus = v;
    },
    setuserinfo(state, v) {
      state.userinfo = v;
    },
    setadmin(state, v) {
      state.admin = v;
    },
    setprohibit(state, v) {
      state.prohibit = v;
    },
    setisgetplist(state, v) {
      state.isgetplist = v;
    },
    setHideShowView(state, v) {
      state.HideShowView = v;
    },
    setpclosecmare(state, v) {
      state.pclosecmare = v;
    },
    setshareStatus(state, v) {
      state.shareStatus = v;
    },
    setclosecmarenum(state, v) {
      state.closecmarenum = v;
    },
    setliveUrl(state, v) {
      state.liveUrl = v;
    },
    setplist(state, v) {
      state.plist = v;
    },
    setfullScreenState(state, v) {
      state.fullScreenState = v
    },
  },
  actions: {},
  modules: {}
})
