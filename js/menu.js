$(document).ready(function(){
    var menuWidth = 200;
    var wrapperWidth = $("#wrapper").width();
    $("#wrapper").css("width",wrapperWidth);
    $(document).on("click",".pull-left",function(){
        var left = $("#leftMenu").css("transform");
        console.log("sss");
        if(left!="matrix(1, 0, 0, 1, 0, 0)"){
             $("#leftMenu").css("transform","translateX(0px)");
             var currentWidth = $("#wrapper").width();
            currentWidth-=menuWidth;
        if($(window).width()<768)
        {
          $(".left-side").css("width",currentWidth);
          $(".left-side").css("float","right");
        }
            $("#wrapper").css("width",currentWidth);
            $("#wrapper").css("float","right");
            $("#wrapper").css("left","0");
            
            console.log(currentWidth);
        }
        else{
            $("#leftMenu").css("transform","translateX(-"+menuWidth+"px)");
                var currentWidth = $("#wrapper").width();
            currentWidth+=menuWidth;
         if($(window).width()<768)
         {
           $(".left-side").css("width",currentWidth);
           $(".left-side").css("float","right");
           $(".left-side").css("left","0");
         }
            
            $("#wrapper").css("width",currentWidth);
            $("#wrapper").css("float","right");
            $("#wrapper").css("left","0");
        }
    });
    
         $(document).on("click",".pull-left-shop",function(){
          if($(window).width()<768){
        var left = $("#leftMenuShop").css("transform");
        console.log(left);
           
        if(left!="matrix(1, 0, 0, 1, 0, 0)"){
             $("#leftMenuShop").css("transform","translateX(0px)");
            $(".right-side").css("left","175px");
        }
        else{
            $("#leftMenuShop").css("transform","translateX(-"+menuWidth+"px)");
            $(".right-side").css("left","0px");
        }
      }
    });
    
  
      $(document).on("click",".pull-right1",function(){
    
          
            var right = $("#rightMenu").css("transform");
        if(right!="matrix(1, 0, 0, 1, 0, 0)"){
             $("#rightMenu").css("transform","translateX(0px)");
            $("#wrapper").css("left","-"+menuWidth+"px");
        }
        else{
            $("#rightMenu").css("transform","translateX(300px)");
            $("#wrapper").css("left","0px");
        }
    });
   
   
     $(document).on("click",".pull-right-tab",function(){
        $(".right-side").css("left", "0%");
         $(".left-side").css("left", "-100%");
     });
    
      $(document).on("click",".pull-left-tab",function(){
        $(".right-side").css("left", "100%");
        $(".left-side").css("left", "0%");
     });
});