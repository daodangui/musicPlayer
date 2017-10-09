/**
 * Created by lijiahui on 2017/8/23.
 */
 define([],function(){
   var dragPlug = function(ele,option = {x:true,y:true,limt:true}) {
        //初始化配置信息
        if(!('x' in option)) option.x = true;
        if(!('y' in option)) option.y = true;
        if(!('limt' in option)){
            ele.parentElement == document.body? option.limt = false : option.limt = true;
        }else{
            if(ele.parentElement == document.body)
                option.limt = false;
        }
        //计算指定子元素与指定父元素之间的左间距及上间距
        function offsetDistance(obj,parent) {
            var point = {
                left : 0,
                top : 0
            }
            while(obj != parent && obj != null){
                point.left += obj.offsetLeft;
                point.top += obj.offsetTop;
                obj = obj.offsetParent;
            }
            return point;
        }
        //添加点击事件
       ele.addEventListener('mousedown',function (e) {
           var e = e || event;
           var mouse = {          //记录鼠标的点击位置，且不受内部元素影响
               left : e.offsetX + offsetDistance(e.target,ele).left,
               top : e.offsetY + offsetDistance(e.target,ele).top
           }
           function move(e) {
               var e = e || event;
               var parentClientLeft = offsetDistance(ele.offsetParent,document.body).left;
               var parentClientTop = offsetDistance(ele.offsetParent,document.body).top;
               if(option.limt){
                   var parentWidth = ele.offsetParent.offsetWidth;
                   var parentHeight = ele.offsetParent.offsetHeight;
                   if(ele.offsetParent == document.body){
                       parentWidth = window.innerWidth;
                       parentHeight = window.innerHeight;
                   }
                   var xLeft = e.clientX + document.body.scrollLeft - parentClientLeft - mouse.left;
                   var yTop = e.clientY + document.body.scrollTop - parentClientTop - mouse.top;
                   if(option.x){
                       ele.style.left = Math.min(parentWidth - ele.offsetWidth,Math.max(0,xLeft)) + 'px';
                   }
                   if(option.y){
                       ele.style.top = Math.min(parentHeight - ele.offsetHeight,Math.max(0,yTop)) + 'px';
                   }
               }else{
                   if(option.x){
                       ele.style.left = Math.min(window.innerWidth - ele.offsetWidth,Math.max(0,e.clientX - mouse.left)) - parentClientLeft + 'px';
                   }
                   if(option.y){
                       // ele.style.top = Math.min(window.innerHeight - ele.offsetHeight ,Math.max(0,e.clientY - mouse.top)) - parentClientTop + 'px';
                       ele.style.top = Math.max(0,e.clientY - mouse.top) - parentClientTop + document.body.scrollTop + 'px';
                   }
               }
           }
           //添加移动事件
           document.addEventListener('mousemove',move);
           //松开鼠标后移除移动事件
           document.addEventListener('mouseup',function () {
               document.removeEventListener('mousemove',move);
           });
       });
    }
    return dragPlug;
  });