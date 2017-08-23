export function setCookie(name,value,expire){
     var date = new Date();
     date.setSeconds(date.getSeconds()+expire);
     document.cookie = name+"="+escape(value)+";expires="+date.toUTCString();
}

export function getCookie(name){
      if(document.cookie.length>0){
          let start = document.cookie.indexOf(name+"=");
          if(start != -1){
               start = start+name.length+1;
               let c_end = document.cookie.indexOf(';',start);
               if(c_end==-1) c_end = document.length;
               return unescape(document.cookie(start,c_end));
          }
      }
}

export function delCookie(name){
      setCookie(name,"",-1);
}
