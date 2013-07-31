/**
 * @load Views.AbstractDialog
 */
Views.AbstractDialogForm = Views.AbstractDialog.extend({
		
	_onPositiveClick: function(){
		
		var url = this._el.find("form").attr('action');		
		var data = this._el.find("form").serialize();
		
		this._disableUI();

		post(url, this._modifyData(data), {
			callback: $.proxy(function(result){
				this._enableUI();
			}, this),
			
			success: $.proxy(function(data){
				this._success(data);
				this._clearAll();
				this.hide();
			}, this),
			
			error: $.proxy(function(data){
				var errors = "";
				for (var i in data){
					errors += i + " >> " + data[i] + "\n";
				}
				
				alert(errors);
			}, this)
		});
	},
	
	_modifyData: function(data){
		return data;
	},
	
	_success: function(data){
	
	},
	
	_onNegativeClick: function(){
		this._el.hide();
		this._clearAll();
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
	}
});