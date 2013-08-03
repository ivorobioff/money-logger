/**
 * @load Views.AbstractGroup
 * @load Views.GroupMenu
 * @load Views.PlannerCategory
 * Класс для отрисвоки группы
 */
Views.PlannerGroup = Views.AbstractGroup.extend({
	
	_view_class: Views.PlannerCategory,
	
	initialize: function(model){
		this._super(model);
		
		this._el.find('.group-title .tab-menu').click($.proxy(function(e){
			Views.GroupMenu.getInstance().setContext(this).show({x: e.pageX, y: e.pageY});
			return false;
		}, this));
	},

	getModel: function(){
		return this._model;
	},
	
	refresh: function(){
		this._el.find(".group-title").updateDataFields(this._model);
	},
});