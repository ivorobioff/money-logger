/**
 * @load Views.AbstractDialogForm
 * @load Models.Budget
 */
Views.MoneyFlowWithdrawalDialog = Views.AbstractDialogForm.extend({
	
	_template: "withdrawal-dialog",

	_success: function(data){
		this._context.getModel().update(data.model);
		Models.Budget.getInstance().update(data.budget);
	},
	
	_clearAll: function(){
		this._el.find("[name=amount]").val("");
		this._el.find("[name=comment]").val("");
	},
	
	_getLayoutLabels: function(){
		return $.extend(this._super(), {title: i18n["/dialogs/titles/money_flow_withdrawal"]});
	}
});

create_singleton(Views.MoneyFlowWithdrawalDialog);