/**
 * @load Views.AbstractMenu
 * @load Views.DepositDialog
 * @load Views.WithdrawalDialog
 * @load Views.ConfirmDialog
 */
Views.BudgetMenu = Views.AbstractMenu.extend({
	_id: "budget-menu",
	
	_archive_confirm: null,
	
	initialize: function(){
		this._render();
		this._el.find("a").click($.proxy(this._onItemClick, this));
	},
	
	deposit: function(){
		Views.DepositDialog.getInstance().show();
	},
	
	withdrawal: function(){
		Views.WithdrawalDialog.getInstance().show();
	},
	
	archive: function(){
		if (_.isNull(this._archive_confirm)){
			this._archive_confirm = new Views.ConfirmDialog({
				text: i18n["/dialogs/text/close_month"],
				yes: $.proxy(function(dlg){
					dlg.disableUI();
					post("/ArchiveProcessor/closeMonth/", {}, {
						success: function(){
							location.assign(_url("/Planner/"));
						},
						error: function(data){
							new Helpers.ErrorsHandler(data).show();
							dlg.enableUI();
							dlg.hide();
						}
					})
				}, this)
			});
		}
		
		this._archive_confirm.show();
	}
});