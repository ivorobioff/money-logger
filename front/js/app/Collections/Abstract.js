/**
 * @load Libs.Event
 */
Collections.Abstract = Class.extend({
	_model_class: null,
	_models: null,
	
	_event: null,
	
	initialize: function(){
		this._models = {};
		this._event = new Libs.Event();
	},
	
	add: function(data){
		var model = new this._model_class(data);
		this._models[model.get("id")] = model;
		
		this._event.trigger("add", [model, this]);
		
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
		var model = this._models[id];
		delete this._models[id];
		this._event.trigger("remove", [model, this]);
		return this;
	},
	
	onAdd: function(callback){
		this._event.add("add", callback);
		return this;
	},
	
	onRemove: function(callback){
		this._event.add("remove", callback);
		return this;
	}
});