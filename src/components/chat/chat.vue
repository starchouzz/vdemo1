<template>
  <transition name="fade">
    <div class="chat">
        <div class="top">
          <img @click="back" src="static/pic/back.png" width="30" height="30" style="vertical-align:top">
          <span style="height:30px;line-height:30px;font-size:15px;">在线人数{{getonlinecount}}</span>
        </div>
        <div class="room">
          <div v-for="obj in getmesshistoryinfos">
            <mymsg v-if="obj.username==getusername" :name="obj.username" :head="obj.src" :msg="obj.msg"
                    :img="obj.img" ></mymsg>
            <othermsg v-if="obj.username!=getusername" :name="obj.username" :head="obj.src" :msg="obj.msg"
                 :img="obj.img" ></othermsg>
          </div>
          <div v-for="obj in getinfos">
          <mymsg v-if="obj.username==getusername" :name="obj.username" :head="obj.src" :msg="obj.msg"
               :img="obj.img" ></mymsg>
          <othermsg v-if="obj.username!=getusername" :name="obj.username" :head="obj.src" :msg="obj.msg"
               :img="obj.img" ></othermsg>
          </div>
        </div>
        <div class="inp">
          <div class="emoj"><img src="static/pic/emo1.png" alt="" @click="emo" ></div>
          <div class="upload" :style="'backgroundImage:url('+getuploadimg+')'">
            <input type="file" style="width:100%;height:100%;opacity:0" @change="upload">
          </div>
          <emo v-if="showemo"></emo>
          <input type="text" class="inp1"  v-model="messg">
          <button type="button" class="btn" @click="submess" >发送</button>
        </div>
    </div>
  </transition>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  &.fade-enter-active, &.fade-leave-active
    transition: all 0.2s linear
    transform translate3d(0, 0, 0)

  &.fade-enter, &.fade-leave-active
    opacity: 1
    transform translate3d(100%, 0, 0)

  .chat
    position: absolute
    top: 0
    left: 0
    width: 100%
    flex: 1
    z-index: 50
    height: 100%
    background-color: white
    display: flex
    opacity: 1
    flex-direction: column
    .top
       width: 100%
       height: 5%
       background:rgb(188,226,255)
    .room
       height: 83%
       overflow: auto
    .inp
        width: 100%
        height: 12%
        position: relative
        background: rgb(241,241,241)
        font-size: 0
        .emoj
          width: 20%
          height: 30px
          float: left
          img
            widht: 100%
            height: 100%
        .upload
          margin-left: 20%
          width: 50px
          height: 30px
          background-size: 60% 30px
          background-repeat: no-repeat
          input
            width: 100%
            height: 100%
        .inp1
          font-size: 14px
          height: 30px
          width: 70%
          vertical-align: top
          border-radius: 10px
          outline: none
        .btn
          width: 29%
          height: 30px
          background: rgb(24,150,216)
          border-radius: 10px
          outline: none
</style>
<script type="text/ecmascript-6">
  import Exif from 'exif-js'
  import emo from '../emo'
  import mymsg from '../mymsg'
  import othermsg from '../othermsg'
  import io from 'socket.io-client'
  import {mapGetters} from 'vuex'
  export default {
    data() {
      return {
        messg: "",
        showemo: false
      }
    },
    created() {
      const that = this
      this.socket = io.connect('http://localhost:3000/')
      this.getsocket.on('message', function (obj) {
        that.$store.commit('addroomdetailinfos', obj)
        window.scrollTo(0, 0)
      })
      this.getsocket.on('logout', function (obj) {
        that.$store.commit('setonlinecount', Object.keys(obj).length);
      })
      this.getsocket.on('disconnect', function () {

      })
    },
    methods: {
      submess() {
        if (this.messg != "") {
          var data = {
            username: sessionStorage.username,
            msg: this.messg,
            src: this.getusersrc,
            img: '',
            room: this.getuserroom
          }
          this.getsocket.emit('message', data);
          this.messg = '';
        } else {
          alert("信息不能为空");
        }
      },
      back() {
        this.$store.commit('changeshowchat');
        var obj = {
          name: this.getusername,
          roomid: this.getuserroom
        }
        this.getsocket.emit('logout', obj)
        this.getsocket.emit('disconnect', function () {
        })
      },
      emo() {
        this.showemo = !this.showemo;
      },

      upload(e) {
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length) return;
        this.picValue = files[0];
        this.imgPreview(this.picValue);
      },
      imgPreview(file) {
        let self = this;
        let Orientation;
        //去获取拍照时的信息，解决拍出来的照片旋转问题
        Exif.getData(file, function () {
          Orientation = Exif.getTag(this, 'Orientation');
        });
        // 看支持不支持FileReader
        if (!file || !window.FileReader) return;
        if (/^image/.test(file.type)) {
          // 创建一个reader
          let reader = new FileReader();
          // 将图片2将转成 base64 格式
          reader.readAsDataURL(file);
          // 读取成功后的回调
          reader.onloadend = async function () {
            let result = this.result;
            let img = new Image();
            img.src = result;
            //判断图片是否大于100K,是就直接上传，反之压缩图片
            if (this.result.length <= (100 * 1024)) {
              self.headerImage = this.result;
              self.postImg();
            } else {
              img.onload = function () {
                let data = self.compress(img, Orientation);
                self.headerImage = data;
                self.postImg();
              }
            }
          }
        }
      },
      postImg() {
        var data = {
          username: this.getusername,
          msg: '',
          src: this.getusersrc,
          img: this.headerImage,
          room: this.getuserroom
        }
        this.getsocket.emit('message', data);
      },
    rotateImg(img, direction, canvas) {
      //最小与最大旋转方向，图片旋转4次后回到原方向
      const min_step = 0;
      const max_step = 3;
      if (img == null) return;
      //img的高度和宽度不能在img元素隐藏后获取，否则会出错
      let height = img.height;
      let width = img.width;
      let step = 2;
      if (step == null) {
        step = min_step;
      }
      if (direction == 'right') {
        step++;
        //旋转到原位置，即超过最大值
        step > max_step && (step = min_step);
      } else {
        step--;
        step < min_step && (step = max_step);
      }
      //旋转角度以弧度值为参数
      let degree = step * 90 * Math.PI / 180;
      let ctx = canvas.getContext('2d');
      switch (step) {
        case 0:
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0);
          break;
        case 1:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(degree);
          ctx.drawImage(img, 0, -height);
          break;
        case 2:
          canvas.width = width;
          canvas.height = height;
          ctx.rotate(degree);
          ctx.drawImage(img, -width, -height);
          break;
        case 3:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(degree);
          ctx.drawImage(img, -width, 0);
          break;
      }
    },
    compress(img, Orientation) {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext('2d');
      //瓦片canvas
      let tCanvas = document.createElement("canvas");
      let tctx = tCanvas.getContext("2d");
      let initSize = img.src.length;
      let width = img.width;
      let height = img.height;
      //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
      let ratio;
      if ((ratio = width * height / 4000000) > 1) {
        console.log("大于400万像素")
        ratio = Math.sqrt(ratio);
        width /= ratio;
        height /= ratio;
      } else {
        ratio = 1;
      }
      canvas.width = width;
      canvas.height = height;
      // 铺底色
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      //如果图片像素大于100万则使用瓦片绘制
      let count;
      if ((count = width * height / 1000000) > 1) {
        console.log("超过100W像素");
        count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片
        //  计算每块瓦片的宽和高
        let nw = ~~(width / count);
        let nh = ~~(height / count);
        tCanvas.width = nw;
        tCanvas.height = nh;
        for (let i = 0; i < count; i++) {
          for (let j = 0; j < count; j++) {
            tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
            ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
          }
        }
      } else {
        ctx.drawImage(img, 0, 0, width, height);
      }
      //修复ios上传图片的时候 被旋转的问题
      if (Orientation != "" && Orientation != 1) {
        switch (Orientation) {
          case 6://需要顺时针（向左）90度旋转
            this.rotateImg(img, 'left', canvas);
            break;
          case 8://需要逆时针（向右）90度旋转
            this.rotateImg(img, 'right', canvas);
            break;
          case 3://需要180度旋转
            this.rotateImg(img, 'right', canvas);//转两次
            this.rotateImg(img, 'right', canvas);
            break;
        }
      }
      //进行最小压缩
      let ndata = canvas.toDataURL('image/jpeg', 0.1);
      console.log('压缩前：' + initSize);
      console.log('压缩后：' + ndata.length);
      console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");
      tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
      return ndata;
    }
          },
      computed : {
        ...mapGetters([
            'getsocket',
            'getmesshistoryinfos',
            'getuserroom',
            'getusersrc',
            'getusername',
            'getinfos',
            'getonlinecount',
            'getuploadimg'
        ])
      },
      components : {
        mymsg,
        othermsg,
        emo
      }
  }
</script>
