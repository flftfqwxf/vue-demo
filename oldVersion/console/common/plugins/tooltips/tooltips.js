/* Copyright (c) 2007 Paul Bakaus (paul.bakaus@googlemail.com) and Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * $LastChangedDate: 2007-07-03 02:57:07 -0400 (Tue, 03 Jul 2007) $
 * $Rev: 2216 $
 *
 * Version: 1.0rc1
 */

(function($){

// store a copy of the core height and width methods
var height = $.fn.height,
    width  = $.fn.width;

$.fn.extend({
	/**
	 * If used on document, returns the document's height (innerHeight).
	 * If used on window, returns the viewport's (window) height.
	 * See core docs on height() to see what happens when used on an element.
	 *
	 * @example $("#testdiv").height()
	 * @result 200
	 *
	 * @example $(document).height()
	 * @result 800
	 *
	 * @example $(window).height()
	 * @result 400
	 *
	 * @name height
	 * @type Number
	 * @cat Plugins/Dimensions
	 */
	height: function() {
		if ( this[0] == window )
			if ( ($.browser.mozilla || $.browser.opera) && $(document).width() > self.innerWidth)
				// mozilla and opera both return width + scrollbar width
				return self.innerHeight - getScrollbarWidth();
			else
				return self.innerHeight ||
					$.boxModel && document.documentElement.clientHeight || 
					document.body.clientHeight;
		
		if ( this[0] == document )
			return Math.max( document.body.scrollHeight, document.body.offsetHeight );
		
		return height.apply(this, arguments);
	},
	
	/**
	 * If used on document, returns the document's width (innerWidth).
	 * If used on window, returns the viewport's (window) width.
	 * See core docs on width() to see what happens when used on an element.
	 *
	 * @example $("#testdiv").width()
	 * @result 200
	 *
	 * @example $(document).width()
	 * @result 800
	 *
	 * @example $(window).width()
	 * @result 400
	 *
	 * @name width
	 * @type Number
	 * @cat Plugins/Dimensions
	 */
	width: function() {
		if ( this[0] == window )
			if (($.browser.mozilla || $.browser.opera) && $(document).height() > self.innerHeight)
				// mozilla and opera both return width + scrollbar width
				return self.innerWidth - getScrollbarWidth();
			else
				return self.innerWidth ||
					$.boxModel && document.documentElement.clientWidth ||
					document.body.clientWidth;

		if ( this[0] == document )
			if ($.browser.mozilla) {
				// mozilla reports scrollWidth and offsetWidth as the same
				var scrollLeft = self.pageXOffset;
				self.scrollTo(99999999, self.pageYOffset);
				var scrollWidth = self.pageXOffset;
				self.scrollTo(scrollLeft, self.pageYOffset);
				return document.body.offsetWidth + scrollWidth;
			}
			else 
				return Math.max( document.body.scrollWidth, document.body.offsetWidth );

		return width.apply(this, arguments);
	},
	
	/**
	 * Returns the inner height value (without the border) for the first matched element.
	 * If used on document, returns the document's height (innerHeight).
	 * If used on window, returns the viewport's (window) height.
	 *
	 * @example $("#testdiv").innerHeight()
	 * @result 210
	 *
	 * @name innerHeight
	 * @type Number
	 * @cat Plugins/Dimensions
	 */
	innerHeight: function() {
		return this[0] == window || this[0] == document ?
			this.height() :
			this.is(':visible') ?
				this[0].offsetHeight - num(this, 'borderTopWidth') - num(this, 'borderBottomWidth') :
				this.height() + num(this, 'paddingTop') + num(this, 'paddingBottom');
	},
	
	/**
	 * Returns the inner width value (without the border) for the first matched element.
	 * If used on document, returns the document's width (innerWidth).
	 * If used on window, returns the viewport's (window) width.
	 *
	 * @example $("#testdiv").innerWidth()
	 * @result 210
	 *
	 * @name innerWidth
	 * @type Number
	 * @cat Plugins/Dimensions
	 */
	innerWidth: function() {
		return this[0] == window || this[0] == document ?
			this.width() :
			this.is(':visible') ?
				this[0].offsetWidth - num(this, 'borderLeftWidth') - num(this, 'borderRightWidth') :
				this.width() + num(this, 'paddingLeft') + num(this, 'paddingRight');
	},
	
	/**
	 * Returns the outer height value (including the border) for the first matched element.
	 * If used on document, returns the document's height (innerHeight).
	 * If used on window, returns the viewport's (window) height.
	 *
	 * @example $("#testdiv").outerHeight()
	 * @result 220
	 *
	 * @name outerHeight
	 * @type Number
	 * @cat Plugins/Dimensions
	 */
	outerHeight: function() {
		return this[0] == window || this[0] == document ?
			this.height() :
			this.is(':visible') ?
				this[0].offsetHeight :
				this.height() + num(this,'borderTopWidth') + num(this, 'borderBottomWidth') + num(this, 'paddingTop') + num(this, 'paddingBottom');
	},
	
	/**
	 * Returns the outer width value (including the border) for the first matched element.
	 * If used on document, returns the document's width (innerWidth).
	 * If used on window, returns the viewport's (window) width.
	 *
	 * @example $("#testdiv").outerHeight()
	 * @result 1000
	 *
	 * @name outerHeight
	 * @type Number
	 * @cat Plugins/Dimensions
	 */
	outerWidth: function() {
		return this[0] == window || this[0] == document ?
			this.width() :
			this.is(':visible') ?
				this[0].offsetWidth :
				this.width() + num(this, 'borderLeftWidth') + num(this, 'borderRightWidth') + num(this, 'paddingLeft') + num(this, 'paddingRight');
	},
	
	/**
	 * Returns how many pixels the user has scrolled to the right (scrollLeft).
	 * Works on containers with overflow: auto and window/document.
	 *
	 * @example $(window).scrollLeft()
	 * @result 100
	 *
	 * @example $(document).scrollLeft()
	 * @result 100
	 * 
	 * @example $("#testdiv").scrollLeft()
	 * @result 100
	 *
	 * @name scrollLeft
	 * @type Number
	 * @cat Plugins/Dimensions
	 */
	/**
	 * Sets the scrollLeft property for each element and continues the chain.
	 * Works on containers with overflow: auto and window/document.
	 *
	 * @example $(window).scrollLeft(100).scrollLeft()
	 * @result 100
	 * 
	 * @example $(document).scrollLeft(100).scrollLeft()
	 * @result 100
	 *
	 * @example $("#testdiv").scrollLeft(100).scrollLeft()
	 * @result 100
	 *
	 * @name scrollLeft
	 * @param Number value A positive number representing the desired scrollLeft.
	 * @type jQuery
	 * @cat Plugins/Dimensions
	 */
	scrollLeft: function(val) {
		if ( val != undefined )
			// set the scroll left
			return this.each(function() {
				if (this == window || this == document)
					window.scrollTo( val, $(window).scrollTop() );
				else
					this.scrollLeft = val;
			});
		
		// return the scroll left offest in pixels
		if ( this[0] == window || this[0] == document )
			return self.pageXOffset ||
				$.boxModel && document.documentElement.scrollLeft ||
				document.body.scrollLeft;
				
		return this[0].scrollLeft;
	},
	
	/**
	 * Returns how many pixels the user has scrolled to the bottom (scrollTop).
	 * Works on containers with overflow: auto and window/document.
	 *
	 * @example $(window).scrollTop()
	 * @result 100
	 *
	 * @example $(document).scrollTop()
	 * @result 100
	 * 
	 * @example $("#testdiv").scrollTop()
	 * @result 100
	 *
	 * @name scrollTop
	 * @type Number
	 * @cat Plugins/Dimensions
	 */
	/**
	 * Sets the scrollTop property for each element and continues the chain.
	 * Works on containers with overflow: auto and window/document.
	 *
	 * @example $(window).scrollTop(100).scrollTop()
	 * @result 100
	 * 
	 * @example $(document).scrollTop(100).scrollTop()
	 * @result 100
	 *
	 * @example $("#testdiv").scrollTop(100).scrollTop()
	 * @result 100
	 *
	 * @name scrollTop
	 * @param Number value A positive number representing the desired scrollTop.
	 * @type jQuery
	 * @cat Plugins/Dimensions
	 */
	scrollTop: function(val) {
		if ( val != undefined )
			// set the scroll top
			return this.each(function() {
				if (this == window || this == document)
					window.scrollTo( $(window).scrollLeft(), val );
				else
					this.scrollTop = val;
			});
		
		// return the scroll top offset in pixels
		if ( this[0] == window || this[0] == document )
			return self.pageYOffset ||
				$.boxModel && document.documentElement.scrollTop ||
				document.body.scrollTop;

		return this[0].scrollTop;
	},
	
	/** 
	 * Returns the top and left positioned offset in pixels.
	 * The positioned offset is the offset between a positioned
	 * parent and the element itself.
	 *
	 * For accurate readings make sure to use pixel values for margins, borders and padding.
	 *
	 * @example $("#testdiv").position()
	 * @result { top: 100, left: 100 }
	 *
	 * @example var position = {};
	 * $("#testdiv").position(position)
	 * @result position = { top: 100, left: 100 }
	 * 
	 * @name position
	 * @param Object returnObject Optional An object to store the return value in, so as not to break the chain. If passed in the
	 *                            chain will not be broken and the result will be assigned to this object.
	 * @type Object
	 * @cat Plugins/Dimensions
	 */
	position: function(returnObject) {
		var offsetParent = this[0].offsetParent;
		if ($.browser.msie && (offsetParent.tagName != 'BODY' && $.css(offsetParent, 'position') == 'static')) {
			do {
				offsetParent = offsetParent.offsetParent;
			} while (offsetParent && (offsetParent.tagName != 'BODY' && $.css(offsetParent, 'position') == 'static'));
		}
		return this.offset({ margin: false, scroll: false, relativeTo: offsetParent }, returnObject);
	},
	
	/**
	 * Returns the location of the element in pixels from the top left corner of the viewport.
	 * The offset method takes an optional map of key value pairs to configure the way
	 * the offset is calculated. Here are the different options.
	 *
	 * (Boolean) margin - Should the margin of the element be included in the calculations? True by default.
	 * (Boolean) border - Should the border of the element be included in the calculations? False by default. 
	 * (Boolean) padding - Should the padding of the element be included in the calcuations? False by default. 
	 * (Boolean) scroll - Sould the scroll offsets of the parent elements be included int he calculations? True by default.
	 *                    When true it adds the total scroll offsets of all parents to the total offset and also adds two
	 *                    properties to the returned object, scrollTop and scrollLeft.
	 * (Boolean) lite - When true it will use the offsetLite method instead of the full-blown, slower offset method. False by default.
	 *                  Only use this when margins, borders and padding calculations don't matter.
	 * (HTML Element) relativeTo - This should be a parent of the element and should have position (like absolute or relative).
	 *                             It will retreieve the offset relative to this parent element. By default it is the body element.
	 *
	 * Also an object can be passed as the second paramater to
	 * catch the value of the return and continue the chain.
	 *
	 * For accurate readings make sure to use pixel values for margins, borders and padding.
	 * 
	 * Known issues:
	 *  - Issue: A div positioned relative or static without any content before it and its parent will report an offsetTop of 0 in Safari
	 *    Workaround: Place content before the relative div ... and set height and width to 0 and overflow to hidden
	 *
	 * @example $("#testdiv").offset()
	 * @result { top: 100, left: 100, scrollTop: 10, scrollLeft: 10 }
	 *
	 * @example $("#testdiv").offset({ scroll: false })
	 * @result { top: 90, left: 90 }
	 *
	 * @example var offset = {}
	 * $("#testdiv").offset({ scroll: false }, offset)
	 * @result offset = { top: 90, left: 90 }
	 *
	 * @name offset
	 * @param Map options Optional settings to configure the way the offset is calculated.
	 * @param Object returnObject An object to store the return value in, so as not to break the chain. If passed in the
	 *                            chain will not be broken and the result will be assigned to this object.
	 * @type Object
	 * @cat Plugins/Dimensions
	 */
	offset: function(options, returnObject) {
		var x = 0, y = 0, sl = 0, st = 0,
		    elem = this[0], parent = this[0], op, parPos, elemPos = $.css(elem, 'position'),
		    mo = $.browser.mozilla, ie = $.browser.msie, sf = $.browser.safari, oa = $.browser.opera,
		    absparent = false, relparent = false, 
		    options = $.extend({ margin: true, border: false, padding: false, scroll: true, lite: false, relativeTo: document.body }, options || {});
		
		// Use offsetLite if lite option is true
		if (options.lite) return this.offsetLite(options, returnObject);
		
		if (elem.tagName == 'BODY') {
			// Safari is the only one to get offsetLeft and offsetTop properties of the body "correct"
			// Except they all mess up when the body is positioned absolute or relative
			x = elem.offsetLeft;
			y = elem.offsetTop;
			// Mozilla ignores margin and subtracts border from body element
			if (mo) {
				x += num(elem, 'marginLeft') + (num(elem, 'borderLeftWidth')*2);
				y += num(elem, 'marginTop')  + (num(elem, 'borderTopWidth') *2);
			} else
			// Opera ignores margin
			if (oa) {
				x += num(elem, 'marginLeft');
				y += num(elem, 'marginTop');
			} else
			// IE does not add the border in Standards Mode
			if (ie && jQuery.boxModel) {
				x += num(elem, 'borderLeftWidth');
				y += num(elem, 'borderTopWidth');
			}
		} else {
			do {
				parPos = $.css(parent, 'position');
			
				x += parent.offsetLeft;
				y += parent.offsetTop;

				// Mozilla and IE do not add the border
				if (mo || ie) {
					// add borders to offset
					x += num(parent, 'borderLeftWidth');
					y += num(parent, 'borderTopWidth');

					// Mozilla does not include the border on body if an element isn't positioned absolute and is without an absolute parent
					if (mo && parPos == 'absolute') absparent = true;
					// IE does not include the border on the body if an element is position static and without an absolute or relative parent
					if (ie && parPos == 'relative') relparent = true;
				}

				op = parent.offsetParent;
				if (options.scroll || mo) {
					do {
						if (options.scroll) {
							// get scroll offsets
							sl += parent.scrollLeft;
							st += parent.scrollTop;
						}
				
						// Mozilla does not add the border for a parent that has overflow set to anything but visible
						if (mo && parent != elem && $.css(parent, 'overflow') != 'visible') {
							x += num(parent, 'borderLeftWidth');
							y += num(parent, 'borderTopWidth');
						}
				
						parent = parent.parentNode;
					} while (parent != op);
				}
				parent = op;

				// exit the loop if we are at the relativeTo option but not if it is the body or html tag
				if (parent == options.relativeTo && !(parent.tagName == 'BODY' || parent.tagName == 'HTML'))  {
					// Mozilla does not add the border for a parent that has overflow set to anything but visible
					if (mo && parent != elem && $.css(parent, 'overflow') != 'visible') {
						x += num(parent, 'borderLeftWidth');
						y += num(parent, 'borderTopWidth');
					}
					// Safari and opera includes border on positioned parents
					if (($.browser.safari || $.browser.opera) && $.css(op, 'position') != 'static') {
						x -= num(op, 'borderLeftWidth');
						y -= num(op, 'borderTopWidth');
					}
					break;
				}
				if (parent.tagName == 'BODY' || parent.tagName == 'HTML') {
					// Safari and IE Standards Mode doesn't add the body margin for elments positioned with static or relative
					if ((sf || (ie && $.boxModel)) && elemPos != 'absolute' && elemPos != 'fixed') {
						x += num(parent, 'marginLeft');
						y += num(parent, 'marginTop');
					}
					// Mozilla does not include the border on body if an element isn't positioned absolute and is without an absolute parent
					// IE does not include the border on the body if an element is positioned static and without an absolute or relative parent
					if ( (mo && !absparent && elemPos != 'fixed') || 
					     (ie && elemPos == 'static' && !relparent) ) {
						x += num(parent, 'borderLeftWidth');
						y += num(parent, 'borderTopWidth');
					}
					break; // Exit the loop
				}
			} while (parent);
		}

		var returnValue = handleOffsetReturn(elem, options, x, y, sl, st);

		if (returnObject) { $.extend(returnObject, returnValue); return this; }
		else              { return returnValue; }
	},
	
	/**
	 * Returns the location of the element in pixels from the top left corner of the viewport.
	 * This method is much faster than offset but not as accurate when borders and margins are
	 * on the element and/or its parents. This method can be invoked
	 * by setting the lite option to true in the offset method.
	 * The offsetLite method takes an optional map of key value pairs to configure the way
	 * the offset is calculated. Here are the different options.
	 *
	 * (Boolean) margin - Should the margin of the element be included in the calculations? True by default.
	 * (Boolean) border - Should the border of the element be included in the calculations? False by default. 
	 * (Boolean) padding - Should the padding of the element be included in the calcuations? False by default. 
	 * (Boolean) scroll - Sould the scroll offsets of the parent elements be included int he calculations? True by default.
	 *                    When true it adds the total scroll offsets of all parents to the total offset and also adds two
	 *                    properties to the returned object, scrollTop and scrollLeft.
	 * (HTML Element) relativeTo - This should be a parent of the element and should have position (like absolute or relative).
	 *                             It will retreieve the offset relative to this parent element. By default it is the body element.
	 *
	 * @name offsetLite
	 * @param Map options Optional settings to configure the way the offset is calculated.
	 * @param Object returnObject An object to store the return value in, so as not to break the chain. If passed in the
	 *                            chain will not be broken and the result will be assigned to this object.
	 * @type Object
	 * @cat Plugins/Dimensions
	 */
	offsetLite: function(options, returnObject) {
		var x = 0, y = 0, sl = 0, st = 0, parent = this[0], offsetParent, 
		    options = $.extend({ margin: true, border: false, padding: false, scroll: true, relativeTo: document.body }, options || {});
				
		do {
			x += parent.offsetLeft;
			y += parent.offsetTop;

			offsetParent = parent.offsetParent;
			if (options.scroll) {
				// get scroll offsets
				do {
					sl += parent.scrollLeft;
					st += parent.scrollTop;
					parent = parent.parentNode;
				} while(parent != offsetParent);
			}
			parent = offsetParent;
		} while (parent && parent.tagName != 'BODY' && parent.tagName != 'HTML' && parent != options.relativeTo);

		var returnValue = handleOffsetReturn(this[0], options, x, y, sl, st);

		if (returnObject) { $.extend(returnObject, returnValue); return this; }
		else              { return returnValue; }
	}
});

/**
 * Handles converting a CSS Style into an Integer.
 * @private
 */
var num = function(el, prop) {
	return parseInt($.css(el.jquery?el[0]:el,prop))||0;
};

/**
 * Handles the return value of the offset and offsetLite methods.
 * @private
 */
var handleOffsetReturn = function(elem, options, x, y, sl, st) {
	if ( !options.margin ) {
		x -= num(elem, 'marginLeft');
		y -= num(elem, 'marginTop');
	}

	// Safari and Opera do not add the border for the element
	if ( options.border && ($.browser.safari || $.browser.opera) ) {
		x += num(elem, 'borderLeftWidth');
		y += num(elem, 'borderTopWidth');
	} else if ( !options.border && !($.browser.safari || $.browser.opera) ) {
		x -= num(elem, 'borderLeftWidth');
		y -= num(elem, 'borderTopWidth');
	}

	if ( options.padding ) {
		x += num(elem, 'paddingLeft');
		y += num(elem, 'paddingTop');
	}
	
	// do not include scroll offset on the element
	if ( options.scroll ) {
		sl -= elem.scrollLeft;
		st -= elem.scrollTop;
	}

	return options.scroll ? { top: y - st, left: x - sl, scrollTop:  st, scrollLeft: sl }
	                      : { top: y, left: x };
};

var scrollbarWidth = 0;
var getScrollbarWidth = function() {
	if (!scrollbarWidth) {
		var testEl = $('<div>')
				.css({
					width: 100,
					height: 100,
					overflow: 'auto',
					position: 'absolute',
					top: -1000,
					left: -1000
				})
				.appendTo('body');
		scrollbarWidth = 100 - testEl
			.append('<div>')
			.find('div')
				.css({
					width: '100%',
					height: 200
				})
				.width();
		testEl.remove();
	}
	return scrollbarWidth;
};

})(jQuery);
/**
* hoverIntent is similar to jQuery's built-in "hover" function except that
* instead of firing the onMouseOver event immediately, hoverIntent checks
* to see if the user's mouse has slowed down (beneath the sensitivity
* threshold) before firing the onMouseOver event.
* 
* hoverIntent r5 // 2007.03.27 // jQuery 1.1.2
* <http://cherne.net/brian/resources/jquery.hoverIntent.html>
* 
* hoverIntent is currently available for use in all personal or commercial 
* projects under both MIT and GPL licenses. This means that you can choose 
* the license that best suits your project, and use it accordingly.
* 
* // basic usage (just like .hover) receives onMouseOver and onMouseOut functions
* $("ul li").hoverIntent( showNav , hideNav );
* 
* // advanced usage receives configuration object only
* $("ul li").hoverIntent({
*	sensitivity: 2, // number = sensitivity threshold (must be 1 or higher)
*	interval: 50,   // number = milliseconds of polling interval
*	over: showNav,  // function = onMouseOver callback (required)
*	timeout: 100,   // number = milliseconds delay before onMouseOut function call
*	out: hideNav    // function = onMouseOut callback (required)
* });
* 
* @param  f  onMouseOver function || An object with configuration options
* @param  g  onMouseOut function  || Nothing (use configuration options object)
* @return    The object (aka "this") that called hoverIntent, and the event object
* @author    Brian Cherne <brian@cherne.net>
*/
(function($) {
	$.fn.hoverIntent = function(f,g) {
		// default configuration options
		var cfg = {
			sensitivity: 7,
			interval: 100,
			timeout: 0
		};
		// override configuration options with user supplied object
		cfg = $.extend(cfg, g ? { over: f, out: g } : f );

		// instantiate variables
		// cX, cY = current X and Y position of mouse, updated by mousemove event
		// pX, pY = previous X and Y position of mouse, set by mouseover and polling interval
		var cX, cY, pX, pY;

		// A private function for getting mouse position
		var track = function(ev) {
			cX = ev.pageX;
			cY = ev.pageY;
		};

		// A private function for comparing current and previous mouse position
		var compare = function(ev,ob) {
			ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
			// compare mouse positions to see if they've crossed the threshold
			if ( ( Math.abs(pX-cX) + Math.abs(pY-cY) ) < cfg.sensitivity ) {
				$(ob).unbind("mousemove",track);
				// set hoverIntent state to true (so mouseOut can be called)
				ob.hoverIntent_s = 1;
				return cfg.over.apply(ob,[ev]);
			} else {
				// set previous coordinates for next time
				pX = cX; pY = cY;
				// use self-calling timeout, guarantees intervals are spaced out properly (avoids JavaScript timer bugs)
				ob.hoverIntent_t = setTimeout( function(){compare(ev, ob);} , cfg.interval );
			}
		};

		// A private function for delaying the mouseOut function
		var delay = function(ev,ob) {
			ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
			ob.hoverIntent_s = 0;
			return cfg.out.apply(ob,[ev]);
		};

		// A private function for handling mouse 'hovering'
		var handleHover = function(e) {
			// next three lines copied from jQuery.hover, ignore children onMouseOver/onMouseOut
			var p = (e.type == "mouseover" ? e.fromElement : e.toElement) || e.relatedTarget;
			while ( p && p != this ) { try { p = p.parentNode; } catch(e) { p = this; } }
			if ( p == this ) { return false; }

			// copy objects to be passed into t (required for event object to be passed in IE)
			var ev = jQuery.extend({},e);
			var ob = this;

			// cancel hoverIntent timer if it exists
			if (ob.hoverIntent_t) { ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t); }

			// else e.type == "onmouseover"
			if (e.type == "mouseover") {
				// set "previous" X and Y position based on initial entry point
				pX = ev.pageX; pY = ev.pageY;
				// update "current" X and Y position based on mousemove
				$(ob).bind("mousemove",track);
				// start polling interval (self-calling timeout) to compare mouse coordinates over time
				if (ob.hoverIntent_s != 1) { ob.hoverIntent_t = setTimeout( function(){compare(ev,ob);} , cfg.interval );}

			// else e.type == "onmouseout"
			} else {
				// unbind expensive mousemove event
				$(ob).unbind("mousemove",track);
				// if hoverIntent state is true, then call the mouseOut function after the specified delay
				if (ob.hoverIntent_s == 1) { ob.hoverIntent_t = setTimeout( function(){delay(ev,ob);} , cfg.timeout );}
			}
		};

		// bind the function to the two event listeners
		return this.mouseover(handleHover).mouseout(handleHover);
	};
})(jQuery);
/*
 * jQuery clueTip plugin
 * Version 0.7  (07/15/2007)
 * @depends jQuery v1.1.1
 * @depends Dimensions plugin 
 *
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 *
 * @name clueTip
 * @type jQuery
 * @cat Plugins/tooltip
 * @return jQuery
 * @author Karl Swedberg
 */
 
 /*
 * @credit Inspired by Cody Lindley's jTip (http://www.codylindley.com)
 * @credit Thanks to Shelane Enos for the feature ideas 
 * @credit Thanks to Glen Lipka, and Jörn Zaefferer for their expert advice
 * @credit Thanks to Jonathan Chaffer, as always, for help with the hard parts. :-)
 */

 /**
 * 
 * Displays a highly customizable tooltip when the user hovers (default) or clicks (optional) the matched element. 
 * By default, the clueTip plugin loads a page indicated by the "rel" attribute via ajax and displays its contents.
 * If a "title" attribute is specified, its value is used as the clueTip's heading.
 * The attribute to be used for both the body and the heading of the clueTip is user-configurable. 
 * Optionally, the clueTip's body can display content from an element on the same page.
 * * Just indicate the element's id (e.g. "#some-id") in the rel attribute.
 * Optionally, the clueTip's body can display content from the title attribute, when a delimiter is indicated. 
 * * The string before the first instance of the delimiter is set as the clueTip's heading.
 * * All subsequent strings are wrapped in separate DIVs and placed in the clueTip's body.
 * The clueTip plugin allows for many, many more options. Pleasee see the examples and the option descriptions below...
 * 
 * 
 * @example $('#tip).cluetip();
 * @desc This is the most basic clueTip. It displays a 275px-wide clueTip on mouseover of the element with an ID of "tip." On mouseout, the clueTip is hidden.
 *
 *
 * @example $('a.clue').cluetip({
 *  hoverClass: 'highlight',
 *  sticky: true,
 *  closePosition: 'bottom',
 *  closeText: '<img src="cross.png" alt="close" />',
 *  truncate: 60,
 *  ajaxSettings: {
 *    type: 'POST'
 *  }
 * });
 * @desc Displays a clueTip on mouseover of all <a> elements with class="clue". The hovered element gets a class of "highlight" added to it (so that it can be styled appropriately. This is esp. useful for non-anchor elements.). The clueTip is "sticky," which means that it will not be hidden until the user either clicks on its "close" text/graphic or displays another clueTip. The "close" text/graphic is set to diplay at the bottom of the clueTip (default is top) and display an image rather than the default "Close" text. Moreover, the body of the clueTip is truncated to the first 60 characters, which are followed by an ellipsis (...). Finally, the clueTip retrieves the content using POST rather than the $.ajax method's default "GET."
 * 
 *
 *
 * @param Object defaults (optional) Customize your clueTips
 * @option Number width: default is 275. The width of the clueTip
 * @option Boolean local: default is false. Whether to use content from the same page (using ID) for clueTip body
 * @option Boolean hideLocal: default is true. If local option is set to true, determine whether local content to be shown in clueTip should be hidden at its original location. 
 * @option String attribute default is 'rel'. The attribute to be used for the URL of the ajaxed content
 * @option String titleAttribute: default is 'title'. The attribute to be used for the clueTip's heading, if the attribute exists for the hovered element.
 * @option String splitTitle: default is '' (empty string). A character used to split the title attribute into the clueTip title and divs within the clueTip body; if used, the clueTip will be populated only by the title attribute, 
 * @option String hoverClass: default is empty string. designate one to apply to the hovered element
 * @option String waitImage: default is 'wait.gif'
 * @option Boolean sticky: default is false. Set to true to keep the clueTip visible until the user either closes it manually by clicking on the CloseText or display another clueTip.
 * @option String activation: default is 'hover'. Set to 'toggle' to force the user to click the element in order to activate the clueTip.
 * @option String closePosition: default is 'top'. Set to 'bottom' to put the closeText at the bottom of the clueTip body
 * @option String closeText: default is 'Close'. This determines the text to be clicked to close a clueTip when sticky is set to true.
 * @option Number truncate: default is 0. Set to some number greater than 0 to truncate the text in the body of the clueTip. This also removes all HTML/images from the clueTip body.
 * @option Boolean hoverIntent: default is true. If jquery.hoverintent.js plugin is included in <head>, hoverIntent() will be used instead of hover()
 * @option Boolean arrows: Default is false. Sets background-position-y to line up an arrow background image with the hovered element.
 * @option Boolean dropShadow: Default is true. Adds a drop shadow to the clueTip. Default is true
 * @option Object ajaxProcess: Default is function(data) { data = $(data).not('style, meta, link, script, title); return data; } . When getting clueTip content via ajax, allows processing of it before it's displayed. The default value strips out elements typically found in the <head> that might interfere with current page.
 * @option Object ajaxSettings: allows you to pass in standard $.ajax() parameters for specifying dataType, error, success, etc. Default is { dataType: 'html'}
 *
 */

(function($) { 
    
  var $cluetip, $cluetipInner, $cluetipOuter, $cluetipTitle, $dropShadow;
  var msie6 = $.browser.msie && ($.browser.version && $.browser.version < 7 || (/5\.5|6.0/).test(navigator.userAgent));

  $.fn.cluetip = function(options) {
    
    // set up default options
    var defaults = {
      width: 275,
      local: false,
      hideLocal: true,
      attribute: 'rel',
      titleAttribute: 'title',
      splitTitle: '',
      hoverClass: '',
      waitImage: 'wait.gif',
      sticky: false,
      activation: 'hover',
      closePosition: 'top',
      closeText: 'Close',
      truncate: 0,
      fx: {
        open: 'fadeIn',
        openSpeed: 'fast',
        close: 'hide',
        closeSpeed: ''
      },
      arrows: false, // CHANGE THIS TO true IF YOU WANT jTip-STYLE ARROWS FOR ALL clueTips
      dropShadow: true,
      hoverIntent: true,
      ajaxProcess: function(data) {
        data = $(data).not('style, meta, link, script, title');
        return data;
      },
      ajaxSettings: {
        dataType: 'html'
      }
    };
    
    if (options && options.ajaxSettings) {
      $.extend(defaults.ajaxSettings, options.ajaxSettings);
      delete options.ajaxSettings;
    }
    
    $.extend(defaults, options);
    
    return this.each(function() {
      // start out with no contents (for ajax activation)
      var cluetipContents = false;

      // create the cluetip divs
      if (!$cluetip) {
        $cluetipInner = $('<div id="cluetip-inner"></div>');
        $cluetipTitle = $('<h3 id="cluetip-title"></h3>');        
        $cluetipOuter = $('<div id="cluetip-outer"></div>').append($cluetipInner).prepend($cluetipTitle);
        $cluetip = $('<div></div>')
          .attr({'id': 'cluetip'})
          .css({zIndex: 1002})
        .append($cluetipOuter)
        .appendTo('body')
        .hide();
        $('<img src="' + defaults.waitImage + '" />')
          .attr({'id': 'cluetip-waitimage'})
          .css({position: 'absolute', zIndex: 1001})
        .appendTo('body')
        .hide();
        var cluezIndex = $cluetip.css('zIndex') != 'auto' ? parseInt($cluetip.css('zIndex'), 10) : 1002;
        $cluetip.css({position: 'absolute', zIndex: cluezIndex});
        $cluetipOuter.css({position: 'relative', zIndex: +cluezIndex+1});
      }
      if (!$dropShadow && defaults.dropShadow) {
        $dropShadow = $([]);
        var dropShadowSteps = 6;
        for (var i=0; i < dropShadowSteps; i++) {
          $dropShadow = $dropShadow.add($('<div></div>').css({zIndex: +cluezIndex-i-1, opacity:.1, top: 1+i, left: 1+i}));
        };
        $dropShadow.css({position: 'absolute', backgroundColor: '#000'})
          .prependTo($cluetip);
      }

      var $this = $(this);      
      var tipAttribute = $this.attr(defaults.attribute);
      if (!tipAttribute && !defaults.splitTitle) return true;
      // if hideLocal is set to true, initially hide the local content that will be displayed in the clueTip
      if (defaults.local && defaults.hideLocal) { $(tipAttribute).hide(); }
      // vertical measurement variables
      var tipHeight, wHeight;
      var sTop, offTop, posY;
      // horizontal measurement variables
      var tipWidth = parseInt(defaults.width, 10);
      var offWidth = this.offsetWidth;
      var offLeft, posX, winWidth;
      
      // parse the title
      var tipParts,
       tipTitle = (defaults.attribute != 'title') ? $this.attr(defaults.titleAttribute) : '';
      if (defaults.splitTitle) {
        tipParts = tipTitle.split(defaults.splitTitle);
        tipTitle = tipParts.shift();
      }
      var localContent;
      
// close cluetip and reset title attribute if one exists
      var cluetipClose = function() {
        $cluetipOuter 
        .parent()[defaults.fx.close](defaults.fx.closeSpeed).end()
        .children().empty();
        if (tipTitle) {
          $this.attr('title', tipTitle);
        }
      };

// get dimensions and options for cluetip and prepare it to be shown
      var cluetipShow = function(bpY) {
        if ($this.css('display') == 'block' || $this[0].tagName.toLowerCase() == 'area') {
          $cluetip.css({top: (bpY - 10) + 'px'});
        }
        else {
          $cluetip.css({top: posY + 'px'});
        }
        if (defaults.truncate) {
          var $truncloaded = $cluetipInner.text().slice(0,defaults.truncate) + '...';
          $cluetipInner.html($truncloaded);
        }
        tipTitle ? $cluetipTitle.show().html(tipTitle) : $cluetipTitle.hide();

        if (defaults.sticky) {
          var $closeLink = $('<span id="cluetip-close"><a href="#">' + defaults.closeText + '</a></span>');
          (defaults.closePosition == 'bottom') ? $closeLink.css('display','block').appendTo($cluetipInner) : $closeLink.css('display','block').prependTo($cluetipInner);
          $closeLink.click(function() {
            cluetipClose();
            return false;
          });
        }
        tipHeight = $cluetip.outerHeight();
        if (defaults.dropShadow) $dropShadow.show().css({height: tipHeight, width: defaults.width});
        if ( posY + tipHeight > sTop + wHeight ) {
          if (tipHeight >= wHeight) {
            $cluetip.css({top: (sTop) + 'px'});            
          } else {
            $cluetip.css({top: (sTop + wHeight - tipHeight - 10) + 'px'});
          }
        } 
        if (defaults.arrows) {
          var bgPos = '0 0';
          var bgY = (posY - parseInt($cluetip.css('top'), 10)) + 'px';
          if ($cluetip.is('.clue-left')) {
            bgPos = $this.css('display') != 'block' && posX >=0 ? '100% ' + bgY : '100% 0';
          } else if ($cluetip.is('.clue-right')) {
            bgPos = $this.css('display') != 'block' && posX >=0 ? '0 ' + bgY : '0 0';
          }
          $cluetip.css({backgroundPosition: bgPos});
        }
       
        $cluetip.hide()[defaults.fx.open](defaults.fx.openSpeed);
      };

/***************************************      
* ACTIVATION
****************************************/

// activate by click
    if (defaults.activation == 'click'||defaults.activation == 'toggle') {
      $this.toggle(function(event) {
        activate(event);
        this.blur();
        return false;
      }, function(event) {
        inactivate(event);
        this.blur();
        return false;
      });
// activate by hover
  // clicking is returned false if cluetip url is same as href url
    } else {
      $this.click(function() {
        if (tipAttribute == $this.attr('href')) {
          return false;
        }
      });
    
      $this[($.fn.hoverIntent) && defaults.hoverIntent ? 'hoverIntent' : 'hover'](function(event) {
        activate(event);
      }, function(event) {
        inactivate(event);
      });
    }
    
//activate clueTip
      var activate = function(event) {
        if (tipAttribute == $this.attr('href')) {
          $this.css('cursor', 'help');
        }
        if (tipTitle) {
          $this.removeAttr('title');          
        }
        if (defaults.hoverClass) {
          $this.addClass(defaults.hoverClass);
        }
        if ($this[0].tagName.toLowerCase() != 'area') {
          sTop = $(document).scrollTop();
          offTop = $this.offset().top;
          offLeft = $this.offset().left;
          winWidth = $(window).width();
          posX = (offWidth > offLeft && offLeft > tipWidth)
            || offLeft + offWidth + tipWidth > winWidth 
            ? offLeft - tipWidth - 15 
            : offWidth + offLeft + 15;
          posY = offTop;
        }
        $cluetip.css({width: defaults.width});

        if ($this.css('display') != 'block' && posX >=0 && $this[0].tagName.toLowerCase() != 'area') {
          $cluetip.css({left: posX + 'px'});
          posX < offLeft ? $cluetip.addClass('clue-left').removeClass('clue-right')
          : $cluetip.addClass('clue-right').removeClass('clue-left');
          
        } else {
          if (event.pageX + tipWidth > winWidth) {
            $cluetip.css({left: (event.pageX - tipWidth - 30) + 'px'})
            .addClass('clue-left').removeClass('clue-right');
          } else {
            $cluetip.css({left: (event.pageX + 30) + 'px'})
            .addClass('clue-right').removeClass('clue-left');
          }
          var pY = event.pageY;
        }
        wHeight = $(window).height();

/***************************************
* load the title attribute only (or user-selected attribute). 
* clueTip title is the string before the first delimiter
* subsequent delimiters place clueTip body text on separate lines
***************************************/
        if (tipParts) {
          for (var i=0; i < tipParts.length; i++){
            if (i == 0) {
              $cluetipInner.html(tipParts[i]);
            } else { 
              $cluetipInner.append('<div class="split-body">' + tipParts[i] + '</div>');
            }            
          };
          cluetipShow(pY);

/***************************************
* load external file via ajax          
***************************************/
        } else if (!defaults.local && tipAttribute.indexOf('#') != 0) {
          if (cluetipContents) {
            $cluetipInner.html(cluetipContents);
            cluetipShow(pY);
          }
          else {
            var ajaxSettings = defaults.ajaxSettings;
            ajaxSettings.url = tipAttribute;
            ajaxSettings.beforeSend = function() {
              $('#cluetip-waitimage')
                .css({top: posY, left: posX+(tipWidth/2)})
              .show();
            };
            ajaxSettings.success = function(data) {
              cluetipContents = defaults.ajaxProcess(data);
              $cluetipInner.html(cluetipContents);
              cluetipShow(pY);
              $('#cluetip-waitimage').hide();
            };
            $.ajax(ajaxSettings);
          }

/***************************************
* load an element from the same page
***************************************/
        } else if (defaults.local && tipAttribute.indexOf('#') == 0){
          var localContent = $(tipAttribute).html();
          $cluetipInner.html(localContent);
          cluetipShow(pY);
        }
      };
 // on mouseout...    
      var inactivate = function() {
        if (!defaults.sticky) {
          cluetipClose();
        };
        if (defaults.hoverClass) {
          $this.removeClass(defaults.hoverClass);
        }
      };
      
    });
  };  
  
})(jQuery);