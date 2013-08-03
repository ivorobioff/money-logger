/**
 * @load Views.Abstract
 */
Views.Budget = Views.Abstract.extend({
	_id: "header-top",
	
	initialize: function(){
		this._render();
		
		Models.Budget.getInstance().onUpdate($.proxy(function(model){
			this._el.updateDataFields(model);
		}, this));
	}
});
create_singleton(Views.Budget);