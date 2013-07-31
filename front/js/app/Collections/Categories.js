Collections.Categories = Collections.Abstract.extend({
	_model_class: Models.Category,

	getByGroupId: function(id){
		var models = [];
		for (var i in this._models){
			var model = this._models[i];

			if (model.get('group_id') == id){
				models.push(model);
			}
		}

		return models;
	},
});
create_singleton(Collections.Categories);