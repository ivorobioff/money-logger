/**
 * Класс вьюшка для бади.
 */
Views.Body = Views.Abstract.extend({
	_tag: "body",
	
	initialize: function(){
		this._render();
	}
});
create_singleton(Views.Body);