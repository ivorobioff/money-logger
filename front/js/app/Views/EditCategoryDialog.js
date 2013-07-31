Views.EditCategoryDialog = Views.AbstractDialogForm.extend({
	
	_template: "edit-category-dialog",

	_success: function(data){
		var current_group = this._context.getModel().get("group_id");
		this._context.getModel().update(data);
		
		this._context.refresh();
		
		var new_group = this._context.getModel().get("group_id");
		
		if (current_group != new_group){
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
	
	_modifyData: function(data){		
		return data + "&id=" + this._context.getModel().get("id");
	},
	
	_getLayoutLabels: function(){
		return $.extend(this._super(), {title: i18n["/dialogs/titles/edit_category"]});
	},
});

create_singleton(Views.EditCategoryDialog);