<template>
  <div class="othermsg">
    <div class="msg">
     <div class="flex">
       <img :src="head" alt="">
       <div class="triangle"></div>
     </div>
     <div class="flexbox">
       <div v-if="msg" class="spanmess">{{msg}}</div>
       <img v-if="img" :src="img" alt="" class="image">
     </div>
    </div>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.othermsg
  margin-top: 20px
  animation: show-chat-odd 0.25s 1 ease-in
  .msg
    overflow: hidden
    font-size: 0
    padding: 10px
    display: flex
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
        border-color: transparent rgb(245,211,178) transparent transparent
    .flexbox
      flex: 1
      .image
        width: 100px
        height: 100px
        padding: 10px
        border-radius: 5px
        background: rgb(158,159,145)
      .spanmess
        display: inline-block
        font-size: 14px
        border-radius: 5px
        word-break:break-all
        background: rgb(245,211,178)
        padding: 10px
        line-height: 1.5
  @keyframes show-chat-odd {
    0% {
      margin-right: -480px;
    }

    100% {
      margin-right: 0;
    }
  }
</style>
<script type="text/ecmascript-6">
  export default {
    props:['name','head','msg','img']
  }
</script>
