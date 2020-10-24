<template>
  <div class="redio">
    <h4>音频</h4>
    <div class="check">
      <el-checkbox label="加入会议时自动通过电脑连接语音"></el-checkbox>
      <br />
      <el-checkbox label="加入会议时将麦克风静音"></el-checkbox>
      <br />
      <el-checkbox label="使用第三方音频时，不弹出连接语音对话框"></el-checkbox>
      <br />
      <el-checkbox label="同步耳机状态按钮"></el-checkbox>
      <br />
    </div>
  </div>
</template>

<script>
export default {
  name: "setredio",
};
</script>

<style lang='less' scoped>
.redio {
  display: flex;
  margin-top: 6%;

  h4 {
    font-weight: 400;
    // font-size: 1.6rem;
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
    }
    /deep/.el-checkbox__label {
      font-size: 1.3rem;
    }
  }
}
</style>