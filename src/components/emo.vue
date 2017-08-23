<template>
  <div class="emo">
    <div v-for="item in emoj" style="display: inline-block">
      <img :src="item" alt="">
    </div>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .emo
     position: absolute
     top: -30px
     left: 0
     width: 100%
     background: rgb(238,238,238)
     img
       width: 30px
       height: 30px

</style>
<script type="text/ecmascript-6">
   export default {
       data () {
         return {
           emoj:["static/pic/detail.png","static/pic/detail.png","static/pic/detail.png","static/pic/detail.png"]
         }
       }
   }
</script>
