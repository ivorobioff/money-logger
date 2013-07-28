/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

  // The base Class implementation (does nothing)
  this.Class = function(){};
 
  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;
   
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
   
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
           
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
           
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);       
            this._super = tmp;
           
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
   
    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.initialize )
        this.initialize.apply(this, arguments);
    }
   
    // Populate our constructed prototype object
    Class.prototype = prototype;
   
    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;

    // And make this class extendable
    Class.extend = arguments.callee;
   
    return Class;
  };
})();


var Views = {};
var Models = {};
var Collections = {};

//Добавил метод в объект String
String.prototype.toCamelCase = function(){
	
	var arr = this.split('-');
	var n_str = '';
	
	for (var i in arr){
		n_str += arr[i].charAt(0).toUpperCase() + arr[i].substr(1); 
	}
	
	return n_str.charAt(0).toLowerCase() + n_str.substr(1);
}

String.prototype.render = function(data, modif){
	var html = this;
	for (var i in data){
		var escape = true;
		
		if (_.isObject(modif) && _.isFunction(modif[i])){
			data[i] = modif[i](data[i], i);
			escape = false;
		}
		
		var data_ = escape ? _.escape(data[i]) : data[i];
		
		html = html.replace('{{' + i + '}}', data_);
	}
	
	return html;
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

function _url(url){
	return url;
}

function post(url, data, callback){
	url = _url(url);
	$.post(url, data, function(result){
		
		if (_.isFunction(callback["callback"])){
			callback.callback(result);
		}
		
		if (result.status == 'success'){
			if (_.isFunction(callback["success"])){
				callback.success(result.data);
			}
		}
		else if(result.status == 'error'){
			if (_.isFunction(callback["error"])){
				callback.error(result.data);
			}
		}else throw 'Wrong response status';
	}, 'json');
}