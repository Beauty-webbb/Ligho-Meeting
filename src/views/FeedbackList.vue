<template>
  <div class="feedback">
    <!-- <header></header>
    <div class="content">
      <div class="top">
        <div class="border"></div>
        <h4>常见问题</h4>
      </div>
      <div class="bottom">
        <ul>
          <li>
            <h5>1.支持系统及下载方式</h5>
            <p>本产品支持Mac OS、Windows、iOS、Android；可以通过官网下载</p>
          </li>
          <li>
            <h5>1.支持系统及下载方式</h5>
            <p>本产品支持Mac OS、Windows、iOS、Android；可以通过官网下载</p>
          </li>
          <li>
            <h5>1.支持系统及下载方式</h5>
            <p>本产品支持Mac OS、Windows、iOS、Android；可以通过官网下载</p>
          </li>
        </ul>
      </div>
    </div>
    <div class="search">
      <input type="text" placeholder="在此输入您的邮箱">
    </div>
    <div class="contact">
      <div>
        <i class="iconfont icon-dianhua"></i>
        <span>400-000-000</span>
      </div>
      <div>
        <i class="iconfont icon-10" style="font-size:20px;"></i>
        <span>9:00-18:00</span>
      </div>
      <div>
        <i class="iconfont icon-theearth2diqiu"></i>
        <span>http://bonwey.com</span>
      </div>
    </div> -->

    <div class="box" ref="box">
      <div class="left">
        左侧div内容
      </div>
      <div class="resize" title="收缩侧边栏">
        ⋮
      </div>
      <div class="mid">
        <div v-for="item in list" :key="item" :style="{border:'1px solid pink',height:uservideoh+'px',width:uservideow+'px'}">{{item}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [111, 222, 333, 444],
      newlist: [],
      id: 3,
      count: 1,
      uservideow: 0,
      uservideoh: 0,
    }
  },
  created() {
    this.calculation_w_h(document.body.clientWidth)
  },
  mounted() {
    this.dragControllerDiv()
  },
  methods: {
    calculation_w_h(bodywidth, num = 0) {
      // console.log('计算宽高')
      if (this.FullScreenVideostatus) {
        return
      }
      if (this.list.length - num >= 2 && this.list.length - num <= 4) {
        var numbers = 2
      } else if (this.list.length - num > 4) {
        this.fontsize = 22
        var numbers = 4
      } else {
        var numbers = 1
      }
      // 两个人的时候，视图大一些
      if (this.list.length == 2) {
        this.uservideow = (bodywidth * 0.9) / numbers - 15
      } else {
        this.uservideow = (bodywidth * 0.75) / numbers - 15
      }
      this.uservideoh = (this.uservideow * 9) / 16 + 1
    },
    dragControllerDiv(e) {
      var that = this
      var resize = document.getElementsByClassName('resize')
      var left = document.getElementsByClassName('left')
      var mid = document.getElementsByClassName('mid')
      var box = document.getElementsByClassName('box')
      console.log(document.body.clientWidth)

      for (let i = 0; i < resize.length; i++) {
        // 鼠标按下事件
        resize[i].onmousedown = function (e) {
          //颜色改变提醒
          resize[i].style.background = '#818181'
          var startX = e.clientX
          resize[i].left = resize[i].offsetLeft
          // 鼠标拖动事件
          document.onmousemove = function (e) {
            var endX = e.clientX
            // 左侧宽度
            var moveLen = resize[i].left + (endX - startX) // （endx-startx）=移动的距离。resize[i].left+移动的距离=左边区域最后的宽度
            var maxT = box[i].clientWidth - resize[i].offsetWidth // 容器宽度 - 左边区域的宽度 = 右边区域的宽度
            // 右侧宽度
            var rightwidth = document.body.clientWidth - moveLen - 10
            console.log(rightwidth)
            if (moveLen < 700) moveLen = 700 // 左边区域的最小宽度为32px
            if (moveLen > maxT - 200) moveLen = maxT - 200 //右边区域最小宽度为150px
            resize[i].style.left = moveLen // 设置左侧区域的宽度
            for (let j = 0; j < left.length; j++) {
              left[j].style.width = moveLen + 'px'
              mid[j].style.width = box[i].clientWidth - moveLen - 10 + 'px'
            }
            if (moveLen > 700 || rightwidth > 200) {
              that.calculation_w_h(rightwidth)
            }
          }
          // 鼠标松开事件
          document.onmouseup = function (evt) {
            //颜色恢复
            resize[i].style.background = '#d6d6d6'
            document.onmousemove = null
            document.onmouseup = null
            resize[i].releaseCapture && resize[i].releaseCapture() //当你不在需要继续获得鼠标消息就要应该调用ReleaseCapture()释放掉
          }
          resize[i].setCapture && resize[i].setCapture() //该函数在属于当前线程的指定窗口里设置鼠标捕获
          return false
        }
      }
    },
  },
}
</script>

<style scpoed lang='less'>
.feedback {
  position: relative;
  height: 100vh;
  background: #fff;
  header {
    height: 142px;
    background-color: #00ccff;
  }
  .content {
    position: absolute;
    top: 105px;
    left: 25%;
    box-sizing: border-box;
    height: 443px;
    background: #ffffff;
    box-shadow: 0px 6px 12px 1px rgba(153, 153, 153, 0.16);
    border-radius: 10px;
    .top {
      background-color: #e0f2ff;
      height: 48px;
      width: 990px;
      display: flex;
      align-items: center;
      border-radius: 10px 10px 0 0;
      .border {
        width: 5px;
        height: 20px;
        background: #00ccff;
        border-radius: 3px;
        margin: 0 6px 0 20px;
      }
      h4 {
        color: #333;
        font-size: 16px;
        font-weight: 400;
      }
    }
    .bottom {
      ul {
        margin: 35px 0 0 18px;
        li {
          font-size: 14px;
          color: #333;
          h5 {
            font-weight: 400;
          }
          p {
            margin: 6px 0 10px 8px;
          }
        }
      }
    }
  }
  .search {
    position: absolute;
    bottom: 62px;
    left: 37%;
    input {
      width: 495px;
      height: 30px;
      background: #ffffff;
      border: 1px solid #cccccc;
      border-radius: 4px;
      outline: none;
      text-indent: 5px;
    }
  }
  .contact {
    position: absolute;
    bottom: 26px;
    left: 37%;
    width: 495px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    i {
      color: #9bd7ff;
    }
    span {
      color: #333;
      font-size: 14px;
      margin-left: 3px;
    }
  }

  /* 拖拽相关样式 */
  /*包围div样式*/
  .box {
    width: 100%;
    height: 100%;
    margin: 1% 0px;
    overflow: hidden;
    box-shadow: -1px 9px 10px 3px rgba(0, 0, 0, 0.11);
  }
  /*左侧div样式*/
  .left {
    width: calc(32% - 10px); /*左侧初始化宽度*/
    height: 100%;
    background: #ffffff;
    float: left;
  }
  /*拖拽区div样式*/
  .resize {
    cursor: col-resize;
    float: left;
    position: relative;
    top: 45%;
    background-color: #d6d6d6;
    border-radius: 5px;
    margin-top: -10px;
    width: 10px;
    height: 50px;
    background-size: cover;
    background-position: center;
    font-size: 32px;
    color: white;
  }
  /*拖拽区鼠标悬停样式*/
  .resize:hover {
    color: #444444;
  }
  /*右侧div'样式*/
  .mid {
    float: left;
    width: 68%; /*右侧初始化宽度*/
    height: 100%;
    background: #fff;
    box-shadow: -1px 4px 5px 3px rgba(0, 0, 0, 0.11);
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    align-content: center;
    justify-content: center;
    div {
      width: 241.7px;
      height: 136px;
    }
  }
}
</style>