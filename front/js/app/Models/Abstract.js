Models.Abstract = Class.extend({
	
	_data: null,
	
	/**
	 * @type Array 
	 */
	_on_change_subscribers: null,
	
	initialize: function(data){
		this._data = data;
		this._on_change_subscribers = [];
	},
	
	get: function(key){
		return this._data[key];
	},
	
	set: function(key, value){
		
		this._set(key, value);
		
		var changed_data = {};
		changed_data[key] = value;
		
		this._runOnChangeSubscribers(changed_data);		
		
		return this;
	},
	
	update: function(data)
	{
		for(var i in data){
			this._set(i, data[i]);
		}
		
		this._runOnChangeSubscribers(data);
	},
	
	getAll: function(){
		return this._data;
	},
	
	onChange: function(func){
		this._on_change_subscribers.push(func);
	},
	
	_set: function(key, value){
		this._data[key] = value;
	},
	
	_runOnChangeSubscribers: function(changed_data){
		
		for (var i in this._on_change_subscribers){
			this._on_change_subscribers[i](changed_data, this);
		}
	}
});