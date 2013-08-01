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
	
	update: function(data)
	{
		for(var i in data){
			this.set(i, data[i]);
		}
	},
	
	getAll: function(){
		return this._data;
	}
});