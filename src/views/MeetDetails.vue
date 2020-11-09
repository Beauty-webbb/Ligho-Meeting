<template>
  <div class="details">
    <div v-for="item in meetlist" :key="item.id">
      <div v-if="item.id == meetId">
        <div>
          <h2>
            {{ item.meetTopic }}<span v-if="item.state=='已结束'"
              style="margin-left:5px;font-size:16px;padding:3px 10px;border:1px solid #f1f1f1;border-radius:20px;font-weight:400;color:#999">{{ item.state }}</span>
            <span v-else-if="item.state=='进行中'"
              style="margin-left:5px;font-size:16px;padding:3px 10px;border:1px solid #f1f1f1;border-radius:20px;font-weight:400;color:red">{{ item.state }}</span>
            <span v-else
              style="margin-left:5px;font-size:16px;padding:3px 10px;border:1px solid #f1f1f1;border-radius:20px;font-weight:400;color:#00ccff">{{ item.state }}</span>
          </h2>
          <div class="meeting">
            <p style="margin-bottom: 20px;font-size:18px">
              会议时间：{{ item.startTime }}&nbsp;&nbsp;-&nbsp;&nbsp;{{
                item.stopTime
              }}
            </p>
            <p style="font-size:18px">
              会议ID：{{ item.meetingId }}
            </p>
          </div>
        </div>
        <div class="btn">
          <button @click="startMeet(item.meetingId)">开始会议</button>
          <button @click="getinvitation(item.meetingId)">复制邀请</button>
          <button @click="showEdit(item.meetingId)">编辑会议</button>
          <button @click="delMeet(item.meetingId)">删除会议</button>
        </div>

        <!-- 会议邀请弹窗 -->
        <el-dialog v-if="invitationdata" style="border-radius:20px;" custom-class="invitations" title="会议邀请" :visible.sync="invitation"
          :close-on-click-modal="false" :close-on-press-escape="false" :show-close="true" :modal="true" top="25vh" width="32% !important" center>
          <!-- 邮箱信息 -->
          <div style="display:flex;justify-content:space-around;align-items:center;padding-left:15px;">
            <!-- 谷歌邮箱信息 -->
            <div style="height:100%;" data-clipboard-action="copy" class="cobyDomObj" :data-clipboard-text="
            '会议主题：' +
            invitationdata.meetTopic +
            '\r\n会议链接：' +
            invitationdata.joinMeetUrl +
            '\r\n开始时间：' +
            invitationdata.startTime +
            '\r\n会议ID：' +
            invitationdata.meetingId+
            '\r\n会议密码：' +
            invitationdata.meetPwd" @click="copyLink">
              <a href="https://accounts.google.com/" target="_blank">
                <img class="logos" src="../assets/google.svg" alt="" style="width:100px;">
              </a>
            </div>
            <!-- 腾讯qq邮箱信息 -->
            <div style="height:100%;margin-left:76px" data-clipboard-action="copy" class="cobyDomObj" :data-clipboard-text="
            '会议主题：' +
            invitationdata.meetTopic +
            '\r\n会议链接：' +
            invitationdata.joinMeetUrl +
            '\r\n开始时间：' +
            invitationdata.startTime +
            '\r\n会议ID：' +
            invitationdata.meetingId+
            '\r\n会议密码：' +
            invitationdata.meetPwd" @click="copyLink">
              <a href="https://mail.qq.com/" target="_blank">
                <img class="logos" src="../assets/tencent.svg" alt="" style="width:80px;">
              </a>
            </div>
            <!-- 网易邮箱信息 -->
            <div style="height:100%;margin-left:37px" data-clipboard-action="copy" class="cobyDomObj" :data-clipboard-text="'会议主题：' +
            invitationdata.meetTopic +
            '\r\n会议链接：' +
            invitationdata.joinMeetUrl +
            '\r\n开始时间：' +
            invitationdata.startTime +
            '\r\n会议ID：' +
            invitationdata.meetingId+
            '\r\n会议密码：' +
            invitationdata.meetPwd" @click="copyLink">
              <a href="http://mail.netease.com/" target="_blank">
                <img class="logos" src="../assets/netease.png" alt="" style="width:200px;">
              </a>
            </div>
          </div>
          <!-- 按钮 -->
          <div style="width: 100%; text-align: center; margin-top: 1.5vh;margin-bottom: 20px">
            <el-button type="primary" style="background:#00ccff;border:0;width:40%;margin-bottom:15px;" round data-clipboard-action="copy"
              class="cobyDomObj" :data-clipboard-text="'会议链接：' +invitationdata.joinMeetUrl" @click="copyLink">
              复制邀请链接</el-button><br>
            <el-button style="width:40%;" round data-clipboard-action="copy" class="cobyDomObj" :data-clipboard-text="
            '会议主题：' +
            invitationdata.meetTopic +
            '\r\n会议链接：' +
            invitationdata.joinMeetUrl +
            '\r\n开始时间：' +
            invitationdata.startTime +
            '\r\n会议ID：' +
            invitationdata.meetingId+
            '\r\n会议密码：' +
            invitationdata.meetPwd" @click="copyLink">
              复制邀请信息</el-button>
          </div>
          <p style="text-align:center;color:#00ccff;">Tips 点击邮箱服务时，会自动复制会议详情至剪切板</p>
        </el-dialog>

      </div>
    </div>

    <div class="anpai" v-if="!meetlist.length">
      <div class="null_data">
        <img src="../assets/null_data.svg" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import APIUrl from '@/axios/api.url'
import { post, get } from '@/axios/index'
import { mapState } from 'vuex'
export default {
  props: ['meetlist', 'meetId', 'EditDialogVisible'],
  data() {
    return {
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
      userinfo: {}, // 个人信息
      invitation: false, // 是否显示邀请弹窗
      invitationdata: {}, // 邀请信息
    }
  },
  created() {
    this.userinfo = JSON.parse(localStorage.getItem('userinfo'))
    // console.log(this.meetId);
  },
  computed: {
    ...mapState(['videoStatus', 'audioStatus']),
  },
  watch: {},
  methods: {
    // 展示编辑会议框
    showEdit(id) {
      console.log(id)
      this.$emit('showEdit', id)
    },

    //获取邀请信息
    async getinvitation(id) {
      const apiurl = APIUrl.util.meetInvite
      let res = await post(apiurl, { meetingId: id })
      // console.log(res);
      if (res.status == 200) {
        this.invitationdata = res.data
        this.invitation = true
      } else {
        this.$message.error(res.message)
      }
    },

    //一键复制
    copyLink(id) {
      // this.getinvitation(id);
      let _this = this
      let clipboardObj = new this.clipboard('.cobyDomObj')
      clipboardObj.on('success', function () {
        _this.$message.success('复制成功')
        _this.invitation = false
        // 销毁
        clipboardObj.destroy()
      })
      clipboardObj.on('error', function () {
        _this.$message.success('复制失败')
      })
    },

    // 开始会议
    startMeet(id) {
      // 筛选会议
      const newmeetlist = this.meetlist.filter((v) => {
        return v.meetingId == id
      })
      const newmeet = newmeetlist[0]
      console.log(newmeet)
      if (newmeet.state == '已结束') {
        this.$message.warning('该会议已结束,赶紧去安排新会议吧')
        return false
      }
      // 如果非主持人并且主持人设置不许提前加入
      // if (!newmeet.tailStatus && newmeet.meetHost !== this.userinfo.username) {
      //   this.$message.warning("您不是主持人，该会议不允许在主持人入会前加入哦");
      //   return false;
      // }
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

    // 删除会议
    delMeet(id) {
      this.$confirm('您确定要删除此会议吗?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          // console.log('子组件传递',id);
          const delMeet = APIUrl.util.delMeet
          post(delMeet, {
            meetingId: id,
            timstamp: this.getTime(),
          }).then((res) => {
            console.log('删除会议', res)
            if (res.status == 200) {
              this.$emit('delMeet', id)
              this.$message({
                type: 'success',
                message: res.message,
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
  },
}
</script>

<style lang='less' scoped>
.details {
  text-align: center;
  overflow: hidden;
  padding-top: 47px;
  .invitation {
    margin-bottom: 15px !important;
  }
  .invitation-left {
    font-weight: 400;
    font-size: 16px;
    color: #666;
  }
  .invitation-right {
    font-weight: 600;
    font-size: 16px;
    color: #333;
    text-align: left;
  }
  /deep/.el-dialog__wrapper {
    // .el-dialog {
    //   @media (min-width: 100px) and (max-width: 1319px) {
    //     width: 830px !important;
    //     height: 445px !important;
    //   }
    //   @media screen and (min-width: 1320px) {
    //     width: 830px !important;
    //     height: 445px !important;
    //   }
    // }
    .invitations {
      width: 32% !important;
      height: 422px !important;
      border-radius: 25px !important;
      .el-dialog__header {
        padding: 29px 20px 10px !important;
        span {
          font-weight: 700;
        }
      }
      .el-dialog__body {
        padding: 25px 25px 46px !important;
      }
    }
  }
  h2 {
    font-size: 28px;
    font-family: 'Source Han Sans CN';
    font-weight: 500;
    color: #333333;
    margin-top: 10%;
    margin-bottom: 3%;
    // height: 37px;
    // line-height: 37px;
  }
  .meeeting {
    p {
      font-size: 18px;
    }
    font-family: 'Microsoft YaHei';
    font-weight: 400;
    color: #333333;
  }
  .btn {
    width: 70%;
    display: flex;
    justify-content: center;
    align-items: center;
    button {
      // width: 7vw;
      padding: 8px 18px;
      // height: 3.7vh;
      background: #00ccff;
      border-radius: 20px;
      border: 0;
      outline: none;
      color: #fff;
      margin-right: 30px;
      cursor: pointer;
      font-size: 18px;
    }
  }

  .anpai {
    text-align: center;
    img {
      margin-top: 5vw;
      width: 15vw;
      height: 15vw;
    }
  }
}
</style>