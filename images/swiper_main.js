
//輪播★v5.2.1★
var swiper_main = function swiper_main() {

  $(".Area_top .Area_swiper .PD_layout ul").addClass('swiper-wrapper');
  $(".Area_top .Area_swiper .PD_layout ul li").addClass('swiper-slide');
  var Area_top = new Swiper('.Area_top .Area_swiper .PD_layout', {
    
    //★5.2.1★小圓點【基本】-白點swiper-pagination-white, 黑點swiper-pagination-black
    pagination: {
      el: '.Area_top .swiper-pagination',
      clickable: true, //觸擊切換
    },
    //★5.2.1★左右切換-白色箭頭swiper-button-white, 黑色箭頭swiper-button-black  
    navigation:{
      nextEl: '.Area_top .swiper-button-next',
      prevEl: '.Area_top .swiper-button-prev',
    },
   //★5.2.1★自動撥放
   autoplay: {
   delay: 2500,
   disableOnInteraction: false, //觸擊後不再自動輪播
    },
        //★5.2.1★切換特效(淡化)
    effect: 'fade',     //切換特效 fade(淡化) cube(立方體) coverflow(3D) flip(翻牌) slide(一般)
    fadeEffect: {
      crossFade: true //打開自動淡出
    },
 
     //★5.2.1★RWD(換成大於)
    breakpoints: {
      0: {
        //手機版
        slidesPerView: 1,
        spaceBetween:0
      },
      768: {
        //電腦版
        slidesPerView: 1,
        spaceBetween: 0
      },
    },

  });
  


    
  /*BN輪播*/ 
  $(".Area_bn .Area_swiper .PD_layout ul").addClass('swiper-wrapper');
  $(".Area_bn .Area_swiper .PD_layout ul li").addClass('swiper-slide');
  var Area_bn = new Swiper('.Area_bn .Area_swiper .PD_layout .btclass', {

    //★5.2.1★小圓點【基本】-白點swiper-pagination-white, 黑點swiper-pagination-black
    pagination: {
      el: '.Area_bn .Area_swiper .swiper-pagination',
      clickable: true, //觸擊切換
    },
    //★5.2.1★左右切換-白色箭頭swiper-button-white, 黑色箭頭swiper-button-black  
    navigation:{
      nextEl: '.Area_bn .Area_swiper .swiper-button-next',
      prevEl: '.Area_bn .Area_swiper .swiper-button-prev',
    },
    //★5.2.1★基本
    watchOverflow: true, //只有1個slide時，不啟動swiper
    roundLengths: true, //寬高四捨五入不出現小數點   
    //initialSlide: Math.floor( Math.random() * $('.Area_bn .Area_swiper .PD_layout .btclass .swiper-slide').length ) , //初始險是第幾個(亂數)
      
    //抵亢反彈
    freeMode: true, //取消只滑動1格,但不會貼齊(要貼齊要再加Sticky)
    freeModeSticky: true, //取消只滑動1格時也可貼齊

    //★5.2.1★RWD(換成大於)
    breakpoints: {
      0:{
        //排版
        slidesPerView: 1.1, //顯示幾個
        spaceBetween: 10, //間距
        slidesOffsetBefore: 10, //左邊偏移量
        slidesOffsetAfter: 10, //右邊偏移量  
      },
      768: {
        //排版
        slidesPerView: 1.2, //顯示幾個
        spaceBetween: 10, //間距
        slidesOffsetBefore: 10, //左邊偏移量
        slidesOffsetAfter: 10, //右邊偏移量  
      },
    },
	
  });

};

 
  /*BN輪播*/ 
  $(".Area_bn2 .Area_swiper .PD_layout ul").addClass('swiper-wrapper');
  $(".Area_bn2 .Area_swiper .PD_layout ul li").addClass('swiper-slide');
  var Area_bn = new Swiper('.Area_bn2 .Area_swiper .PD_layout .btclass', {

    //★5.2.1★小圓點【基本】-白點swiper-pagination-white, 黑點swiper-pagination-black
    pagination: {
      el: '.Area_bn2 .Area_swiper .swiper-pagination',
      clickable: true, //觸擊切換
    },
    //★5.2.1★左右切換-白色箭頭swiper-button-white, 黑色箭頭swiper-button-black  
    navigation:{
      nextEl: '.Area_bn2 .Area_swiper .swiper-button-next',
      prevEl: '.Area_bn2 .Area_swiper .swiper-button-prev',
    },

   //★5.2.1★自動撥放
   autoplay: {
   delay: 2500,
   disableOnInteraction: false, //觸擊後不再自動輪播
    },
    
    //★5.2.1★基本
    watchOverflow: true, //只有1個slide時，不啟動swiper
    roundLengths: true, //寬高四捨五入不出現小數點   
    //initialSlide: Math.floor( Math.random() * $('.Area_bn .Area_swiper .PD_layout .btclass .swiper-slide').length ) , //初始險是第幾個(亂數)
      
    //抵亢反彈
    freeMode: true, //取消只滑動1格,但不會貼齊(要貼齊要再加Sticky)
    freeModeSticky: true, //取消只滑動1格時也可貼齊

        //★5.2.1★切換特效(淡化)
    effect: 'fade',     //切換特效 fade(淡化) cube(立方體) coverflow(3D) flip(翻牌) slide(一般)
    fadeEffect: {
      crossFade: true //打開自動淡出
    },
 


     //★5.2.1★RWD(換成大於)
    breakpoints: {
      0: {
        //手機版
        slidesPerView: 1,
        spaceBetween:0
      },
      768: {
        //電腦版
        slidesPerView: 1,
        spaceBetween: 0
      },
    },

  });



  /*新朋友BN輪播*/ 
  $(".Area_bn3 .Area_swiper .PD_layout ul").addClass('swiper-wrapper');
  $(".Area_bn3 .Area_swiper .PD_layout ul li").addClass('swiper-slide');
  var Area_bn = new Swiper('.Area_bn3 .Area_swiper .PD_layout .btclass', {

    //★5.2.1★小圓點【基本】-白點swiper-pagination-white, 黑點swiper-pagination-black
    pagination: {
      el: '.Area_bn3 .Area_swiper .swiper-pagination',
      clickable: true, //觸擊切換
    },
    //★5.2.1★左右切換-白色箭頭swiper-button-white, 黑色箭頭swiper-button-black  
    navigation:{
      nextEl: '.Area_bn3 .Area_swiper .swiper-button-next',
      prevEl: '.Area_bn3 .Area_swiper .swiper-button-prev',
    },

  //��5.2.1��撠誩�㯄�𠺶�𣂼抅�𧋦��-�蒾暺鈈wiper-pagination-white, 暺煾�鈈wiper-pagination-black
  pagination: {
    el: '.Area_PD1 .Area_swiper .swiper-pagination',
    clickable: true, //閫豢�𠰴����
  },
  //��5.2.1��撌血𢰧�����-�蒾�𠧧蝞剝�swiper-button-white, 暺𤏸𠧧蝞剝�swiper-button-black  
  navigation:{
    nextEl: '.Area_PD1 .Area_swiper .swiper-button-next',
    prevEl: '.Area_PD1 .Area_swiper .swiper-button-prev',
  },
  //��5.2.1���抅�𧋦
  watchOverflow: true, //�蘨���1�𨈇lide��嚗䔶�滚�笔�䅿wiper
  roundLengths: true, //撖祇�睃�𥟇崕鈭𥪜�乩�滚枂�𣶹撠𤩺彍暺�   
  //initialSlide: Math.floor( Math.random() * $('.Area_PD1 .Area_swiper .PD_layout .btclass .swiper-slide').length ) , //��嘥�钅麬�糓蝚砍嗾��(鈭��彍)
    
  //�𠽌鈭Ｗ�滚��
  freeMode: true, //��𡝗��蘨皛穃��1�聢,雿�銝齿�鞎潮��(閬�鞎潮�𡃏��滚�䒷ticky)
  freeModeSticky: true, //��𡝗��蘨皛穃��1�聢��銋笔虾鞎潮��


     //★5.2.1★RWD(換成大於)
    breakpoints: {
    0:{
      //��垍��
      slidesPerView: 2.2, //憿舐內撟曉��
      spaceBetween: 5, //��栞��
      slidesOffsetBefore: 10, //撌阡�𠰴�讐宏���
      slidesOffsetAfter: 10, //�𢰧�𠰴�讐宏���  
    },
    768: {
      //��垍��
      slidesPerView: 3.2, //憿舐內撟曉��
      spaceBetween: 5, //��栞��
      slidesOffsetBefore: 10, //撌阡�𠰴�讐宏���
      slidesOffsetAfter: 10, //�𢰧�𠰴�讐宏���  
      },
    },

  });


 /*新朋友BN輪播*/ 
  $(".Area_bn4 .Area_swiper .PD_layout ul").addClass('swiper-wrapper');
  $(".Area_bn4 .Area_swiper .PD_layout ul li").addClass('swiper-slide');
  var Area_bn = new Swiper('.Area_bn4 .Area_swiper .PD_layout .btclass', {

    //★5.2.1★小圓點【基本】-白點swiper-pagination-white, 黑點swiper-pagination-black
    pagination: {
      el: '.Area_bn4 .Area_swiper .swiper-pagination',
      clickable: true, //觸擊切換
    },
    //★5.2.1★左右切換-白色箭頭swiper-button-white, 黑色箭頭swiper-button-black  
    navigation:{
      nextEl: '.Area_bn4 .Area_swiper .swiper-button-next',
      prevEl: '.Area_bn4 .Area_swiper .swiper-button-prev',
    },

  //��5.2.1��撠誩�㯄�𠺶�𣂼抅�𧋦��-�蒾暺鈈wiper-pagination-white, 暺煾�鈈wiper-pagination-black
  pagination: {
    el: '.Area_PD1 .Area_swiper .swiper-pagination',
    clickable: true, //閫豢�𠰴����
  },
  //��5.2.1��撌血𢰧�����-�蒾�𠧧蝞剝�swiper-button-white, 暺𤏸𠧧蝞剝�swiper-button-black  
  navigation:{
    nextEl: '.Area_PD1 .Area_swiper .swiper-button-next',
    prevEl: '.Area_PD1 .Area_swiper .swiper-button-prev',
  },
  //��5.2.1���抅�𧋦
  watchOverflow: true, //�蘨���1�𨈇lide��嚗䔶�滚�笔�䅿wiper
  roundLengths: true, //撖祇�睃�𥟇崕鈭𥪜�乩�滚枂�𣶹撠𤩺彍暺�   
  //initialSlide: Math.floor( Math.random() * $('.Area_PD1 .Area_swiper .PD_layout .btclass .swiper-slide').length ) , //��嘥�钅麬�糓蝚砍嗾��(鈭��彍)
    
  //�𠽌鈭Ｗ�滚��
  freeMode: true, //��𡝗��蘨皛穃��1�聢,雿�銝齿�鞎潮��(閬�鞎潮�𡃏��滚�䒷ticky)
  freeModeSticky: true, //��𡝗��蘨皛穃��1�聢��銋笔虾鞎潮��


     //★5.2.1★RWD(換成大於)
    breakpoints: {
    0:{
      //��垍��
      slidesPerView: 1.2, //憿舐內撟曉��
      spaceBetween: 5, //��栞��
      slidesOffsetBefore: 10, //撌阡�𠰴�讐宏���
      slidesOffsetAfter: 10, //�𢰧�𠰴�讐宏���  
    },
    768: {
      //��垍��
      slidesPerView: 1.2, //憿舐內撟曉��
      spaceBetween: 5, //��栞��
      slidesOffsetBefore: 10, //撌阡�𠰴�讐宏���
      slidesOffsetAfter: 10, //�𢰧�𠰴�讐宏���  

      },
    },

  });


/*頛芣偘Area_PD1*/ 
$(".Area_PD1 .Area_swiper .PD_layout ul").addClass('swiper-wrapper');
$(".Area_PD1 .Area_swiper .PD_layout ul li").addClass('swiper-slide');
var Area_PD1 = new Swiper('.Area_PD1 .Area_swiper .PD_layout .btclass', {

  //��5.2.1��撠誩�㯄�𠺶�𣂼抅�𧋦��-�蒾暺鈈wiper-pagination-white, 暺煾�鈈wiper-pagination-black
  pagination: {
    el: '.Area_PD1 .Area_swiper .swiper-pagination',
    clickable: true, //閫豢�𠰴����
  },
  //��5.2.1��撌血𢰧�����-�蒾�𠧧蝞剝�swiper-button-white, 暺𤏸𠧧蝞剝�swiper-button-black  
  navigation:{
    nextEl: '.Area_PD1 .Area_swiper .swiper-button-next',
    prevEl: '.Area_PD1 .Area_swiper .swiper-button-prev',
  },
  //��5.2.1���抅�𧋦
  watchOverflow: true, //�蘨���1�𨈇lide��嚗䔶�滚�笔�䅿wiper
  roundLengths: true, //撖祇�睃�𥟇崕鈭𥪜�乩�滚枂�𣶹撠𤩺彍暺�   
  //initialSlide: Math.floor( Math.random() * $('.Area_PD1 .Area_swiper .PD_layout .btclass .swiper-slide').length ) , //��嘥�钅麬�糓蝚砍嗾��(鈭��彍)
    
  //�𠽌鈭Ｗ�滚��
  freeMode: true, //��𡝗��蘨皛穃��1�聢,雿�銝齿�鞎潮��(閬�鞎潮�𡃏��滚�䒷ticky)
  freeModeSticky: true, //��𡝗��蘨皛穃��1�聢��銋笔虾鞎潮��

  //��5.2.1��RWD(��𥟇�𣂼之�䲰)
  breakpoints: {
    0:{
      //��垍��
      slidesPerView: 2.2, //憿舐內撟曉��
      spaceBetween: 10, //��栞��
      slidesOffsetBefore: 10, //撌阡�𠰴�讐宏���
      slidesOffsetAfter: 10, //�𢰧�𠰴�讐宏���  
    },
    768: {
      //��垍��
      slidesPerView: 4.2, //憿舐內撟曉��
      spaceBetween: 10, //��栞��
      slidesOffsetBefore: 10, //撌阡�𠰴�讐宏���
      slidesOffsetAfter: 10, //�𢰧�𠰴�讐宏���  
    },
  },

});









/* --------------------------------------
  * 進頁面馬上執行
  * -------------------------------------- */
$(function () {
  //lazyLoadInstance.loadAll(); //圖片延遲全部加載(檢查用)
  swiper_main(); //輪播★v5.2.1★   
});

/* --------------------------------------
  * 頁面讀取完畢後執行
  * -------------------------------------- */
$(window).on('load',function(){
  lazyLoadInstance.update(); //重新觸發圖片延遲,針對共用素材、無限輪播
});
                    

