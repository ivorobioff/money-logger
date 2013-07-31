/**
 * @load Views.AbstractDialogForm
 */
Views.EditGroupDialog = Views.AbstractDialogForm.extend({

	_template: "edit-group-dialog",

	_success: function(data){
		this._context.getModel().update(data);
		this._context.refresh();
	},

	_onShow: function(){
		this._el.find("[name=name]").val(this._context.getModel().get("name"));
	},

	_modifyData: function(data){
		return data + "&id=" + this._context.getModel().get("id");
	},

	_clearAll: function(){
		return ;
	},

	_getLayoutLabels: function(){
		return $.extend(this._super(), {title: i18n["/dialogs/titles/edit_group"]});
	}
});

create_singleton(Views.EditGroupDialog);