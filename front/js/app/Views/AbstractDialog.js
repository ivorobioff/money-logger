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
	},
	
	_getContentLabels: function(){
		return {};
	}
});