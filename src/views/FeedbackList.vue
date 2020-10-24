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
    <button @click="prepage" class="pre">上一页</button>
    <button @click="nextpage" class="next">下一页</button>
    <div class="pagess" style="max-width:156px; overflow: hidden;">
      <div style="width:50px;height:50px;border:1px solid #00f;" v-for="item in newlist" :key="item">{{item}}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [
        111,
        222,
        333,
        444,
        555,
        666,
        777,
        888,
        999,
        123,
        456,
        323,
        645,
        3423,
        121,
        23,
        87,
        45,
        32,
        434,
        1545,
        5656,
      ],
      newlist: [],
      id: 3,
      count: 1,
    }
  },
  created() {
    this.newlist = this.list.slice(0, 3)
  },
  methods: {
    getCount(count) {},
    prepage() {
      console.log('上一页')
      this.count--
      this.newlist = this.list.slice((this.count - 1) * 3, this.count * 3)
      if (this.count == 1) {
        document.querySelector('.pre').style.display = 'none'
        document.querySelector('.next').style.display = 'block'
      }
    },
    nextpage() {
      console.log('下一页')
      this.count++
      if (this.count != 1) {
        document.querySelector('.pre').style.display = 'block'
      }
      console.log(this.count)
      this.newlist = this.list.slice((this.count - 1) * 3, this.count * 3)
      if (this.newlist.length % 3) {
        document.querySelector('.next').style.display = 'none'
      }
      console.log(this.newlist)
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
  // .pagess::-webkit-scrollbar {
  //   display: none;
  // }
  .pagess {
    display: flex;
  }
}
</style>