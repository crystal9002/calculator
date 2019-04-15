var XMath = function() {
	var _this = this;
	_this.recursion = function(args, callback, initValue) {
		var len = args.length;
		if(len == 0) {
			return initValue;
		}
		
		if(initValue == null) {
			initValue = args[0]
			args = args.slice(1);
			return _this.recursion(args, callback, initValue);
		}
		initValue = callback(1.0 * initValue, 1.0 * args[0]);
		args = args.slice(1);
		return _this.recursion(args, callback, initValue);
	};
	_this.add = function(args) { 
		return _this.recursion(args, function(a, b){
			return a + b;
		});
	};
	_this.minus =  function(args) { 
		return _this.recursion(args, function(a, b){
			return a - b;
		});
	};
	_this.multi = function(args) { 
		return _this.recursion(args, function(a, b){
			return a * b;
		});
	};
	_this.div = function(args) { 
		return _this.recursion(args, function(a, b){
			return a / b;
		});
	}
	_this.operateMap = {
		'+': _this.add,
		'-': _this.minus,
		'*': _this.multi,
		'/': _this.div,
	};
	return _this;
}();

var ArrayTookit = function() {
	var _this = this;
	_this.arrayKeyExist = function(val, arr) {
		for(var i in arr) {
			if(i == val) {
				return true;
			}
		}
		return false;
	};
	_this.inArray = function(val, arr) {
		for(var i in arr) {
			if(arr[i] == val) {
				return true;
			}
		}
		return false;
	};
	return _this;
}();

function Node() {
	this.parent =  null;
	this.children =  [];
	this.value = '';
	this.addChildren = function(obj) {
		obj.parent = this;
		this.children.push(obj);
	};
	this.setValue = function(val) {
		this.value = val
	},
	this.getRoot = function(node) {
		if(node == null) {
			node = this;
		}
		if(node.parent == null) {
			return node;
		}
		return node.getRoot(node.parent);
	},
	this.calculate = function() {
		if(this.children.length == 0) {
			return this.value;
		}	
		var args = [];
		var tmp = 0;
		for(var i = 0; i < this.children.length; i++) {
			if(ArrayTookit.arrayKeyExist(this.children[i].value, XMath.operateMap)) {
				tmp = this.children[i].calculate();
			} else {
				tmp = this.children[i].value
			}
			args.push(tmp);
		}
		
		if(ArrayTookit.arrayKeyExist(this.value, XMath.operateMap)) {
			return XMath.operateMap[this.value](args);
		} 
		throw new Error('wrong operate code:' + this.value);
	},
	this.toString = function() {
		if(this.children.length == 0) {
			return this.value;
		}	
		var args = [];
		var tmp = 0;
		for(var i = 0; i < this.children.length; i++) {
			if(ArrayTookit.arrayKeyExist(this.children[i].value, XMath.operateMap)) {
				tmp = this.children[i].toString();
			} else {
				tmp = this.children[i].value
			}
			args.push(tmp);
		}
		
		if(ArrayTookit.arrayKeyExist(this.value, XMath.operateMap)) {
			return '(' + args.join(this.value) + ')';
		} 
	}
};

function NodeBuilder(str) {
	this.src = str;
	this.index = 0;
	this.container = {};
	this.parse = function(str) {
		if(str.indexOf('(') >= 0) {
			return this.bracketsParse(str);
		} else {
			return this.mathParse(str);
		}
	};
	this.root = null;
	this.bracketsParse = function(str) {
		var matches = str.match(/\(.*?\)/g);
		for(var i in matches) {		
			matches[i] = matches[i].substr(matches[i].lastIndexOf('('));
			matches[i] = matches[i].replace(/[\(]+/g, '').replace(/[\)]+/g, '');
			var key = 'matches_' + this.index++;
			str = str.replace('(' + matches[i] + ')', key);
			this.container[key] = this.mathParse(matches[i]);
		}
		return this.parse(str);
	};
	
	this.mathParse = function(str) {
		var k = 0;
		var res = [];
		var arr = str.match(/([\d\.\w]+)|([\+\-\*\/])/g);
		for(var i in arr) {
			var node = new Node();
			node.setValue(arr[i]);
			res[k++] = node;
		}
		for(var i in res) {
			i = parseInt(i);
			// 偶数下标项为数字
			if(i % 2 == 0) {
				if(isNaN(res[i].value)) {
					res[i] = this.container[res[i].value];
				}
			}
		}
		for(var i in res) {
			i = parseInt(i);
			// 偶数下标项为数字或者子节点
			if(i % 2 == 0) {
				continue;
			}
			// 奇数下标的为操作符
			if(res[i].value == '*' || res[i].value == '/') {
				if(i > 1) {
					var prev = res[i-2].children.pop();
					res[i-2].addChildren(res[i]);
					res[i].addChildren(prev);
					res[i].addChildren(res[i+1]);
				} else {
					res[i].addChildren(res[0].getRoot());
					res[i].addChildren(res[i+1]);
				}
			} else {
				res[i].addChildren(res[0].getRoot());
				res[i].addChildren(res[i+1]);
			}
		}
		return res[0].getRoot();
	};
	return this.parse(this.src);
};

var str = "(1+2)+(5*6-7)+(3/4)";
var root = new NodeBuilder(str);
console.log(root.toString() + ' = ' + root.calculate());