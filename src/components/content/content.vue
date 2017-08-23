<template>
   <div class="con">
      <div class="p1">
         <img  @click="goback" src="static/pic/back.png" alt="">
         <span>{{title}}</span>
      </div>
      <div class="pic" >
        <img :src="img" >
        <div class="score">
          <div class="sub">导演:</div>
          <div class="sub">主演:</div>
          <div class="sub">评分:{{score}}</div>
        </div>
      </div>
      <div class="bg" :style="'backgroundImage:url('+img+')'">
      </div>
      <div class="middle">
         <div class="title"  @click ="show1">详情</div>
         <div class="title"  @click ="show2">评论</div>
      </div>
      <div class="content" v-if="getshowcontent">
          hello
      </div>
      <div class="rat" v-if="getshowrat">
        <div class="room">
         <div v-for="item in gethistoryratingfos">
           <span @click="addFriend(item)">{{item.user}}</span>
           <span>{{item.message}}</span>
         </div>
         <div v-for="item in getratinfos">
           <span @click="addFriend(item)">{{item.user}}</span>
           <span>{{item.message}}</span>
         </div>
        </div>
        <div class="input">
           <input type="textarea" v-model="ratmess">
           <button @click="submess">发送</button>
        </div>
      </div>
   </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .con
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      z-index: 2
      background-color: white
      text-align: center
      opacity: 1
      overflow: hidden
      .p1
         height: 5%
         text-align: left
         background: rgb(240,234,211)
         img
           width: 30px
           height: 30px
           vertical-align: top
         span
           font-size: 20px
      .pic
         width: 80%
         height: 40%
         margin: 0 auto
         text-align: left
         display: flex
         img
           width: 60%
           height: 80%
           flex: 0 0 60%
           margin-top: 5%
         .score
            color: rgb(215,215,215)
            margin-top: 5%
            flex: 1
            margin-left: 3%
            .sub
               margin-top: 10px
               height: 30px
      .bg
         position: absolute
         top: 5%
         left: 0
         width: 100%
         height: 40%
         overflow: hidden
         filter: blur(10px)
         opacity: 0.8
         z-index: -1
         background-size: 100% 100%

      .middle
         display: flex
         height: 5%
         background: rgb(206,228,241)
        .title
            display: block
            height: 100%
            line-height: 100%
            flex: 1
      .content
         height: 50%
         font-size: 20px
         text-align: left
         background: rgb(240,247,250)
      .rat
         height: 50%
         font-size: 20px
         text-align: left
         background: rgb(240,247,250)
         .room
           height: 80%
           font-size: 20px
           overflow: auto
           text-align: left
         .input
             width: 100%
             height: 20%
             display: flex
             background: rgb(244,244,244)
             input
               height: 70%
               flex: 0 0 70%
               outline: none
               border: 1px solid rgb(244,244,244)
               border-radius: 5px
             button
               height: 70%
               flex: 1
               border: none
               border-radius: 10px
               outline: none
</style>
<script type="text/ecmascript-6">
  import io from 'socket.io-client'
  import {mapGetters} from 'vuex'
    export default {
       data () {
          return {
             ratmess:''
          }
       },
       created () {
       },
       props : ['img','score','title'],
       methods : {
            submess () {
               var data = {
                 user: this.getusername,
                 message : this.ratmess,
                 title: this.title
               }
               this.$store.dispatch('torat',data);
               this.ratmess = "";
            },
            addFriend () {
                var obj = {
                    name1: "zz",
                    name2: "pp"
                }
                if(obj.name1 != obj.name2) {
                    this.getsocket.emit('add',obj);
                }
            },
            show1 () {
               this.$store.commit('setshowcontent',true);
               this.$store.commit('setshowrat',false);
            },
            show2() {
              this.$store.commit('setshowcontent',false);
              this.$store.commit('setshowrat',true);
            },
            goback () {
               this.$emit('tochange','');
            }
       },
      computed : {
        ...mapGetters([
           'getusername',
           'getratinfos',
           'gethistoryratingfos',
           'getshowcontent',
           'getshowrat'
        ])
      }
    }
</script>
