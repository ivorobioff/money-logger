/**
 * @load Views.Abstract
 */
Views.AbstractMenu = Views.Abstract.extend({
	_onItemClick: function(e, params){
		
		if (_.isUndefined(params)) params = [];
		
		var action = $(e.target).attr('action');
		
		if (!_.isString(action)){
			return ;
		}
		
		var method = action.toCamelCase();
		
		if (!_.isFunction(this[method])){
			return ;
		}
		
		this[method].apply(this, params);
		return false;
	}
});