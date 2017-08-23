<template>
   <div class="rating">
      <div class="house" @click="chat('rom1')">
        <img src="static/pic/chat.png" alt="">
        <p>点击进入聊天室</p>
        <img src="static/pic/next.png" alt="">
      </div>
      <div class="robotroom" @click="robotchat">
        <img src="static/pic/robot.png" alt="">
        <p>机器人</p>
        <img src="static/pic/next.png" alt="">
      </div>
      <div class="friend" >
       <img src="static/pic/robot.png" alt="">
       <p>在线好友</p>
        <img src="static/pic/next.png" alt="">
      </div>
      <chat v-show="getshowchat"></chat>
      <div class="robotchat" v-show="getshowrobotchat">
        <div class="top">
          <img @click="back" src="static/pic/back.png" width="30" height="30" style="vertical-align:top">
          <span style="height:30px;line-height:30px;font-size:15px;">在线人数</span>
          <span></span>
        </div>
        <div class="middle">
         <div v-for="obj in getrobotmsg">
           <othermsg v-if="obj.name!=getusername" :head="obj.src" :msg="obj.message"
            :img="obj.img"></othermsg>
           <mymsg v-if="obj.name==getusername"  :head="obj.src" :msg="obj.message"
            :img="obj.img"></mymsg>
         </div>
        </div>
        <div class="inputtext">
          <input type="text" v-model="robotmess">
          <button type="button" @click="subrobotmess">发送</button>
        </div>
      </div>
   </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .rating
    width: 100%
    flex: 1
    position: relative
    .house
       height: 40px
       width: 100%
       border-radius: 5px
       display: flex
       background:rgb(240,234,211)
       img
         height: 40px
         flex: 0 0 40px
         vertical-align: top
       p
         flex: 1
         text-align: center
         line-height: 40px
         height: 40px
    .robotroom
       margin-top: 5px
       height: 40px
       width: 100%
       border-radius: 5px
       display: flex
       background:rgb(240,234,211)
       img
         height: 40px
         flex: 0 0 40px
         vertical-align: top
       p
         flex: 1
         text-align: center
         line-height: 40px
         height: 40px
    .friend
      margin-top: 5px
      height: 40px
      width: 100%
      border-radius: 5px
      display: flex
      background:rgb(240,234,211)
      img
        height: 40px
        flex: 0 0 40px
        vertical-align: top
      p
        flex: 1
        text-align: center
        line-height: 40px
        height: 40px
    .robotchat
       position: absolute
       left: 0
       top: 0
       width: 100%
       height: 100%
       overflow: auto
       z-index: 2
       opacity: 1
       background-color: white
       .top
         height: 5%
         background:rgb(188,226,255)
       .middle
          width: 100%
          height: 88%
          overflow: auto
       .inputtext
          width: 100%
          height: 7%
          text-align: center
          display: flex
          background: rgb(188,226,255)
          input
            flex: 0 0 69.5%
            line-height: 30px
            font-size: 14px
            height: 30px
            width: 70%
            vertical-align: top
            border-radius: 10px
            outline: none
            border: 1px solid gray
          button
            flex: 0 0 30%
            width: 30%
            height: 30px
            outline: none
            border-radius: 10px

</style>
<script type="text/ecmascript-6" scoped>
  import mymsg from '../mymsg'
  import othermsg from '../othermsg'
  import chat from '../chat/chat'
  import io from 'socket.io-client'
  import {mapGetters} from 'vuex'
     export default {
        data () {
          return {
             socket:  "",
             robotmess: "",
             onlinecount: 0
          }
        },
       created (){
           var that  = this;
           this.$store.commit('setsocket',io.connect('http://localhost:3000/'));
           this.getsocket.on('connect',function(){
                 console.log(55);
           })
           this.getsocket.on('join',function(obj){
                that.$store.commit('setonlinecount',Object.keys(obj).length);
           })
         this.getsocket.on('mess',function(data){
             alert(data);
         })
       },
       computed : {
         ...mapGetters([
           'getsocket',
           'getshowchat',
           'getusername',
           'getusersrc',
           'getuserroom',
           'getmesshistoryinfos',
           'getrobotmsg',
           'getshowrobotchat'
         ])
       },
       methods : {
          chat(roomID){
              this.$store.commit('changeshowchat');
              var obj = {
                 name : this.getusername,
                 roomid : roomID,
                 src: this.getusersrc
              }
              this.$store.commit('setuserroom',roomID);
              this.getsocket.emit('join',obj);
              this.getsocket.emit('mail',{to:"dd",msg:"hello"});
              var data = {
                 roomid : roomID
              }
              this.$store.dispatch('getmesshistory',data)
          },
          robotchat () {
             this.$store.commit('changeshowrobotchat')
          },
          subrobotmess () {
             var data = {
                  info : this.robotmess,
                  id : this.getusername
             }
             this.$store.dispatch('getrobotmess',data)
             this.$store.commit('setrobotmsg',{
                 message : this.robotmess,
                 name : this.getusername,
                 src: this.getusersrc
             });
             this.robotmess = '';
         },
         back () {
           this.$store.commit('changeshowrobotchat');
         }
       },
       components : {
          chat,
          mymsg,
          othermsg
       }
     }
</script>
