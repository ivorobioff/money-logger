/**
 * @load Libs.Event
 */
Models.Abstract = Class.extend({
	
	_data: null,
	_event: null,
	
	initialize: function(data){
		
		if (_.isUndefined(data)) data = {};
		
		this._data = data;
		this._event = new Libs.Event();
	},
		
	get: function(key){
		return this._data[key];
	},
	
	set: function(key, value, silent){
		
		if (_.isUndefined(silent)) silent = false;
		
		if (!silent) this._event.trigger("set:" + key + ":before", [this]);
		this._set(key, value);		
		if (!silent) this._event.trigger("set:" + key + ":after", [value, this]);
		return this;
	},
	
	update: function(data, silent)
	{
		if (_.isUndefined(silent)) silent = false;
		
		if (!silent) this._event.trigger("update:before", [this]);
	
		for(var i in data){
			this._set(i, data[i]);
		}
		
		if (!silent) this._event.trigger("update:after", [this]);
		return this;
	},
	
	getAll: function(){
		return this._data;
	},
	
	onUpdate: function(callback){
		if (!_.isFunction(callback)){
			this._event.add("update:before", callback.before);
			this._event.add("update:after", callback.after);
		} else {
			this._event.add("update:after", callback);
		}
		return this;
	},
	
	onSet: function(key, callback){
		if (!_.isFunction(callback)){
			this._event.add("set:" + key + ":before", callback.before);
			this._event.add("set:" + key + ":after", callback.after);
		} else {
			this._event.add("set:" + key + ":after", callback);
		}
		
		return this;
	},
	
	_set: function(key, value){
		this._data[key] = value;
	}
});