Views.AddCategoryDialog = Views.AbstractDialogForm.extend({
	
	_template: "add-category-dialog",

	_success: function(data){
		var model = Collections.Categories.getInstance().add(data);
		var view = Views.GroupsCollection.getInstance().get(model.get("group_id"));
		view.attachCategory(new Views.Category(model));
	},
	
	_onShow: function(){
		var html = "";
		
		Collections.Groups.getInstance().each(function(model){
			html += "<option value=\"" + model.get("id") + "\">" + _.escape(model.get("name")) + "</option>";
		});
		
		this._el.find("select[name=group]").html(html).val(this._context.getModel().get("id"));
	},
	
	_clearAll: function(){
		this._el.find('input[name=title], input[name=amount]').val("");
		this._el.find('input[name=pin]').removeAttr('checked');
	},
	
	_getLayoutLabels: function(){
		return $.extend(this._super(), {title: i18n["/dialogs/titles/add_category"]});
	},
});

create_singleton(Views.AddCategoryDialog);