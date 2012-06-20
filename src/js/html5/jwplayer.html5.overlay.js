/**
 * JW Player HTML5 overlay component
 * 
 * @author pablo
 * @version 6.0
 */
(function(jwplayer) {
	
	var html5 = jwplayer.html5,
		utils = jwplayer.utils,
		_css = utils.css,
		_setTransition = utils.transitionStyle,

		/** Some CSS constants we should use for minimization **/
		JW_CSS_RELATIVE = "relative",
		JW_CSS_ABSOLUTE = "absolute",
		//JW_CSS_NONE = "none",
		//JW_CSS_BLOCK = "block",
		//JW_CSS_INLINE = "inline",
		//JW_CSS_INLINE_BLOCK = "inline-block",
		JW_CSS_HIDDEN = "hidden",
		//JW_CSS_LEFT = "left",
		//JW_CSS_RIGHT = "right",
		JW_CSS_100PCT = "100%",
		JW_CSS_SMOOTH_EASE = "opacity .25s, visibility .25s",
		
		OVERLAY_CLASS = '.jwoverlay',
		
		TOP = "top",
		BOTTOM = "bottom",
		RIGHT = "right",
		LEFT = "left",
		
		UNDEFINED = undefined,
		DOCUMENT = document;
	
	/** HTML5 Overlay class **/
	html5.overlay = function(id, skin) {
		var _skin = skin,
			_id = id,
			_container,
			_contents,
			_borderSizes = {};
//			_width = width,
//			_height = height;
		
		function _init() {
			_container = _createElement(OVERLAY_CLASS.replace(".",""));
			_container.id = _id;

			_contents = _createElement("jwcontents", _container);
			
			_createBorderElement(TOP, LEFT);
			_createBorderElement(BOTTOM, LEFT);
			_createBorderElement(TOP, RIGHT);
			_createBorderElement(BOTTOM, RIGHT);
			_createBorderElement(LEFT);
			_createBorderElement(RIGHT);
			_createBorderElement(TOP);
			_createBorderElement(BOTTOM);
			
			_createSkinElement("background", "jwback");
			_css(_internalSelector("jwback"), {
				left: _borderSizes.left,
				right: _borderSizes.right,
				top: _borderSizes.top,
				bottom: _borderSizes.bottom
			});
			
			var arrow = _createSkinElement("arrow", "jwarrow")[1];
			_css(_internalSelector("jwarrow"), {
				position: JW_CSS_ABSOLUTE,
				bottom: -1 * arrow.height,
				width: arrow.width,
				height: arrow.height,
				left: "50%",
				'margin-left': arrow.width / -2
			});

			_css(_internalSelector(), {
//				width: _width,
//				height: _height,
				'padding-top': _borderSizes.top,
				'padding-bottom': _borderSizes.bottom,
				'padding-left': _borderSizes.left,
				'padding-right': _borderSizes.right
			});
			

		}
		
		function _internalSelector(name) {
			return '#' + _id + (name ? " ." + name : "");
		}
		
		function _createElement(className, parent) {
			var elem = DOCUMENT.createElement("div");
			if (className) elem.className = className;
			if (parent) parent.appendChild(elem);
			return elem;
		}


		function _createSkinElement(name, className) {
			var skinElem = _getSkinElement(name),
				elem = _createElement(className, _container);
			
			_css(_internalSelector(className.replace(" ", ".")), {
				'background-image': skinElem.src
			});
			
			return [elem, skinElem];
			
		}
		
		function _createBorderElement(dim1, dim2) {
			if (!dim2) dim2 = "";
			var created = _createSkinElement('cap' + dim1 + dim2, "jwborder jw" + dim1 + (dim2 ? dim2 : "")); 
				elem = created[0],
				skinElem = created[1],
				elemStyle = {
					'background-image': skinElem.src,
					width: (dim1 == LEFT || dim2 == LEFT || dim1 == RIGHT || dim2 == RIGHT) ? skinElem.width: UNDEFINED,
					height: (dim1 == TOP || dim2 == TOP || dim1 == BOTTOM || dim2 == BOTTOM) ? skinElem.height: UNDEFINED
				};
			
			elemStyle[dim1] = 0;
			if (dim2) elemStyle[dim2] = 0;
			
			_css(_internalSelector(elem.className.replace(/ /g, ".")), elemStyle);
			
			var dim1style = {}, dim2style = {}, dims = { left: skinElem.width, right: skinElem.width, top: skinElem.height, bottom: skinElem.height};
			if (dim1 && dim2) {
				dim1style[dim2] = dims[dim2];
				dim1style[dim1] = 0;
				dim2style[dim1] = dims[dim1];
				dim2style[dim2] = 0;
				_css(_internalSelector("jw"+dim1), dim1style);
				_css(_internalSelector("jw"+dim2), dim2style);
				_borderSizes[dim1] = dims[dim1];
				_borderSizes[dim2] = dims[dim2];
			}
		}

		this.element = function() {
			return _container;
		};
		
		this.setContents = function(contents) {
			_contents.innerHTML = "";
			_contents.appendChild(contents);
		}
		
		this.borderWidth = function() {
			return _borderSizes.left
		}

		function _getSkinElement(name) {
			var elem = _skin.getSkinElement('tooltip', name); 
			if (elem) {
				return elem;
			} else {
				return {
					width: 0,
					height: 0,
					src: "",
					image: UNDEFINED,
					ready: false
				}
			}
		}
		
		this.show = function() {
			_css(_internalSelector(), { opacity: 1, visibility: "visible" });
		}
		
		this.hide = function() {
			_css(_internalSelector(), { opacity: 0, visibility: JW_CSS_HIDDEN });
		}
		
		// Call constructor
		_init();

	}

	/*************************************************************
	 * Player stylesheets - done once on script initialization;  *
	 * These CSS rules are used for all JW Player instances      *
	 *************************************************************/

	_css(OVERLAY_CLASS, {
		position: JW_CSS_ABSOLUTE,
		visibility: JW_CSS_HIDDEN,
		opacity: 0,
//		'z-index': 1 // required for IE9
	});

	_css(OVERLAY_CLASS + " .jwcontents", {
		position: JW_CSS_RELATIVE,
		'z-index': 1
	});

	_css(OVERLAY_CLASS + " .jwborder", {
		position: JW_CSS_ABSOLUTE,
		'background-size': JW_CSS_100PCT + " " + JW_CSS_100PCT
	});

	_css(OVERLAY_CLASS + " .jwback", {
		position: JW_CSS_ABSOLUTE,
		'background-size': JW_CSS_100PCT + " " + JW_CSS_100PCT
	});

	_setTransition(OVERLAY_CLASS, JW_CSS_SMOOTH_EASE);
})(jwplayer);