<template>
  <div class="setup">
    <div class="main">
      <header>
        <div style="margin-left:2%">
          <img src="../assets/webrtcs/meetlogo.png" alt="" style="width:155px;height:57px;">
        </div>
        <i class="el-icon-close" style="font-size: 30px; margin-left: 10px; cursor: pointer" @click="$router.push('/menu')"></i>
      </header>
      <div style="display:flex; width: 100%;height: 92vh;">
        <el-aside>
          <el-col :span="6">
            <h5 style=""> 设置 </h5>
            <el-menu :default-active="$route.path" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" router>
              <el-menu-item index="/setup/setpersonal">
                <span slot="title">个人资料</span>
              </el-menu-item>
              <el-menu-item index="/setup/setfeedback">
                <span slot="title">反馈</span>
              </el-menu-item>
            </el-menu>
          </el-col>
        </el-aside>
        <el-main style="padding:47px 20px">
          <router-view></router-view>
        </el-main>
      </div>

    </div>
  </div>
</template>

<script>
import { Col, Menu, mentItem, Submenu } from 'element-ui'
export default {
  methods: {
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
.setup {
  width: 100%;
  height: 100vh;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 1100px;
  .main {
    width: 100%;
    height: 100%;
    background: #ffffff;
    box-shadow: 0px 0px 9px 0px rgba(0, 0, 0, 0.13);
    header {
      width: 100%;
      height: 8vh;
      background: #ffffff;
      box-shadow: 0px 3px 9px 0px rgba(0, 0, 0, 0.05);
      display: flex;
      align-items: center;
      .el-icon-close {
        position: absolute;
        top: 20px;
        right: 20px;
        font-size: 24px;
        color: #666;
        cursor: pointer;
        font-weight: 600;
      }
    }
    .el-aside {
      width: 17% !important;
      height: 100%;
      border-right: 1px solid rgba(0, 0, 0, 0.08);

      .el-col {
        width: 100%;
        h5 {
          height: 101px;
          line-height: 101px;
          margin-left: 40px;
          // margin-bottom: 5%;
          font-weight: 400;
          @media screen and (max-width: 700px) {
            font-size: 18px;
          }
          @media screen and (min-width: 701px) and (max-width: 1100px) {
            font-size: 22px;
          }
          @media screen and (min-width: 1101px) and (max-width: 1520px) {
            font-size: 24px;
          }
          @media screen and (min-width: 1521px) {
            font-size: 26px;
          }
        }
        .el-menu {
          border-right: 0;
          .el-menu-item {
            text-indent: 2rem;
            font-size: 1.7rem;
            line-height: 51px;
            padding-left: 30px !important;
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
            &:hover {
              background-color: #fff;
            }
          }
          /deep/.el-menu-item.is-active {
            color: #fff;
            background-color: #00ccff;
          }
        }
      }
    }
  }
}
</style>