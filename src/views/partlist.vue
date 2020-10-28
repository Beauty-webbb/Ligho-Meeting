<template>
  <div class="participants">
    <div class="title">
      <h3>参会者</h3>
    </div>
    <div class="cont">
      <div class="cont-left">
        <div class="cont-left-people" v-for="(item,key) in contdata" :key="key">
          <img :src="item.img" />
          <span>({{item.num}})</span>
        </div>
      </div>

      <div class="cont-right">
        <el-input placeholder="搜索参会人" v-model="peoplesearch" class="input-with-select">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
    </div>
    <div class="peoplelist" v-for="(item,key) in plist" :key="key" :style="{'background-color':bcolor(key)}">
      <el-dropdown @command="handleCommand" placement="bottom" trigger="click"
        style="width: 70%; height: 3.5vh; padding-left: 1vh; font-size: 19px; display: flex; align-items: center;">
        <div class="peoplelist-left">
          <div class="pavatar"><img style="width: 100%;" :src="item.avatar" /></div>
          <span>{{item.username}}</span>
        </div>
        <el-dropdown-menu>
          <el-dropdown-item v-if="admin==1||admin==3" @click="moveadmin(item.userId)" :command="{type:'move',id:item.userId,message:item.admin}">
            {{admin==3?'收回主持人权限':'移交主持人权限'}}
          </el-dropdown-item>
          <el-dropdown-item v-if="admin==1||admin==3" @click="handtranscribe(item.userId)"
            :command="{type:'transcribe',id:item.userId,message:item.transcribe}">
            {{item.transcribe?'收回录制权限':'赋予录制权限'}}
          </el-dropdown-item>
          <el-dropdown-item v-if="admin==1||admin==3" @click="handstreaming(item.userId)"
            :command="{type:'streaming',id:item.userId,message:item.streaming}">
            {{item.streaming?'收回直播权限':'赋予直播权限'}}
          </el-dropdown-item>
          <el-dropdown-item v-if="admin==1||admin==3" @click="allScene(item.userId)" :command="{type:'allscene',id:item.userId,message:allscene?1:0}">
            {{allscene?'解除全体禁言':'全体禁言'}}
          </el-dropdown-item>
          <el-dropdown-item v-if="admin==1||admin==3" @click="moveOutMeet(item.userId)"
            :command="{type:'remove',id:item.userId,message:item.username}">
            移出会议
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <div class="peoplelist-right">
        <img :src='item.video ? require("../assets/canhui/video.png") : require("../assets/canhui/videoclose.png")'
          @click="joininfo.userId != item.userId ? send_msg('Hostvideo',item.video,item.userId,key) : send_msg('video',item.video,item.userId,key) " />
        <img :src='item.scene ? require("../assets/canhui/audio.png") : require("../assets/canhui/audioclose.png")'
          @click="joininfo.userId != item.userId ? send_msg('Hostscene',item.scene,item.userId,key) : send_msg('scene',item.scene,item.userId,key) " />
      </div>
    </div>
    <!-- <consolebottom  @setvideo="setmyvideostatus" @setscene="setmyscenestatus"></consolebottom> -->
  </div>
</template>

<script>
import { mapState } from 'vuex' //引入vuex
import APIUrl from '@/axios/api.url'
import { post, get } from '@/axios/index'
import vm from '@/event.js'
import Vue from 'vue'
import peoplelist from '../components/participants.vue' //参会者组件
import consolebottom from '../components/webrtcBottom.vue' //底部组件

export default {
  name: 'partlist',
  data() {
    return {
      contdata: [
        { img: require('../assets/canhui/people.png'), num: 0 },
        { img: require('../assets/canhui/video.png'), num: 0 },
        { img: require('../assets/canhui/audio.png'), num: 0 },
      ],
      peoplesearch: '',
      plist: [],
      joininfo: {},
      moveadminstate: true,
      showDropdowm: true,
      allscene: false, // 是否全体禁言
    }
  },
  components: { peoplelist, consolebottom },
  watch: {
    //监听参会者状态，例如总数，开关摄像头数量
    plist(newv, oldv) {
      this.setcontdata()
    },
    //监听是否去允许获取参会者列表
    isgetplist(newv, oldv) {
      if (newv) {
        this.getplist()
      }
    },
  },
  created() {
    this.getplist()
    const joininf = window.localStorage.getItem('joininfo')
    this.joininfo = JSON.parse(joininf)

    vm.$on('videostatus', (data) => {
      this.setmyvideostatus(data)
    })

    vm.$on('scenestatus', (data) => {
      this.setmyscenestatus(data)
    })
  },
  computed: {
    ...mapState([
      'drawer',
      'admin',
      'isgetplist',
      'HideShowView',
      'closecmarenum',
    ]),
  },
  methods: {
    // 显示/隐藏下拉列表
    clickmyself(id) {
      if (id == this.joininfo.userId) {
        this.showDropdowm = false
        return false
      } else {
        this.showDropdowm = true
      }
    },

    // 点击子菜单的回调
    handleCommand(data) {
      // console.log(data)
      if (
        data.id == this.joininfo.userId &&
        data.type !== 'allscene' &&
        data.type !== 'remove'
      ) {
        this.$message.warning('不能操作自己')
        return false
      } else if (this.admin == 0) {
        this.$message.warning('您无权限')
        return false
      }

      // 判断类型，调用对应方法
      if (data.type == 'move') {
        this.moveadmin(data)
      } else if (data.type == 'transcribe') {
        this.handtranscribe(data)
      } else if (data.type == 'streaming') {
        this.handstreaming(data)
      } else if (data.type == 'allscene') {
        this.allScene(data)
      } else if (data.type == 'remove') {
        this.moveOutMeet(data)
      }
    },

    // 踢出会议
    moveOutMeet(data) {
      // console.log(data)
      const activepush = APIUrl.util.activepush
      post(activepush, {
        userId: data.id,
        meetingId: this.joininfo.channelId,
        type: data.type,
      }).then((res) => {
        console.log('踢人请求', res)
        if (res.status == 200) {
          this.$message.success(`已将${data.message}移出会议`)
          this.plist = this.plist.filter((v) => {
            return v.userId !== data.id
          })
        } else {
          this.$message.error(res.message)
        }
      })
    },

    // 全体静音
    allScene(data) {
      console.log(data)
      const activepush = APIUrl.util.activepush
      post(activepush, {
        userId: data.id,
        message: data.message,
        meetingId: this.joininfo.channelId,
        type: data.type,
      }).then((res) => {
        console.log('全体禁音请求', res)
        if (res.status == 200) {
          if (this.allscene) {
            this.$message.success('已解除全体禁言')
          } else {
            this.$message.success('已开启全体禁言')
          }
          this.allscene = !this.allscene
        }
      })
    },

    // 赋予直播权限
    handstreaming(data) {
      // console.log('直播', data)
      const message = data.message ? 0 : 1
      const giveTran = APIUrl.util.giveTran
      post(giveTran, {
        userId: data.id,
        meetingId: this.joininfo.channelId,
        type: 'streaming',
        message: message,
      }).then((res) => {
        console.log('直播', res)
        if (res.status == 200) {
          this.$message.success(res.message)
          this.$store.commit('setisgetplist', 1)
          // this.getplist()
        } else {
          this.$message.warning(res.message)
        }
      })
    },

    // 赋予录制权限
    handtranscribe(data) {
      // console.log('录制', data)
      const message = data.message ? 0 : 1
      const giveTran = APIUrl.util.giveTran
      post(giveTran, {
        userId: data.id,
        meetingId: this.joininfo.channelId,
        type: 'transcribe',
        message: message,
      }).then((res) => {
        console.log('赋予录制', res)
        this.$message.success(res.message)
        if (res.status == 200) {
          this.$store.commit('setisgetplist', 1)
          // this.getplist()
        } else {
          this.$message.warning(res.message)
        }
      })
    },

    // 移交主持人权限
    moveadmin(data) {
      console.log(data)
      var name = ''
      this.plist.forEach((item) => {
        if (item.userId == data.id) {
          name = item.username
        }
      })
      // // 移交权限
      if (this.admin == 1 || this.admin == 2) {
        this.$confirm(`您确定要将主持人权限赋予${name}吗?`, '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            const apiurl = APIUrl.util.giveMeetHost
            post(apiurl, {
              meetingId: this.joininfo.channelId,
              userId: data.id,
            }).then((res) => {
              console.log('移交权限', res)
              if (res.status == 200) {
                // this.moveadminstate = false
                this.$store.commit('setisgetplist', 1)
              } else {
                this.$message.error(res.message)
              }
            })
          })
          .catch(() => {})
        // 收回权限
      } else if (this.admin == 3) {
        this.plist.forEach((item) => {
          if (item.userId == data.id) {
            name = item.username
            if (item.admin !== 2) {
              this.$message.warning(`${name}不是主持人哦`)
              return false
            } else {
              this.$confirm(`您确定要收回${name}的主持人权限吗?`, '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
              })
                .then(() => {
                  const apiurl = APIUrl.util.giveMeetHost
                  post(apiurl, {
                    meetingId: this.joininfo.channelId,
                    userId: this.joininfo.userId,
                  }).then((res) => {
                    console.log('收回权限', res)
                    if (res.status == 200) {
                      // this.moveadminstate = true
                      // this.$message.success(`您已收回主持人权限`)
                      this.$store.commit('setisgetplist', 1)
                    } else {
                      this.$message.error(res.message)
                    }
                  })
                })
                .catch((err) => {
                  console.log('取消', err)
                })
            }
          }
        })
      } else {
        this.$message.warning('您无权限')
      }
    },

    //设置参会者详情
    setcontdata() {
      const contnum = this.plist.length
      var videonum = 0
      var audionum = 0
      this.plist.forEach((item, index) => {
        if (item.video == 1) {
          videonum++
        }
        if (item.scene == 1) {
          audionum++
        }
      })
      this.contdata = [
        { img: require('../assets/canhui/people.png'), num: contnum },
        { img: require('../assets/canhui/video.png'), num: videonum },
        { img: require('../assets/canhui/audio.png'), num: audionum },
      ]
    },

    //参会者列表背景颜色的设置
    bcolor(key) {
      if (key % 2 == 0) {
        return 'rgba(0, 204, 255, 0.1)'
      } else {
        return 'rgba(255, 255, 255, 1)'
      }
    },

    //获取参会者列表
    getplist() {
      const joininf = window.localStorage.getItem('joininfo')
      const joininfo = JSON.parse(joininf)
      const apiurl = APIUrl.util.getParticipant
      post(apiurl, { meetingId: joininfo.channelId })
        .then((res) => {
          console.log(res, '子组件参会者')
          if (res.status == 200) {
            console.log(res.data.participant)
            this.$store.commit('setisgetplist', 0)
            this.plist = res.data.participant
            this.$store.commit('setplist', res.data.participant)
            this.isadmin(res.data.participant)
          } else {
            this.$message.error(res.message)
          }
        })
        .catch((error) => {
          console.log(error, '获取参会者列表错误')
        })
    },

    //隐藏无视频的参会者视图
    hidevideo() {
      this.plist.forEach((item, key) => {
        if (!item.video && this.HideShowView) {
          this.$emit('hidecamera', item.userId)
        } else if (!item.video && !this.HideShowVie) {
          this.$emit('showcamera', item.userId)
        }
      })
      console.log(this.closecmarenum, 'yincang')
      this.$emit('sethideshowview', this.closecmarenum)
    },

    //发送消息
    send_msg(type, message, uid, key) {
      console.log(type, message, uid, key)
      if (type == 'video') {
        const data = this.plist[key]
        console.log(data)
        Vue.set(this.plist, key, {
          admin: data.admin,
          avatar: data.avatar,
          scene: data.scene,
          video: message ? 0 : 1,
          userId: data.userId,
          username: data.username,
        })
        vm.$emit('Camera', message ? true : false)
      }
      if (type == 'scene') {
        // this.plist[key].scene = message ? 0 : 1;
        const data = this.plist[key]
        Vue.set(this.plist, key, {
          admin: data.admin,
          avatar: data.avatar,
          scene: message ? 0 : 1,
          video: data.video,
          userId: data.userId,
          username: data.username,
        })
        this.$emit('Audio', message ? true : false)
        vm.$emit('audio', message ? true : false)
      }

      if (type == 'Hostvideo' || type == 'Hostscene') {
        if (this.admin == 0 || this.admin == 3) {
          this.$message.error('您无权限！')
          return
        }
      }

      if (type == 'Hostvideo') {
        const data = this.plist[key]
        Vue.set(this.plist, key, {
          admin: data.admin,
          avatar: data.avatar,
          scene: data.scene,
          video: message ? 0 : 1,
          userId: data.userId,
          username: data.username,
        })
      }
      if (type == 'Hostscene') {
        // this.plist[key].scene = message ? 0 : 1;
        const data = this.plist[key]
        Vue.set(this.plist, key, {
          admin: data.admin,
          avatar: data.avatar,
          scene: message ? 0 : 1,
          video: data.video,
          userId: data.userId,
          username: data.username,
        })
      }
      const apiurl = APIUrl.util.activepush
      post(apiurl, {
        userId: uid,
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

    //修改状态
    setplist(type, data) {
      if (type == 'save') {
        var num = 0
        for (var i = 0; i < this.plist.length; i++) {
          if (this.plist[i].userId == data.userId) {
            Vue.set(this.plist, i, data)
          }
          if (!this.plist[i].video) {
            num++
          }
        }
        if (this.HideShowView) {
          if (data.video) {
            this.$emit('showcamera', data.userId)
          } else {
            this.$emit('hidecamera', data.userId)
          }
          this.$emit('sethideshowview', num)
        }
        this.$store.commit('setclosecmarenum', num) //用户状态发生改变时，关闭摄像头的用户数量
      } else if (type == 'add') {
        var ispush = 0
        var num = 0
        for (var i = 0; i < this.plist.length; i++) {
          if (this.plist[i].userId == data.userId) {
            ispush = 1
          }
          if (!this.plist[i].video) {
            num++
          }
        }
        if (ispush) {
          return
        }
        if (!data.video) {
          num++
        }
        this.$store.commit('setclosecmarenum', num) //用户新增时，关闭摄像头的用户数量
        console.log(num, this.closecmarenum)
        this.plist.push(data)
      } else if (type == 'exit') {
        this.plist.forEach((item, index) => {
          if (item.video == 0) {
            this.$store.commit('setclosecmarenum', this.closecmarenum - 1) //用户退出时，关闭摄像头的用户数量
          }
          if (item.userId == data.userId) {
            this.plist.splice(index, 1)
          }
        })
      }
    },

    //修改自己的视频状态
    setmyvideostatus(data) {
      for (var i = 0; i < this.plist.length; i++) {
        if (this.plist[i].userId == this.joininfo.userId) {
          this.plist[i].video = data
        }
      }
    },

    //修改自己的音频状态
    setmyscenestatus(data) {
      console.log(data)
      for (var i = 0; i < this.plist.length; i++) {
        if (this.plist[i].userId == this.joininfo.userId) {
          this.plist[i].scene = data
        }
      }
    },

    //判定是不是主持人
    isadmin(data) {
      if (!window.localStorage.getItem('joininfo')) {
        this.$message.error('缺少参数joininfo')
      }
      const joininfo = JSON.parse(window.localStorage.getItem('joininfo'))
      var closecmarenum = 0
      for (var i = 0; i < data.length; i++) {
        if (data[i].userId == joininfo.userId) {
          console.log(data[i].admin)
          // if (data[i].admin == 1 || data[i].admin == 2) {
          //   this.$store.commit('setadmin', 1)
          // }是否未主持人身份
          // 赋值
          this.$store.commit('setadmin', data[i].admin)
        }
        if (!data[i].video) {
          var val = []
          closecmarenum++
          val.push(data[i].userId)
          this.$store.commit('setpclosecmare', val)
        }
      }
      this.$store.commit('setclosecmarenum', closecmarenum) //初次进入会议有多少关闭摄像头的用户
    },
  },
}
</script>

<style>
.participants {
  width: 100%;
  height: 100vh;
  background-color: #fff;
}
.participants .bottom {
  position: absolute;
  left: 0;
  bottom: 2vh;
  /* border: 1px solid red; */
  width: 100%;
  text-align: center;
}
.title {
  width: 100%;
  height: 5vh;
  min-height: 50px;
  text-align: center;
  border-bottom: 1px rgba(204, 204, 204, 1) solid;
  display: flex;
  align-items: center;
  justify-content: center;
}
.title h3 {
  margin: 0;
}
.cont {
  width: 100%;
  height: 4vh;
  min-height: 50px;
  display: flex;
  /* border: 1px red solid; */
}
.cont-left {
  width: 50%;
  height: 4vh;
  min-height: 50px;
  display: flex;
  align-items: center;
  /* justify-content:center; */
  /* border: 1px saddlebrown solid; */
}
.cont-left-people {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 7px;
  /* justify-content:center; */
}
.cont-left-people img {
  width: 25px;
  margin-right: 0.5vh;
}
.cont-right {
  height: 4vh;
  width: 48%;
  min-height: 50px;
  /* border: 1px solid red; */
  display: flex;
  align-items: center;
  justify-content: center;
}
.cont-right .el-input__inner {
  border-radius: 0 !important;
}
.peoplelist {
  width: 100%;
  /* border: 1px solid red; */
  height: 5vh;
  min-height: 60px;
  display: flex;
  align-items: center;
  cursor: pointer;
}
.peoplelist-left {
  width: 70%;
  height: 3.5vh;
  padding-left: 1vh;
  /* border: 1px solid red; */
  font-size: 19px;
  display: flex;
  align-items: center;
}
.peoplelist-left .pavatar {
  width: 30px;
  height: 30px;
  margin-right: 0.5vh;
  background-color: #00ccff;
  color: white;
  border-radius: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.peoplelist-right {
  width: 30%;
  height: 3.5vh;
  /* border: 1px solid red; */
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.peoplelist-right img {
  /* width: 25px; */
  width: 3vh;
  max-width: 25px;
  margin: 0 5px;
}
</style>
