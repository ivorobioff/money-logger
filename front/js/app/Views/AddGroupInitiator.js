/**
 * @load Views.Abstract
 * @load Views.AddGroupDialog
 */
Views.AddGroupInitiator = Views.Abstract.extend({
	_id: 'new-gr',
	
	initialize: function(){
		this._render();
		
		this._el.click(function(){
			Views.AddGroupDialog.getInstance().show();
			return false;
		});
	}
});