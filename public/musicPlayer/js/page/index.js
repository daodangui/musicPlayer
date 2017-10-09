require(['/musicPlayer/js/config.js'],function () {
    require(['jquery','template','dragdrop','scrollbar'],function ($,template,dragdrop,scrollbar) {
    	// 音乐播放器控制
    	var musicPlayer = {
    		now : null,
    		play : function(element){
                element.play();
                animate.discs(true);
                $('.play').html('&#xe6fa;');
    		},
    		pause : function(element){
    			element.pause();
    			animate.discs(false);
                $('.play').html('&#xe622;');
    		},
    		next : function(list,element){
    			for(var i=0; i<list.length; i++){
    				if(list[i].id == this.now){
    					var n = i+1 > list.length-1 ? 0 : i+1;
    					$.get('/music/url',{id : list[n].id},function(data){
		                	element.src = data.data[0].url;
		                	musicPlayer.play(element);
		                	musicPlayer.now = list[n].id;
		                });
                        return n;
    				}
    			}
    		},
    		prev : function(list,element){
    			for(var i=0; i<list.length; i++){
    				if(list[i].id == this.now){
    					var n = i-1 < 0 ? list.length-1 : i-1;
    					$.get('/music/url',{id : list[n].id},function(data){
		                	element.src = data.data[0].url;
		                	musicPlayer.play(element);
		                	musicPlayer.now = list[n].id;
		                });
                        return n;
    				}
    			}
    		},
    		random : function(list,element){
                do{
                    var n = Math.floor(Math.random()*list.length);
                }while(list[n].id == this.now);
    			$.get('/music/url',{id : list[n].id},function(data){
		            element.src = data.data[0].url;
		            musicPlayer.play(element);
		            musicPlayer.now = list[n].id;
		        });
                return n;
    		},
    		refresh : function(element){
    			element.currentTime = 0;
    		},
    		volume : function(element,value){
                element.volume = value;
    		},
            time : (function(){
                var t = null;
                return function(element,box){
                    if(t) clearInterval(t);
                    musicPlayer.aidTime(element,box);
                    t = setInterval(function(){
                       musicPlayer.aidTime(element,box);
                    },1000);
                }
            })(),
            aidTime : function(element,box){
                var im = isNaN(parseInt(element.currentTime/60)) ? '00' : parseInt(element.currentTime/60);
                var ic = isNaN(parseInt(element.currentTime%60)) ? '00' : parseInt(element.currentTime%60);
                var zm = isNaN(parseInt(element.duration/60)) ? '00' : parseInt(element.duration/60);
                var zc = isNaN(parseInt(element.duration%60)) ? '00' : parseInt(element.duration%60);
                im = im.toString().length >=2 ? im : '0'+im;
                ic = ic.toString().length >=2 ? ic : '0'+ic;
                zm = zm.toString().length >=2 ? zm : '0'+zm;
                zc = zc.toString().length >=2 ? zc : '0'+zc;
                box.innerHTML = im + ':' + ic + '/' + zm + ':' + zc;
                var width = parseInt($('.playPgbar').width())*(element.currentTime/element.duration);
                $('.playPg').css('width',width);
            }
    	}
        //视频播放器控制
        var videoPlayer = {
            now : null,
            play : function(element){
                element.play();
                $('.vplay>i').html('&#xe6fa;');
            },
            pause : function(element){
                element.pause();
                $('.vplay>i').html('&#xe622;');
            },
            volume : function(element,value){
                element.volume = value;
            },
            time : (function(){
                var t = null;
                return function(element,box){
                    if(t) clearInterval(t);
                    videoPlayer.aidTime(element,box);
                    t = setInterval(function(){
                       videoPlayer.aidTime(element,box);
                    },1000);
                }
            })(),
            aidTime : function(element,box){
                var im = isNaN(parseInt(element.currentTime/60)) ? '00' : parseInt(element.currentTime/60);
                var ic = isNaN(parseInt(element.currentTime%60)) ? '00' : parseInt(element.currentTime%60);
                var zm = isNaN(parseInt(element.duration/60)) ? '00' : parseInt(element.duration/60);
                var zc = isNaN(parseInt(element.duration%60)) ? '00' : parseInt(element.duration%60);
                im = im.toString().length >=2 ? im : '0'+im;
                ic = ic.toString().length >=2 ? ic : '0'+ic;
                zm = zm.toString().length >=2 ? zm : '0'+zm;
                zc = zc.toString().length >=2 ? zc : '0'+zc;
                box.innerHTML = im + ':' + ic + '/' + zm + ':' + zc;
                var width = parseInt($('.vprobar').width())*(element.currentTime/element.duration);
                $('.nowvbar').css('width',width);
            }
        }
    	// 动画效果
    	var animate = {
    		discs : function(bool){
    			if(bool){
					$('.discs').css({
            			animation : 'turntable 4s linear 0s infinite forwards',
                        animationPlayState : 'running'
            		});
                    $('.arm').css({
                        transform : 'rotate(3deg)'
                    });
    			}else{
    				$('.discs').css({
            			animationPlayState : 'paused'
            		});
                     $('.arm').css({
                        transform : 'rotate(-30deg)'
                    });
    			}
    		}
    	}
        // 音乐切换
        function switchMusic(data){
            if(data.album&&data.album.blurPicUrl){
                $('#artists>img').attr('src',data.album.blurPicUrl);
            }else if(data.artists&&data.artists[0].img1v1Url){
                $('#artists>img').attr('src',data.artists[0].img1v1Url);
            }else{
                $('#artists>img').attr('src',data.al.picUrl);
                $('#player>h1').html(data.name);
                $('#player .author').html(data.ar[0].name);
                $('#player .album').html('专辑：'+data.al.name);
                return;
            }
            $('#player>h1').html(data.name);
            $('#player .author').html(data.artists[0].name);
            $('#player .album').html('专辑：'+data.album.name);
        }
        $(function () {
        	var list = [];
            var relist = [];
            // 模板加载&初始化
            var initData = null;
            function initRandom(data){
                var num = data.result.tracks.length;
                var arr = [];
                while(arr.length < 4){
                    var item = data.result.tracks[Math.floor(Math.random()*num)];
                    if(arr.includes(item)){
                        continue;
                    }
                    arr.push(item);
                }
                $('#menu>ul').html(template('menutem',arr));
                switchMusic(arr[0]);
                musicPlayer.now = arr[0].id;
                $.get('/music/url',{id : arr[0].id},function(data){
                    $('#audio').attr('src',data.data[0].url);
                });
                return arr;
            }
            function init(){
                $.get('/top/list',{idx : 0},function (data) {
                    initData = data;
                    var arr = initRandom(data);
                    list = [].concat(arr);
                });
            }
            init();
            // 音乐播放器音量拖拽
            (function(){
                dragdrop($('#drag').get(0),{x:false});
                $('#drag').on('mousedown',function(){
                    $(document).on('mousemove',function(){
                        var n = parseInt($('#drag').position().top)/parseInt($('#volbar').height());
                        musicPlayer.volume($('#audio').get(0),parseInt((1-n)*100)/100);
                        if(parseInt($('#drag').css('bottom')) == 0){
                            musicPlayer.volume($('#audio').get(0),0);
                            $('.volume').html('&#xe645;');
                        }else{
                            $('.volume').html('&#xe506;');
                        } 
                        $('#volbar').css({
                            background : 'linear-gradient(to top,#bc24b7 0%, #bc24b7 '+parseInt((1-n)*100)+'%, #999 '+parseInt((1-n)*100)+'%, #999 100%)'
                        });
                    });
                    $(document).on('mouseup',function(){
                        $(document).off('mousemove');
                    });
                })
            })();
            //视频播放器音量拖拽
            (function(){
                dragdrop($('#vdrag').get(0),{x:false});
                $('#vdrag').on('mousedown',function(){
                    $(document).on('mousemove',function(){
                        var n = parseInt($('#vdrag').position().top)/parseInt($('.vvolumebar').height());
                        videoPlayer.volume($('#video').get(0),parseInt((1-n)*100)/100);
                        if(parseInt($('#vdrag').css('bottom')) == 0){
                            videoPlayer.volume($('#video').get(0),0);
                            $('.vvolume>i').html('&#xe645;');
                        }else{
                            $('.vvolume>i').html('&#xe506;');
                        } 
                        $('.vvolumebar').css({
                            background : 'linear-gradient(to top,#bc24b7 0%, #bc24b7 '+parseInt((1-n)*100)+'%, #999 '+parseInt((1-n)*100)+'%, #999 100%)'
                        });
                    });
                    $(document).on('mouseup',function(){
                        $(document).off('mousemove');
                    });
                });
            })();
            // 按键监听
            (function(){
                // 首页播放器部分
            	$('#player').on('click','.play',function(){
                    if($('#audio').get(0).paused){
                        musicPlayer.play($('#audio').get(0));
                    }else{
                        musicPlayer.pause($('#audio').get(0));
                    }
                    musicPlayer.time($('#audio').get(0),$('.currentTime').get(0));
            	});
            	$('#player').on('click','.prev',function(){
            		var n = musicPlayer.prev(list,$('#audio').get(0));
                    switchMusic(list[n]);
            	});
            	$('#player').on('click','.next',function(){
            		var n = musicPlayer.next(list,$('#audio').get(0));
                    switchMusic(list[n]);
            	});
                $('#player').on('click','.random',function(){
                    var n = musicPlayer.random(list,$('#audio').get(0));
                    switchMusic(list[n]);
                });
                $('#player').on('click','.refresh',function(){
                    musicPlayer.refresh($('#audio').get(0));
                });
                $('#player').on('click','.volume',function(){
                    $('#volumeCon').fadeToggle(400);
                });
                $('#player').on('click','.playPgbar',function(e){
                   var left = parseInt(e.pageX) - parseInt($('.playPgbar').offset().left);
                   var currentTime = parseInt($('#audio').get(0).duration*(left/parseInt($('.playPgbar').width())));
                   $('#audio').get(0).currentTime = currentTime;
                   musicPlayer.time($('#audio').get(0),$('.currentTime').get(0));
                });
                $('#menu').on('click','.remusic',function(){
                    musicPlayer.pause($('#audio').get(0));
                    var arr = initRandom(initData);
                    list = [].concat(arr);
                });
                $('#menu').on('click','.itembox',function(){
                    var id = $(this).find('.itemboxid').html();
                    for(var i=0; i<list.length; i++){
                        if(list[i].id == id){
                            var n = i;
                            $.get('/music/url',{id : list[n].id},function(data){
                                $('#audio').get(0).src = data.data[0].url;
                                musicPlayer.play($('#audio').get(0));
                                musicPlayer.now = list[n].id;
                            });
                            break;
                        }
                    }
                    switchMusic(list[n]);
                    musicPlayer.time($('#audio').get(0),$('.currentTime').get(0));
                });
                // 侧边栏按键监听部分
                var colorArr = ['#CC0066','#0099FF','#9933CC','#66CC33','#FF9933','#FF33FF'];
                $('.sbmleft').on('click','li',function(){
                    $(this).closest('ul').children().each(function(){
                        $(this).css('backgroundColor',colorArr[$(this).index()]);
                    });
                    $(this).css({
                        backgroundColor : 'rgba(40, 49, 58, 0.9)'
                    });
                    switch ($(this).index()){
                        case 0:{
                            $.get('/top/artists',{
                                offset : 0,
                                limit : 30
                            },function(data){
                                var data = JSON.parse(data);
                                $('.sbmright>ul').html(template('menuright',data.artists)).attr('data-kind','artists');
                                //左侧菜单自定义滚动条
                                scrollbar('sbmright','scrollbar');
                            });
                            break;
                        }
                        case 1:{
                            $.get('/top/playlist/highquality',{
                                limit : 30
                            },function(data){
                                var data = JSON.parse(data);
                                $('.sbmright>ul').html(template('menuright',data.playlists)).attr('data-kind','playlist');
                                //左侧菜单自定义滚动条
                                scrollbar('sbmright','scrollbar');
                            });
                            break;
                        }
                        case 2:{
                            $.get('/top/list',{
                                idx : 0
                            },function(data){
                                relist = data.result.tracks;
                                $('.sbmright>ul').html(template('menuright',data.result.tracks)).attr('data-kind','musiclist');
                                //左侧菜单自定义滚动条
                                scrollbar('sbmright','scrollbar');
                            });
                            break;
                        }
                        case 3:{
                            $.get('/top/list',{
                                idx : 1
                            },function(data){
                                relist = data.result.tracks;
                                $('.sbmright>ul').html(template('menuright',data.result.tracks)).attr('data-kind','musiclist');
                                //左侧菜单自定义滚动条
                                scrollbar('sbmright','scrollbar');
                            });
                            break;
                        }
                        case 4:{
                            $.get('/top/list',{
                                idx : 6
                            },function(data){
                                relist = data.result.tracks;
                                $('.sbmright>ul').html(template('menuright',data.result.tracks)).attr('data-kind','musiclist');
                                //左侧菜单自定义滚动条
                                scrollbar('sbmright','scrollbar');
                            });
                            break;
                        }
                        case 5:{
                            $.get('/top/mv',{
                                offset : 0,
                                limit : 30
                            },function(data){
                                $('.sbmright>ul').html(template('menuright',data.data)).attr('data-kind','mvlist');
                                //左侧菜单自定义滚动条
                                scrollbar('sbmright','scrollbar');
                            });
                            break;
                        }
                    }
                });
                $('.sbmright').on('click','li',function(){
                    var kind = $(this).closest('ul').attr('data-kind');
                    switch (kind){
                        case 'artists':{
                            var value = $(this).children().eq(1).html();
                            $.get('/search',{
                                keywords : value
                            },function(data){
                                var data = JSON.parse(data);
                                if (data.code == 200) {
                                    relist = data.result.songs;
                                    $('.mrcontent>ul').html(template('searchtem',data.result.songs));
                                    $('.maskresult').fadeIn(600).css('display','flex');
                                    //左侧菜单自定义滚动条
                                    scrollbar('mrcontent','mrscrollbar');
                                }
                            });
                            break;
                        }
                        case 'playlist':{
                            var id = $(this).attr('data-id');
                            $.get('/playlist/detail',{
                                id : id
                            },function(data){
                                var data = JSON.parse(data);
                                if(data.code == 200){
                                    relist = data.playlist.tracks;
                                    $('.mrcontent>ul').html(template('playlisttem',data.playlist.tracks));
                                    $('.maskresult').fadeIn(600).css('display','flex');
                                    //左侧菜单自定义滚动条
                                    scrollbar('mrcontent','mrscrollbar');
                                }
                            });
                            break;
                        }
                        case 'musiclist':{
                            var id = $(this).attr('data-id');
                            list = [].concat(relist);
                            for(var i=0; i<list.length; i++){
                                if(id == list[i].id){
                                    var n = i;
                                    break;
                                }
                            }
                            $.get('/music/url',{id : list[n].id},function(data){
                                $('#audio').get(0).src = data.data[0].url;
                                musicPlayer.play($('#audio').get(0));
                                musicPlayer.now = list[n].id;
                                switchMusic(list[n]);
                                musicPlayer.time($('#audio').get(0),$('.currentTime').get(0));
                            });
                            break;
                        }
                        case 'mvlist':{
                            var id = $(this).attr('data-id');
                            musicPlayer.pause($('#audio').get(0));
                            $.get('/mv',{
                                mvid : id
                            },function(data){
                                var data = JSON.parse(data);
                                $('#video').attr('src','/mv/url?url='+data.data.brs['480']);
                                $('.vplay>i').html('&#xe6fa;');
                                $('#mvmask').css('display','flex');
                            });
                            break;
                        }
                    }
                });
                //搜索部分
                $('.searchvalue').on('blur',function(){
                    var value = $(this).val();
                    $.get('/search',{
                        keywords : value
                    },function(data){
                        var data = JSON.parse(data);
                        if (data.code == 200) {
                            relist = data.result.songs;
                            $('.mrcontent>ul').html(template('searchtem',data.result.songs));
                            $('.maskresult').fadeIn(600).css('display','flex');
                            //左侧菜单自定义滚动条
                            scrollbar('mrcontent','mrscrollbar');
                        }
                    });
                });
                $('.maskresult').on('click','li',function(){
                    var id = $(this).attr('data-id');
                    list = [].concat(relist);
                    for(var i=0; i<list.length; i++){
                        if(id == list[i].id){
                            var n = i;
                            break;
                        }
                    }
                    $.get('/music/url',{id : list[n].id},function(data){
                        $('#audio').get(0).src = data.data[0].url;
                        musicPlayer.play($('#audio').get(0));
                        musicPlayer.now = list[n].id;
                        switchMusic(list[n]);
                        musicPlayer.time($('#audio').get(0),$('.currentTime').get(0));
                    });
                });
                $('.maskresult').on('click','.mrexit',function(){
                    $('.sbmleft>ul>li').each(function(){
                        if($(this).css('backgroundColor') == 'rgba(40, 49, 58, 0.9)'){
                            $(this).trigger('click');
                        }
                    });
                    $('.maskresult').fadeOut(600);
                });
                //键盘按键监听
                $(document).on('keydown',function(e){
                    var video = $('#video').get(0);
                    switch (e.which){
                        case 27:{
                            if(parseInt($('#video').css('height')) == parseInt(window.screen.height)){
                                document.webkitCancelFullScreen();
                                $('#videobox').css({
                                    width : $('#video').get(0).videoWidth,
                                    height : $('#video').get(0).videoHeight
                                });
                                $('#video').css({
                                    width : $('#video').get(0).videoWidth,
                                    height : $('#video').get(0).videoHeight
                                });
                                $('.full').html('&#xe657;');
                            }else{
                                videoPlayer.pause(video);
                                $('#mvmask').css('display','none');
                                $('#videobox').css({
                                    width : 'auto',
                                    height : 'auto'
                                });
                                $('#video').css({
                                    width : 'auto',
                                    height : 'auto'
                                });
                            }
                            break;
                        }
                        case 13:{
                            $('.searchvalue').trigger('blur');
                            break;
                        }
                    }
                });
                //视频播放器部分
                $('#vcontrols').on('click','.vplay',function(){
                    if($('#video').get(0).paused){
                        videoPlayer.play($('#video').get(0));
                    }else{
                        videoPlayer.pause($('#video').get(0));
                    }
                });
                $('#video').on('play',function(){
                    videoPlayer.time($(this).get(0),$('.vtimebox').get(0));
                });
                $('#vcontrols').on('click','.full',function(){
                    if(parseInt($('#videobox').css('width')) != parseInt($(window).width())){
                        document.documentElement.webkitRequestFullScreen();
                        $('#videobox').css({
                            width : window.screen.width,
                            height : window.screen.height
                        });
                        $('#video').css({
                            width : window.screen.width,
                            height : window.screen.height
                        });
                        $('.full').html('&#xe65d;');
                    }else{
                        document.webkitCancelFullScreen();
                        $('#videobox').css({
                            width : $('#video').get(0).videoWidth,
                            height : $('#video').get(0).videoHeight
                        });
                        $('#video').css({
                            width : $('#video').get(0).videoWidth,
                            height : $('#video').get(0).videoHeight
                        });
                        $('.full').html('&#xe657;');
                    }
                });
                $('#vcontrols').on('click','.vprobar',function(e){
                    var left = parseInt(e.pageX) - parseInt($('.vprobar').offset().left);
                    var currentTime = parseInt($('#video').get(0).duration*(left/parseInt($('.vprobar').width())));
                    $('#video').get(0).currentTime = currentTime;
                    videoPlayer.time($('#video').get(0),$('.vtimebox').get(0));
                });
                //收展侧边栏
                $('.fold>i').on('click',function(){
                    if(parseInt($('#sidebar').css('left')) == 0){
                        $('#sidebar').animate({
                            left : -350
                        },1000);
                        $(this).html('&#xe601;');
                    }else{
                        $('#sidebar').animate({
                            left : 0
                        },1000);
                        $(this).html('&#xe525;');
                    }
                });
                //鼠标滑入视频弹出控制选项，滑出隐藏控制选项
                var videoMouseTime = (function(){
                    var t = null;
                    return function(){
                        if(t) clearTimeout(t);
                        t = setTimeout(function(){
                            if(parseInt($('.vplay').css('left')) == 10){
                                $('.vplay').stop().animate({
                                    left : -30
                                },1000);
                                $('.vvolume').stop().animate({
                                    right : -30
                                },1000);
                                $('.vprogress').stop().animate({
                                    bottom : -40
                                },1000);
                            }
                        },10000);
                    }
                })();
                $('#videobox').on('mouseenter',function(e){
                    $('.vplay').stop().animate({
                        left : 10
                    },1000);
                    $('.vvolume').stop().animate({
                        right : 10
                    },1000);
                    $('.vprogress').stop().animate({
                        bottom : 0
                    },1000);
                    videoMouseTime();
                });
                // $('#videobox').on('mouseout',function(){
                //     $('.vplay').stop().animate({
                //         left : -30
                //     },1000);
                //     $('.vvolume').stop().animate({
                //         right : -30
                //     },1000);
                //     $('.vprogress').stop().animate({
                //         bottom : -40
                //     },1000);
                // });
            })();
            //左侧菜单栏默认触发
            $('.sbmleft>ul>li').eq(2).trigger('click');
        });
    })
});