/**
 * @load Views.AbstractDialog
 */
Views.ConfirmDialog = Views.AbstractDialog.extend({
	
	_options: null,
	_template: 'confirm-dialog',
	_params: null,
	
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
		
	getParams: function(){
		return this._params;
	},
	
	setParams: function(params){
		this._params = params;
		return this;
	},
	
	disableUI: function(){
		this._el.find(".submit-button, .cancel-button").attr("disabled", "disabled");
	},
	
	enableUI: function(){
		this._el.find(".submit-button, .cancel-button").removeAttr("disabled");
	}
});