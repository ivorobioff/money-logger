/**
 * @load Views.Abstract
 * @load Helpers.ItemClick
 * @load Views.DepositDialog
 * @load Views.WithdrawalDialog
 */
Views.BudgetMenu = Views.Abstract.extend({
	_id: "budget-menu",
	_helper: null,
	
	initialize: function(){
		this._render();
		this._helper = new Helpers.ItemClick(this);
		
		this._el.find("a").click($.proxy(function(e){
			this._helper.process(e);
			return false;
		}, this));
	},
	
	deposit: function(){
		Views.DepositDialog.getInstance().show();
	},
	
	withdrawal: function(){
		Views.WithdrawalDialog.getInstance().show();
	}
});