Models.Group = Models.Abstract.extend({});
Collections.Groups = Collections.Abstract.extend({
	_model_class: Models.Group,
});
create_singleton(Collections.Groups);