Collections.Abstract = Class.extend({
	_model_class: null,
	_models: null,
	
	initialize: function(){
		this._models = {};
	},
	
	add: function(data){
		var model = new this._model_class(data);
		this._models[model.get("id")] = model;
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
	
	remove: function(id){
		delete this._models[id];
	}
	
});