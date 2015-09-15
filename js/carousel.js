    
$(document).ready(function(){
    var time = 2000;
    var lastSize = $(window).width();
$( window ).resize(function() {
  if($(window).width()<768 && lastSize > 768){
      
      $('.vert-carousel').slick('unslick');
      $('.vert-carousel').slick({
           autoplay: true,
           autoplaySpeed: time,
           vertical:false
    }).then(function(){
    
        $(".vert-carousel").find("div").attr("style","");
        $(".vert-carousel").find("img").attr("style","");
    });
  }
    else  if($(window).width()>768 && lastSize < 768){
      
      $('.vert-carousel').slick('unslick');
      $('.vert-carousel').slick({
           autoplay: true,
           autoplaySpeed: time,
           vertical:true
    }).then(function(){
    
        $(".vert-carousel").find("div").attr("style","");
        $(".vert-carousel").find("img").attr("style","");
    });
  }
    lastSize=$(window).width();
});
  
if($(window).width()<768){
        $('.vert-carousel').slick({
      autoplay: true,
      autoplaySpeed: time,
      vertical:false
     }).then(function(){
    
        $(".vert-carousel").find("div").attr("style","");
        $(".vert-carousel").find("img").attr("style","");
    });
}
    else{
        
   
    $('.vert-carousel').slick({
      autoplay: true,
      autoplaySpeed: time,
     vertical:true,
        adaptiveHeight:true
     }).then(function(){
    
        $(".vert-carousel").find("div").attr("style","");
        $(".vert-carousel").find("img").attr("style","");
    });
    }
        
    $('.car-item').slick({
		  infinite: true,
		  slidesToShow: 4,
		  slidesToScroll: 4,
		});
    
    
    

});
	