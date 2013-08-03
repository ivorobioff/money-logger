/**
 * @load Views.AbstractMenu
 * @load Views.DepositDialog
 * @load Views.WithdrawalDialog
 */
Views.BudgetMenu = Views.AbstractMenu.extend({
	_id: "budget-menu",
	
	initialize: function(){
		this._render();
		this._el.find("a").click($.proxy(this._onItemClick, this));
	},
	
	deposit: function(){
		Views.DepositDialog.getInstance().show();
	},
	
	withdrawal: function(){
		Views.WithdrawalDialog.getInstance().show();
	}
});