Helpers.ErrorsHandler = Class.extend({
	show: function(data){
		if (_.keys(data).length == 1){
			alert(data[_.first(_.keys(data))]);
			return ;
		}
		
		var errors = "";
		var c = 1;
		for (var i in data){
			errors += c + ". " + data[i] + "\n";
			c++;
		}
		
		alert(errors);
	}
});

create_singleton(Helpers.ErrorsHandler);