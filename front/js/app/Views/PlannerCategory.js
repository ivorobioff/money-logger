/**
 * @load Views.AbstractCategory
 * Вьюшка для отдельной категории
 */
Views.PlannerCategory = Views.AbstractCategory.extend({
	_getAmountValue: function(){
		return this._model.get("amount");
	}
});