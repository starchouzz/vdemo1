<template>
  <div class="temp">
      <div class="head">
         <div class="pic" @click="toDetail">
            <img src="static/pic/menu.png" @click="changeShow">
         </div>
         <div class="content-wrapper">
           wellcome {{getusername}}
         </div>
      </div>
      <div class="detail" v-if="!getusername" :style="'backgroundImage:url('+getbgImg+')'">
          <div class="title">
             <div class="log-title" @click="toggle1">Login</div>
             <div class="reg-title" @click="toggle2">Register</div>
          </div>
         <transition name="fade">
          <div class="login" v-if="showLogin" >
             <div class="bor"></div>
             <div class="inp">
               <img src="static/pic/person.png" alt="">
               <input type="text" placeholder="username" v-model="user">
             </div>
            <div class="inp">
              <img src="static/pic/password.png" alt="">
              <input type="password" placeholder="password" v-model="password">
            </div>
             <button type="button" @click="login">Login</button>
          </div>
         </transition>
         <transition name="fade">
          <div class="register" v-if="showRegister" >
             <div class="bor"></div>
            <div class="inp">
              <img src="static/pic/person.png" alt="">
              <input type="text" placeholder="username" v-model="user1">
            </div>
            <div class="inp">
              <img src="static/pic/password.png" alt="">
              <input type="password" placeholder="password" v-model="password1">
            </div>
            <button type="button" @click="register">Register</button>
          </div>
        </transition>
      </div>
  </div>
</template>
<style lang="stylus" rel="stylesheeet/stylus" scoped>
  .fade-enter-active {
    transition: all .5s ease
  }
  .fade-leave-active {
    transition: all 0s ease
  }
  .fade-enter, .fade-leave-active {
    transform: scale(0)
    opacity: 0
  }
.temp
   flex: 0 0 60px
   .head
       display: flex
       z-index: 2
       width: 100%
       height: 60px
       background-color: rgb(206,228,241)
       .pic
           flex: 0 0 120px
           height: 80px
           img
             width: 50px
             height: 50px
             display: inline-block
             vertical-align: top
             margin: 10px 0 10px 10px
             border-radius: 50%
       .content-wrapper
           flex: 1
           line-height: 60px
           font-size: 20px
   .detail
       position: fixed
       top: 0
       left: 0
       z-index: 999
       width: 100%
       height: 100%
       overflow: auto
       background:rgba(7,17,27,0.8)
       background-size: 100% 100%
       background-repeat: no-repeat
       .title
          width: 100%
          margin-top: 40px
          margin-bottom: 40px
          display: flex
          text-align: center
          font-size: 16px
          color: mediumvioletred
          .log-title
             flex: 1
          .reg-title
             flex: 1
       .login
          width: 70%
          margin: 0 auto
          text-align: center
          .bor
            width: 50%
            border: 2px solid rgb(13,121,209)
          .inp
             margin-top: 40px
             width: 80%
             display: flex
             line-height: 60px
             img
               flex: 0 0 30px
               width: 30px
               height: 30px
               margin-right: 10px
               margin-top: 15px
             input
              flex: 1
              margin: 0 auto
              height: 60px
              border-bottom: 1px solid rgb(82,163,190)
              color: rgb(13,121,209)
              background: transparent
              outline:none;
          button
            background:transparent
            border: 1px solid rgb(82,163,190)
            color: rgb(13,121,209)
            border-radius: 15px
            margin-top: 40px
            width: 80%
            padding: 15px 32px
            text-align: center
            text-decoration: none
            display: inline-block
            font-size: 16px
            outline: none
       .register
          width: 70%
          margin: 0 auto
          text-align: center
          .bor
           margin-left: 50%
           width: 50%
           border: 2px solid rgb(13,121,209)
     .inp
       margin-top: 40px
       width: 80%
       display: flex
       line-height: 60px
       img
         flex: 0 0 30px
         width: 30px
         height: 30px
         margin-right: 10px
         margin-top: 15px
       input
         flex: 1
         margin: 0 auto
         height: 60px
         border-bottom: 1px solid rgb(82,163,190)
         color: rgb(13,121,209)
         background: transparent
         outline:none
     button
       background:transparent
       border: 1px solid rgb(82,163,190)
       color: rgb(13,121,209)
       border-radius: 15px
       margin-top: 40px
       width: 80%
       padding: 15px 32px
       text-align: center
       text-decoration: none
       display: inline-block
       font-size: 16px
       outline: none
</style>
<script type="text/ecmascript-6">
import io from 'socket.io-client'
import {mapGetters} from 'vuex'
  export default {
       data () {
          return {
             showLogin: true,
             showRegister: false,
             user: '',
             password: '',
             user1: '',
             password1: '',
             password2: '',
          }
       },
       created () {
          var that  = this;
          this.$store.commit('setsocket',io.connect('http://localhost:3000/'));
          this.getsocket.on('login',function(obj){
              console.log(obj);
         })
       },
       mounted () {
       },
       methods: {
           toggle1 () {
             this.showLogin = true;
             this.showRegister = false ;
           },
           toggle2 () {
             this.showLogin = false;
             this.showRegister = true ;
           },
           toDetail () {
             this.showDetail = true;
           },
           login () {
                var that = this;
                var data = {
                  user:this.user,
                  password:this.password
                }
                this.$store.dispatch('tologin',data);
                this.getsocket.emit('login',{user:sessionStorage.username,src:this.getusersrc})
           },
           register () {
             this.$http.post('restful/register',{
                 user:this.user1,
                 password:this.password1,
                 src: ''
           }).then((response) => {
                 if(response.body.errno == 0){
                   this.showLogin = true;
                   this.showRegister = false ;
                 }
           })
           },
           changeShow () {
              this.$store.commit('setshowTab');
           }
       },
       computed : {
         ...mapGetters([
              'getusername',
              'getshowDetail',
              'getusersrc',
              'getbgImg',
              'getsocket'
         ])
       }
  }
</script>
