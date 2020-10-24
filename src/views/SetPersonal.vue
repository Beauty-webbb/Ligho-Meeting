<template>
  <div class="personal">
    <el-form :label-position="labelPosition" label-width="160px" :model="formLabelAlign">
      <el-form-item label="头像：" style="margin-top: 2%">
        <div class="avatarr">
          <img :src="userinfo.avatar" alt ref="img" />
          <el-upload class="avatar-uploader" action="123" :show-file-list="false" :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload" :auto-upload="false" :on-change="uploadChange">
            <!-- <img v-if="imageUrl" :src="imageUrl" class="avatar" /> -->
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="昵称：">
        <el-input v-model="username" :placeholder="userinfo.username"></el-input>
        <span class="change" @click="updateName">更改</span>
      </el-form-item>
      <el-form-item label="个人会议ID：">
        <el-input v-model="userinfo.meetingId" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="个人直播账号：">
        <el-input v-if="userinfo.livemobile" :placeholder="userinfo.livemobile" :disabled="true"></el-input>
        <el-input v-else placeholder="暂未绑定直播账号"></el-input>
        <span class="change" @click="liveVisible=true">更改</span>

      </el-form-item>
      <el-form-item label="登录电子邮件：">
        <div class="email">
          <span>{{ userinfo.email?userinfo.email:'暂未绑定邮箱' }}</span>
          <span class="change" @click="dialogVisible = true">绑定/更改</span>
          <!-- <span class="change" @click="open">保存</span> -->
          <!-- <span class="change cancel" @click="isShowEmail = false">取消</span> -->
        </div>
        <!-- <div class="changeEmail" v-if="isShowEmail">
          <input type="text" placeholder="请输入新的邮件地址" />
          <br />
          <input type="text" placeholder="验证码" />
          <br />
          <span class="code" @click="send_sms">发送验证码</span>
        </div> -->
      </el-form-item>
      <el-form-item label="用户类型：">
        <div class="userinfo">授权用户</div>
      </el-form-item>
      <el-form-item label="容量：">
        <div class="userinfo">会议 120</div>
      </el-form-item>
      <el-form-item label="登录密码：">
        <div class="pwd">
          <span class="showPwd" style="font-size:16px;" v-if="userinfo.password">{{
            showPwd ? userinfo.password : "********"
          }}</span>
          <span class="showPwd" v-if="!userinfo.password">暂未设置密码</span>
          <span class="change" @click="showPwd = !showPwd">显示</span>
          <span class="change" @click="passwordVisible = true">更改</span>
          <!-- <span class="change cancel" @click="showPwdInp = false">取消</span> -->
        </div>
      </el-form-item>
    </el-form>

    <el-dialog class="dialog" title="修改邮箱：" :visible.sync="dialogVisible" :before-close="handleClose">
      <div class="changeEmail">
        <input type="text" placeholder="请输入新的邮件地址" style="width: 68%; height: 37px; border-radius: 23px" v-model="newEmail" />
        <br />
        <input type="text" placeholder="验证码" style="width: 68%; height: 37px; border-radius: 23px" v-model="Emailcode" />
        <br />
        <span class="code" @click="verifyEmail">发送验证码</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" round>取 消</el-button>
        <el-button type="primary" @click="updateEmail" style="background:#00ccff;border:0;" round>确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog class="dialog" title="修改密码：" :visible.sync="passwordVisible" :before-close="handleClose">
      <div class="changeEmail changePwd">
        <input type="password" placeholder="新密码" style="width: 70%; height: 37px; border-radius: 23px" v-model="newPwd" />
        <br />
        <input type="text" placeholder="验证码" style="width: 70%; height: 37px; border-radius: 23px" v-model="code" />
        <span class="code" @click="send_sms">发送验证码</span>
        <br />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="passwordVisible = false" round>取 消</el-button>
        <el-button type="primary" @click="updatePwd" style="background:#00ccff;border:0;" round>确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog class="dialog" title="绑定直播账号：" :visible.sync="liveVisible" :before-close="handleClose">
      <div class="changeEmail changePwd">
        <input type="text" placeholder="直播账号" style="width: 70%; height: 37px; border-radius: 23px" v-model="liveId" />
        <br />
        <input type="password" placeholder="密码" style="width: 70%; height: 37px; border-radius: 23px" v-model="livepwd" />
        <br />
        <a href="https://login.lighos.com/signUp" target="_blank" style="margin-left:41%;color:#00ccff;">没有账号?去注册</a>
      </div>
      <span slot="footer" class="dialog-footer" style="text-align:center;">
        <el-button @click="liveVisible = false" round>取 消</el-button>
        <el-button type="primary" @click="bindlive" style="background:#00ccff;border:0;" round>确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { Upload } from "element-ui";
import APIUrl from '@/axios/api.url'
import { post, get } from '@/axios/index'
import { mapState } from 'vuex'
export default {
  name: 'setpersonal',
  data() {
    return {
      pwd: '', // 密码
      username: '', // 用户名
      isShowEmail: false, // 显示修改邮箱
      showPwdInp: false, // 显示修改密码
      isShowName: false, // 显示修改昵称
      showPwd: false, // 显示密码
      newPwd: '', // 新密码
      newEmail: '', // 新邮箱
      Emailcode: '', // 邮箱验证码
      code: '', // 验证码
      userinfo: {}, // 个人信息
      imageUrl: '',
      uploadUrl: APIUrl.baseURL,
      uploadPort: APIUrl.util.updateAvatar,
      headers: {
        Authorization: 'Bearer' + ' ' + localStorage.getItem('token'),
      },
      labelPosition: 'right',
      formLabelAlign: {
        name: '',
        region: '',
        type: '',
      },
      dialogVisible: false,
      passwordVisible: false,
      liveVisible: false,
      liveId: '',
      livepwd: '',
    }
  },
  created() {
    this.userinfo = JSON.parse(localStorage.getItem('userinfo'))
    // console.log(localStorage.getItem("token"));
  },
  computed: {
    // ...mapState(["userinfo"]),
  },
  methods: {
    // 绑定轻直播账号
    bindlive() {
      console.log(this.liveId)
      console.log(this.livepwd)
      if (!this.livepwd || !this.liveId) {
        this.$message.warning('请输入完整信息')
        return false
      }
      const apiurl = APIUrl.util.account
      post(apiurl, {
        userId: this.userinfo.userId,
        livemobile: this.liveId,
        livepassword: this.livepwd,
      }).then((res) => {
        console.log('绑定账号', res)
        if (res.status == 200) {
          this.$message.success('绑定成功')
          this.userinfo.livemobile = this.liveId
          this.userinfo.livepassword = this.livepwd
          this.$store.commit('setuserinfo', this.userinfo)
          localStorage.setItem('userinfo', JSON.stringify(this.userinfo))
          this.liveVisible = false
        }
      })
    },
    // 显示密码
    showPwdd() {
      this.showPwd = !this.showPwd
    },

    hidePwd() {
      this.showPwdInp = false
      console.log(123)
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

    // 更改头像
    uploadChange(file) {
      console.log(file)
      this.imageUrl = URL.createObjectURL(file.raw)
      console.log(this.imageUrl)
      this.getBase64(file.raw).then((res) => {
        // console.log(res);
        this.imageUrl = res
        // console.log(this.imageUrl);
        const apiurl = APIUrl.util.updateAvatar
        post(apiurl, {
          newavatar: this.imageUrl,
          userId: this.userinfo.userId,
          timestamp: this.getTime(),
        })
          .then((res) => {
            console.log('上传头像', res)
            if (res.status == 200) {
              this.userinfo.avatar = res.data.avatar
              // console.log(this.userinfo);
              this.$store.commit('setuserinfo', this.userinfo)
              localStorage.setItem('userinfo', JSON.stringify(this.userinfo))
              this.$message.success('修改头像成功')
            }
          })
          .catch((err) => {
            console.log('上传头像失败', err)
          })
      })
    },
    // 图片转码
    getBase64(file) {
      return new Promise(function (resolve, reject) {
        let reader = new FileReader()
        let imgResult = ''
        reader.readAsDataURL(file)
        reader.onload = function () {
          imgResult = reader.result
        }
        reader.onerror = function (error) {
          reject(error)
        }
        reader.onloadend = function () {
          resolve(imgResult)
        }
      })
    },

    // 上传头像成功
    handleAvatarSuccess(res, file) {
      console.log(res)
      console.log(file)
      this.imageUrl = URL.createObjectURL(file.raw)
      console.log(this.imageUrl)
      this.getBase64(file.raw).then((res) => {
        // console.log(res);
        this.imageUrl = res
        console.log(this.imageUrl)
      })
    },
    // 上传头像之前的验证
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },

    // 修改昵称
    updateName() {
      if (!this.username) {
        // alert("请输入内容");
        this.$message.warning('请输入新昵称哦')
        return false
      }
      if (this.username == this.userinfo.username) {
        this.$message.warning('新昵称不能和旧昵称一样哦')
        return false
      }
      const apiurl = APIUrl.util.updateUserName
      post(apiurl, {
        userId: this.userinfo.userId,
        username: this.username,
        timestamp: this.getTime(),
      })
        .then((res) => {
          console.log('修改昵称', res)
          if (res.status == 200) {
            this.$message.success(res.message)
            this.userinfo.username = this.username
            this.$store.commit('setuserinfo', this.userinfo)
            localStorage.setItem('userinfo', JSON.stringify(this.userinfo))
          }
        })
        .catch((err) => {
          console.log('修改昵称失败', err)
        })
    },

    //发送验证码
    send_sms() {
      if (this.newPwd == this.userinfo.password) {
        this.$message.warning('新密码和旧密码不能一样哦')
        return false
      }
      if (!this.newPwd) {
        this.$message.error('请填写新密码')
        return
      }
      const send_sms_api = APIUrl.util.send_sms
      post(send_sms_api, {
        phone: this.userinfo.phone,
      }).then((res) => {
        if (res.status == 200) {
          this.$message.success('验证码已发送至您的手机')
        } else {
          this.$message.error(res.message)
        }
      })
    },

    // 发送邮件验证码
    verifyEmail() {
      const reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
      if (!reg.test(this.newEmail)) {
        this.$message.error('邮箱格式不正确，请重新输入')
        return false
      }
      // 1.先发送邮箱验证码
      const sendEmail = APIUrl.util.sendEmail
      post(sendEmail, {
        email: this.newEmail,
        timestamp: this.getTime(),
      })
        .then((res) => {
          this.$message.success('验证码已发至您的邮箱')
          console.log('发送邮件', res)
        })
        .catch((err) => {
          console.log(err)
        })
    },

    // 修改邮箱
    updateEmail() {
      console.log(222)
      // 2.校验邮箱
      const verifyEmail = APIUrl.util.verifyEmail
      post(verifyEmail, {
        email: this.newEmail,
        code: this.Emailcode,
        timestamp: this.getTime(),
      }).then((res) => {
        console.log('校验邮箱', res)
        if (res.status == 200) {
          // 3.修改邮箱
          const updateEmail = APIUrl.util.updateEmail
          post(updateEmail, {
            userId: this.userinfo.userId,
            newemail: this.newEmail,
            timestamp: this.getTime(),
          }).then((res) => {
            console.log('update', res)
            if (res.status == 200) {
              this.$message.success(res.message)
              this.userinfo.email = this.newEmail
              this.$store.commit('setUserinfo', this.userinfo)
              localStorage.setItem('userinfo', JSON.parse(this.userinfo))
            } else {
              this.$message.error(res.message)
            }
          })
        }
      })

      // this.dialogVisible = false;
    },

    // 修改密码
    updatePwd() {
      if (this.newPwd == this.userinfo.password) {
        this.$message.warning('新密码和旧密码不能一样哦')
        return false
      }
      if (!this.code || !this.newPwd) {
        this.$message.warning('请输入完整内容')
        return false
      }
      const apiurl = APIUrl.util.updatePwd
      post(apiurl, {
        phone: this.userinfo.phone,
        newpwd: this.newPwd,
        code: this.code,
        timestamp: this.getTime(),
      })
        .then((res) => {
          console.log('修改密码', res)
          if (res.status == 200) {
            // 将新密码存入个人信息
            this.userinfo.password = this.newPwd
            this.$store.commit('setuserinfo', this.userinfo)
            localStorage.setItem('userinfo', JSON.stringify(this.userinfo))
            setTimeout(() => {
              // 密码改变用户需要重新登录
              this.$message.error('您已修改密码，请重新登录')
              localStorage.removeItem('token')
              localStorage.removeItem('userinfo')
              this.$router.push('/')
            }, 1000)
          } else {
            this.$message.error(res.message)
          }
        })
        .catch((err) => {
          console.log('修改密码错误', err)
        })
    },

    handleClose(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          done()
        })
        .catch((_) => {})
    },
  },
}
</script>

<style scoped lang='less'>
.personal {
  padding-left: 4vw;
  .change {
    color: #00ccff;
    font-size: 1rem;
    margin-left: 1.5vw;
    cursor: pointer;
  }

  .changeEmail {
    padding-left: 2%;
    margin-bottom: 20px;
    position: relative;
    input {
      width: 28%;
      height: 30px;
      line-height: 30px;
      border: 1px solid #ccc;
      border-radius: 15px;
      outline: none;
      text-indent: 10px;
      &:nth-child(1) {
        margin-bottom: 10px;
      }
    }
    input:focus {
      border: 1px solid #00ccff;
    }
    span {
      height: 15px;
      font-size: 1.1rem;
      font-weight: 400;
      color: #999999;
      text-indent: 5px;
    }
    @media screen and (min-width: 100px) and (max-width: 1200px) {
      .code {
        position: absolute;
        top: 68% !important;
        left: 65% !important;
        font-size: 12px !important;
      }
    }
    @media screen and (min-width: 1201px) and (max-width: 1920px) {
      .code {
        position: absolute;
        top: 68% !important;
        left: 65% !important;
        font-size: 12px !important;
      }
    }
    @media screen and (min-width: 1921px) {
      .code {
        position: absolute;
        top: 68% !important;
        left: 65% !important;
        font-size: 12px !important;
      }
    }
  }
  .name {
    margin-bottom: 1.5vw;
    font-size: 1.3rem;

    input {
      width: 25%;
      height: 30px;
      line-height: 30px;
      border: 1px solid #ccc;
      border-radius: 15px;
      outline: none;
      text-indent: 5px;
    }
    input:focus {
      border: 1px solid #00ccff;
    }
  }

  .avatarr {
    position: relative;
    // margin-top: 2%;
    // margin-bottom: .8%;
    font-size: 1.3rem;
    img {
      width: 60px;
      height: 60px;
      border-radius: 100%;
      vertical-align: middle;
    }
    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    /deep/.avatar-uploader {
      position: absolute;
      top: -18px;
      left: 21px;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409eff;
    }
    .avatar-uploader-icon {
      position: absolute;
      top: 18px;
      left: -20px;
      font-size: 28px;
      color: #8c939d;
      width: 60px;
      height: 60px;
      line-height: 60px;
      text-align: center;
      background-color: pink;
      border-radius: 100%;
      opacity: 0;
    }
    .avatar {
      width: 60px;
      height: 60px;
      display: block;
    }
  }
  .email {
    margin-bottom: 0.8%;
    font-size: 1.3rem;

    .cancel {
      color: #666;
    }
  }
  .userinfo {
    margin-bottom: 0.8%;
    font-size: 1.3rem;
  }
  .pwd {
    margin-bottom: 0.5%;
    font-size: 1.3rem;
    .cancel {
      color: #666;
    }
  }
  .el-form {
    .el-form-item {
      .el-input {
        width: 25%;
        /deep/.el-input__inner {
          // height: 30px !important;
          &:focus {
            border: 1px solid #00ccff;
          }
        }
      }
      /deep/.el-form-item__label {
        font-size: 1.3rem;
      }
      .changePwd {
        position: relative;
        .code {
          position: absolute;
          left: 22%;
          bottom: 28%;
          font-size: 14px;
          cursor: pointer;
        }
        .btn {
          border: 0;
          outline: none;
          background-color: #00ccff;
          color: #fff;
          position: absolute;
          top: 62%;
          left: 26%;
          width: 37px;
          height: 28px;
          border-radius: 8px;
          cursor: pointer;
        }
      }
    }
  }
  /deep/.el-dialog__wrapper {
    /deep/.el-dialog {
      // @media screen and (min-width: 699px) {
      //   width: 27% !important;
      // }
      @media screen and (min-width: 100px) and (max-width: 1200px) {
        width: 450px !important;
        height: 305px !important;
      }
      @media screen and (min-width: 1201px) and (max-width: 1920px) {
        width: 450px !important;
        height: 305px !important;
      }
      @media screen and (min-width: 1921px) {
        width: 456px !important;
        height: 315px !important;
      }
      .el-dialog__footer {
        text-align: center;
      }
      .el-dialog__body {
        text-align: center;
      }
    }
  }
}
</style>