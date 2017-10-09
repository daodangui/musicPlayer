define(['dragdrop'],function(dragPlug){
	var scrollbar = function(boxid,barid){
		var box = document.querySelector('#'+boxid);
	    var scrollbarbox = document.querySelector('#'+barid);
	    var scrollbarboxheight = parseInt(window.getComputedStyle(scrollbarbox).height);
	    var scrollbar = document.querySelector('#'+barid+' span');
	    scrollbarbox.style.display = 'block';
	    // scrollbar.style.height = window.innerHeight * scrollbarboxheight / box.scrollHeight + 'px';
	    scrollbar.style.height = box.clientHeight * scrollbarboxheight / box.scrollHeight + 'px';
	    // 当元素未溢出是隐藏滚动条
	    if(parseInt(scrollbar.style.height) >= scrollbarboxheight){
	    	scrollbarbox.style.display = 'none';
	    }
	    box.addEventListener('mousewheel', function (e) {
	        var e = e || event;
	        if (e.wheelDelta >= 120) {
	            box.scrollTop -= 50;
	            scrollbar.style.top = box.scrollTop * scrollbarboxheight / box.scrollHeight + 'px';
	        } else {
	            box.scrollTop += 50;
	            scrollbar.style.top = box.scrollTop * scrollbarboxheight / box.scrollHeight + 'px';
	        }
	    });
	    dragPlug(scrollbar, {x: false});
	    scrollbar.onmousedown = function () {
	        document.documentElement.style.userSelect = 'none';
	        document.onmousemove = function () {
	            box.scrollTop = parseInt(scrollbar.style.top)*box.scrollHeight/scrollbarboxheight;
	        }
	    }
	    document.onmouseup = function () {
	        document.onmousemove = null;
	        document.documentElement.style.userSelect = 'text';
	    }
	    window.onresize = function () {
	        scrollbarboxheight = parseInt(window.getComputedStyle(scrollbarbox).height);
	        scrollbar.style.height = window.innerHeight * scrollbarboxheight / box.scrollHeight + 'px';
	        scrollbar.style.top = box.scrollTop * scrollbarboxheight / box.scrollHeight + 'px';
	    }
	}
	return scrollbar;
});