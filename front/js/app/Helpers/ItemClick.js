Helpers.ItemClick = Class.extend({
	
	_that: null,
	
	initialize: function(that){
		this._that = that;
	},
	
	process: function(e, params){
		
		if (_.isUndefined(params)) params = [];
		
		var action = $(e.target).attr('action');
		
		if (!_.isString(action)){
			return ;
		}
		
		var method = action.toCamelCase();
		
		if (!_.isFunction(this._that[method])){
			return ;
		}
		
		this._that[method].apply(this._that, params);
	}
});