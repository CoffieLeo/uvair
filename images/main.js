
//回版頭
$(function () {
  var $gotop = $("#gotop");
  $gotop.click(function () {
    $("html,body").stop(true, false).animate({ scrollTop: 0 });
  });
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      $gotop.addClass("cate-open");
    } else {
      $gotop.removeClass("cate-open");
    }
  });
}); 
                  




//20200114-滑動到指定位置 javascript:goto('物件','速度','偏移')
function goto(val,tSpeed,fixstart) {
  if(!fixstart){ fixstart = 0 }; //無偏移時
  if(!tSpeed){ tSpeed = 0 }; //無速度時
  $('html,body').animate({scrollTop:$(val).offset().top - fixstart },tSpeed);
};






/* 滑動的GOTO */
function goTop(val) {
	if($(window).width() > 767 ){
		var gotop_i = 150;
	} else {
		var gotop_i = 100;
	}
	jQuery('html,body').animate({scrollTop: jQuery(val).offset().top - gotop_i },700);
}




/* 浮層區*/
function agree(val) {
	var blackBox = $(".blackBox");
	$(blackBox).fadeOut();
	$(val).fadeIn();
	var winST =  jQuery(window).scrollTop(); //目前位置
	var winH =  jQuery(window).height(); //裝置高度
	//浮層高度
	$(val).find('.agreeArea .txtArea').css('height', winH * 60 / 100 );
	var this_agreeH = $(val).find('.agreeArea').height();
	//浮層top定位
	// $('.agreeArea').css('top', winST + winH/2 - this_agreeH/2 );
	// removeEditBtn()

}
$(function(){
	var blackBox = $(".blackBox");
	var blackBox_close = $(".blackBox .close , .blackBox .but-close");
	var blackBox_BOXclose = ".Boxclose , .fixedfooterArea_B ";
	//點按鈕關閉
	blackBox_close.delegate( "a" ,"touchstart click",function(e){
		$(blackBox).fadeOut();
		e.preventDefault();
	});
	//點黑區關閉
	blackBox.delegate( blackBox_BOXclose ,"touchstart click",function(e){
		$(blackBox).fadeOut();
		e.preventDefault();
	});
});
 
 
 
/* 浮層區2(浮層不限高度，內容全部顯示)*/
function agree2(val) {
	$(val).css('opacity','1');
	$(val).css('pointer-events','auto');
	imglazyload();
	var winST =  jQuery(window).scrollTop(); //目前位置
	var winH =  jQuery(window).height(); //裝置高度
	var this_agreeH = $(val).find('.agreeArea2').height();
	$(val).height( $('body').height() );
	
	//浮層top定位
	if( this_agreeH < winH ){
		//內容小於裝置高度，居中
		$('.agreeArea2').css('top', winST + winH/2 - this_agreeH/2 );
	} else {
		//內容大於裝置高度，置上
		$('.agreeArea2').css('top', winST + winH/100*2 );
	}

}
$(function(){
	var blackBox2 = $(".blackBox2");
	var blackBox2_close = $(".close2 , .but-close2");
	var blackBox2_BOXclose = ".Boxclose2 ";
	//點按鈕關閉
	blackBox2_close.delegate( "a" ,"touchstart click",function(e){
		$(blackBox2).attr('style','');
		$(blackBox2).find('.agreeArea2').attr('style','');
		e.preventDefault();
	});
	//點黑區關閉
	blackBox2.delegate( blackBox2_BOXclose ,"touchstart click",function(e){
		$(blackBox2).attr('style','');
		$(blackBox2).find('.agreeArea2').attr('style','');
		e.preventDefault();
	});
}); 
 


/*背景互動*/
function bgscroll(val,top,num) { //背景互動(物件,起始top位置,速度)
  var $win = $(window);
  var $doc = $(document);
  var $bg  = $(val);
  var handler = $.throttle(function(e) {
    var dTop = $doc.scrollTop()
    highLight(dTop);
  }, 100);
  function highLight(docTop) {
    $bg.css('background-position', 'center '+  -1*( top + docTop * num) +'px' );
  };
  $win.scroll(handler)
};
$(function(){ 
  bgscroll('.js-Area_bgtop_00',0,0.2);
  //bgscroll('.js-Area_bgtop_01',-500,0.25);
});





    /* --------------------------------------
     * ECM入稿機制--進階功能-v25.3
     * --------------------------------------
     * ecmWriter_removeArea('.fixarea');  //(1)編輯模式時刪除
     * ecmWriter_showArea('');            //(2)編輯模式時顯示(純手機版位)
     * PdLayout_removeLi('.Area_AD');     //(3)未入稿刪除商品【父層,子層,元素】
     * PdLayout_removeArea('.Area_AD');   //(4)未入稿刪除區塊【父層,子層,元素】
     * -------------------------------------- */
    //基本設定
    var is_trigger = false; //重覆觸發
    var is_forPC = document.body.clientWidth > 767; //forPC
    var is_Online = (location.protocol).indexOf('http') === 0; //線上
    var is_EcmWriter = document.querySelectorAll('input[id^="eWriterBtn"]').length > 0; //ECM編輯模式

    //啟動器
    // ecmWriter_removeArea('.fixarea');  //(1)編輯模式時刪除
    // ecmWriter_showArea('');            //(2)編輯模式時顯示(純手機版位)
    //PdLayout_removeLi('.hide');     //(3)未入稿刪除商品【父層,子層,元素】
    // PdLayout_removeArea('.hide');   //(4)未入稿刪除區塊【父層,子層,元素】
    // PdLayout_highlightLi('.Area_AD')

    //針對ECM入稿區進階功能
    function ecmWriter_removeArea(el){  //(1)編輯模式時刪除
      if(is_EcmWriter){
        let _self = $(el);
        if(_self.length>0){
          _self.remove();
          console.log(el,'在ECM編輯模式刪除');
        }
      }
    };
    function ecmWriter_showArea(el){  //(2)編輯模式時顯示(純手機版位)
      if(is_EcmWriter){
        let _self = $(el);
        if(_self.length>0){
          _self.attr('style','display:block !important');
          console.log(el,'在ECM編輯模式顯示(純手機版位)');
        }
      }
    };
    function PdLayout_removeLi(el,elWap,item){  //(3)未入稿刪除商品【父層,子層,元素】
      if(!is_EcmWriter && is_Online){
        $(el).find((elWap||'')+(item||' .PD_slide')).each(function(){
          var _this = $(this);
          (_this.attr('data-id') === '')? _this.remove():''
        });
      }
    };
    function PdLayout_removeArea(el,elWap,item){ //(4)未入稿刪除區塊【父層,子層,元素】
      if(!is_EcmWriter && is_Online){
        $(el).each(function(){ 
          var _this = $(this);
          (_this.find((elWap||'')+(item||' .PD_slide')).length === 0)? _this.remove():''
        })
      }
    };
    function PdLayout_highlightLi(val){ //(5)高亮當日日期	
      var now = new Date();
      var nowDate = now.toLocaleDateString(undefined, {month:'numeric', day:'numeric'})
      var activeIndex 
      
      $(val).find('.PD_slide .js-PD_val.setDate').each(function(index){
        var _this = $(this).context.innerHTML;
        if(nowDate == _this){
          return activeIndex = index
        }
      });
  
      $(val).find('li').eq(activeIndex).addClass('cate-hover')
       
    };
            




