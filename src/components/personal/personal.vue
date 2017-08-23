<template>
  <div class="person" >
      <div class="head" >
        <img :src="getusersrc" alt="">
        <p>{{getusername}}</p>
      </div>
      <div class="background" :style="'backgroundImage:url('+getusersrc+')'">
      </div>
      <div class="content">
      <div class="menu" @click="changeImg">更换头像</div>
      <div class="uploadBtn" v-show="getheadImage" :style="'backgroundImage:url('+getheaderImg+')'" style="
    width: 100%;margin-top: 10px;height: 80px;background-size: 60% 100px;background-repeat:no-repeat;
    background-position: center;">
        <input type="file" id="upload" accept="image" @change="upload" style="width:100%;
        height:100%;opacity:0">
      </div>
      <div class="menu">修改密码</div>
      <div class="menu" @click="collectlist">我的收藏</div>
      <div class="collection" v-show="showcol" style="max-height:240px;overflow:auto;" >
          <div class="collect" v-for="item in getcollect" style="width: 100%;height: 80px;display: flex;">
              <div class="avatar" style="flex: 0 0 80px;height: 80px;">
                <img :src="item.imgUrl" alt="" width="80" height="80">
              </div>
              <div class="content" style="flex: 1">
                 <div class="title">{{item.title}}</div>
                 <div>
                   <div>{{item.score}}</div>
                 </div>
              </div>
          </div>
      </div>
      <div class="menu" @click="logout">退出应用</div>
      </div>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.person
   flex: 1
   width: 100%
   position: relative
   diaplay: flex
   flex-direction: column
  .head
    text-align: center
    flex: 0 100px 0
    img
      width: 100px
      height: 100px
      border-radius: 50%
    p
      font-size: 20px
  .background
    filter: blur(10px)
    width: 100%
    height: 120px
    z-index: -1
    position: absolute
    top: 0
    left: 0
  .content
    flex: 1
    background: rgb(240,240,240)
    .menu
     height: 40px
     width: 90%
     margin: 0 auto
     margin-top: 20px
     border-radius: 5px
     background: rgb(206,228,241)
     text-align: center
     line-height: 40px
    .collection
       width: 90%
       margin: 0 auto
       height:240px
       overflow: auto
       .collect
         width: 100%
         height: 80px
         display: flex
         .avatar

         .content
           flex: 1

</style>
<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  import Exif from 'exif-js'
  export default {
    data () {
      return {
        showcol: false
      }
    },
    mounted () {
    },
    methods: {
      upload (e) {
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length) return;
        this.picValue = files[0];
        this.imgPreview(this.picValue);
      },
      imgPreview (file) {
        let self = this;
        let Orientation;
        //去获取拍照时的信息，解决拍出来的照片旋转问题
        Exif.getData(file, function(){
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
            }else {
              img.onload = function () {
                let data = self.compress(img,Orientation);
                self.headerImage = data;
                self.postImg();
              }
            }
          }
        }
      },
      postImg () {
          var that = this;
          this.$http.post('restful/upload',{user:this.getusername,"imgUrl":this.headerImage})
            .then((response) => {
                 if(response.body.msg =="上传成功"){
                      this.$store.commit('setusersrc',this.headerImage);
                      this.$store.commit('setheaderImg',this.headerImage);
                 }
           })
      },
      rotateImg (img, direction,canvas) {
        //最小与最大旋转方向，图片旋转4次后回到原方向
        const min_step = 0;
        const max_step = 3;
        if (img == null)return;
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
      compress(img,Orientation) {
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
        if(Orientation != "" && Orientation != 1){
          switch(Orientation){
            case 6://需要顺时针（向左）90度旋转
              this.rotateImg(img,'left',canvas);
              break;
            case 8://需要逆时针（向右）90度旋转
              this.rotateImg(img,'right',canvas);
              break;
            case 3://需要180度旋转
              this.rotateImg(img,'right',canvas);//转两次
              this.rotateImg(img,'right',canvas);
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
      },
      changeImg(){
          var url = 'static/pic/camera.png';
         this.$store.commit('setheadImage');
         this.$store.commit('setheaderImg',url);
      },
      collectlist () {
        this.showcol = !this.showcol;
        if(this.showcol){
           this.$store.commit('setcollect',JSON.parse(sessionStorage.collect));
        }
      },
      logout () {
          var data = {
            user : this.getusername
          };
          this.$store.dispatch('tologout',data);
      }
    },
    computed : {
      ...mapGetters([
         'getusername',
         'getusersrc',
         'getheadImage',
         'getheaderImg',
         'getcollect'
      ])
    }
  }
</script>
