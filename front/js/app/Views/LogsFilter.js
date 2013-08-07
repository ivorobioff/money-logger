/**
 * @load Views.Abstract
 */
Views.LogsFilter = Views.Abstract.extend({
	_id: "search-bl",
	
	initialize: function(){
		this._render();
		
		var dp_settings = {
			dateFormat: 'yy-mm-dd',
			duration: 0
		};
			
		this._el.find('[name=from]').datepicker(dp_settings);
		this._el.find('[name=to]').datepicker(dp_settings);
	}
});