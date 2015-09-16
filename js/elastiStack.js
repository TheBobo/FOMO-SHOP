/**
 * elastiStack.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2013, Codrops
 * http://www.codrops.com
 */
;( function( window ) {
	
	'use strict';

	function extend( a, b ) {
		for( var key in b ) { 
			if( b.hasOwnProperty( key ) ) {
				a[key] = b[key];
			}
		}
		return a;
	}

	// support
	var is3d = !!getStyleProperty( 'perspective' ),
		supportTransitions = Modernizr.csstransitions,
		// transition end event name
		transEndEventNames = {
			'WebkitTransition': 'webkitTransitionEnd',
			'MozTransition': 'transitionend',
			'OTransition': 'oTransitionEnd',
			'msTransition': 'MSTransitionEnd',
			'transition': 'transitionend'
		},
		transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ];
        var showIcons = 5;
     var oldStatus = "none";
	function ElastiStack( el, options ) {
		this.container = el;
		this.options = extend( {}, this.options );
  		extend( this.options, options );
  		this._init();
	}

	function setTransformStyle( el, tval ) {
		el.style.WebkitTransform = tval;
		el.style.msTransform = tval;
		el.style.transform = tval;
	}

	ElastiStack.prototype.options = {
		// distDragBack: if the user stops dragging the image in a area that does not exceed [distDragBack]px for either x or y then the image goes back to the stack 
		distDragBack : 200,
		// distDragMax: if the user drags the image in a area that exceeds [distDragMax]px for either x or y then the image moves away from the stack 
		distDragMax : 450,
		// callback
		onUpdateStack : function( current ) { return false; }
	};

	ElastiStack.prototype._init = function() {
		// items
		this.items = [].slice.call( this.container.children );
		// total items
		this.itemsCount = this.items.length;
		// current item's index (the one on the top of the stack)
		this.current = 0;
		// set initial styles
		this._setStackStyle();
		// return if no items or only one
		if( this.itemsCount <= 1 ) return;
		// add dragging capability
		this._initDragg();
		// init drag events
		this._initEvents();
	};

	ElastiStack.prototype._initEvents = function() {
		var self = this;
		this.draggie.on( 'dragStart', function( i, e, p ) { self._onDragStart( i, e, p ); } );
		this.draggie.on( 'dragMove', function( i, e, p ) { self._onDragMove( i, e, p ); } );
		this.draggie.on( 'dragEnd', function( i, e, p ) { self._onDragEnd( i, e, p ); } );
	};

	ElastiStack.prototype._setStackStyle = function() {
		var item1 = this._firstItem(), item2 = this._secondItem(), item3 = this._thirdItem();

		if( item1 ) {
			item1.style.opacity = 1;
			item1.style.zIndex = 4;
			setTransformStyle( item1, is3d ? 'translate3d(0,0,0)' : 'translate(0,0)' );
		}

		if( item2 ) {
			item2.style.opacity = 1;
			item2.style.zIndex = 3;
			setTransformStyle( item2, is3d ? 'translate3d(10px,10px,0 )' : 'translate(0,0)' );
		}

		if( item3 ) {
			item3.style.opacity = 1;
			item3.style.zIndex = 2;
			setTransformStyle( item3, is3d ? 'translate3d(20px,20px,0px)' : 'translate(0,0)' );
		}
	};

ElastiStack.prototype._moveAway = function( instance ) {
        
          
          
		  instance.element.getElementsByClassName("updown")[0].style.display="none";
            instance.element.getElementsByClassName("updown")[1].style.display="none";
        // disable drag
		this._disableDragg();
		
		// add class "animate"
		classie.add( instance.element, 'animate' );
		
		// calculate how much to translate in the x and y axis
		var tVal = this._getTranslateVal( instance );
		
		// apply it	
		setTransformStyle( instance.element, is3d ? 'translate3d(' + tVal.x + 'px,' + tVal.y + 'px, 0px)' : 'translate(' + tVal.x + 'px,' + tVal.y + 'px)' );
		
		// item also fades out
		instance.element.style.opacity = 0;

		// other items move back to stack
		var item2 = this._secondItem(), item3 = this._thirdItem();

		if( item2 ) {
			classie.add( item2, 'move-back' );
			classie.add( item2, 'animate' );
			setTransformStyle( item2, is3d ? 'translate3d(10px,10px,0px)' : 'translate(0,0)' );
		}
		if( item3 ) {
			classie.add( item3, 'move-back' );
			classie.add( item3, 'animate' );
			setTransformStyle( item3, is3d ? 'translate3d(20px,20px,0px)' : 'translate(0,0)' );
		}

		// after transition ends..
		var self = this,
			onEndTransFn = function() {
				instance.element.removeEventListener( transEndEventName, onEndTransFn );
				
				// reset first item
				setTransformStyle( instance.element, is3d ? 'translate3d(0,0,-180px)' : 'translate(0,0,0)' );
				instance.element.style.left = instance.element.style.top = '0px';
				instance.element.style.zIndex = -1;
				classie.remove( instance.element, 'animate' );

				// reorder stack
				self.current = self.current < self.itemsCount - 1 ? self.current + 1 : 0;
				// new front items
				var item1 = self._firstItem(),
					item2 = self._secondItem(),
					item3 = self._thirdItem();

				// reset transition timing function
				classie.remove( item1, 'move-back' );
				if( item2 ) classie.remove( item2, 'move-back' );
				if( item3 ) classie.remove( item3, 'move-back' );

				setTimeout( function() {
					// the upcoming one will animate..
					classie.add( self._lastItem(), 'animate' );
					// reset style
					self._setStackStyle();
				}, 25 );

				// add dragging capability
				self._initDragg();

				// init drag events on new current item
				self._initEvents();

				// callback
				self.options.onUpdateStack( self.current );
			};

		if( supportTransitions ) {
			instance.element.addEventListener( transEndEventName, onEndTransFn );
		}
		else {
			onEndTransFn.call();
		}
	};


	ElastiStack.prototype._moveBack = function( instance ) {
		var item2 = this._secondItem(), item3 = this._thirdItem();

		classie.add( instance.element, 'move-back' );
		classie.add( instance.element, 'animate' );
		setTransformStyle( instance.element, is3d ? 'translate3d(0,0,0)' : 'translate(0,0)' );
		instance.element.style.left = '0px';
		instance.element.style.top = '0px';

		if( item2 ) {
			classie.add( item2, 'move-back' );
			classie.add( item2, 'animate' );
			setTransformStyle( item2, is3d ? 'translate3d(10px,10px,0px)' : 'translate(0,0)' );
		}
		if( item3 ) {
			classie.add( item3, 'move-back' );
			classie.add( item3, 'animate' );
			setTransformStyle( item3, is3d ? 'translate3d(20px,20px,0px)' : 'translate(0,0)' );
		}
	};
	ElastiStack.prototype._onDragStart = function( instance, event, pointer ) {
                $(".vote-thumbs").hide();
		 var yy=event.target.classList;
        for(var i=0; i<yy.length; i++){
      if(yy[i] == "vote-yes"){
          this._moveAway( instance );
          
          //console.log("vote-up");
          return;
            }
            else  if(yy[i] == "vote-no"){
          this._moveAway( instance );
                $(".vote-thumbs").show();
               // console.log("vote-down");
          return;
            }
        }
        
        $(".vote-thumbs").hide();
        $(".vote-thumbs").hide();
		// remove transition classes if any
		var item2 = this._secondItem(), item3 = this._thirdItem();

		//classie.remove( instance.element, 'move-back' );
		//classie.remove( instance.element, 'animate' );

		if( item2 ) {
			//classie.remove( item2, 'move-back' );
			//classie.remove( item2, 'animate' );
		}
		if( item3 ) {
			//classie.remove( item3, 'move-back' );
			//classie.remove( item3, 'animate' );
		}
	};

        function MoveCompetitionTitle( instance ){
            debugger;
        var startCompetition = $(instance.element).find(".labelLike").css("display");
            
            if(startCompetition == "block" ){
                  if($(".competition-mtitle").text() == "" && $(instance.element).is(':first-child')){ 
                    oldStatus="block";
                    var competitionName = $(instance.element).find("h5");
                    //alert(competitionName.position().left + " " + competitionName.position().top);
                    var offset = $(competitionName).offset();
                     
                      var width = $(competitionName).css("width");
                      var titlePosition = $("#numero1").offset();
                      titlePosition.top = Math.abs(titlePosition.top-offset.top);
                      if($(document).width()>769){
                        titlePosition.left = Math.abs(titlePosition.left-offset.left)-100;
                      } 
                      else{
                        titlePosition.left =  titlePosition.left-0;
                      }
                    $(".competition-mtitle").css("transition","width: 0s, left 0s, top 0s");
                    $(".competition-mtitle").text($(competitionName).text());
                    var widthCurrent = parseInt($(".competition-mtitle").css("width"));
                    var widthTit = parseInt($(instance.element).find("h5").css("width"));
                    var dif = Math.abs(widthCurrent-widthTit);
                    var difDevide2 = dif/2;
                    var leftM = $(instance.element).find("h5").offset().left+parseInt($(instance.element).find("h5").css("margin-left"))+parseInt($(instance.element).find("h5").css("padding-left"))+difDevide2;
                      
                    $(".competition-mtitle").css("top",offset.top);
                    $(".competition-mtitle").css("left",leftM);
                    
                    $(".competition-mtitle").css("opacity",1);
                    //$(instance.element).find("h5").css("opacity",0);
                    
                      if($(document).width()>769){
                          var tt=$(".left-side").find("h3")[0]
                          var left = $(tt).offset().left+parseInt($(tt).css("margin-left"))+parseInt($(tt).css("padding-left"))+parseInt($(tt).css("margin-right"))+parseInt($(tt).css("padding-right"));//+$(tt).width();
                          Animate(0.5,left,$(tt).offset().top+3-parseInt($(tt).css("margin-bottom")),1.2,3)
                    }
                    else{
                      var ob =$(".top-navigation-bar").find("h3");
                        debugger;
                      var fontSize=  $(ob).css("font-size");
                      //fontSize = parseInt(fontSize)*2;
                      $(".competition-mtitle").css("font-size",fontSize);
                        debugger;
                      var left = parseInt( $(ob).css("margin-left"))+parseInt($(ob).offset().left);
                        var top =$(ob).offset().top+20+parseInt($(ob).css("font-size"));
                       // $(".competition-mtitle").css("left",left);
                       // $(".competition-mtitle").css("top",top);
                        
                        top =$(ob).offset().top+30;
                        
                        left=parseInt(width)/2;
                        if($(document).width()<400){
                            left=parseInt(width)/4;
                        }
                        if($(document).width()<769 && $(document).width()>480){
                            var tt=$(".top-navigation-bar").find("h3")[0]
                            var left = $(tt).offset().left+parseInt($(tt).css("padding-left"));
                            left=1*left;
                            
                          Animate(0.5,left,25,1.2,2.5);
                        }
                        else if($(document).width()<480 && $(document).width()>420){
                            var tt=$(".mobile-inner-pages").find("h3")[0]
                            var left = $(tt).offset().left+parseInt($(tt).css("padding-left"));
                            Animate(0.5,left,25,0.95,2.5)
                            
                        }
                          else if($(document).width()<420 && $(document).width()>319){
                              var tt=$(".mobile-inner-pages").find("h3")[0]
                              var left = $(tt).offset().left+parseInt($(tt).css("padding-left"));
                              Animate(0.5,left,20,0.7,2.5)
                        }
						  else if($(document).width()<320){
                             var tt=$(".mobile-inner-pages").find("h3")[0]
                             var left = $(tt).offset().left+parseInt($(tt).css("padding-left"));
                             Animate(0.5,left,20,0.6,2.5)
                        }
                    }
                      
                    //$(".competition-mtitle").css("transition", "font-size:1.0s")
                   // $(".competition-mtitle").css("transform","scale(0.5,0.5)");
                    
                    
                }
            }
    }
    
    function Animate(timeDuration,leftPosition,topPosition,zoomOut,zoomIn){
         //$(".competition-mtitle").css("font-size","19px");
        var fontSize = parseInt($(".competition-mtitle").css("font-size"));
        fontSize*=zoomIn;
        $(".competition-mtitle").css("transition","font-size "+timeDuration+"s, left "+timeDuration+"s, top "+timeDuration+"s");
         var cw = $(".competition-mtitle").width();
        cw=(cw*zoomIn-1)/2/2;
        var cL = parseInt($(".competition-mtitle").css("left"));
       cL=cL-cw;
        debugger;
        //todo fontsize apply dinamicly
       
         $(".competition-mtitle").css("font-size",fontSize+"px");
         $(".competition-mtitle").css("left",cL)
        //$(".competition-mtitle").css("transition-duration", timeDuration+"s");
        //$(".competition-mtitle").css("transform"," scale("+zoomIn+","+zoomIn+"");
      
        var timeDurationJS =  timeDuration*1000;
        setTimeout(function () {
                 debugger;   
        $(".competition-mtitle").css("top",topPosition+"px");
        $(".competition-mtitle").css("left",leftPosition+"px");
    fontSize=fontSize/zoomIn*zoomOut;
             if(fontSize<14){
            fontSize=14;
        }
    $(".competition-mtitle").css("font-size",fontSize+"px");
        //$(".competition-mtitle").css("transform","translate( "+leftPosition+"px, "+topPosition+"px) scale("+zoomOut+","+zoomOut+"");
        //$(".competition-mtitle").css("width","auto");
    }, timeDurationJS);
    }
    
      function RemoveItemsReturnLeftItemsCount(inst){
          var tt = inst.element;
            var ul = $(tt).parent();
            //$(tt).remove();
          var liArray =ul.children();
          for(var i=0; i<liArray.length; i++){
               if($(liArray[i]).css("z-index") == "-1")
            {
                $(liArray[i]).remove();
            }
              if($(liArray[i]).html() == $(tt).html())
              {
                  debugger;
                  if(i+1 == liArray.length){
                      return 0;}
                  else{
                      return 1;
                  }
              }
          }
          
          
          
          debugger;
            return $(ul).children().length;
    }
    
	ElastiStack.prototype._onDragMove = function( instance, event, pointer ) {
		if( this._outOfBounds( instance ) ) {
			
              if(RemoveItemsReturnLeftItemsCount(instance) == 0)
            {
                $(".no-more-items").show();
                $("#elasticstack").hide();
            }
          
            
            this._moveAway( instance );
            instance.element.getElementsByClassName("updown")[0].style.display="none";
            instance.element.getElementsByClassName("updown")[1].style.display="none";
            debugger;
		}
		else {
                     if(instance.position.x < 0 && Math.abs(instance.position.x)>showIcons){
                instance.element.getElementsByClassName("updown")[0].style.display="none";
                     instance.element.getElementsByClassName("updown")[1].style.display="block";
                oldStatus="none";
                
            }
            else if(instance.position.x > 0 && Math.abs(instance.position.x)>showIcons){
                  
                instance.element.getElementsByClassName("updown")[0].style.display="block";
                instance.element.getElementsByClassName("updown")[1].style.display="none";
                MoveCompetitionTitle(instance);
            }
            else{
                 instance.element.getElementsByClassName("updown")[0].style.display="none";
            instance.element.getElementsByClassName("updown")[1].style.display="none";
                //HideCompetionTitle(instance);
            }
			// the second and third items also move
			var item1 = this._firstItem(), item2 =  this._secondItem(), item3 = this._thirdItem();
           
			// the second and third items also move
			var item2 = this._secondItem(), item3 = this._thirdItem();
			if( item2 ) {
				setTransformStyle( item2, is3d ? 'translate3d(' + ( instance.position.x * .6 ) + 'px,' + ( instance.position.y * .6 ) + 'px, 60px) ' : 'translate(' + ( instance.position.x * .6 ) + 'px,' + ( instance.position.y * .6 ) + 'px)' );
			}
			if( item3 ) {
				setTransformStyle( item3, is3d ? 'translate3d(' + ( instance.position.x * .3 ) + 'px,' + ( instance.position.y * .3 ) + 'px, -120px)' : 'translate(' + ( instance.position.x * .3 ) + 'px,' + ( instance.position.y * .3 ) + 'px)' );
			}
		}
	};

	
	ElastiStack.prototype._onDragEnd = function( instance, event, pointer ) {
        $(".vote-thumbs").show();
		$(".vote-thumbs").show();
		if( this._outOfBounds( instance ) ) return;
		if( this._outOfSight(instance) ) {
             
           if(RemoveItemsReturnLeftItemsCount(instance) == 0)
            {
                $(".no-more-items").show();
            }
          
			
            this._moveAway( instance );
            
		}
		else {
			this._moveBack( instance );
            instance.element.getElementsByClassName("updown")[0].style.display="none";
            instance.element.getElementsByClassName("updown")[1].style.display="none";
		}
	};

	ElastiStack.prototype._initDragg = function() {
        debugger;
		this.draggie = new Draggabilly( this.items[ this.current ] );
	};

	ElastiStack.prototype._disableDragg = function() {
		this.draggie.disable();
	};

	// returns true if x or y is bigger than distDragMax
	ElastiStack.prototype._outOfBounds = function( el ) {
		return Math.abs( el.position.x ) > this.options.distDragMax || Math.abs( el.position.y ) > this.options.distDragMax;
	};

	// returns true if x or y is bigger than distDragBack
	ElastiStack.prototype._outOfSight = function( el ) {
		return Math.abs( el.position.x ) > this.options.distDragBack || Math.abs( el.position.y ) > this.options.distDragBack;
	};

	ElastiStack.prototype._getTranslateVal = function( el ) {
		var h = Math.sqrt( Math.pow( el.position.x, 2 ) + Math.pow( el.position.y, 2 ) ),
			a = Math.asin( Math.abs( el.position.y ) / h ) / ( Math.PI / 180 ),
			hL = h + this.options.distDragBack,
			dx = Math.cos( a * ( Math.PI / 180 ) ) * hL,
			dy = Math.sin( a * ( Math.PI / 180 ) ) * hL,
			tx = dx - Math.abs( el.position.x ),
			ty = dy - Math.abs( el.position.y );
		
		return {
			x : el.position.x > 0 ? tx : tx * -1, 
			y : el.position.y > 0 ? ty : ty * -1
		}
	};

	// returns the first item in the stack
	ElastiStack.prototype._firstItem = function() {
		return this.items[ this.current ];
	};
	
	// returns the second item in the stack
	ElastiStack.prototype._secondItem = function() {
		if( this.itemsCount >= 2 ) {
			return this.current + 1 < this.itemsCount ? this.items[ this.current + 1 ] : this.items[ Math.abs( this.itemsCount - ( this.current + 1 ) ) ];
		}
	};
	
	// returns the third item in the stack
	ElastiStack.prototype._thirdItem = function() { 
		if( this.itemsCount >= 3 ) {
			return this.current + 2 < this.itemsCount ? this.items[ this.current + 2 ] : this.items[ Math.abs( this.itemsCount - ( this.current + 2 ) ) ];
		}
	};

	// returns the last item (of the first three) in the stack
	ElastiStack.prototype._lastItem = function() { 
		if( this.itemsCount >= 3 ) {
			return this._thirdItem();
		}
		else {
			return this._secondItem();
		}
	};

	// add to global namespace
	window.ElastiStack = ElastiStack;

})( window );