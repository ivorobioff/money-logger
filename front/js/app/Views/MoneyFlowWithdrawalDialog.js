/**
 * @load Views.AbstractDialogForm
 * @load Models.Budget
 * @load Views.ConfirmDialog
 */
Views.MoneyFlowWithdrawalDialog = Views.AbstractDialogForm.extend({
	
	_template: "moneyflow-withdrawal-dialog",

	_request_amount_confirm: null,
	
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
	},
	
	showError: function(data){
		if (!_.isUndefined(data.post_back)){
			
			if (_.isNull(this._request_amount_confirm)){
				this._request_amount_confirm = new Views.ConfirmDialog({
					text: i18n["/dialogs/text/request_amount"],
					yes: $.proxy(function(dlg){
						dlg.disableUI();
						post("/MoneyFlowProcessor/withdrawal/", dlg.getParams().post_back, {
							callback: $.proxy(function(){
								dlg.enableUI();
								dlg.hide();
							}, this),
							success: $.proxy(function(data){
								dlg.getContext().getModel().update(data.model);
								Models.Budget.getInstance().update(data.budget);
								this.hide();
							}, this),
							error: $.proxy(function(data){
								this.showError(data);
							}, this),
						});
					}, this)
				});
			}
			
			this._request_amount_confirm
				.setContext(this._context)
				.setParams({post_back: data.post_back})
				.show();
		} else {
			this._super(data);
		}
	}
});

create_singleton(Views.MoneyFlowWithdrawalDialog);