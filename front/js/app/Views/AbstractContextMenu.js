/**
 * @load Views.Abstract
 * @load Views.Body
 * @load Helpers.ItemClick
 * Абстракный класс для контекст-меню
 */
Views.AbstractContextMenu = Views.Abstract.extend({
	
	_template: "context-menu",
	_is_shown: false,
	_coor: {},
	_context: null,
	_helper: null,
	
	initialize: function(){	
		this._render();
		this._helper = new Helpers.ItemClick(this);
		
		this._el.find('a').click($.proxy(this._onItemClick, this));
		
		this._el.mousedown(function(){
			return false;
		});
		
		Views.Body.getInstance().getElement().mousedown($.proxy(function(){
			if (this.isShown()){
					this.hide();
			}
		}, this));
	},
	
	_onItemClick: function(e){
		this._helper.process(e, [this._context]);
		this.hide();
		return false;
	},
	
	_render: function(){
		var template = $('#' + this._template).html();
		this._el = $(template);
		$('body').append(this._el);
	},
	
	show: function(coor){
		this._coor = coor;
		this._el.show();
		this._setPosition();
		this._is_shown = true;
	},
	
	hide: function(){
		this._el.hide();
		this._is_shown = false;
	},
			
	isShown: function(){
		return this._is_shown;
	},
	
	setContext: function(context){
		this._context = context;
		return this;
	},
	
	_setPosition: function(){
		this._el.css({left: this._coor.x, top: this._coor.y});
	}
});