/*
 * Ghvzon
 * 導覽/選單高亮組件 navlight-v3.10
 *******************************************************************
 *  --2021.04.01--新增自動擷取選單資料(v3.10)
 *  --2021.02.27--捲動更新區塊資料(v3.9)
 *  --2020.02.26--修正頁面到底高亮顯示最後一個改判斷body(v3.8)
 *  --2020.02.18--修正頁面到底高亮顯示最後一個改判斷body(v3.7)
 *  --2019.09.05--修正頁面到底高亮顯示最後一個(v3.6)
 *  --2019.03.26--新增可調整置頂偏移高度(v3.5)
 *  --2019.02.27--修正快速置頂時，高亮顯示錯誤(v3.4)
 *  --2019.01.11--修正回推高度(v3.3)
 *  --2019.01.02--新增高亮選單滑動的色塊(v3.3)
 *  --2018.11.23--新增垂直樣式(v3.2)
 *******************************************************************
 */ 

 /*導覽/選單--置頂組件*/
$.fn.topSuction = function(option) {
  option = option || {};
  var navbox = option.navbox || '.Nav_box'; //置頂區塊Class
  var fixCls = option.fixCls || 'cate-fixed'; //置頂Class
  var fixstart = option.fixstart || ''; //置頂偏移高度區塊ID或Class
  var fixend = option.fixend || 'body'; //結束置頂內容區塊ID或Class
  var fixedFunc = option.fixedFunc;
  var resetFunc = option.resetFunc;
  var $self = this;
  var $win  = $(window);
  if (!$self.length) return;
  var width = $self.width();
  var height = $self.height();
  var offset = $self.offset();
  var fTop   = offset.top;
  var fLeft  = offset.left;
  //置頂偏移高度
  var $fixstart = $(fixstart);
  var fsHeight =  $fixstart.height()
  if (!fsHeight){ fsHeight = 0;}
  //結束置頂
  var $fixend = $(fixend);
  var feBottom =  $fixend.offset().top + $fixend.height()
  $self.css('z-index','200');
  if ( fixend == 'body' ){
    $self.attr('data-fix',true);
  }
  //20210227-更新定位點
  function updateOffset(){
    width = $self.width();
    height = $self.height();
    offset = $self.offset();
    fTop   = offset.top;
    fLeft  = offset.left;
    fsHeight =  $fixstart.height()
    feBottom =  $fixend.offset().top + $fixend.height()
  };
  function fix(){
    dTop = $(document).scrollTop();
    if ( fTop - fsHeight < dTop && feBottom > dTop) {
      $self.addClass(fixCls);
      if ( feBottom - height < dTop ){
        var h =dTop - feBottom + height
        $self.find(navbox).css('top', h * -1 );
      } else {
        $self.find(navbox).css('top', fsHeight + 'px');
      }
      if (fixedFunc) {
        fixedFunc.call($self, fTop);
      };
    } else {
      $self.removeClass(fixCls);
      $self.find(navbox).css('top','');
      if (resetFunc) {
        resetFunc.call($self, fTop);
      };
    };
  };
  fix();
  $win.scroll(function() {
    updateOffset(); //20210227-更新定位點
    fix();
  });
  $win.resize(function() {
    updateOffset(); //20210227-更新定位點
    fix();
  });
  //【切換樣式】NavArea-fixed-bottom選單一開始就置底時，隱藏系統地
  if( $self.hasClass('NavArea-fixed-bottom') == true ){ $('.footerArea').hide() };
};

/*導覽/選單--展開組件*/
$.fn.navbtn = function(option, callback) {
  option = option || {};
  var navbtn = option.nav || '.Nav_Btn'; //展開按鈕Class
  var navopen = option.navopen || 'cate-open'; //展開Class
  var $self = $(this);
  var $navbtn = $self.find(navbtn);
  //展開選單
  $self.delegate( navbtn , ' click', function(e) {
    $self.toggleClass(navopen);
    e.preventDefault();
  })
  //點黑屏選單展開收合
  $self.delegate('.Nav_bg' , ' click', function(e) {
    $self.removeClass(navopen);
    e.preventDefault();
  });
};

/*導覽/選單--高亮組件*/
$.debounce = function(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};
$.throttle = function(func, wait) {
  var context, args, timeout, throttling, more, result;
  var whenDone = $.debounce(function() {
    more = throttling = false;
  }, wait);
  return function() {
    context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (more) func.apply(context, args);
      whenDone();
    };
    if (!timeout) timeout = setTimeout(later, wait);
    if (throttling) {
      more = true;
    } else {
      result = func.apply(context, args);
    };
    whenDone();
    throttling = true;
    return result;
  };
};
$.fn.navLight = function(option, callback) {
  option = option || {};
  var navarea = option.navarea || '.NavArea'; //最大包Class
  var navs = option.navs || '.Nav'; //區塊Class
  var nav_wrapper = option.nav_wrapper || '.Nav-wrapper'; //內容包Class
  var nav = option.nav || '.Nav-slide'; //內容Class
  var nav_toptext = option.nav_toptext || '.Nav_toptext'; //前置標Class
  var nav_slidebg = option.nav_slidebg || '.Nav-slidebg'; //高亮選單滑動的色塊Class
  var content = option.content || '.js-navlight_content'; //選單對應內容區塊Class
  var diffTop = option.diffTop || 100; //距離頂部的誤差值
  var diffBottom = option.diffBottom || 0; //距離底部的誤差值
  var lightCls = option.lightCls || 'cate-hover'; //高亮Class
  var navopen = option.navopen || 'cate-open'; //展開Class
  var top_i = option.top_i || 0; //錨點偏移
  var top_timing = option.top_timing || 0; //錨點速度
  var open_light = option.open_light;
  var open_navlightcenter = option.open_navlightcenter;
  var open_toptext = option.open_toptext;
  var open_direction = option.open_direction || 'horizontal';
  var open_slidebg = option.open_slidebg;
  var $self = $(this);
  var $navarea = $self.find(navarea);
  var $navs = $navarea.find(navs);
  var $nav_wrapper = $navarea.find(nav_wrapper);
  var $nav_slidebg = $navarea.find(nav_slidebg);
  var $content = $self.find(content);
  //20210227-捲動更新區塊資料-記錄每個內容區塊的位置
  var contentPosi = {};
  function contentPosiFu(val){ //更新區塊資料
    contentPosi = $content.map(function(idx, elem) {
      var $cont = $(elem);
      var top = $cont.offset().top;
      var bottom = $cont.offset().top;
      var height = $cont.height();
      var name_pc = $cont.attr('data-nav-pc');
      var name_phone = $cont.attr('data-nav-phone');
      return {
        top: top-diffTop,
        bottom: top+height+diffBottom,
        name_pc : name_pc,
        name_phone : name_phone,
        jq: $cont
      };
    }); 
  };
  contentPosiFu('into'); //更新區塊資料
  //2021.04.01--新增自動擷取選單資料
  var open_getname = option.open_getname;
  if(open_getname){
    for(var i=0; i<contentPosi.length; i++){
      $nav_wrapper.prepend('<li class="Nav-slide"><a href="javascript:void(0);"><span class="for_pc">'+ contentPosi[contentPosi.length-1-i].name_pc +'</span><span class="for_phone">'+ contentPosi[contentPosi.length-1-i].name_phone +'</span><i></i></a></li>')
    }
  };  
  var $nav = $navarea.find(nav);
  // 記錄每個選單的位置
  var navPosi = $nav.map(function(idx, elem) {
    var $cont = $(elem);
    var left = $cont.offset().left;
    var top =  $cont.offset().top - $navs.offset().top;
    var width = $cont.outerWidth(true);
    var height = $cont.outerHeight(true);
    return {
      top: top,
      left: left,
      width: width,
      height: height,
      jq: $cont
    };
  });
  
  var $win = $(window);
  var $doc = $(document);
  var handler = $.throttle(function(e) {
    var dTop = $doc.scrollTop()
    highLight(dTop);
  }, 100);
  function highLight(docTop) {
    if (open_light) {
      contentPosiFu('highLight'); //更新區塊資料
      //觸發高亮對應區塊
      contentPosi.each(function(idx, posi) {
        if ( posi.top < docTop && posi.bottom > docTop ) {
          //高亮
          $nav.removeClass(lightCls);
          $nav.eq(idx).addClass(lightCls).siblings();
          //高亮置中(預設水平,垂直加vertical)
          if ( open_direction == 'horizontal' ) { //水平
            var left = navPosi[idx].left;
            var center = ( $win.width() - navPosi[idx].width )*0.5;
            $navs.stop().animate({ scrollLeft: left - center },100);
          }
          if ( open_direction == 'vertical' ){ //垂直
            var top = navPosi[idx].top;
            var center = $win.height()*0.33 - navPosi[idx].height*0.5;
            $navs.stop().animate({ scrollTop: top - center },100);
          }
          //高亮選單滑動的色塊-webkit-transition:all 300ms  ease 0ms; transition: all 300ms  ease 0ms;
          if(open_slidebg){
            var ingCls = 'cate-ing';
            $nav_slidebg.css({
              'height': navPosi[idx].height,
              '-webkit-transform':'translate3d('+ navPosi[idx].left  +'px,'+  navPosi[idx].top +'px,0)',
              '-moz-transform': 	'translate3d('+ navPosi[idx].left  +'px,'+  navPosi[idx].top +'px,0)',
              '-ms-transform': 	'translate3d('+ navPosi[idx].left  +'px,'+  navPosi[idx].top +'px,0)',
              '-o-transform': 	'translate3d('+ navPosi[idx].left  +'px,'+  navPosi[idx].top +'px,0)',
              'transform':		'translate3d('+ navPosi[idx].left  +'px,'+  navPosi[idx].top +'px,0)',
            }).addClass(ingCls)
            setTimeout(function(){

              $nav_slidebg.removeClass(ingCls)
            },300)
          };
          if (callback) {
            callback($nav, $content);
          }
        };
      });
      //20190227-快速置頂時，高亮顯示錯誤 
      if( docTop < contentPosi[0].top ){
        $nav.removeClass(lightCls);
        $nav.eq(0).addClass(lightCls).siblings();
      };
      //20200226-頁面到底高亮最後一個改判斷body
      if( docTop + window.innerHeight >= $doc.height() ){
        $nav.removeClass(lightCls);
        $nav.eq(contentPosi.length-1).addClass(lightCls).siblings();
        $navs.stop().animate({ scrollLeft: navPosi[navPosi.length-1].left + navPosi[navPosi.length-1].width },100);
      };
    }
  };
  //點選單錨點
  if (open_light) {
    $nav.eq(0).addClass(lightCls);
    $navarea.delegate( nav , ' click', function(e) {
      contentPosiFu('click'); //更新區塊資料
      var $na = $(this);
      var idx = $nav.index($na);
      var $cont = $content.eq(idx);
      var top = $cont.offset().top;
      var height = $nav.outerHeight(true);
      $navarea.removeClass(navopen);
      //【切換樣式】NavArea-fixed-bottom選單一開始就置底時，不算選單高度
      if( $navarea.hasClass('NavArea-fixed-bottom') == true ){ height = 0 };
      //錨點到指定區塊
      if ( open_direction == 'horizontal' ) { //水平
        $('html,body').animate({ scrollTop: top - height - top_i + 'px' },top_timing);
      }
      if ( open_direction == 'vertical' ){ //垂直
        $('html,body').animate({ scrollTop: top - top_i + 'px' },top_timing);
      }
      setTimeout(function(){
        contentPosiFu('click2'); //更新區塊資料
        top = $cont.offset().top;
        //錨點到指定區塊
        if ( open_direction == 'horizontal' ) { //水平
          $('html,body').animate({ scrollTop: top - height - top_i + 'px' },top_timing);
        }
        if ( open_direction == 'vertical' ){ //垂直
          $('html,body').animate({ scrollTop: top - top_i + 'px' },top_timing);
        }
      },top_timing)
      e.preventDefault();
    });
  };
  //前置標抓目前高亮資料
  if(open_toptext){
    var oneCls = 'cate-one';	//高亮移到最前面Class
    //前置標設定
    var oneHtml = '<a href="javascript:goTop(' + "'" + navarea + "'" + ');">' + $navarea.find('.' + lightCls +' a').html() + '</a>';	//前置標的HTML
    $navarea.find(nav_toptext).html( oneHtml );
    //判斷是否打開前置標
    if( $navarea.attr('data-toptext') !== 'on' ){
      //高亮移到最前面設定
      var cateone = '<li class="' + oneCls +' '+  lightCls + '">' + oneHtml + '</li>';	//高亮移到最前面的HTML
      $navarea.find('.' + lightCls).hide();
      $navarea.find(nav_wrapper).prepend( cateone );
    }
  };
  //自動控制選單數量寬度比例
  var datanum =$navarea.attr('data-num');
  if( datanum > ' ' ){
    $nav.css('float','left');
    $nav.css('width',  ($navs.width() ) / datanum)
  };
  //高亮預設置中
  if(open_navlightcenter){
    var idx = $navs.find('li.'+ lightCls ).index();
    var left = navPosi[idx].left;
    var center = ( $win.width() - navPosi[idx].width )/2;
    $navs.stop().animate({ scrollLeft: left - center },100);
  }
  //高亮選單滑動的色塊
  if(open_slidebg){
    var idx = 0
    $nav_slidebg.css({
      'height': navPosi[idx].height,
      '-webkit-transform':'translate3d('+ navPosi[idx].left  +'px,'+  navPosi[idx].top +'px,0)',
      '-moz-transform': 	'translate3d('+ navPosi[idx].left  +'px,'+  navPosi[idx].top +'px,0)',
      '-ms-transform': 	'translate3d('+ navPosi[idx].left  +'px,'+  navPosi[idx].top +'px,0)',
      '-o-transform': 	'translate3d('+ navPosi[idx].left  +'px,'+  navPosi[idx].top +'px,0)',
      'transform':		'translate3d('+ navPosi[idx].left  +'px,'+  navPosi[idx].top +'px,0)',
    })
  };
  $win.scroll(handler)
};


/* 
 * -------------------------------------------
 * 多選單互動(勿動)fNavChange()
 * -------------------------------------------
 */
function fNavChange(){
  var $navarea = $('.NavArea[data-fix="true"]')
  // 記錄每個內容區塊的位置
  var NavboxPosi = {};
  function NavboxPosiFu(val){ //更新區塊資料
    NavboxPosi = $navarea.map(function(idx, elem) {
      var $cont = $(elem);
      var top = $cont.offset().top;
      var bottom = $cont.offset().top;
      var height = $cont.height();
      var fix    = $cont.attr('data-fix');
      return {		
        top: top,
        bottom: top + height,
        height: height,
        fix: fix,
        jq: $cont
      };
    });
  };
  NavboxPosiFu('into'); //更新區塊資料
  //只有1個選單時不使用
  if ( NavboxPosi.length != 1){
    var $win = $(window);
    var $doc = $(document);
    $win.scroll(function(){
      var dTop = $doc.scrollTop();   
      NavboxPosiFu('update'); //更新區塊資料
      NavboxPosi.each(function(idx, posi) {
        if(idx != 0){
          var touch = posi.top - posi.height;
          if ( touch < dTop  && posi.bottom > dTop ) {
            var h = dTop - touch
            $navarea.find('.Nav_box').eq(idx-1).css('top', h * -1 );
          } else {
            $navarea.find('.Nav_box').eq(idx-1).css('top','');
          };
        };
      });	
    });	
  }
};




