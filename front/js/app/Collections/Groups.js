/**
 * @load Collections.Abstract
 * @load Models.Group
 */
Collections.Groups = Collections.Abstract.extend({
	_model_class: Models.Group
});
create_singleton(Collections.Groups);