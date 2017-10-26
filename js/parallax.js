/*
Plugin: jQuery Parallax
Version 1.1.3
Author: Ian Lunn
Twitter: @IanLunn
Author URL: http://www.ianlunn.co.uk/
Plugin URL: http://www.ianlunn.co.uk/plugins/jquery-parallax/

Dual licensed under the MIT and GPL licenses:
http://www.opensource.org/licenses/mit-license.php
http://www.gnu.org/licenses/gpl.html
*/
class InfiniteSlider {
	constructor(animTime = '10000', selector = '.slider', container = '#slider-container') {
		this.slider = document.querySelector(selector)
		this.container = document.querySelector(container)
		this.width = 0
		this.oldWidth = 0
		this.duration = parseInt(animTime)
		this.start = 0
		this.refresh = 0 //0, 1, or 2, as in steps of the animation
		this._prevStop = false
		this._stop = false
		this._oldTimestamp = 0
	}
	
	animate() {
		/* fix for browsers who like to run JS before images are loaded */
		const imgs = Array.prototype.slice.call(this.slider.querySelectorAll('img'))
						.filter(img => {
							return img.naturalWidth === 0
						})
		if (imgs.length > 0) {
			window.requestAnimationFrame(this.animate.bind(this));
			return
		}
		
		/* Add another copy of the slideshow to the end, keep track of original width */
		this.oldWidth = this.slider.offsetWidth
		const sliderText = '<span class="slider-extra">' + this.slider.innerHTML + '</span>'
		this.slider.innerHTML += sliderText

		/* can have content still when we move past original slider */
		this.width = this.slider.offsetWidth
		const minWidth = 2 * screen.width

		/* Add more slideshows if needed to keep a continuous stream of content */
		while (this.width < minWidth) {
			this.slider.innerHTML += sliderText
			this.width = this.slider.width
		}
		this.slider.querySelector('.slider-extra:last-child').classList.add('slider-last')
		
		/* loop animation endlesssly (this is pretty cool) */
		window.requestAnimationFrame(this.controlAnimation.bind(this))
	}
	
	halt() {
		this._stop = true
		this._prevStop = false
	}
	
	go() {
		this._stop = false
		this._prevStop = true
	}
	
	stagnate() {
		this.container.style.overflowX = "scroll"
	}
	
	controlAnimation(timestamp) {
		//console.log('this.stop: ' + this._stop + '\nthis.prevStop: ' + this._prevStop)
		if (this._stop === true) {
			if (this._prevStop === false) {
				this.slider.style.marginLeft = getComputedStyle(this.slider).marginLeft
				this._prevStop = true
				this._oldTimestamp = timestamp
			}
		} else if (this._stop === false && this._prevStop === true) {
			this._prevStop = false
			this.start = this.start + (timestamp - this._oldTimestamp)
		} else {
			//reset animation
			if (this.refresh >= 1) {
				this.start = timestamp
				this.slider.style.marginLeft = 0
				this.refresh = 0
				window.requestAnimationFrame(this.controlAnimation.bind(this))
				return
			}
			if (timestamp - this.start >= this.duration) {
				this.refresh = 1
			}
			
			const perc = ((timestamp - (this.start)) / this.duration) * this.oldWidth
			this.slider.style.marginLeft = (-perc) + 'px'
		}
		window.requestAnimationFrame(this.controlAnimation.bind(this))
		return
	}
	
	getIeWidth() {
		this.slider.style.marginLeft = '-99999px';
	}
	
	ie11Fix() {
		this.slider.querySelector('.slider-last').style.position = 'absolute';
	}
}

function detectIE() {
	var ua = window.navigator.userAgent
	var msie = ua.indexOf('MSIE ')

	if (msie > 0) {
		// IE 10 or older => return version number
		return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10)
	}
	
	var trident = ua.indexOf('Trident/')
	if (trident > 0) {
		// IE 11 => return version number
		var rv = ua.indexOf('rv:')
		return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10)
	}

	var edge = ua.indexOf('Edge/');
	if (edge > 0) {
		// Edge (IE 12+) => return version number
		return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10)
	}

	// other browser
	return false
}


document.addEventListener('DOMContentLoaded', function() {
	const slider = new InfiniteSlider(20000)
	const ie = detectIE()
	
	//Dont animate under IE10, just place the images
	if (ie !== false && ie < 10) {
		slider.stagnate()
		return
	}
	//IE 11 and lower, fix for width *increasing* as more of the slider is shown
	if (ie !== false && ie < 12) { slider.getIeWidth() }
	
	slider.animate()
	document.querySelector('#slider-container')
		.addEventListener('mouseenter', slider.halt.bind(slider))
	document.querySelector('#slider-container')
		.addEventListener('mouseleave', slider.go.bind(slider))
	
	if (ie === 11) {
		setTimeout(slider.ie11Fix.bind(slider), 1000)
	}
});

window.onload = function () {
    var N = 1
    document.getElementById("myImg").src = "https://dl.dropboxusercontent.com/u/5791345/Alex_JS_2016/example/3-9-slideshow/images/"+N+".jpg"
        //    console.alert(N)
    
    //手動部份
    document.getElementById("prev").onclick = function () {
        if (N > 1) {
            N = N - 1
        }
        else {
            N = 11
        }
        document.getElementById("myImg").src = "https://dl.dropboxusercontent.com/u/5791345/Alex_JS_2016/example/3-9-slideshow/images/"+N+".jpg"
    }
    document.getElementById("next").onclick = NEXT;

    function NEXT() {
        if (N < 11) {
            N = N + 1
        }
        else {
            N = 1
        }
        document.getElementById("myImg").src = "https://dl.dropboxusercontent.com/u/5791345/Alex_JS_2016/example/3-9-slideshow/images/"+ N +".jpg"
    }
    
  //自動與開關部份
    
        var AutoPlay = setInterval(NEXT, 1000)
        
        document.getElementById("switch").onclick = function() {
            if (AutoPlay) {
                AutoPlay = clearInterval(AutoPlay)
                this.src = "https://dl.dropboxusercontent.com/u/5791345/Alex_JS_2016/example/3-9-slideshow/images/play.jpg"
            }
            else {
                this.src = "https://dl.dropboxusercontent.com/u/5791345/Alex_JS_2016/example/3-9-slideshow/images/pause.jpg"
                AutoPlay=1
            }
        }
    //模式切換
    document.getElementById("myPic").onmouseenter = function () {
        clearInterval(AutoPlay)
    }
    document.getElementById("myPic").onmouseleave = function () {
      if(AutoPlay) {
        clearInterval(AutoPlay)
        AutoPlay = setInterval(NEXT, 1000)
        }
    }

}    
(function( $ ){
	var $window = $(window);
	var windowHeight = $window.height();

	$window.resize(function () {
		windowHeight = $window.height();
	});

	$.fn.parallax = function(xpos, speedFactor, outerHeight) {
		var $this = $(this);
		var getHeight;
		var firstTop;
		var paddingTop = 0;
		
		//get the starting position of each element to have parallax applied to it	
		function update (){
			
			$this.each(function(){
								
				firstTop = $this.offset().top;
			});
	
			if (outerHeight) {
				getHeight = function(jqo) {
					return jqo.outerHeight(true);
				};
			} else {
				getHeight = function(jqo) {
					return jqo.height();
				};
			}
				
			// setup defaults if arguments aren't specified
			if (arguments.length < 1 || xpos === null) xpos = "50%";
			if (arguments.length < 2 || speedFactor === null) speedFactor = 0.5;
			if (arguments.length < 3 || outerHeight === null) outerHeight = true;
			
			// function to be called whenever the window is scrolled or resized
			
				var pos = $window.scrollTop();				
	
				$this.each(function(){
					var $element = $(this);
					var top = $element.offset().top;
					var height = getHeight($element);
	
					// Check if totally above or totally below viewport
					if (top + height < pos || top > pos + windowHeight) {
						return;
					}
					
					$this.css('backgroundPosition', xpos + " " + Math.round((firstTop - pos) * speedFactor) + "px");
					
				});
		}		

		$window.bind('scroll', update).resize(update);
		update();
	};
})(jQuery);







// =============================================
// Parallax Init
// =============================================
	
	jQuery(window).bind('load', function () {
	parallaxInit();						  
	});
	function parallaxInit() {
		jQuery('.parallax').each(function(){
			jQuery(this).parallax("50%", 0.5);
		});
	}