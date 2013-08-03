/**
 * @load Views.AbstractGroup
 * @load Views.MoneyFlowCategory
 * Класс для отрисвоки группы
 */
Views.MoneyFlowGroup = Views.AbstractGroup.extend({
	_view_class: Views.MoneyFlowCategory
});