import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
Vue.use(Vuex)

const store = new Vuex.Store({
    state : {
       socket : '',
       user : {
           name : sessionStorage.username,
           src : 'static/pic/1.jpg',
           room : ''
       },
       messhistory : {
          infos : []
       },
       roomdetail: {
        id: '',
        users: {},
        infos: []
        },
       onlinecount: 0,
       collectsrc: 'static/pic/collect1.png',
       collectsrc1: 'static/pic/collect.png',
       detailsrc:'static/pic/detail.png',
       robotmsg : [{
           message : 'Hi~有什么问题问我',
           name : 'robot',
           src:'static/pic/robot1.png'
       }],
       collect:[],
       showDetail : false,
       showchat : false,
       showrobotchat: false,
       collectShow: false,
       bgImg:'static/pic/bg.jpg',
       headImage: false,
       headerImg: 'static/pic/camera.png',
       uploadimg: 'static/pic/uploadimg.png',
       ratinfos:[],
       historyratingfos:[],
       showTab:false,
       showcontent: true,
       showrat: false
    },
    getters : {
       getsocket: state=>state.socket,
       getusername:state=>state.user.name,
       getusersrc:state=>state.user.src,
       getmesshistoryinfos:state=>state.messhistory.infos,
       getrobotmsg:state=>state.robotmsg,
       getshowDetail:state=>state.showDetail,
       getshowchat:state=>state.showchat,
       getuserroom:state=>state.user.room,
       getinfos:state=>state.roomdetail.infos,
       getshowrobotchat:state=>state.showrobotchat,
       getcollectsrc:state=>state.collectsrc,
       getcollectsrc1:state=>state.collectsrc1,
       getdetailsrc:state=>state.detailsrc,
       getcollectShow:state=>state.collectShow,
       getheadImage:state=>state.headImage,
       getheaderImg:state=>state.headerImg,
       getcollect:state=>state.collect,
       getratinfos:state=>state.ratinfos,
       gethistoryratingfos:state=>state.historyratingfos,
       getonlinecount:state=>state.onlinecount,
       getuploadimg:state=>state.uploadimg,
       getbgImg:state=>state.bgImg,
       getshowTab:state=>state.showTab,
       getshowcontent:state=>state.showcontent,
       getshowrat:state=>state.showrat
    },
    mutations : {
        setsocket(state,data){
          return state.socket = data;
        },
        setusername(state,data){
              return state.user.name = data
        },
        setusersrc(state,data){
          return state.user.src = data;
        },
        setuserroom(state,data){
          return state.user.room = data;
        },
        setmesshistoryinfos(state,data){
          return state.messhistory.infos = data;
        },
        setrobotmsg(state,data){
          return state.robotmsg.push(data);
        },
        changeshowDetail(state){
          return state.showDetail = !state.showDetail;
        },
        changeshowchat(state) {
          return state.showchat = !state.showchat;
        },
        addroomdetailinfos(state, data) {
         return state.roomdetail.infos.push(data)
        },
        removeroomdetailinfos(state){
          return state.roomdetail.infos.splice(0,state.roomdetail.infos.length);
        },
        changeshowrobotchat(state,data){
           return state.showrobotchat = !state.showrobotchat
       },
        setcollectsrc(state,data){
           return state.collectsrc = data
       },
       setcollectShow(state){
          return state.collectShow = !state.collectShow
       },
       setheadImage(state){
          return state.headImage = !state.headImage
       },
       setheaderImg(state,data){
          return state.headerImg = data
       },
       setcollect(state,data){
          return state.collect = data
       },
       addcollect(state,data){
         return state.collect.push(data);
       },
       setratinfos(state,data){
         return state.ratinfos.push(data)
       },
       sethistoryinfos(state,data){
          return state.historyinfos = data
       },
       setonlinecount(state,data) {
          return state.onlinecount = data
       },
       setshowTab(state,data) {
          return state.showTab = !state.showTab
       },
       sethistoryratinginfos(state,data) {
          return state.historyratinginfos = data
       },
       setshowcontent(state,data) {
         return state.showcontent = data
       },
       setshowrat(state,data) {
          return state.showrat = data
       }
    },
    actions : {
        tologin({commit},data){
           axios.post('restful/login',data)
             .then((response) => {
                if(response.data.errno == 0){
                    sessionStorage.username = data.user;
                    sessionStorage.collect = JSON.stringify(response.data.collect);
                    commit('changeshowDetail');
                    commit('setusername',sessionStorage.username);
                    commit('setcollect',JSON.parse(sessionStorage.collect));
                    if(response.data.src !== ""){
                      commit('setusersrc',response.data.src);
                    }
                } else{
                    alert(response.data.msg);
               }
             })
        },
        getmesshistory({commit}, data) {
           axios.get('restful/message', {params: data})
               .then(function (data) {
             commit('setmesshistoryinfos', data.data.data)
            })
             .catch(function (err) {
                 console.log(err)
            })
        },
        getrobotmess({commit},data) {
             var robotdata = '';
            axios.get('restful/robotapi',{params: data})
              .then(function(data){
                  robotdata = JSON.parse(data.data.data);
                 if(robotdata.code === 100000){
                    commit('setrobotmsg',{message:robotdata.text,name:'robot',src:'static/pic/robot1.png'})
                 }else if(robotdata.code === 200000){
                    commit('setrobotmsg',{message:robotdata.text+robotdata.url,name:'robot',src:'static/pic/robot1.png'})
                 }else if(robotdata.code === 302000) {
                    commit('setrobotmsg',{message:"暂时未开通",user:'robot',src:'static/pic/robot1.png'})
                 }else{
                    commit('setrobotmsg',{message:"暂时未开通",user:'robot',src:'static/pic/robot1.png'})
                 }
                })
        },
         tologout({commit},data){
              axios.post('restful/logout',data)
                .then((response) => {
                  sessionStorage.username = '';
                  commit('setusername','');
                  commit('removeroomdetailinfos');
                })
         },
         torat ({commit},data){
             axios.post('restful/rating',data)
               .then((response) => {
                  if(response.data.errno == 1){
                      commit('setratinfos',data)
                  }
               })
         },
         togethistoryratinfos ({commit},data) {
             axios.get('restful/rating',{params:data})
               .then((response) => {
                   commit('sethistoryratinginfos',response.data.data);
               })
         }
    }
})

export default store;
