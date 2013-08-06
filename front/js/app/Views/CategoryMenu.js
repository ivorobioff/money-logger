/**
 * @load Views.AbstractContextMenu
 * @load Views.EditCategoryDialog
 * @load Views.ConfirmDialog
 * @load Collections.Categories
 * @load Views.MoneyFlowWithdrawalDialog
 * @load Views.RefundDialog
 * 
 * Класс вьюшка для контекста меню категорий
 */
Views.CategoryMenu = Views.AbstractContextMenu.extend({
	
	_template: "categories-context-menu",
	
	_delete_dialog: null,
	
	_return_remainder_dialog: null,
	
	editCategory: function(context){
		Views.EditCategoryDialog.getInstance().setContext(context).show();
	},
	
	deleteCategory: function(context){
		
		if (_.isNull(this._delete_dialog)){
			this._delete_dialog = new Views.ConfirmDialog({
				
				text: i18n["/dialogs/text/delete_category"],				
				
				yes: function(dlg){
					var id = dlg.getContext().getModel().get("id");
					dlg.disableUI();					
					post(_url("/PlannerProcessor/deleteCategory/"), {id: id}, {
						callback: function(){
							dlg.enableUI();
						},
						
						success: function(data){
							dlg.getContext().remove();
							Collections.Categories.getInstance().remove(data.id);
							Models.Budget.getInstance().update(data.budget);
							dlg.hide();
						},
						
						error: function(data){
							alert(data);
							dlg.hide();
						}
					})
				}
			
			});
		}
		
		this._delete_dialog.setContext(context).show();
	},
	
	withdrawal: function(context){
		Views.MoneyFlowWithdrawalDialog.getInstance().setContext(context).show();
	},
	
	refund: function(context){
		Views.RefundDialog.getInstance().setContext(context).show();
	},
	
	returnRemainder: function(context){
		if (_.isNull(this._return_remainder_dialog)){
			this._return_remainder_dialog = new Views.ConfirmDialog({
				text: i18n["/dialogs/text/return_remainder"],
				yes: $.proxy(function(dlg){
					dlg.disableUI();
					post("/MoneyFlowProcessor/returnRemainder/", {id: dlg.getContext().getModel().get("id")}, {
						callback: function(){
							dlg.enableUI();
							dlg.hide();
						},
						success: function(data){
							dlg.getContext().getModel().update(data.model);
							Models.Budget.getInstance().update(data.budget);
						},
						error: function(data){
							alert(data.error);
						}
					});
				}, this)
			});
		}
		
		this._return_remainder_dialog.setContext(context).show();
	}
});
create_singleton(Views.CategoryMenu);