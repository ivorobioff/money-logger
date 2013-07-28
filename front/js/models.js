Collections.Abstract = Class.extend({
	_model_class: null,
	_models: null,
	
	initialize: function(){
		this._models = [];
	},
	
	add: function(data){
		var model = new this._model_class(data);
		this._models.push(model);
		return model;
	},
	
	addBunch: function(data){
		for (var i in data){
			this.add(data[i]);
		}
		
		return this._models;
	},
	
	each: function(callback){
		for (var i in this._models){
			callback(this._models[i], i);
		}
		
		return this;
	},
	
});

Models.Abstract = Class.extend({
	_data: null,
	
	initialize: function(data){
		this._data = data;
	},
	
	get: function(key){
		return this._data[key];
	},
	
	set: function(key, value){
		this._data[key] = value;
		return this;
	},
	
	getAll: function(){
		return this._data;
	}
});

Models.Group = Models.Abstract.extend({});
Collections.Groups = Collections.Abstract.extend({
	_model_class: Models.Group,
});
create_singleton(Collections.Groups);

Models.Category = Models.Abstract.extend({});
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