/**
 * @load Views.AbstractContextMenu
 * @load Views.AddCategoryDialog
 * @load Views.EditGroupDialog
 * @load Views.ConfirmDialog
 * @load Views.GroupsCollection
 * @load Collections.Groups
 */
Views.GroupMenu = Views.AbstractContextMenu.extend({
	_template: 'groups-context-menu',
	
	_delete_dialog: null,
	
	addCategory: function(context){
		Views.AddCategoryDialog.getInstance().setContext(context).show();
	},
	
	editGroup: function(context){
		Views.EditGroupDialog.getInstance().setContext(context).show();
	},
	
	deleteGroup: function(context){
		
		if (_.isNull(this._delete_dialog)){
			this._delete_dialog = new Views.ConfirmDialog({
				
				text: i18n["/dialogs/text/delete_group"],				
				
				yes: function(dlg){
					var id = dlg.getContext().getModel().get("id");
					dlg.disableUI();					
					post(_url("/PlannerProcessor/deleteGroup/"), {id: id}, {
						callback: function(){
							dlg.enableUI();
						},
						
						success: function(data){
							dlg.getContext().remove();
							Views.GroupsCollection.getInstance().remove(data.id);
							Collections.Groups.getInstance().remove(data.id);
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
	}
});

create_singleton(Views.GroupMenu);