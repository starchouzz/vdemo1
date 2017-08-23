<template>
    <div class="star" :class="starType">
      <span :class="itemClass" v-for="itemClass in itemClasses" class="star-item"></span>
    </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixin.styl"
  .star
     font-size: 0
     height: 12px
     .star-item
        display: inline-block
     &.star-24
       .star-item
          width: 10px
          height: 10px
          margin-right: 2px
          background-size: 10px 10px
          &:last-child
             margin-left: 0
          &.on
             bg-image('star24_on')
          &.half
             bg-image('star24_half')
          &.off
             bg-image('star24_off')
</style>
<script type="text/ecmascript">
  const LENGTH = 5;
  const CLS_ON = 'on';
  const CLS_HALF = 'half';
  const CLS_OFF = 'off';
  export default {
       props: {
          size: {
              type: Number
          },
          score: {
              type: String
         }
       },
       computed:{
           starType(){
              return "star-"+this.size;
           },
           itemClasses(){
              let result = [];
              let score = Math.floor(parseFloat(this.score))/2;
              var hasDecimal = true;
              if(score == Math.floor(score)){
                 hasDecimal = false;
              }
              let integer = Math.floor(score);
              for(let i = 0 ; i < integer ; i++){
                 result.push(CLS_ON);
              };
              if(hasDecimal){
                 result.push(CLS_HALF);
              };
              while(result.length < LENGTH){
                 result.push(CLS_OFF);
              };
              return result;
           }
       }
  }
</script>
