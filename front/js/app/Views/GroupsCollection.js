Views.GroupsCollection = Class.extend({
	_views: null,
	
	initialize: function(){
		this._views = {};
	},
	
	add: function(id, view){
		this._views[id] = view;
	},
	
	get: function(id){
		return this._views[id];
	},
	
	remove: function(id){
		delete this._views[id];
	}
});

create_singleton(Views.GroupsCollection);