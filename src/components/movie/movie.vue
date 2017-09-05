<template>
 <div class="wrapper">
   <div class = "list" v-if="movieList">
    <div class="content-wrapper" v-for="(item ,index) in movieList">
       <div class = "avatar"><img :src="item.imgUrl" width="80" height="80"></div>
       <div class="content">
         <div class="title">{{item.title}}</div>
         <div class="actor mt h">{{item.message}}</div>
         <div class="rat mt">
           <star :size="24" :score="item.score" class="dblock"></star>
           <span>{{item.score}}</span>
           <span>{{item.rating}}</span>
         </div>
         <div class="article mt">{{item.article}}</div>
       </div>
       <div class="collection">
         <div class="ver" @click="collect(item)">
           <img :src="getcollectsrc " v-if="item.content.length == 0" alt="">
           <img :src="getcollectsrc1" v-if="item.content.length" alt="">
         </div>
         <div class="ver " @click="showPage(item)">
           <img :src="getdetailsrc" alt="">
         </div>
       </div>
       <con v-show=" collectp == item.title" :img="item.imgUrl" :score="item.score" :title="item.title"
       @tochange="toback"></con>
       <transition name="fade">
         <log v-if="getcollectShow"></log>
       </transition>
      </div>
    </div>
 </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  &.fade-enter-active, &.fade-leave-active
    transition: all 0.2s linear
    transform translate3d(0, 0, 0)

  &.fade-enter, &.fade-leave-active
    opacity: 1
    transform translate3d(100%, 0, 0)

.wrapper
   width: 100%
   overflow: auto
   position: relative
   height: 100%
   column: 40%
   flex: 1
   .list
    width: 100%
    overflow: auto
    height: 100%
    .content-wrapper
      width: 100%
      display: flex
      border-bottom: 1px solid rgb(77,85,93)
      .avatar
        flex: 0 0 80px
        width: 80px
      .content
        flex: 4
        font-size: 12px
        padding-left: 5px
        color: rgb(77,85,93)
        height: 80px
      .mt
        margin-top: 2px
      .h
        height: 24px
        overflow: hidden
      .of
        overflow: hidden
      .title
        font-weight: bold
      .dblock
         display: inline-block
      .collection
        flex: 1
        font-size: 12px
        padding-left: 5px
        color: rgb(77,85,93)
        height: 80px
        .ver
           width: 100%
           height: 30px
           line-height: 30px
           text-align: center
           img
             width: 20px
             height: 20px

</style>
<script type="text/ecmascript-6">
  import log from '../log/log'
  import star from '../star/star'
  import con from '../content/content'
  import {mapGetters} from 'vuex'
   export default {
         data(){
           return {
             movieList:[],
             toShow : false,
             collectpic: '',
             collectp:''
           };
         },
         created () {
             this.$http.get('restful/cheerio')
               .then((response) => {
                   this.movieList = response.body;
             })
        },
        methods : {
           collect :function(item){
             var that = this;
             this.$http.post('restful/collect',{
                user:sessionStorage.username,
                ref:item.ref,
                num:item.num,
                title:item.title,
                score:item.score,
                imgUrl:item.imgUrl
             }).then((response) => {
                   if(response.body.msg == "收藏成功"){
                        that.$store.commit('setcollectShow')
                        var st = setTimeout(() => {
                          that.$store.commit('setcollectShow')
                         },2000)
                        item.content.push(1);
                   }
             })
           },
           showPage : function (item){
             this.collectp = item.title;
             var data = {
                title : item.title
             }
             this.$store.dispatch('togethistoryratinfos',data)
           },
           toback (msg) {
              this.collectp = msg
           }
        },
        computed : {
          ...mapGetters([
             'getcollectsrc',
             'getdetailsrc',
             'getcollectShow',
             'getcollectsrc1'
          ]),
          fade : function(){
            this.$store.dispatch('changecollectShow')
          }
         },
        components : {
           star,
           con,
           log
        }
   }
</script>
