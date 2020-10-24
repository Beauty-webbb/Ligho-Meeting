<template>
  <div class="back">
    <div class="videos">
      <h4>视频</h4>
      <div class="check">
        <el-checkbox label="开启美颜" v-model="openBeauty"></el-checkbox>
        <br />
      </div>
    </div>
    <div class="meet">
      <h4>会议</h4>
      <div class="check">
        <el-checkbox label="加入会议时静音" v-model="scene"></el-checkbox>
        <br />
        <el-checkbox label="自动录制会议" v-model="transcribe"></el-checkbox>
        <br />
        <!-- <el-select v-model="value" placeholder="画质设置" clearable>
          <el-option v-for="item in options" :key="item.value" :label="item.value" :value="item.value">
          </el-option>
        </el-select> -->
      </div>
    </div>
  </div>
</template>

<script>
import APIUrl from "@/axios/api.url";
import { post, get } from "@/axios/index";
export default {
  name: "setvideo",
  data() {
    return {
      userinfo: {}, // 用户信息
      openMirror: "", // 打开镜像
      openBeauty: "", // 打开美颜
      beforeHost: "", // 主持人之前加入
      scene: "", // 音频
      oneself: "", // 使用个人会议号
      transcribe: "", // 自动录制
      userSet: {}, // 用户设置信息
      options: [{ value: "高清" }, { value: "超清" }, { value: "原画" }],
      value: "",
    };
  },
  created() {
    this.userinfo = JSON.parse(localStorage.getItem("userinfo"));
  },
  mounted() {
    this.$nextTick(() => {
      this.getUserSet();
    });
  },
  destroyed() {
    this.updateUserSet();
  },
  methods: {
    //获取当前时间，并定义格式
    getTime() {
      let yy = new Date().getFullYear();
      let mm = new Date().getMonth() + 1;
      mm = mm < 10 ? "0" + mm : mm;
      let dd =
        new Date().getDate() < 10
          ? "0" + new Date().getDate()
          : new Date().getDate();
      let hh = new Date().getHours();
      let mf =
        new Date().getMinutes() < 10
          ? "0" + new Date().getMinutes()
          : new Date().getMinutes();
      let ss =
        new Date().getSeconds() < 10
          ? "0" + new Date().getSeconds()
          : new Date().getSeconds();

      return yy + "-" + mm + "-" + dd + " " + hh + ":" + mf + ":" + ss;
    },

    // 获取个人设置
    getUserSet() {
      const getUserSet = APIUrl.util.getUserSet;
      post(getUserSet, {
        userId: this.userinfo.userId,
        timestamp: this.getTime(),
      }).then((res) => {
        console.log(res);
        if (res.status == 200) {
          this.userSet = res.data;
          this.openBeauty = this.userSet.beauty_effect ? true : false; // 打开美颜
          this.transcribe = this.userSet.transcribe ? true : false; // 自动录制
          this.scene = this.userSet.scene_profile ? true : false; // 音频
        }
      });
    },

    // 修改个人设置
    updateUserSet() {
      const updateUserSet = APIUrl.util.updateUserSet;
      post(updateUserSet, {
        userId: this.userinfo.userId,
        beauty_effect: this.openBeauty ? 1 : 0,
        scene_profile: this.scene ? 1 : 0,
        transcribe: this.transcribe ? 1 : 0,
      }).then((res) => {
        console.log("修改个人设置", res);
        if (res.status == 200) {
          this.$store.commit("setaudioStatus", this.scene ? 1 : 0);
        }
      });
    },
  },
};
</script>

<style lang='less' scoped>
.back {
  margin-top: 6%;
  .videos {
    display: flex;
    margin-bottom: 35px;
    h4 {
      font-weight: 400;
      margin-right: 4%;
      @media screen and (max-width: 700px) {
        font-size: 14px;
      }
      @media screen and (min-width: 701px) and (max-width: 1100px) {
        font-size: 18px;
      }
      @media screen and (min-width: 1101px) and (max-width: 1520px) {
        font-size: 20px;
      }
      @media screen and (min-width: 1521px) {
        font-size: 24px;
      }
    }
    .el-checkbox {
      margin-bottom: 9%;
      /deep/.el-checkbox__inner {
        width: 17px;
        height: 17px;
        position: relative;
        border-radius: 50%;
      }
      /deep/.el-checkbox__input.is-checked {
        position: relative;
        /deep/.el-checkbox__inner::after {
          content: "";
          position: absolute;
          left: 5.5px;
          top: 2px;
          width: 4px;
          height: 8px;
        }
      }
      /deep/.el-checkbox__input.is-checked + .el-checkbox__label {
        color: #666 !important;
      }

      /deep/.el-checkbox__original {
        font-size: 1.3rem;
        color: #666;
      }
      /deep/.el-checkbox__label {
        font-size: 1.3rem;
        color: #666;
      }
    }
  }
  .meet {
    display: flex;
    h4 {
      font-weight: 400;
      margin-right: 4%;
      @media screen and (max-width: 700px) {
        font-size: 14px;
      }
      @media screen and (min-width: 701px) and (max-width: 1100px) {
        font-size: 18px;
      }
      @media screen and (min-width: 1101px) and (max-width: 1520px) {
        font-size: 20px;
      }
      @media screen and (min-width: 1521px) {
        font-size: 24px;
      }
    }
    .el-checkbox {
      margin-bottom: 5%;
      /deep/.el-checkbox__inner {
        width: 17px;
        height: 17px;
        position: relative;
        border-radius: 50%;
      }
      /deep/.el-checkbox__input.is-checked {
        position: relative;
        /deep/.el-checkbox__inner::after {
          content: "";
          position: absolute;
          left: 5.5px;
          top: 2px;
          width: 4px;
          height: 8px;
        }
      }
      /deep/.el-checkbox__input.is-checked + .el-checkbox__label {
        color: #666 !important;
      }

      /deep/.el-checkbox__original {
        font-size: 1.3rem;
        color: #666;
      }
      /deep/.el-checkbox__label {
        font-size: 1.3rem;
        color: #666;
      }
    }
  }
}
</style>