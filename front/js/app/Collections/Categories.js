/**
 * @load Collections.Abstract
 * @load Models.Category
 */
Collections.Categories = Collections.Abstract.extend({
	_model_class: Models.Category,
});
create_singleton(Collections.Categories);