/**
 * @load Views.AbstractCategory
 * Вьюшка для отдельной категории
 */
Views.PlannerCategory = Views.AbstractCategory.extend({
	_getAmountValue: function(){
		return this._model.get("amount");
	},
	
	_render: function(){
		this._super();
		this._markIfPinned();
	},
	
	refresh: function(){
		this._super();
		this._markIfPinned();
	},
	
	_markIfPinned: function(){
		if (this._model.get("pin") == 1){
			this._el.addClass("is_pinned");
		} else {
			this._el.removeClass("is_pinned");
		}
	}
});