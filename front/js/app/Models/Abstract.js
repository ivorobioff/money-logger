/**
 * @load Libs.Event
 */
Models.Abstract = Class.extend({
	
	_data: null,
	_event: null,
	
	initialize: function(data){
		this._data = data;
		this._event = new Libs.Event();
	},
	
	get: function(key){
		return this._data[key];
	},
	
	set: function(key, value){
		this._set(key, value);		
		this._event.trigger("set:" + key, [value, this]);
		return this;
	},
	
	update: function(data)
	{
		for(var i in data){
			this._set(i, data[i]);
		}
		
		this._event.trigger("update", [this]);
		return this;
	},
	
	getAll: function(){
		return this._data;
	},
	
	onUpdate: function(callback){
		this._event.add("update", callback);
		return this;
	},
	
	onSet: function(key, callback){
		this._event.add("set:" + key, callback);
		return this;
	},
	
	_set: function(key, value){
		this._data[key] = value;
	}
});