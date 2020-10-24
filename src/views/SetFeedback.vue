<template>
  <div class="feed">
    <h2>提交反馈</h2>
    <div class="inp">
      <input placeholder="您的名字" type="text"><input placeholder="您的联系电话" type="text">
    </div>
    <textarea placeholder="请留下您的意见或建议" name id cols="30" rows="10" v-model="content"></textarea>
    <button @click="submit">发送反馈</button>
  </div>
</template>

<script>
import APIUrl from '@/axios/api.url'
import { post, get } from '@/axios/index'
import { Message } from 'element-ui'
export default {
  name: 'feedback',
  data() {
    return {
      content: '', // 反馈内容
      userinfo: {}, // 个人信息
      username: '',
      phone: '',
    }
  },
  created() {
    this.userinfo = JSON.parse(localStorage.getItem('userinfo'))
  },
  methods: {
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

      return yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss
    },

    // 提交反馈
    submit() {
      if (!this.content) {
        Message({
          type: 'warning',
          message: '请先输入反馈内容',
        })
        return false
      }
      const feedbackurl = APIUrl.util.feedBack
      post(feedbackurl, {
        userId: this.userinfo.userId,
        content: this.content,
        timestamp: this.getTime(),
      }).then((res) => {
        console.log('反馈', res)
        if (res.status == 200) {
          this.$message.success(res.message)
          setTimeout(() => {
            this.content = ''
          }, 300)
        } else {
          this.$message.error(res.message)
        }
      })
    },
  },
}
</script>

<style lang='less' scoped>
.feed {
  margin: 0 auto;
  // margin-top: 6%;
  position: relative;
  height: 85%;
  width: 50%;
  text-align: center;
  h2 {
    width: 70%;
    font-size: 30px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #333333;
    text-align: center;
    margin-bottom: 5%;
    margin-left: 12%;
  }
  .inp {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    input {
      height: 50px;
      border: 1px solid #ccc;
      outline: none;
      text-indent: 10px;
      font-size: 16px;
      font-family: Arial, Helvetica, sans-serif;
      &:nth-child(1) {
        flex: 3;
      }
      &:nth-child(2) {
        flex: 6;
        margin-left: 30px;
      }
    }
  }
  textarea {
    margin: 0 auto;
    width: 100%;
    height: 52%;
    border: 1px solid #cccccc;
    resize: none;
    outline: none;
    font-size: 16px;
    margin-top: 20px;
    text-indent: 10px;
    padding-top: 10px;
    @media screen and (max-width: 700px) {
      width: 100%;
      height: 40%;
    }
    @media screen and (min-width: 701px) and (max-width: 1100px) {
      width: 100%;
      height: 40%;
    }
    @media screen and (min-width: 1101px) and (max-width: 1520px) {
      font-size: 16px;
    }
    @media screen and (min-width: 1521px) {
      font-size: 16px;
    }
  }
  button {
    position: absolute;
    right: 37vw;
    bottom: 36vh;
    padding: 0.5rem 1rem;
    background: #00ccff;
    border-radius: 25px;
    color: #fff;
    padding: 10px 20px;
    border: 0;
    outline: none;
    cursor: pointer;
    font-size: 1.3rem;
    @media screen and (max-width: 700px) {
      font-size: 16px;
      right: 4%;
      bottom: 36.5%;
      padding: 10px 15px;
    }
    @media screen and (min-width: 701px) and (max-width: 1100px) {
      font-size: 18px;
      right: 3%;
      bottom: 36.5%;
      padding: 10px 15px;
    }
    @media screen and (min-width: 1101px) and (max-width: 1520px) {
      font-size: 20px;
      right: 3%;
      bottom: 23%;
      padding: 10px 15px;
    }
    @media screen and (min-width: 1521px) {
      font-size: 22px;
      right: 3%;
      bottom: 25.5%;
      padding: 8px 12px;
    }
  }
}
</style>