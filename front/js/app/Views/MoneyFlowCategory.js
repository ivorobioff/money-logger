/**
 * @load Views.AbstractCategory
 * Вьюшка для отдельной категории
 */
Views.MoneyFlowCategory = Views.AbstractCategory.extend({
	_getAmountValue: function(){
		return this._model.get("current_amount");
	}
});