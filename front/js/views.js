/**
 * Абстрактный класс вьюшек
 */
Views.Abstract = Class.extend({
	_id: null,
	_tag: null,
	_el: null,

	_render: function(){
		if (_.isString(this._id)){
			this._el = $('#' + this._id);
		}else if(_.isString(this._tag)){
			this._el = $(this._tag);
		}
	},
	
	getElement: function(){
		return this._el;
	}
});

/**
 * Абстрактный класс форм
 */
Views.AbstractForm = Views.Abstract.extend({
	
	_url: '',
	_id: 'single-form',
	_el: null,
	_data: {},
	
	initialize: function(){
		this._render();
		this._url = this._el.attr('action');
		this._el.submit($.proxy(function(){
			this._data = this._el.serialize();
			this.beforeSubmit();
			$.post(this._url, this._data, $.proxy(function(res){
				this.afterSubmit(res);
				
				if (typeof res.status != 'string'){
					throw 'wrong status';
				}
				
				if (res.status == 'success'){
					this.success(res.data);
				} else if (res.status == 'error') {
					this.error(res.data);
				} else {
					throw 'wrong status';
				}
			}, this), 'json');
			
			return false;
		}, this));
	},
	
	beforeSubmit: function(){
		this.disableUI();
	},
	
	afterSubmit: function(data){},
	success: function(data){},
	
	error: function(data){
		this._showErrors(data);
		this.enableUI();
	},
	
	disableUI: function(){
		this._el.find('input, select, textarea').each(function(){
			$(this).attr('disabled', 'disabled');
		});
	},
	
	enableUI: function(){
		this._el.find('input, select, textarea').each(function(){
			$(this).removeAttr('disabled');
		});
	},
	
	_showErrors: function(data){
		
		for (var i in data){
			alert(i + ': ' + data[i]);
		}
	}
});

/**
 * Абстракнтый класс форм которые требуют переадресацию после успеха.
 */
Views.AutoRedirectForm = Views.AbstractForm.extend({
	_redirect_url: '',

	initialize: function(url){
		this._super();
		this._redirect_url = url;
	},
	
	success: function(){
		location.href = this._redirect_url;
	}
});

/**
 * Класс формы регистрации
 */
Views.SignupForm = Views.AutoRedirectForm.extend({
	_id: 'signup-form'
});

/**
 * Класс формы авторизации
 */
Views.SigninForm = Views.AutoRedirectForm.extend({
	_id: 'signin-form'
});

/**
 * Абстракный класс для контекст-меню
 */
Views.AbstractContextMenu = Views.Abstract.extend({
	
	_template: "context-menu",
	_is_shown: false,
	_coor: {},
	_context: null,
	
	initialize: function(){	
		this._render();
		
		this._el.find('a').click($.proxy(this._onItemClick, this));
		
		this._el.mousedown(function(){
			return false;
		});
		
		Views.Body.getInstance().getElement().mousedown($.proxy(function(){
			if (this.isShown()){
					this.hide();
			}
		}, this));
	},
	
	_onItemClick: function(e){
		var action = $(e.target).attr('action');
		
		if (!_.isString(action)){
			return ;
		}
		
		var method = action.toCamelCase();
		
		if (!_.isFunction(this[method])){
			return ;
		}
		
		this[method](this._context);
		this.hide();
		return false;
	},
	
	_render: function(){
		var template = $('#' + this._template).html();
		this._el = $(template);
		$('body').append(this._el);
	},
	
	show: function(coor){
		this._coor = coor;
		this._el.show();
		this._setPosition();
		this._is_shown = true;
	},
	
	hide: function(){
		this._el.hide();
		this._is_shown = false;
	},
			
	isShown: function(){
		return this._is_shown;
	},
	
	setContext: function(context){
		this._context = context;
		return this;
	},
	
	_setPosition: function(){
		this._el.css({left: this._coor.x, top: this._coor.y});
	}
});


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


/**
 * Вьюшка для отдельной категории
 */
Views.Category = Views.Abstract.extend({
	_model: null,
	
	initialize: function(model){
		this._model = model;
		this._render();
		this._el.find('.tab-menu').click($.proxy(function(e){
			Views.CategoryMenu.getInstance().setContext(this).show({x: e.pageX, y: e.pageY});
			return false;
		}, this));
	},
	
	_render: function(){
		var template = $('#category-template').html().render({
			title: this._model.get("title"), 
			amount: this._model.get("amount")
		});
		
		this._el = $(template);
	},
	
	getModel: function(){
		return this._model;
	},
	
	refresh: function(){
		this._el.find("[data-field=title]").html(_.escape(this._model.get("title")));
		this._el.find("[data-field=amount]").html(_.escape(this._model.get("amount")));
	}
});


Views.GroupsCollection = Class.extend({
	_views: null,
	
	initialize: function(){
		this._views = {};
	},
	
	add: function(id, view){
		this._views[id] = view;
	},
	
	get: function(id){
		return this._views[id];
	}
});

create_singleton(Views.GroupsCollection);

/**
 * Класс для отрисвоки группы
 */
Views.Group = Views.Abstract.extend({
	_model: null,
	
	initialize: function(model){
		this._model = model;
		this._render();
		
		this._el.find('.group-title .tab-menu').click($.proxy(function(e){
			Views.GroupMenu.getInstance().setContext(this).show({x: e.pageX, y: e.pageY});
			return false;
		}, this));
		
		var categories = Collections.Categories.getInstance().getByGroupId(this._model.get('id'));
		
		for (var i in categories){
			this.attachCategory(new Views.Category(categories[i]));
		}
	},
	
	_render: function(){
		var template = $('#group-template').html().render({name: this._model.get("name")});
		this._el = $(template);
		$('#count').append(this._el);
	},
	
	getModel: function(){
		return this._model;
	},
	
	attachCategory: function(view){
		view.getElement().insertBefore(this._el.find('#categories-hook'));
	},
	
	refresh: function(){
		this._el.find("[data-field=name]").html(_.escape(this._model.get("name")));
	}
});

Views.GroupMenu = Views.AbstractContextMenu.extend({
	_template: 'groups-context-menu',
	
	addCategory: function(context){
		Views.AddCategoryDialog.getInstance().setContext(context).show();
	},
	
	editGroup: function(context){
		Views.EditGroupDialog.getInstance().setContext(context).show();
	},
	
	deleteGroup: function(context){
		
	}
});

create_singleton(Views.GroupMenu);

/**
 * Класс вьюшка для контекста меню категорий
 */
Views.CategoryMenu = Views.AbstractContextMenu.extend({
	
	_template: "categories-context-menu",
	
	editCategory: function(context){
		Views.EditCategoryDialog.getInstance().setContext(context).show();
	},
	
	deleteCategory: function(){
		
	}
});
create_singleton(Views.CategoryMenu);

Views.AbstractDialog = Views.Abstract.extend({
	
	_template: null,
	_context: null,
	
	initialize: function(){
		this._render();
		
		this._el.find('.dlg-close').click($.proxy(function(){
			this.hide();
			return false;
		}, this));
		
		this._el.find('.submit-button').click($.proxy(this._onPositiveClick, this));
		this._el.find('.cancel-button').click($.proxy(this._onNegativeClick, this));
	},
	
	_render: function(){
		
		var layout_labels = this._getLayoutLabels();
		
		this._el = $($('#dialog-layout').html().render(this._getLayoutLabels()));
		
		if (_.isNull(this._template)) throw "The template for the dialog is undefined";
		
		this._el.find('#dialog-content').html($('#' + this._template).html());
		$('body').append(this._el);
	},
	
	_adjustWindow: function(){
		
		var dlg = this._el.find('.dlg');
		
		var top = Math.round(dlg.height() / 2);
		
		dlg.css('margin-top', '-'+top+'px');
	},
	
	setContext: function(context){
		this._context = context;
		return this;
	},
	
	show: function(){
		this._onShow();
		this._el.show();
		this._adjustWindow();
	},
	
	hide: function(){
		this._el.hide();
	},
	
	_onShow: function(){
		
	},
	
	_onPositiveClick: function(){
		
	},
	
	_onNegativeClick: function(){
		
	},
	
	_getLayoutLabels: function(){
		return {
			title: "",
			submit: i18n["/dialogs/submit"],
			cancel: i18n["/dialogs/cancel"],
		};
	}
});

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
	},

});


Views.AddCategoryDialog = Views.AbstractDialogForm.extend({
	
	_template: "add-category-dialog",

	_success: function(data){
		var model = Collections.Categories.getInstance().add(data);
		var view = Views.GroupsCollection.getInstance().get(model.get("group_id"));
		view.attachCategory(new Views.Category(model));
	},
	
	_onShow: function(){
		var html = "";
		
		Collections.Groups.getInstance().each(function(model){
			html += "<option value=\"" + model.get("id") + "\">" + _.escape(model.get("name")) + "</option>";
		});
		
		this._el.find("select[name=group]").html(html).val(this._context.getModel().get("id"));
	},
	
	_clearAll: function(){
		this._el.find('input[name=title], input[name=amount]').val("");
		this._el.find('input[name=pin]').removeAttr('checked');
	},
	
	_getLayoutLabels: function(){
		return $.extend(this._super(), {title: i18n["/dialogs/titles/add_category"]});
	},
});

create_singleton(Views.AddCategoryDialog);


Views.EditCategoryDialog = Views.AbstractDialogForm.extend({
	
	_template: "edit-category-dialog",

	_success: function(data){
		var current_group = this._context.getModel().get("group_id");
		this._context.getModel().update(data);
		
		this._context.refresh();
		
		var new_group = this._context.getModel().get("group_id");
		
		if (current_group != new_group){
			var view = Views.GroupsCollection.getInstance().get(new_group);
			view.attachCategory(this._context);
		}
	},
	
	_onShow: function(){
		var html = "";
		
		Collections.Groups.getInstance().each(function(model){
			html += "<option value=\"" + model.get("id") + "\">" + _.escape(model.get("name")) + "</option>";
		});
		
		this._el.find("select[name=group]").html(html).val(this._context.getModel().get("group_id"));
		
		this._el.find('input[name=title]').val(this._context.getModel().get("title"));
		this._el.find('input[name=amount]').val(this._context.getModel().get("amount"));
		
		if (this._context.getModel().get("pin") == 1){
			this._el.find('input[name=pin]').attr('checked', "checked");
		} else {
			this._el.find('input[name=pin]').removeAttr('checked');
		}
	},
	
	_clearAll: function(){
		return ;
	},
	
	_modifyData: function(data){		
		return data + "&id=" + this._context.getModel().get("id");
	},
	
	_getLayoutLabels: function(){
		return $.extend(this._super(), {title: i18n["/dialogs/titles/edit_category"]});
	},
});

create_singleton(Views.EditCategoryDialog);


Views.AddGroupInitiator = Views.Abstract.extend({
	_id: 'new-gr',
	
	initialize: function(){
		this._render();
		
		this._el.click(function(){
			Views.AddGroupDialog.getInstance().show();
		});
	}
});

Views.AddGroupDialog = Views.AbstractDialogForm.extend({
	
	_template: "add-group-dialog",

	_success: function(data){
		var model = Collections.Groups.getInstance().add(data);
		new Views.Group(model);
	},
	
	_clearAll: function(){
		this._el.find('input[name=name]').val("");
	},
	
	_getLayoutLabels: function(){
		return $.extend(this._super(), {title: i18n["/dialogs/titles/add_group"]});
	},
});

create_singleton(Views.AddGroupDialog);

Views.EditGroupDialog = Views.AbstractDialogForm.extend({
	
	_template: "edit-group-dialog",

	_success: function(data){
		this._context.getModel().update(data);
		this._context.refresh();
	},
	
	_onShow: function(){
		this._el.find("[name=name]").val(this._context.getModel().get("name"));
	},
	
	_modifyData: function(data){
		return data + "&id=" + this._context.getModel().get("id");
	},
	
	_clearAll: function(){
		return ;
	},
	
	_getLayoutLabels: function(){
		return $.extend(this._super(), {title: i18n["/dialogs/titles/edit_group"]});
	},
});

create_singleton(Views.EditGroupDialog);