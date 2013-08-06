/**
 * @load Views.AbstractDialog
 * @load Helpers.ErrorsHandler
 */
Views.AbstractDialogForm = Views.AbstractDialog.extend({
	
	initialize: function(){
		this._super();	
		this._el.find("form").submit($.proxy(this._onPositiveClick, this));
	},
	_onPositiveClick: function(){
		
		var url = this._el.find("form").attr('action');		
		var data = this._el.find("form").serialize();
		
		if (!_.isUndefined(this._context) && !_.isNull(this._context)){
			data += "&id=" + this._context.getModel().get("id");
		}
		
		this._disableUI();

		post(url, data, {
			callback: $.proxy(function(result){
				this._enableUI();
			}, this),
			
			success: $.proxy(function(data){
				this._success(data);
				this.hide();
			}, this),
			
			error: $.proxy(this.showError, this)
		});
		
		return false;
	},
	
	_onNegativeClick: function(){
		this.hide();
	},
	
	_success: function(data){
	
	},
	
	showError: function(data){
		Helpers.ErrorsHandler.getInstance().show(data);
	},
		
	_disableUI: function(){
		this._el.find('input, select, textarea').each(function(){
			$(this).attr('disabled', 'disabled');
		});
	},
	
	_enableUI: function(){
		this._el.find('input, select, textarea').each(function(){
			$(this).removeAttr('disabled');
		});
	},
	
	_onHide: function(){
		this._clearAll();
	}
});