/**
 * @load Views.AbstractDialogForm
 * @load Collections.Groups
 * @load Views.GroupsCollection
 */
Views.AddGroupDialog = Views.AbstractDialogForm.extend({
	
	_template: "add-group-dialog",

	_success: function(data){
		var model = Collections.Groups.getInstance().add(data);
		Views.GroupsCollection.getInstance().add(model.get("id"), new Views.Group(model));
	},
	
	_clearAll: function(){
		this._el.find('input[name=name]').val("");
	},
	
	_getLayoutLabels: function(){
		return $.extend(this._super(), {title: i18n["/dialogs/titles/add_group"]});
	}
});

create_singleton(Views.AddGroupDialog);