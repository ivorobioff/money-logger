/**
 * @load Views.Abstract
 * @load Views.GroupMenu
 * @load Views.Category
 * @load Collections.Categories
 * 
 * Класс для отрисвоки группы
 */
Views.Group = Views.Abstract.extend({
	_model: null,
	
	initialize: function(model){
		this._model = model;
		this._render();
		
		this._el.find('.group-title .tab-menu').click($.proxy(function(e){
			Views.GroupMenu.getInstance().setContext(this).show({x: e.pageX, y: e.pageY});
			return false;
		}, this));
		
		var categories = Collections.Categories.getInstance().getByGroupId(this._model.get('id'));
		
		for (var i in categories){
			this.attachCategory(new Views.Category(categories[i]));
		}
		
		Collections.Categories.getInstance().onAdd($.proxy(function(model){
			if (this._model.get("id") == model.get("group_id")){
				this.attachCategory(new Views.Category(model));
			}
		}, this));
	},
	
	_render: function(){
		var template = $('#group-template').html().render({name: this._model.get("name")});
		this._el = $(template);
		$('#count').append(this._el);
	},
	
	getModel: function(){
		return this._model;
	},
	
	attachCategory: function(view){
		view.getElement().insertBefore(this._el.find('#categories-hook'));
	},
	
	refresh: function(){
		this._el.find("[data-field=name]").html(_.escape(this._model.get("name")));
	},
});