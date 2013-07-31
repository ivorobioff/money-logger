/**
 * Вьюшка для отдельной категории
 */
Views.Category = Views.Abstract.extend({
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
			amount: this._model.get("amount")
		});
		
		this._el = $(template);
	},
	
	getModel: function(){
		return this._model;
	},
	
	refresh: function(){
		this._el.find("[data-field=title]").html(_.escape(this._model.get("title")));
		this._el.find("[data-field=amount]").html(_.escape(this._model.get("amount")));
	}
});