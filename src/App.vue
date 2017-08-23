<template>
  <div id="app">
    <v-header></v-header>
    <transition name="fade">
    <div class="tab border-1px" v-show="getshowTab">
      <div class="headImg">
        <img :src="getusersrc" alt="">
      </div>
      <div class="tabshadow" @click="changeshow"></div>
      <div class="tab-item"><router-link to="/movie" class="link">
        <img src="static/pic/all.png" alt="" class="l">
        <span>电影</span>
        <img src="static/pic/next.png" alt="" class="ri">
      </router-link></div>
      <div class="tab-item"><router-link to="/rating" class="link">
        <img src="static/pic/message.png" alt="" class="l">
        <span>聊天</span>
        <img src="static/pic/next.png" alt=""  class="ri">
      </router-link></div>
      <div class="tab-item"><router-link to="/personal" class="link">
        <img src="static/pic/personal.png" alt="" class="l">
        <span>我的</span>
        <img src="static/pic/next.png" alt=""  class="ri">
      </router-link></div>
    </div>
    </transition>
    <router-view></router-view>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import header from "./components/header/header"
export default {
  name: 'app',
  data(){
    return {

    }
  },
  methods : {
    changeshow (){
      this.$store.commit('setshowTab');
    }
  },
  computed : {
    ...mapGetters([
       'getusersrc',
       'getshowTab'
    ])
  },
  components : {
     "v-header": header
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" >
  @import "./common/stylus/mixin.styl"
  &.fade-enter-active, &.fade-leave-active
    transition: all 2s linear
    transform translate3d(0, 0, 0)

  &.fade-enter, &.fade-leave-active
    opacity: 1
    transform translate3d(0, 50%, 100%)

html,body
   width: 100%
   height: 100%
   #app
    display: flex
    height: 100%
    flex-direction: column
    .tab
     position: fixed
     top: 0
     left: 0
     z-index: 99
     width: 80%
     height: 100%
     line-height: 40px
     background-color: white
     .headImg
         text-align: center
         border-bottom: 1px solid rgba(7,17,27,0.1)
         img
          border-radius: 50%
          width: 100px
          height: 100px
     .tabshadow
         position: fixed
         top: 0
         left: 0
         width: 100%
         height: 100%
         z-index: -1
     .tab-item
         width: 100%
         border-1px(rgba(7,17,27,0.1))
         border-bottom: 1px solid rgba(7,17,27,0.1)
         &>.link
          display: block
          width: 100%
          height: 40px
          display: flex
          color: rgb(77,85,93)
          &.active
             color: rgb(240,20,20)
             height: 40px
          .l
             flex: 0 0 40px
             width: 30px
             height: 30px
             vertical-align: top
          span
             flex: 1
             font-size: 15px
             margin-left: 20px
             line-height: 40px
          .ri
            flex: 0 0 40px
            width: 30px
            height: 30px
            vertical-align: top

</style>
