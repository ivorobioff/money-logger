Libs.Event = Class.extend({
	_events: null,
	
	initialize: function(){
		this._events = {};
	},
	
	add: function (event, callback){
		if (_.isUndefined(this._events[event])){
			this._events[event] = [];
		}
		
		this._events[event].push(callback);
	},
	
	trigger: function(event, params){
		
		if (_.isUndefined(this._events[event])) return ; 
		if (_.isUndefined(params)) params = [];	
		
		var events = this._events[event];
		
		for (var i in events){
			events[i].apply(this, params)
		}
	}
});
/**
 * @load Libs.Event
 */
Models.Abstract = Class.extend({
	
	_data: null,
	_event: null,
	
	initialize: function(data){
		
		if (_.isUndefined(data)) data = {};
		
		this._data = data;
		this._event = new Libs.Event();
	},
		
	get: function(key){
		return this._data[key];
	},
	
	set: function(key, value, silent){
		
		if (_.isUndefined(silent)) silent = false;
		
		if (!silent) this._event.trigger("set:" + key + ":before", [this]);
		this._set(key, value);		
		if (!silent) this._event.trigger("set:" + key + ":after", [value, this]);
		return this;
	},
	
	update: function(data, silent)
	{
		if (_.isUndefined(silent)) silent = false;
		
		if (!silent) this._event.trigger("update:before", [this]);
	
		for(var i in data){
			this._set(i, data[i]);
		}
		
		if (!silent) this._event.trigger("update:after", [this]);
		return this;
	},
	
	getAll: function(){
		return this._data;
	},
	
	onUpdate: function(callback){
		if (!_.isFunction(callback)){
			this._event.add("update:before", callback.before);
			this._event.add("update:after", callback.after);
		} else {
			this._event.add("update:after", callback);
		}
		return this;
	},
	
	onSet: function(key, callback){
		if (!_.isFunction(callback)){
			this._event.add("set:" + key + ":before", callback.before);
			this._event.add("set:" + key + ":after", callback.after);
		} else {
			this._event.add("set:" + key + ":after", callback);
		}
		
		return this;
	},
	
	_set: function(key, value){
		this._data[key] = value;
	}
});
/**
 * @load Models.Abstract
 */
Models.Budget = Models.Abstract.extend({});
create_singleton(Models.Budget);
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
	},
	
	remove: function(){
		this._el.remove();
	}
});
/**
 * @load Views.Abstract
 **/
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
		var layout = $('#dialog-layout').html().render(this._getLayoutLabels());		
		var content = $('#' + this._template).html().render(this._getContentLabels());
		
		this._el = $(layout);
		this._el.find('#dialog-content').html(content);
		
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
		this._onHide();
		this._el.hide();
	},
	
	_onShow: function(){
		
	},
	
	_onHide: function(){
		
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
	},
	
	_getContentLabels: function(){
		return {};
	}
});
/**
 * @load Views.AbstractDialog
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
		var errors = "";
		for (var i in data){
			errors += i + " >> " + data[i] + "\n";
		}
		
		alert(errors);
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
/**
 * @load Views.AbstractDialogForm
 * @load Models.Budget
 */
Views.WithdrawalDialog = Views.AbstractDialogForm.extend({
	_template: 'withdrawal-dialog',
	
	_success: function(data){
		Models.Budget.getInstance().update(data);
	},

	_clearAll: function(){
		this._el.find('input[name=amount]').val("");
	},
	
	_getLayoutLabels: function(){
		return $.extend(this._super(), {title: i18n["/dialogs/titles/withdrawal"]});
	}
});

create_singleton(Views.WithdrawalDialog);
/**
 * @load Views.AbstractDialogForm
 * @load Models.Budget
 */
Views.DepositDialog = Views.AbstractDialogForm.extend({
	_template: 'deposit-dialog',
	
	_success: function(data){
		Models.Budget.getInstance().update(data);
	},

	_clearAll: function(){
		this._el.find('input[name=amount]').val("");
	},
	
	_getLayoutLabels: function(){
		return $.extend(this._super(), {title: i18n["/dialogs/titles/deposit"]});
	}
});

create_singleton(Views.DepositDialog);
/**
 * @load Views.Abstract
 */
Views.AbstractMenu = Views.Abstract.extend({
	_onItemClick: function(e, params){
		
		if (_.isUndefined(params)) params = [];
		
		var action = $(e.target).attr('action');
		
		if (!_.isString(action)){
			return ;
		}
		
		var method = action.toCamelCase();
		
		if (!_.isFunction(this[method])){
			return ;
		}
		
		this[method].apply(this, params);
		return false;
	}
});
/**
 * @load Views.AbstractMenu
 * @load Views.DepositDialog
 * @load Views.WithdrawalDialog
 */
Views.BudgetMenu = Views.AbstractMenu.extend({
	_id: "budget-menu",
	
	initialize: function(){
		this._render();
		this._el.find("a").click($.proxy(this._onItemClick, this));
	},
	
	deposit: function(){
		Views.DepositDialog.getInstance().show();
	},
	
	withdrawal: function(){
		Views.WithdrawalDialog.getInstance().show();
	}
});
/**
 * @load Views.Abstract
 */
Views.Budget = Views.Abstract.extend({
	_id: "header-top",
	
	initialize: function(){
		this._render();
		
		Models.Budget.getInstance().onUpdate($.proxy(function(model){
			this._el.updateDataFields(model);
		}, this));
	}
});
create_singleton(Views.Budget);
