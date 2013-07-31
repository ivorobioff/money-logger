/**
 * @load Views.Abstract
 * @load Views.Body
 * Абстракный класс для контекст-меню
 */
Views.AbstractContextMenu = Views.Abstract.extend({
	
	_template: "context-menu",
	_is_shown: false,
	_coor: {},
	_context: null,
	
	initialize: function(){	
		this._render();
		
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
		var action = $(e.target).attr('action');
		
		if (!_.isString(action)){
			return ;
		}
		
		var method = action.toCamelCase();
		
		if (!_.isFunction(this[method])){
			return ;
		}
		
		this[method](this._context);
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