var Views = {};
var Models = {};

//Добавил метод в объект String
String.prototype.toCamelCase = function(){
	
	var arr = this.split('-');
	var n_str = '';
	
	for (var i in arr){
		n_str += arr[i].charAt(0).toUpperCase() + arr[i].substr(1); 
	}
	
	return n_str.charAt(0).toLowerCase() + n_str.substr(1);
}

/**
 * Полезная функция для дебага. Выводит хэш атрибутов объекта
 */
function pred(data){
	alert(JSON.stringify(data));
}

/**
 * Создает синглтон для класа
 * @param class_name
 */
function create_singleton(class_name){
	class_name._INSTANCE = null;
	
	class_name.getInstance = function(){
		
		if (class_name._INSTANCE == null){
			class_name._INSTANCE = new class_name();
		}
		
		return class_name._INSTANCE;
	}
}

/**
 * Абстрактный класс вьюшек
 */
Views.Abstract = Class.extend({
	_id: null,
	_tag: null,
	_el: null,
	
	initialize: function(){
		this._render();
	},
	
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
		this._super();
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
		this._super();
		
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
 * Класс вьюшка для контекста меню категорий
 */
Views.CategoryMenu = Views.AbstractContextMenu.extend({
	withdrawal: function(context){
		
	},
	
	returnAmount: function(context){
		
	}
});
create_singleton(Views.CategoryMenu);

/**
 * Класс вьюшка для бади.
 */
Views.Body = Views.Abstract.extend({
	_tag: "body",
});
create_singleton(Views.Body);

/**
 * Вьюшка для таблицы с категориями
 */
Views.Categories = Views.Abstract.extend({
	_id: 'categories-container',
	
	initialize: function(){	
		this._super();
		
		this._el.find('tr').each(function(){
			new Views.Category($(this));
		});
	}
});

/**
 * Вьюшка для отдельной категории
 */
Views.Category = Views.Abstract.extend({
	initialize: function(el){
		this._super();
		this._el = el;
		this._el.find('.tab-menu').click($.proxy(function(e){
			Views.CategoryMenu.getInstance().setContext(this).show({x: e.pageX, y: e.pageY});
			return false;
		}, this));
	}
});

Views.Group = Views.Abstract.extend({
	initialize: function(el){
		this._super();
		this._el = el;
		
		this._el.find('.group-title .tab-menu').click($.proxy(function(e){
			Views.GroupMenu.getInstance().setContext(this).show({x: e.pageX, y: e.pageY});
			return false;
		}, this));
	}
});

Views.GroupMenu = Views.AbstractContextMenu.extend({
	_template: 'groups-context-menu',
	
	addCategory: function(context){
		Views.AddCategoryDialog.getInstance().show();
	},
	
	editGroup: function(context){
		
	},
	
	deleteGroup: function(context){
		
	}
});

create_singleton(Views.GroupMenu);

Views.AbstractDialog = Views.Abstract.extend({
	
	_template: null,
	
	initialize: function(){
		this._super();
		
		this._el.find('.dlg-close').click($.proxy(function(){
			this.hide();
			return false;
		}, this));
		
		this._el.find('.submit-button').click($.proxy(this._onPositiveClick, this));
		this._el.find('.cancel-button').click($.proxy(this._onNegativeClick, this));
	},
	
	_render: function(){
		
		var layout_labels = this._getLayoutLabels();
		
		var layout_html = $('#dialog-layout').html()
			.replace("{{title}}", layout_labels.title)
			.replace("{{submit}}", layout_labels.submit)
			.replace("{{cancel}}", layout_labels.cancel);
		
		this._el = $(layout_html);
		
		if (_.isNull(this._template)) throw "The template for the dialog is undefined";
		
		this._el.find('#dialog-content').html($('#' + this._template).html());
		$('body').append(this._el);
	},
	
	_adjustWindow: function(){
		
		var dlg = this._el.find('.dlg');
		
		var top = Math.round(dlg.height() / 2);
		
		dlg.css('margin-top', '-'+top+'px');
	},
	
	show: function(){
		this._el.show();
		this._adjustWindow();
	},
	
	hide: function(){
		this._el.hide();
	},
	
	_onPositiveClick: function(){
		
	},
	
	_onNegativeClick: function(){
		
	},
	
	_getLayoutLabels: function(){
		return {
			title: "",
			submit: "",
			cancel: "",
		};
	}
});

Views.AddCategoryDialog = Views.AbstractDialog.extend({
	
	_template: "add-category-dialog",
		
	_onPositiveClick: function(){
		this._el.hide();
	},
	
	_onNegativeClick: function(){
		this._el.hide();
	}
});

create_singleton(Views.AddCategoryDialog);