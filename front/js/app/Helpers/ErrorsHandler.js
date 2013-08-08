Helpers.ErrorsHandler = Class.extend({

	_data: null,
	
	initialize: function(data){
		this._data = data;
	},
	
	show: function(){
		if (_.keys(this._data).length == 1){
			alert(this._data[_.first(_.keys(this._data))]);
			return ;
		}
		
		var errors = "";
		var c = 1;
		for (var i in this._data){
			errors += c + ". " + this._data[i] + "\n";
			c++;
		}
		
		alert(errors);
	}
});