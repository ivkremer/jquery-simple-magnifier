// Fill free to use this jQuery plugin in any projects you want
// while keeping the comment below on top of the script.
// Don't forget not to remove it from a minimised version also.

/**
 * jquery.simple-magnifier: jquery smagnifier plugin | (c) 2013 Ilya Kremer
 * MIT license http://www.opensource.org/licenses/mit-license.php
 */

// Thank you!
/**
 * @param {Object} $ jQuery reference
 * @param {HTMLDocument} document
 * @returns {undefined}
 */
(function($, document) {
	$.fn.smagnifier = function(options) {
		var p = $.extend(true, {}, $.fn.smagnifier.defaults, options);
		var prefix = p.prefix;

		function onClick($span) {
			build($span);
		}

		/**
		 * Thanks to Russ Painter and Yu-Jie Lin:
		 * https://github.com/jquery-textfill/jquery-textfill
		 * http://stackoverflow.com/questions/687998
		 * @param $div jQuery object
		 */
		function textFill($div) {
			var text = $div.text();
			var $span = $('<span />');
			$div.empty().append($span);

            var $shadow = $('<div id="' + prefix + 'shadow"></div>').css({
                width: $div.width(),
                height: $div.height(),
                position: 'absolute',
                top: -9999,
                left: -9999
            }).appendTo('body');

            var $spanShadow = $('<span />');
            $shadow.append($spanShadow.text(text));

			var fontSize = 150;
			var maxHeight = $('.' + prefix + 'text').height();
			var maxWidth = $('.' + prefix + 'text').width();
			var textHeight;
			var textWidth;
			do {
                $spanShadow.css('font-size', fontSize);
				textHeight = $spanShadow.height();
				textWidth = $spanShadow.width();
				fontSize = fontSize - 1;
			} while ((textHeight > maxHeight || textWidth > maxWidth) && fontSize > 6);
            $span.css('font-size', fontSize).text(text);
            $shadow.remove();
		}

		function build($span) {
			var speed = p.speed;
			var ovclass = p.prefix + 'overlay';
			$('.' + ovclass).remove();
			$('body').append('<div class="' + ovclass + '"></div>').css('overflow', 'hidden').bind('keyup.' + p.prefix, function(e) {
				if (e.which == 27) { // escape
					$.fn.smagnifier.close(p);
				}
			});
			var $text = $('.' + ovclass)
				.css('height', '100%')
				.fadeTo(speed, p.opacity) // fade in overlay
				.after(
					p.wrapperMarkup
					.replace(/\${text}/, $span.text())
					.replace(/\${prefix}/g, prefix)
				) // create wrapper html
				.find('~ .' + prefix + 'wrapper').fadeTo(speed, 1) // fade in wrapper
				.click(function(e) { // click on overlay will close the smagnifier
					if ($(e.target).closest('div').hasClass(prefix + 'text')) {
						return; // let text div be clickable
					}
					$.fn.smagnifier.close(p);
				})
				.find('.' + prefix + 'text')
				.css('margin-top', $('.' + prefix + 'wrapper').height() / 2 - $('.' + prefix + 'text').outerHeight() / 2 + 'px');
			textFill($text);
		}

		return this.each(function() {
			var $t = $(this);
			$t.click(function() {
				$('html').css('backgound', 'black');
				$('body').animate({'border-spacing': 0.9}, {
					step: function(now, fx) {
//						$(this).css('transform', 'scale(' + now + ')');
					},
					duration: p.speed
				});
				build($(this));
			});
			if (p['link-class']) {
				$t.addClass(p['link-class']);
			}
		});
	};

	$.fn.smagnifier.defaults = {
		speed: 'normal',
		prefix: 'smagnifier-', // don't forget to change smagnifier.css
		wrapperMarkup: '\
			<div class="${prefix}wrapper">\
				<div class="${prefix}text">${text}</div>\
			</div>\
		', // don't forget to change smagnifier.css if necessary
		opacity: 0.7,
		'link-class': '' // provide special classes for original elements (useful for adding pseudo class)
	};

	$.fn.smagnifier.close = function(p) {
		var ovclass = p.prefix + 'overlay';
		$('.' + ovclass + ', .' + p.prefix + 'wrapper').fadeTo(p.speed, 0, function() {
			$('.' + ovclass + ', .' + p.prefix + 'wrapper').remove();
			$('body').css('overflow', '').unbind('.' + p.prefix);
		});
	};

	/**
	 * http://stackoverflow.com/questions/1145850
	 */
	$.fn.smagnifier.docHeight = function() {
		var body = document.body,
			html = document.documentElement;

		return Math.max(
			body.scrollHeight, body.offsetHeight,
			html.scrollHeight, html.offsetHeight, html.clientHeight
		);
	};
})(jQuery, document);