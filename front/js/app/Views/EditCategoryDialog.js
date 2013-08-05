/**
 * @load Views.AbstractDialogForm
 * @load Views.GroupsCollection
 * @load Collections.Groups
 */
Views.EditCategoryDialog = Views.AbstractDialogForm.extend({
	
	_template: "edit-category-dialog",

	_success: function(data){
		var old_group = this._context.getModel().get("group_id");
		this._context.getModel().update(data.model);
		
		Models.Budget.getInstance().update(data.budget);
		
		var new_group = this._context.getModel().get("group_id");
		
		if (old_group != new_group){
			var view = Views.GroupsCollection.getInstance().get(new_group);
			view.attachCategory(this._context);
		}
	},
	
	_onShow: function(){
		var html = "";
		
		Collections.Groups.getInstance().each(function(model){
			html += "<option value=\"" + model.get("id") + "\">" + _.escape(model.get("name")) + "</option>";
		});
		
		this._el.find("select[name=group]").html(html).val(this._context.getModel().get("group_id"));
		
		this._el.find('input[name=title]').val(this._context.getModel().get("title"));
		this._el.find('input[name=amount]').val(this._context.getModel().get("amount"));
		
		if (this._context.getModel().get("pin") == 1){
			this._el.find('input[name=pin]').attr('checked', "checked");
		} else {
			this._el.find('input[name=pin]').removeAttr('checked');
		}
	},
	
	_clearAll: function(){
		return ;
	},
	
	_getLayoutLabels: function(){
		return $.extend(this._super(), {title: i18n["/dialogs/titles/edit_category"]});
	}
});

create_singleton(Views.EditCategoryDialog);