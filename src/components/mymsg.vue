<template>
    <div class="mymsg">
      <div class="nomess"></div>
      <div class="msg">
        <div class="flexbox">
          <div v-if="msg" class="spanmess">{{msg}}</div>
          <img v-if="img" :src="img" alt="" class="image">
        </div>
        <div class="flex">
         <div class="triangle"></div>
         <img :src="head" alt="">
        </div>
      </div>
    </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    .mymsg
      margin-top: 20px
      animation: show-chat-odd 0.25s 1 ease-in
      text-align: right
      .msg
         padding-top: 20px
         overflow: hidden
         font-size: 0
         padding: 10px
         display: flex
         .flexbox
           flex: 1
           float: right
           .image
             width: 100px
             height: 100px
             padding: 10px
             border-radius: 5px
             background: rgb(158,159,145)
           .spanmess
            font-size: 14px
            border-radius: 5px
            background: rgb(245,211,178)
            word-break: break-all
            line-height: 1.5
            padding: 10px
         .flex
           flex: 0 0 40px
           img
             height: 30px
             width: 30px
             border-radius: 50%
           .triangle
             display: inline-block
             width: 0
             height: 0
             border-width: 5px
             border-style: solid
             margin: auto
             border-color: transparent transparent transparent rgb(245,211,178)

      @keyframes show-chat-odd {
       0% {
        margin-right: 480px
      }

      100% {
        margin-right: 0
      }
    }
</style>
<script type="text/ecmascript-6">
    export default {
        props:['name','head','msg','img']
    }
</script>
