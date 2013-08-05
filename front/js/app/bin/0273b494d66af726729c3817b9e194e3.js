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
	},
	
	remove: function(id){
		delete this._views[id];
	}
});

create_singleton(Views.GroupsCollection);
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
Models.Group = Models.Abstract.extend({});
/**
 * @load Libs.Event
 */
Collections.Abstract = Class.extend({
	_model_class: null,
	_models: null,
	
	_event: null,
	
	initialize: function(){
		this._models = {};
		this._event = new Libs.Event();
	},
	
	add: function(data, silent){
		
		if (_.isUndefined(silent)) silent = false;
		
		var model = new this._model_class(data);
		this._models[model.get("id")] = model;
		
		if (!silent) this._event.trigger("add", [model, this]);
		
		return model;
	},
	
	addBunch: function(data, silent){
		for (var i in data){
			this.add(data[i], silent);
		}
		
		return this._models;
	},
	
	each: function(callback){
		for (var i in this._models){
			callback(this._models[i], i);
		}
		
		return this;
	},
	
	remove: function(id, silent){
		
		if (_.isUndefined(silent)) silent = false;
		
		var model = this._models[id];
		delete this._models[id];
		
		if (!silent) this._event.trigger("remove", [model, this]);
		
		return this;
	},
	
	onAdd: function(callback){
		this._event.add("add", callback);
		return this;
	},
	
	onRemove: function(callback){
		this._event.add("remove", callback);
		return this;
	}
});
/**
 * @load Collections.Abstract
 * @load Models.Group
 */
Collections.Groups = Collections.Abstract.extend({
	_model_class: Models.Group
});
create_singleton(Collections.Groups);
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
 * @load Collections.Groups
 */
Views.AddGroupDialog = Views.AbstractDialogForm.extend({
	
	_template: "add-group-dialog",

	_success: function(data){
		Collections.Groups.getInstance().add(data);
	},
	
	_clearAll: function(){
		this._el.find('input[name=name]').val("");
	},
	
	_getLayoutLabels: function(){
		return $.extend(this._super(), {title: i18n["/dialogs/titles/add_group"]});
	}
});

create_singleton(Views.AddGroupDialog);
/**
 * @load Views.Abstract
 * @load Views.AddGroupDialog
 */
Views.AddGroupInitiator = Views.Abstract.extend({
	_id: 'new-gr',
	
	initialize: function(){
		this._render();
		
		this._el.find('a').click(function(){
			Views.AddGroupDialog.getInstance().show();
			return false;
		});
	}
});
/**
 * @load Models.Abstract
 */
Models.Budget = Models.Abstract.extend({});
create_singleton(Models.Budget);
/**
 * @load Views.AbstractDialogForm
 * @load Models.Budget
 */
Views.RefundDialog = Views.AbstractDialogForm.extend({

	_template: "refund-dialog",
	
	_success: function(data){
		this._context.getModel().update(data.model);
		Models.Budget.getInstance().update(data.budget);
	},
	
	_clearAll: function(){
		this._el.find("[name=amount]").val("");
		this._el.find("[name=comment]").val("");
	},
	
	_getLayoutLabels: function(){
		return $.extend(this._super(), {title: i18n["/dialogs/titles/refund"]});
	}
});

create_singleton(Views.RefundDialog);
/**
 * @load Views.AbstractDialog
 */
Views.ConfirmDialog = Views.AbstractDialog.extend({
	
	_options: null,
	_template: 'confirm-dialog',
	
	initialize: function(options){
		this._options = options;
		this._super();
	},
	
	_onPositiveClick: function(){
		if (_.isFunction(this._options.yes)){
			this._options.yes(this);
		}
	},
	
	_onNegativeClick: function(){
		this.hide();
	},
	
	_getLayoutLabels: function(){
		return {
			title: i18n["/dialogs/titles/warning"],
			submit: i18n["/dialogs/yes"],
			cancel: i18n["/dialogs/no"]
		};
	},
	
	_getContentLabels: function(){
		return {
			text: this._options.text
		};
	},
	
	getContext: function(){
		return this._context;
	},
	
	disableUI: function(){
		this._el.find(".submit-button, .cancel-button").attr("disabled", "disabled");
	},
	
	enableUI: function(){
		this._el.find(".submit-button, .cancel-button").removeAttr("disabled");
	}
});
/**
 * @load Views.AbstractDialogForm
 * @load Models.Budget
 * @load Views.ConfirmDialog
 */
Views.MoneyFlowWithdrawalDialog = Views.AbstractDialogForm.extend({
	
	_template: "moneyflow-withdrawal-dialog",

	_request_amount_confirm: null,
	
	_success: function(data){
		this._context.getModel().update(data.model);
		Models.Budget.getInstance().update(data.budget);
	},
	
	_clearAll: function(){
		this._el.find("[name=amount]").val("");
		this._el.find("[name=comment]").val("");
	},
	
	_getLayoutLabels: function(){
		return $.extend(this._super(), {title: i18n["/dialogs/titles/money_flow_withdrawal"]});
	},
	
	showError: function(data){
		if (!_.isUndefined(data.post_back)){
			
			if (_.isNull(this._request_amount_confirm)){
				this._request_amount_confirm = new Views.ConfirmDialog({
					text: i18n["/dialogs/text/request_amount"],
					yes: $.proxy(function(dlg){
						dlg.disableUI();
						post("/MoneyFlowProcessor/withdrawal/", data.post_back, {
							callback: $.proxy(function(){
								dlg.enableUI();
								dlg.hide();
							}, this),
							success: $.proxy(function(data){
								this._context.getModel().update(data.model);
								Models.Budget.getInstance().update(data.budget);
								this.hide();
							}, this),
							error: $.proxy(function(data){
								this.showError(data);
							}, this),
						});
					}, this)
				});
			}
			
			this._request_amount_confirm.show();
		} else {
			this._super(data);
		}
	}
});

create_singleton(Views.MoneyFlowWithdrawalDialog);
/**
 * @load Models.Abstract
 */
Models.Category = Models.Abstract.extend({});
/**
 * @load Collections.Abstract
 * @load Models.Category
 */
Collections.Categories = Collections.Abstract.extend({
	_model_class: Models.Category,
});
create_singleton(Collections.Categories);
/**
 * @load Views.AbstractDialogForm
 * @load Views.GroupsCollection
 * @load Collections.Groups
 */
Views.EditCategoryDialog = Views.AbstractDialogForm.extend({
	
	_template: "edit-category-dialog",

	_success: function(data){
		var old_group = this._context.getModel().get("group_id");
		this._context.getModel().update(data.model);
		
		Models.Budget.getInstance().update(data.budget);
		
		var new_group = this._context.getModel().get("group_id");
		
		if (old_group != new_group){
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
	
	_getLayoutLabels: function(){
		return $.extend(this._super(), {title: i18n["/dialogs/titles/edit_category"]});
	}
});

create_singleton(Views.EditCategoryDialog);
/**
 * @load Views.Abstract
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
 * @load Views.Body
 * Абстракный класс для контекст-меню
 */
Views.AbstractContextMenu = Views.AbstractMenu.extend({
	
	_template: "context-menu",
	_is_shown: false,
	_coor: {},
	_context: null,
	
	initialize: function(){	
		this._render();
		
		this._el.find('a').click($.proxy(function(e){
			this._onItemClick(e, [this._context]);
			this.hide();
			return false;
		}, this));
		
		this._el.mousedown(function(){
			return false;
		});
		
		Views.Body.getInstance().getElement().mousedown($.proxy(function(){
			if (this.isShown()){
					this.hide();
			}
		}, this));
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
 * @load Views.AbstractContextMenu
 * @load Views.EditCategoryDialog
 * @load Views.ConfirmDialog
 * @load Collections.Categories
 * @load Views.MoneyFlowWithdrawalDialog
 * @load Views.RefundDialog
 * 
 * Класс вьюшка для контекста меню категорий
 */
Views.CategoryMenu = Views.AbstractContextMenu.extend({
	
	_template: "categories-context-menu",
	
	_delete_dialog: null,
	
	_return_remainder_dialog: null,
	
	editCategory: function(context){
		Views.EditCategoryDialog.getInstance().setContext(context).show();
	},
	
	deleteCategory: function(context){
		
		if (_.isNull(this._delete_dialog)){
			this._delete_dialog = new Views.ConfirmDialog({
				
				text: i18n["/dialogs/text/delete_category"],				
				
				yes: function(dlg){
					var id = dlg.getContext().getModel().get("id");
					dlg.disableUI();					
					post(_url("/PlannerProcessor/deleteCategory/"), {id: id}, {
						callback: function(){
							dlg.enableUI();
						},
						
						success: function(data){
							dlg.getContext().remove();
							Collections.Categories.getInstance().remove(data.id);
							Models.Budget.getInstance().update(data.budget);
							dlg.hide();
						},
						
						error: function(data){
							alert(data);
							dlg.hide();
						}
					})
				}
			
			});
		}
		
		this._delete_dialog.setContext(context).show();
	},
	
	withdrawal: function(context){
		Views.MoneyFlowWithdrawalDialog.getInstance().setContext(context).show();
	},
	
	refund: function(context){
		Views.RefundDialog.getInstance().setContext(context).show();
	},
	
	returnRemainder: function(context){
		if (_.isNull(this._return_remainder_dialog)){
			this._return_remainder_dialog = new Views.ConfirmDialog({
				text: i18n["/dialogs/text/return_remainder"],
				yes: $.proxy(function(dlg){
					dlg.disableUI();
					post("/MoneyFlowProcessor/returnRemainder/", {id: dlg.getContext().getModel().get("id")}, {
						callback: function(){
							dlg.enableUI();
							dlg.hide();
						},
						success: function(data){
							dlg.getContext().getModel().update(data.model);
							Models.Budget.getInstance().update(data.budget);
						},
						error: function(data){
							alert(data.error);
						}
					});
				}, this)
			});
		}
		
		this._return_remainder_dialog.setContext(context).show();
	}
});
create_singleton(Views.CategoryMenu);
/**
 * @load Views.Abstract
 * @load Views.CategoryMenu
 * Вьюшка для отдельной категории
 */
Views.AbstractCategory = Views.Abstract.extend({
	_model: null,
	
	initialize: function(model){
		this._model = model;
		this._render();
		
		this._el.find('.tab-menu').click($.proxy(function(e){
			Views.CategoryMenu.getInstance().setContext(this).show({x: e.pageX, y: e.pageY});
			return false;
		}, this));
		
		this._model.onUpdate($.proxy(function(){
			this.refresh();
		}, this));
	},
	
	_render: function(){
		var template = $('#category-template').html().render({
			title: this._model.get("title"), 
			amount: this._getAmountValue(),
		});
		
		this._el = $(template);
	},
	
	getModel: function(){
		return this._model;
	},
	
	refresh: function(){
		this._el.updateDataFields(this._model);
	},
	
	_getAmountValue: function(){
		return '';
	}
});
/**
 * @load Views.AbstractCategory
 * Вьюшка для отдельной категории
 */
Views.PlannerCategory = Views.AbstractCategory.extend({
	_getAmountValue: function(){
		return this._model.get("amount");
	}
});
/**
 * @load Views.AbstractDialogForm
 */
Views.EditGroupDialog = Views.AbstractDialogForm.extend({

	_template: "edit-group-dialog",

	_success: function(data){
		this._context.getModel().update(data);
		this._context.refresh();
	},

	_onShow: function(){
		this._el.find("[name=name]").val(this._context.getModel().get("name"));
	},

	_clearAll: function(){
		return ;
	},

	_getLayoutLabels: function(){
		return $.extend(this._super(), {title: i18n["/dialogs/titles/edit_group"]});
	}
});

create_singleton(Views.EditGroupDialog);
/**
 * @load Views.AbstractDialogForm
 * @load Collections.Categories
 * @load Views.PlannerCategory
 * @load Collections.Groups
 */
Views.AddCategoryDialog = Views.AbstractDialogForm.extend({
	
	_template: "add-category-dialog",

	_success: function(data){
		Collections.Categories.getInstance().add(data.model);
		Models.Budget.getInstance().update(data.budget);
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
/**
 * @load Views.AbstractContextMenu
 * @load Views.AddCategoryDialog
 * @load Views.EditGroupDialog
 * @load Views.ConfirmDialog
 * @load Views.GroupsCollection
 * @load Collections.Groups
 */
Views.GroupMenu = Views.AbstractContextMenu.extend({
	_template: 'groups-context-menu',
	
	_delete_dialog: null,
	
	addCategory: function(context){
		Views.AddCategoryDialog.getInstance().setContext(context).show();
	},
	
	editGroup: function(context){
		Views.EditGroupDialog.getInstance().setContext(context).show();
	},
	
	deleteGroup: function(context){
		
		if (_.isNull(this._delete_dialog)){
			this._delete_dialog = new Views.ConfirmDialog({
				
				text: i18n["/dialogs/text/delete_group"],				
				
				yes: function(dlg){
					var id = dlg.getContext().getModel().get("id");
					dlg.disableUI();					
					post(_url("/PlannerProcessor/deleteGroup/"), {id: id}, {
						callback: function(){
							dlg.enableUI();
							dlg.hide();
						},
						
						success: function(data){
							dlg.getContext().remove();
							Views.GroupsCollection.getInstance().remove(data.id);
							Collections.Groups.getInstance().remove(data.id);
						},
						
						error: function(data){
							alert(data);
						}
					})
				}
			
			});
		}
		
		this._delete_dialog.setContext(context).show();
	}
});

create_singleton(Views.GroupMenu);
/**
 * @load Views.Abstract
 * @load Views.PlannerCategory
 * @load Collections.Categories
 * 
 * Класс для отрисвоки группы
 */
Views.AbstractGroup = Views.Abstract.extend({
	_model: null,
	_view_class: null,
	
	initialize: function(model){
		this._model = model;
		this._render();
		
		Collections.Categories.getInstance().onAdd($.proxy(function(model){
			if (this._model.get("id") == model.get("group_id")){
				this.attachCategory(new this._view_class(model));
			}
		}, this));
	},
	
	_render: function(){
		var template = $('#group-template').html().render({name: this._model.get("name")});
		this._el = $(template);
		$('#count').append(this._el);
	},

	attachCategory: function(view){
		view.getElement().insertBefore(this._el.find('#categories-hook'));
	}
});
/**
 * @load Views.AbstractGroup
 * @load Views.GroupMenu
 * @load Views.PlannerCategory
 * Класс для отрисвоки группы
 */
Views.PlannerGroup = Views.AbstractGroup.extend({
	
	_view_class: Views.PlannerCategory,
	
	initialize: function(model){
		this._super(model);
		
		this._el.find('.group-title .tab-menu').click($.proxy(function(e){
			Views.GroupMenu.getInstance().setContext(this).show({x: e.pageX, y: e.pageY});
			return false;
		}, this));
	},

	getModel: function(){
		return this._model;
	},
	
	refresh: function(){
		this._el.find(".group-title").updateDataFields(this._model);
	},
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
