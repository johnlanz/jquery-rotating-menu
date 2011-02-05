/*
*	Class: rotatingMenu
*	Author: John Lanz (http://pixelcone.com)
*	Version: 1.0
*/
(function($) {
	$.rotatingMenu = {
		defaults: {
			maxSpeed: 500,
			minSpeed: 2000,
			divId: "#rmenu"
		}
	};
	$.fn.extend({
		rotatingMenu:function(config) {
			var config = $.extend({}, $.rotatingMenu.defaults, config);
			var speed = config.minSpeed;
			var divWidth = $('div', this).width(),
			divHeight = $('div', this).height(),
			menuWidth = $(this).width(),
			menuHeight = $(this).height(),
			leftLimit = menuWidth - (divWidth + 2);
			
			//calculating the numver of div
			var tdiv = $('div', this).length,
				tdivhaf = Math.round(tdiv / 2),
				dHalf = Math.round(tdivhaf/2),
				tdiv_odd = (tdivhaf-1) % 2;
			//getting the position and distance
			var topPos = (menuHeight / 2) - (divHeight / 2),
				topPos_distance = (tdiv_odd)? Math.floor(topPos / dHalf) : Math.floor(topPos / (dHalf-1)),
				lPos = 0,
				lPos_distance = Math.floor((menuWidth - (divWidth*(tdivhaf+1))) / tdivhaf + divWidth);
			//getting div bottom total and distance
			var tdiv_bottom = tdiv-tdivhaf,
				bdiv_odd = (tdiv_bottom-1) % 2,
				bottomPos = topPos,
				bhalf = Math.round(tdiv_bottom/2) + tdivhaf,
				bdiv_half = Math.round(tdiv_bottom/2),
				tdiv_bottom_pos = Math.floor((menuWidth - (divWidth*(tdiv_bottom+1))) / tdiv_bottom + divWidth),
				bPos_distance = (bdiv_odd)? Math.floor(bottomPos / bdiv_half) : Math.floor(bottomPos / (bdiv_half-1));
			var count = 0,
				leftAnim = false, //left animation,
				zPos = topPos, //firt top position,
				zHigh = 0,
				zLow = 0,
				mapPos = {}; //stores the position of the menu
			var rdiv = $('div', this),
				rData = new Array(),
				rpos = new Array();
			for(i=0; i<tdiv; i++){
				ids = rdiv.eq(i).attr('id');
				rData[i] = ids;
			}
			var rEvent = this; //copy 'this' to rEvent
			var rm = {
				//menu positioning
				menuPosition : function(){
					for (i=1; i<=tdiv; i++){
						if (i <= tdivhaf){
							$(rEvent).children(config.divId + i).css({top: topPos, left: lPos});
							mapPos['menu'+i] = {top: topPos, left: lPos};
							lPos += lPos_distance;
							if (i <= dHalf){
								if (i == dHalf && !tdiv_odd){
								}else{
									topPos += topPos_distance;
								}
							}else{
								topPos -= topPos_distance;
							}
						}else{
							$(rEvent).children(config.divId + i).css({top: bottomPos, left: lPos});
							mapPos['menu'+i] = {top: bottomPos, left: lPos};
							lPos -= tdiv_bottom_pos;
							if (i <= bhalf){
								if (i == bhalf && !bdiv_odd){
								}else{
									bottomPos -= bPos_distance;
								}
							}else{
								bottomPos += bPos_distance;
							}
						}
					}
				},
				//reset whether go to left or right animation
				menuReset : function(cont){
					count++;
					if (count == tdiv || (typeof cont != "undefined" && cont)){
						if (leftAnim){
							for (i=0; i<tdiv; i++){
								val1 = rData[i];
								if (i > 0){
									rData[i] = val;
								}else{
									rData[i] = rData[tdiv-1];
								}
								val = val1;
								rpos[i] = rdiv.eq(i).position();
							}
						}else{
							for (i=tdiv-1; i>=0; i--){
								val1 = rData[i];
								//console.log(i);
								if (i < tdiv-1){
									rData[i] = val;
								}else{
									rData[i] = rData[0];
								}
								val = val1;
								rpos[i] = rdiv.eq(i).position();
							}
						}
						zHigh = 100;
						zLow = 50;
						for(i=0; i<tdiv; i++){
							if (leftAnim && ((rpos[i].top > zPos && rpos[i].left > 0) || rpos[i].left >= leftLimit)){
								zHigh--;
								rdiv.eq(i).attr('id', rData[i]).css('z-index', zHigh);
							}else if(!leftAnim && (rpos[i].top > zPos || rpos[i].left == 0)){
								zHigh--;
								rdiv.eq(i).attr('id', rData[i]).css('z-index', zHigh);
							}else{
								zLow--;
								rdiv.eq(i).attr('id', rData[i]).css('z-index', zLow);
							}
						}
						count = 0;
						if(!cont){
							this.rmAnimate();
						}
					}
				},
				//animate
				rmAnimate : function(){
					for (i=1; i<=tdiv; i++){
						$(rEvent).children(config.divId + i).animate({top: mapPos['menu'+i].top, left: mapPos['menu'+i].left}, speed, 'linear', function(){
						rm.menuReset();
						});
					}
				}
			}
			rm.menuPosition();
			rm.menuReset(true);
			rm.rmAnimate();
			var rmPos = $(rEvent).offset();
			var halfMenuW = menuWidth/2;
			var mouseP = Math.round(rmPos.left + halfMenuW); // if >:right <:left
			$(window).resize(function(){
				rmPos = $(rEvent).offset();
				mouseP = Math.round(rmPos.left + halfMenuW); // if >:right <:left
			});
			var mousePoints = Math.floor(halfMenuW/8);
			var speedMeter = Math.floor((config.minSpeed - config.maxSpeed)/8);
			$(this).mousemove(function(e){
				mPoint = 0;
				if (mouseP > e.clientX){
					leftAnim = false;
					mPoint = mouseP - e.clientX;
				}else{
					leftAnim = true;
					mPoint = e.clientX - mouseP;
				}
				speed = config.minSpeed - (speedMeter * Math.round(mPoint/mousePoints));
			});
			
			$('div', this).hover(function(){
				$(this).siblings('div').find('span').hide();
				$('span', this).show().css('display', 'block');
			},function(){
				$(rEvent).find('span').hide();
			});
			return this;
		}
	});
})(jQuery);