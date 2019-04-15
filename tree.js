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
		initValue = 1.0 * initValue;
		initValue = callback(initValue, args[0]);
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
	return _this;
}();

function Node() {
	this.parent =  null;
	this.children =  [];
	this.value = '';
	this.addChildren = function(obj) {
		obj.parent = this
		this.children.push(obj);
	};
	this.setValue = function(val) {
		this.value = val
	},
	this.inArray = function(val, arr) {
		for(var i in arr) {
			if(arr[i] == val) {
				return true;
			}
		}
		return false;
	},
	this.arrayKeyExist = function(val, arr) {
		for(var i in arr) {
			if(i == val) {
				return true;
			}
		}
		return false;
	},
	this.operateMap = {
		'+': XMath.add,
		'-': XMath.minus,
		'*': XMath.multi,
		'/': XMath.div,
	},
	this.calculate = function() {
		if(this.children.length == 0) {
			return this.value;
		}	
		var args = [];
		var tmp = 0;
		for(var i = 0; i < this.children.length; i++) {
			if(this.arrayKeyExist(this.children[i].value, this.operateMap)) {
				tmp = this.children[i].calculate();
			} else {
				tmp = this.children[i].value
			}
			args.push(tmp);
		}
		
		if(this.arrayKeyExist(this.value, this.operateMap)) {
			return this.operateMap[this.value](args);
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
			if(this.arrayKeyExist(this.children[i].value, this.operateMap)) {
				tmp = this.children[i].toString();
			} else {
				tmp = this.children[i].value
			}
			args.push(tmp);
		}
		
		if(this.arrayKeyExist(this.value, this.operateMap)) {
			return '(' + args.join(this.value) + ')';
		} 
	}
};

var root = new Node();
root.setValue('+')

c1 = new Node();
c1.setValue(1);
c2 = new Node();
c2.setValue(2);
c3 = new Node();
c3.setValue('+');
c3.addChildren(c1);
c3.addChildren(c2);
root.addChildren(c3)

c4 = new Node();
c4.setValue(5);
c5 = new Node();
c5.setValue(6);
c6 = new Node();
c6.setValue('*');
c6.addChildren(c4);
c6.addChildren(c5);


c7 = new Node();
c7.setValue(7);
c8 = new Node();
c8.setValue('-');
c8.addChildren(c6);
c8.addChildren(c7);
root.addChildren(c8)


c9 = new Node();
c9.setValue(3);
c10 = new Node();
c10.setValue(4);
c11 = new Node();
c11.setValue('/');
c11.addChildren(c9);
c11.addChildren(c10);
root.addChildren(c11);
x = root.toString() + ' = ' + root.calculate();
console.log(x);

