/**
 * @load Views.AbstractDialogForm
 * @load Models.Budget
 */
Views.DepositDialog = Views.AbstractDialogForm.extend({
	_template: 'deposit-dialog',
	
	_success: function(data){
		Models.Budget.getInstance().update(data);
	},

	_clearAll: function(){
		this._el.find('input[name=amount]').val("");
	},
	
	_getLayoutLabels: function(){
		return $.extend(this._super(), {title: i18n["/dialogs/titles/deposit"]});
	}
});

create_singleton(Views.DepositDialog);