/**
 * @load Views.Abstract
 * @load Views.PlannerCategory
 * @load Collections.Categories
 * 
 * Класс для отрисвоки группы
 */
Views.AbstractGroup = Views.Abstract.extend({
	_model: null,
	_view_class: null,
	
	initialize: function(model){
		this._model = model;
		this._render();
		
		Collections.Categories.getInstance().onAdd($.proxy(function(model){
			if (this._model.get("id") == model.get("group_id")){
				this.attachCategory(new this._view_class(model));
			}
		}, this));
	},
	
	_render: function(){
		var template = $('#group-template').html().render({name: this._model.get("name")});
		this._el = $(template);
		$('#count').append(this._el);
	},

	attachCategory: function(view){
		view.getElement().insertBefore(this._el.find('#categories-hook'));
	}
});