/**
 * @load Views.Abstract
 * @load Views.CategoryMenu
 * Вьюшка для отдельной категории
 */
Views.AbstractCategory = Views.Abstract.extend({
	_model: null,
	
	initialize: function(model){
		this._model = model;
		this._render();
		
		this._el.find('.tab-menu').click($.proxy(function(e){
			Views.CategoryMenu.getInstance().setContext(this).show({x: e.pageX, y: e.pageY});
			return false;
		}, this));
	},
	
	_render: function(){
		var template = $('#category-template').html().render({
			title: this._model.get("title"), 
			amount: this._getAmountValue(),
		});
		
		this._el = $(template);
	},
	
	getModel: function(){
		return this._model;
	},
	
	refresh: function(){
		this._el.updateDataFields(this._model);
	},
	
	_getAmountValue: function(){
		return '';
	}
});