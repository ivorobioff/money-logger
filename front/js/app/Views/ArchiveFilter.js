/**
 * @load Views.Abstract
 */
Views.ArchiveFilter = Views.Abstract.extend({
	_id: "search-arcv-inf",
	
	initialize: function(){
		this._render();
		
		this._el.find("[name=archive_id]").change($.proxy(function(){
			this._el.find("form").submit();
		}, this));
	}
});