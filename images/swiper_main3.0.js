
//輪播★v5.2.1★
var swiper_main = function swiper_main() {
    
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
        slidesPerView: 2.2, //顯示幾個
        spaceBetween: 10, //間距
        slidesOffsetBefore: 10, //左邊偏移量
        slidesOffsetAfter: 10, //右邊偏移量  
      },
      768: {
        //排版
        slidesPerView: 2.2, //顯示幾個
        spaceBetween: 10, //間距
        slidesOffsetBefore: 10, //左邊偏移量
        slidesOffsetAfter: 10, //右邊偏移量  
      },
    },
	
  });

};




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
                    