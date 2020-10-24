<template>
  <div class="reserMeet">
    <div class="main">
      <header>
        <div class="avatar">
          <img :src="userinfo.avatar" alt />
        </div>
        <div class="search">
          <i class="el-icon-search"></i>
          <input type="text" placeholder="搜索" />
        </div>
        <i class="el-icon-close" @click="$router.push('/menu')"></i>
      </header>

      <div style="display: flex">
        <el-aside>
          <el-col :span="6">
            <div style="padding: 2vh 2vw; box-sizing: border-box">
              <button style="" @click="centerDialogVisible = true">
                安排会议
              </button>
              <div class="mymeet">
                <h4>{{ userinfo.meetingId }}</h4>
                我的个人会议ID（PMI）
              </div>
              <img src="../assets/webrtc/edit.png" alt @click="showEditIdDialog(userinfo.userId)" />
            </div>
            <el-menu style="margin-top:10px;" :default-active="'/resermeet/meetDetails:' + meetId" class="el-menu-vertical-demo" @open="handleOpen"
              @close="handleClose" router>
              <!-- <el-menu-item index="/resermeet/meetDetails" v-if="!meetlist.length">
                <span slot="title" style="font-size: 1.4rem"> 暂无会议哦</span>
              </el-menu-item> -->
              <el-menu-item @click="getId(item.id)" :index="'/resermeet/meetDetails:' + item.id" v-for="item in meetlist" :key="item.id">
                <span
                  style="font-size: 1.4rem;overflow: hidden;white-space: nowrap;  text-overflow: ellipsis;  box-sizing: border-box; display: block; width: 332px;">{{ item.meetTopic }}
                </span>
                <span style="font-size: 1.05rem;margin-top:-3px !important;">会议时间：{{ item.start }}-{{ item.stop }}
                </span>
                <br />
                <span style="font-size: 1.05rem;margin-top:-3px !important;">会议ID：{{ item.meetingId }}</span>
              </el-menu-item>
            </el-menu>
          </el-col>
        </el-aside>

        <el-main style="
            padding: 0;
            background-color: #f8f8f8;
            displapy: flex;
            justify-content: center;
            align-items: center;
            width: 80%;
          ">
          <router-view :meetlist="meetlist" :meetId="meetId" @delMeet="delMeet" @showEdit="showEditDialog">
          </router-view>
        </el-main>

        <!-- 安排会议 -->
        <el-dialog title="安排会议" center :visible.sync="centerDialogVisible">
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="会议主题" prop="meetTopic">
              <el-input v-model="form.meetTopic"></el-input>
            </el-form-item>
            <!-- 开始时间 -->
            <el-form-item label="开始日期" style="text-align: center" prop="date">
              <el-col :span="15">
                <el-date-picker type="date" placeholder="选择日期" v-model="form.startDate" style="width: 100%" value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-col>
              <el-col class="line" :span="2" style="text-align: center">&nbsp;&nbsp;</el-col>
              <el-col :span="7" style="margin-left: 37px">
                <el-time-picker placeholder="选择时间" v-model="form.startTime" style="width: 100%" value-format="HH:mm">
                </el-time-picker>
              </el-col>
            </el-form-item>
            <!-- 结束时间 -->
            <el-form-item label="结束日期" style="text-align: center" prop="date">
              <el-col :span="15">
                <el-date-picker type="date" placeholder="选择日期" v-model="form.stopDate" style="width: 100%" value-format="yyyy-MM-dd"
                  @change="endchange(form.stopDate,form.startDate)"></el-date-picker>
              </el-col>
              <el-col class="line" :span="2" style="text-align: center">&nbsp;&nbsp;</el-col>
              <el-col :span="7" style="margin-left: 37px">
                <el-time-picker placeholder="选择时间" v-model="form.stopTime" style="width: 100%" value-format="HH:mm">
                </el-time-picker>
              </el-col>
            </el-form-item>

            <el-form-item label="密码" style="width:'50%;" prop="pwd">
              <el-input v-model="form.pwd" type="password" placeholder="可不填"></el-input>
            </el-form-item>
            <el-form-item label="选项" prop="beforeHost">
              <el-checkbox label="允许在主持人入会前加入" v-model="form.beforeHost"></el-checkbox>
              <br />
              <el-checkbox label="使用个人会议ID" v-model="form.meetingId"></el-checkbox>
              <br />
            </el-form-item>

            <!-- 按钮 -->
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="resetFields" round>取消</el-button>
            <el-button style="
              background-color: #00ccff !important;
              border-color: #00ccff !important;
            " type="primary" @click="creatmeet" round>安排</el-button>
          </span>
        </el-dialog>

        <!--个人会议ID设置 -->
        <el-dialog title="个人会议ID设置" width="35vw" center :visible.sync="showEditMeet">
          <el-form ref="Idform" :model="IdForm" label-width="88px">
            <el-form-item label="个人会议ID">
              <el-input size='small' v-model="form.meetingId" style="width: 98%" :disabled="true" :placeholder="IdForm.meetingId">
              </el-input>
            </el-form-item>
            <!-- <el-form-item label="视频">
              <el-form-item label="主持人" style="display: inline-block" label-width="56px;" class="host">
                <el-switch v-model="IdForm.host"></el-switch>
              </el-form-item>
              <el-form-item label="参会者" style="display: inline-block">
                <el-switch v-model="IdForm.part"></el-switch>
              </el-form-item>
            </el-form-item> -->

            <!-- <el-form-item label="音频">
              <el-radio-group v-model="IdForm.resource">
                <el-radio label="电脑音频"></el-radio>
              </el-radio-group>
            </el-form-item> -->
            <el-form-item label="选项">
              <el-checkbox label="保持摄像头关闭" v-model="IdForm.video"></el-checkbox>
              <br />
              <el-checkbox label="加入会议时静音" v-model="IdForm.scene"></el-checkbox>
              <br />
              <el-checkbox label="自动录制会议并保存在本地" v-model="IdForm.transcribe"></el-checkbox>
              <br />
            </el-form-item>

            <!-- 按钮 -->
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="showEditMeet = false" round>取消</el-button>
            <el-button type="primary" round @click="updateUserSet" style="background:#00ccff;border:0;">确定</el-button>
          </span>
        </el-dialog>

        <!-- 编辑会议 -->
        <el-dialog title="编辑会议" center :visible.sync="EditDialogVisible">
          <span></span>
          <el-form ref="editForm" :model="formData" label-width="80px">
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
                <el-time-picker placeholder="选择时间" v-model="formData.startTime" style="width: 100%" value-format="HH:mm"></el-time-picker>
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
              <el-input v-model="formData.pwd" type="password"></el-input>
            </el-form-item>
            <!-- <el-form-item label="视频">
              <el-form-item label="主持人" style="display: inline-block" label-width="56px" class="host">
                <el-switch v-model="formData.host"></el-switch>
              </el-form-item>
              <el-form-item label="参会者" style="display: inline-block">
                <el-switch v-model="formData.part"></el-switch>
              </el-form-item>
            </el-form-item> -->
            <el-form-item label="选项">
              <el-checkbox label="允许在主持人入会前加入" name="type" v-model="formData.beforeHost" :checked="formData.beforeHost">
              </el-checkbox>
              <!-- <br />
              <el-checkbox label="使用个人会议号" name="type" v-model="formData.oneself" :checked="formData.oneself">
              </el-checkbox>
              <br /> -->
            </el-form-item>

            <!-- 按钮 -->
          </el-form>

          <span slot="footer" class="dialog-footer">
            <el-button @click="resetEditFields" round>取消</el-button>
            <el-button type="primary" @click="updateMeet" round style="background:#00ccff;border:0;">编辑</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
// import { Col, Menu, mentItem, Submenu } from "element-ui";
import APIUrl from '@/axios/api.url'
import { post, get } from '@/axios/index'
import { mapMutations } from 'vuex'
export default {
  data() {
    return {
      userinfo: {}, // 用户个人信息
      centerDialogVisible: false, // 展示安排会议
      EditDialogVisible: false, // 展示编辑会议
      showEditMeet: false, // 展示个人会议ID设置
      // 个人会议id设置信息列表
      IdForm: {
        host: true,
        part: false,
        resource: '',
        scene: '',
        video: '',
        transcribe: '', // 自动录制
        meetingId: '',
      },

      // 安排会议信息列表
      form: {
        meetingId: '', // 会议ID
        meetTopic: '', // 会议主题
        startDate: '', // 会议开始日期
        startTime: '', // 会议开始时间
        stopDate: '', // 会议结束日期
        stopTime: '', // 会议结束时间
        host: true, // 主持人
        part: false, // 参会者
        scene: '', // 音频设置
        resource: '',
        desc: '',
        pwd: '', // 会议密码
        beforeHost: '', // 主持人入会前加入
      },
      meetlist: [], // 会议列表
      meetId: '', // 会议id

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
        oneself: '', // 使用自己的会议id
      },
      meetDeatil: {}, // 会议详情
      pickerOptions0: {
        disabledDate: (time) => {
          if (this.endTime) {
            return time.getTime() > this.endTime
          }
        },
      },
      pickerOptions1: {
        disabledDate: (time) => {
          if (this.starTime) {
            return time.getTime() < this.starTime
          }
        },
      },
    }
  },
  computed: {},
  created() {
    this.userinfo = JSON.parse(localStorage.getItem('userinfo'))
    this.IdForm.meetingId = this.userinfo.meetingId
    this.meetId = this.$route.path.split(':')[1]
    this.getMeetList()
  },
  methods: {
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

    // 获取会议ID
    getId(id) {
      // console.log(id);
      this.meetId = id
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
          this.meetId = this.meetlist[0].id
        }
      })
    },

    // 表单重置
    resetFields() {
      this.centerDialogVisible = false
      this.$refs.form.resetFields()
    },

    // 表单重置
    resetEditFields() {
      this.$refs.editForm.resetFields()
      this.EditDialogVisible = false
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

    // 安排会议
    creatmeet() {
      // console.log(this.form.startDate + ' ' + this.form.startTime)
      // console.log(this.form.stopDate + ' ' + this.form.stopTime)
      // console.log(this.form.startDate)
      // console.log(this.form.stopDate)
      // console.log(this.form.startDate < this.form.stopDate)
      // console.log(this.form.beforeHost)
      // console.log(this.form.meetingId)
      // console.log(this.form.host)
      if (this.form.startDate && this.form.stopDate < this.form.startDate) {
        this.$message({
          message: '会议结束时间不得早于开始时间',
          type: 'warning',
        })
        return false
      }
      const apiurl = APIUrl.util.createmeet
      post(apiurl, {
        userId: this.userinfo.userId,
        meetTopic: this.form.meetTopic,
        meetHost: this.userinfo.username
          ? this.userinfo.username
          : this.userinfo.phone,
        meetPwd: this.form.pwd || '',
        startTime: this.form.startDate + ' ' + this.form.startTime,
        stopTime: this.form.stopDate + ' ' + this.form.stopTime,
        timestamp: this.getTime(),
        oneself: this.form.meetingId ? 1 : 0,
        tailStatus: this.form.beforeHost ? 1 : 0,
      })
        .then((res) => {
          console.log('安排会议', res)
          if (res.status == 200) {
            this.$message.success(res.message)
            this.$refs.form.resetFields()
            this.centerDialogVisible = false
            this.getMeetList()
          } else {
            this.$message.error(res.message)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    // 显示编辑会议框
    showEditDialog(id) {
      const newmeetlist = this.meetlist.filter((v) => {
        return v.meetingId == id
      })
      const newmeet = newmeetlist[0]
      // if (newmeet.meetHost !== this.userinfo.username) {
      //   this.$message.warning("您没有权限哦");
      //   return false;
      // }
      if (newmeet.state == '进行中') {
        this.$message.warning('该会议正在进行中，您无法编辑了哦')
        return false
      }

      console.log('接收', id)
      this.EditDialogVisible = true
      // 先获取会议详情赋值
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
          // this.getMeetList() // 获取会议列表
        } else {
          this.$message.error(res.message)
        }
      })
    },

    // 编辑会议
    updateMeet(id) {
      console.log(id)
      const updateMeet = APIUrl.util.updateMeet
      // console.log(this.meetId);
      console.log(this.userinfo.username)
      if (
        this.formData.startDate &&
        this.formData.stopDate < this.formData.startDate
      ) {
        this.$message({
          message: '会议结束时间不得早于开始时间',
          type: 'warning',
        })
        return false
      }
      post(updateMeet, {
        id: this.meetId,
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
          this.$message.success(res.message)
          this.EditDialogVisible = false
          this.getMeetList()
        } else {
          this.$message.warning(res.message)
        }
      })
    },

    // 删除会议
    delMeet(id) {
      this.meetlist = this.meetlist.filter((item) => {
        return item.id !== id
      })
      this.getMeetList()
    },

    // 获取个人会议id信息
    showEditIdDialog(id) {
      this.showEditMeet = true
      const getUserSet = APIUrl.util.getUserSet
      // 获取个人设置
      post(getUserSet, {
        userId: id,
        timestamp: this.getTime(),
      }).then((res) => {
        console.log('个人设置', res)
        if (res.status == 200) {
          this.IdForm.scene = res.data.scene_profile ? true : false
          this.IdForm.transcribe = res.data.transcribe ? true : false
          this.IdForm.video = res.data.video_profile ? true : false
          this.$store.commit(
            'setaudioStatus',
            res.data.scene_profile ? true : false
          )
          this.$store.commit(
            'setvideoStatus',
            res.data.video_profile ? true : false
          )
          this.$forceUpdate()
        }
      })
    },

    // 修改个人设置
    updateUserSet() {
      const updateUserSet = APIUrl.util.updateUserSet
      post(updateUserSet, {
        userId: this.userinfo.userId,
        scene_profile: this.IdForm.scene ? 1 : 0,
        video_profile: this.IdForm.video ? 1 : 0,
        transcribe: this.IdForm.transcribe ? 1 : 0,
      }).then((res) => {
        console.log('修改个人会议id', res)
        if (res.status == 200) {
          this.$message.success(res.message)
          this.$store.commit('setvideoStatus', this.IdForm.video ? 1 : 0)
          this.$store.commit('setaudioStatus', this.IdForm.scene ? 1 : 0)
          this.showEditMeet = false
        }
      })
    },

    handleOpen(key, keyPath) {
      console.log(key, keyPath)
      $('.el-menu-item').style.backgroundColor = '#00ccff'
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    },
  },
}
</script>

<style lang='less' scoped>
.reserMeet {
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 1200px;
  .main {
    width: 100%;
    height: 100%;
    background: #ffffff;
    box-shadow: 0px 0px 9px 0px rgba(0, 0, 0, 0.13);
    header {
      display: flex;
      align-items: center;
      width: 100%;
      height: 8vh;
      background: #ffffff;
      box-shadow: 0px 3px 9px 0px rgba(0, 0, 0, 0.05);
      padding-left: 30px;
      box-sizing: border-box;
      position: relative;
      .avatar {
        width: 60px;
        height: 60px;
        border-radius: 30px;
        img {
          width: 100%;
          height: 100%;
          display: block;
          border-radius: 100%;
        }
      }
      .search {
        position: relative;
        margin-left: 20px;
        i {
          position: absolute;
          top: 10px;
          left: 15px;
          font-size: 20px;
          color: #666;
          font-weight: 600;
        }
        input {
          width: 329px;
          height: 40px;
          background: #f8f8f8;
          border-radius: 20px;
          border: 0;
          outline: none;
          text-indent: 40px;
          &:focus {
            border: 1px solid #00ccff;
          }
        }
      }
      .el-icon-close {
        position: absolute;
        top: 29px;
        right: 20px;
        font-size: 24px;
        color: #666;
        cursor: pointer;
        font-weight: 600;
      }
    }
    .el-aside {
      width: 20% !important;
      /**隐藏滚动条但是可以滚动 */
      &::-webkit-scrollbar {
        display: none;
      }
      .el-col {
        width: 100%;
        height: 92vh;
        border-right: 1px solid rgba(0, 0, 0, 0.08);
        position: relative;
        img {
          position: absolute;
          top: 13%;
          right: 12%;
          cursor: pointer;
        }
        button {
          width: 70%;
          height: 5vh;
          background: #00ccff;
          box-shadow: 0px 2px 8px 0px rgba(102, 102, 102, 0.26);
          border-radius: 3vh;
          border: 0;
          outline: none;
          margin-left: 14%;
          color: #fff;
          cursor: pointer;
          font-size: 22px;
        }
        .mymeet {
          margin-top: 20px;
          padding: 10px 10px;
          text-align: center;
          font-size: 16px;
          color: #333;
          h4 {
            font-weight: 400;
            text-align: center;
            font-size: 20px;
            color: #333;
          }
        }
        .el-menu {
          border-right: 0;
          .el-menu-item {
            padding: 15px 0 10px;
            padding-left: 45px !important;
            font-size: 25px;
            line-height: 32px;
            height: 20%;
            border-bottom: 1px solid #eee;

            &:hover {
              background-color: #fff;
            }
          }
          /deep/.el-menu-item.is-active {
            color: #fff;
            background-color: #00ccff;
            border-bottom: 0;
          }
        }
      }
    }
    .el-dialog__wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      .el-input {
        width: 20vw;
      }
    }
    .el-form {
      .host {
        /deep/.el-form-item__content {
          margin-left: 56px !important;
        }
      }
    }
    /deep/.el-dialog__wrapper {
      .el-dialog {
        @media screen and (min-width: 100px) and (max-width: 1319px) {
          width: 585px !important;
          height: 576px !important;
          &:nth-child(2) {
            height: 443px !important;
          }
        }
        @media screen and (min-width: 1320px) {
          width: 585px !important;
          height: 576px !important;
          &:nth-child(2) {
            height: 443px !important;
          }
        }
      }
    }
  }
}
</style>