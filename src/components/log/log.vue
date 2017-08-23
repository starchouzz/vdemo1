<template>
  <div class="dialog fade">
    <div class="collect" >
      <img src="static/pic/sucollect.png" alt="" >
    </div>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped>
     .dialog
        position : fixed
        top : 0
        left: 0
        z-index: 20
        width: 100%
        min-height: 100%
        .collect
           opacity: 0.1
           width: 40%
           padding: 20px 20px
           margin: 0 auto
           border-radius: 20px
           background-color: rgb(160,198,232)
           margin-top: 50%
           text-align: center
           img
             width: 50%
</style>
<script type="text/ecmascript-6">

    export default {
           mounted () {
//               var that = this;
//               setTimeout ( function (){
//                 that.$store.commit('setcollectShow')
//               },1000);
             },
           computed : {
             fade : function(){
//               alert(1);
//               var that = this;
//               setTimeout ( () => {
//                 that.$store.commit('setcollectShow')
//               },1000)
             }
           },
           methods : {
             close (){
               this.$store.commit('setcollectShow')
             }
           }
    }
</script>
