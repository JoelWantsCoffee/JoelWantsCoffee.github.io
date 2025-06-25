(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

console.warn('Compiled in DEV mode. Follow the advice at https://elm-lang.org/0.19.1/optimize for better performance and smaller assets.');


// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**_UNUSED/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**_UNUSED/
	if (typeof x.$ === 'undefined')
	//*/
	/**/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0_UNUSED = 0;
var _Utils_Tuple0 = { $: '#0' };

function _Utils_Tuple2_UNUSED(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3_UNUSED(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr_UNUSED(c) { return c; }
function _Utils_chr(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil_UNUSED = { $: 0 };
var _List_Nil = { $: '[]' };

function _List_Cons_UNUSED(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log_UNUSED = F2(function(tag, value)
{
	return value;
});

var _Debug_log = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString_UNUSED(value)
{
	return '<internals>';
}

function _Debug_toString(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash_UNUSED(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.start.line === region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'on lines ' + region.start.line + ' through ' + region.end.line;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap(value) { return { $: 0, a: value }; }
function _Json_unwrap(value) { return value.a; }

function _Json_wrap_UNUSED(value) { return value; }
function _Json_unwrap_UNUSED(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**_UNUSED/
	var node = args['node'];
	//*/
	/**/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS
//
// For some reason, tabs can appear in href protocols and it still works.
// So '\tjava\tSCRIPT:alert("!!!")' and 'javascript:alert("!!!")' are the same
// in practice. That is why _VirtualDom_RE_js and _VirtualDom_RE_js_html look
// so freaky.
//
// Pulling the regular expressions out to the top level gives a slight speed
// boost in small benchmarks (4-10%) but hoisting values to reduce allocation
// can be unpredictable in large programs where JIT may have a harder time with
// functions are not fully self-contained. The benefit is more that the js and
// js_html ones are so weird that I prefer to see them near each other.


var _VirtualDom_RE_script = /^script$/i;
var _VirtualDom_RE_on_formAction = /^(on|formAction$)/i;
var _VirtualDom_RE_js = /^\s*j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:/i;
var _VirtualDom_RE_js_html = /^\s*(j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:|d\s*a\s*t\s*a\s*:\s*t\s*e\s*x\s*t\s*\/\s*h\s*t\s*m\s*l\s*(,|;))/i;


function _VirtualDom_noScript(tag)
{
	return _VirtualDom_RE_script.test(tag) ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return _VirtualDom_RE_on_formAction.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return _VirtualDom_RE_js.test(value)
		? /**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return _VirtualDom_RE_js_html.test(value)
		? /**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlJson(value)
{
	return (typeof _Json_unwrap(value) === 'string' && _VirtualDom_RE_js_html.test(_Json_unwrap(value)))
		? _Json_wrap(
			/**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		) : value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		message: func(record.message),
		stopPropagation: record.stopPropagation,
		preventDefault: record.preventDefault
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.message;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.stopPropagation;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.preventDefault) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var view = impl.view;
			/**_UNUSED/
			var domNode = args['node'];
			//*/
			/**/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.setup && impl.setup(sendToApp)
			var view = impl.view;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.body);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.title) && (_VirtualDom_doc.title = title = doc.title);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.onUrlChange;
	var onUrlRequest = impl.onUrlRequest;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		setup: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.protocol === next.protocol
							&& curr.host === next.host
							&& curr.port_.a === next.port_.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		init: function(flags)
		{
			return A3(impl.init, flags, _Browser_getUrl(), key);
		},
		view: impl.view,
		update: impl.update,
		subscriptions: impl.subscriptions
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { hidden: 'hidden', change: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { hidden: 'mozHidden', change: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { hidden: 'msHidden', change: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { hidden: 'webkitHidden', change: 'webkitvisibilitychange' }
		: { hidden: 'hidden', change: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		scene: _Browser_getScene(),
		viewport: {
			x: _Browser_window.pageXOffset,
			y: _Browser_window.pageYOffset,
			width: _Browser_doc.documentElement.clientWidth,
			height: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		width: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		height: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			scene: {
				width: node.scrollWidth,
				height: node.scrollHeight
			},
			viewport: {
				x: node.scrollLeft,
				y: node.scrollTop,
				width: node.clientWidth,
				height: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			scene: _Browser_getScene(),
			viewport: {
				x: x,
				y: y,
				width: _Browser_doc.documentElement.clientWidth,
				height: _Browser_doc.documentElement.clientHeight
			},
			element: {
				x: x + rect.left,
				y: y + rect.top,
				width: rect.width,
				height: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}




// VIRTUAL-DOM WIDGETS


var _Markdown_toHtml = F3(function(options, factList, rawMarkdown)
{
	return _VirtualDom_custom(
		factList,
		{
			a: options,
			b: rawMarkdown
		},
		_Markdown_render,
		_Markdown_diff
	);
});



// WIDGET IMPLEMENTATION


function _Markdown_render(model)
{
	return A2(_Markdown_replace, model, _VirtualDom_doc.createElement('div'));
}


function _Markdown_diff(x, y)
{
	return x.b === y.b && x.a === y.a
		? false
		: _Markdown_replace(y);
}


var _Markdown_replace = F2(function(model, div)
{
	div.innerHTML = _Markdown_marked(model.b, _Markdown_formatOptions(model.a));
	return div;
});



// ACTUAL MARKDOWN PARSER


var _Markdown_marked = function() {
	// catch the `marked` object regardless of the outer environment.
	// (ex. a CommonJS module compatible environment.)
	// note that this depends on marked's implementation of environment detection.
	var module = {};
	var exports = module.exports = {};

	/**
	 * marked - a markdown parser
	 * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
	 * https://github.com/chjj/marked
	 * commit cd2f6f5b7091154c5526e79b5f3bfb4d15995a51
	 */
	(function(){var block={newline:/^\n+/,code:/^( {4}[^\n]+\n*)+/,fences:noop,hr:/^( *[-*_]){3,} *(?:\n+|$)/,heading:/^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,nptable:noop,lheading:/^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,blockquote:/^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,list:/^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,html:/^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,table:noop,paragraph:/^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,text:/^[^\n]+/};block.bullet=/(?:[*+-]|\d+\.)/;block.item=/^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;block.item=replace(block.item,"gm")(/bull/g,block.bullet)();block.list=replace(block.list)(/bull/g,block.bullet)("hr","\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))")("def","\\n+(?="+block.def.source+")")();block.blockquote=replace(block.blockquote)("def",block.def)();block._tag="(?!(?:"+"a|em|strong|small|s|cite|q|dfn|abbr|data|time|code"+"|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo"+"|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b";block.html=replace(block.html)("comment",/<!--[\s\S]*?-->/)("closed",/<(tag)[\s\S]+?<\/\1>/)("closing",/<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)(/tag/g,block._tag)();block.paragraph=replace(block.paragraph)("hr",block.hr)("heading",block.heading)("lheading",block.lheading)("blockquote",block.blockquote)("tag","<"+block._tag)("def",block.def)();block.normal=merge({},block);block.gfm=merge({},block.normal,{fences:/^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\s*\1 *(?:\n+|$)/,paragraph:/^/,heading:/^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/});block.gfm.paragraph=replace(block.paragraph)("(?!","(?!"+block.gfm.fences.source.replace("\\1","\\2")+"|"+block.list.source.replace("\\1","\\3")+"|")();block.tables=merge({},block.gfm,{nptable:/^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,table:/^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/});function Lexer(options){this.tokens=[];this.tokens.links={};this.options=options||marked.defaults;this.rules=block.normal;if(this.options.gfm){if(this.options.tables){this.rules=block.tables}else{this.rules=block.gfm}}}Lexer.rules=block;Lexer.lex=function(src,options){var lexer=new Lexer(options);return lexer.lex(src)};Lexer.prototype.lex=function(src){src=src.replace(/\r\n|\r/g,"\n").replace(/\t/g,"    ").replace(/\u00a0/g," ").replace(/\u2424/g,"\n");return this.token(src,true)};Lexer.prototype.token=function(src,top,bq){var src=src.replace(/^ +$/gm,""),next,loose,cap,bull,b,item,space,i,l;while(src){if(cap=this.rules.newline.exec(src)){src=src.substring(cap[0].length);if(cap[0].length>1){this.tokens.push({type:"space"})}}if(cap=this.rules.code.exec(src)){src=src.substring(cap[0].length);cap=cap[0].replace(/^ {4}/gm,"");this.tokens.push({type:"code",text:!this.options.pedantic?cap.replace(/\n+$/,""):cap});continue}if(cap=this.rules.fences.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"code",lang:cap[2],text:cap[3]||""});continue}if(cap=this.rules.heading.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"heading",depth:cap[1].length,text:cap[2]});continue}if(top&&(cap=this.rules.nptable.exec(src))){src=src.substring(cap[0].length);item={type:"table",header:cap[1].replace(/^ *| *\| *$/g,"").split(/ *\| */),align:cap[2].replace(/^ *|\| *$/g,"").split(/ *\| */),cells:cap[3].replace(/\n$/,"").split("\n")};for(i=0;i<item.align.length;i++){if(/^ *-+: *$/.test(item.align[i])){item.align[i]="right"}else if(/^ *:-+: *$/.test(item.align[i])){item.align[i]="center"}else if(/^ *:-+ *$/.test(item.align[i])){item.align[i]="left"}else{item.align[i]=null}}for(i=0;i<item.cells.length;i++){item.cells[i]=item.cells[i].split(/ *\| */)}this.tokens.push(item);continue}if(cap=this.rules.lheading.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"heading",depth:cap[2]==="="?1:2,text:cap[1]});continue}if(cap=this.rules.hr.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"hr"});continue}if(cap=this.rules.blockquote.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"blockquote_start"});cap=cap[0].replace(/^ *> ?/gm,"");this.token(cap,top,true);this.tokens.push({type:"blockquote_end"});continue}if(cap=this.rules.list.exec(src)){src=src.substring(cap[0].length);bull=cap[2];this.tokens.push({type:"list_start",ordered:bull.length>1});cap=cap[0].match(this.rules.item);next=false;l=cap.length;i=0;for(;i<l;i++){item=cap[i];space=item.length;item=item.replace(/^ *([*+-]|\d+\.) +/,"");if(~item.indexOf("\n ")){space-=item.length;item=!this.options.pedantic?item.replace(new RegExp("^ {1,"+space+"}","gm"),""):item.replace(/^ {1,4}/gm,"")}if(this.options.smartLists&&i!==l-1){b=block.bullet.exec(cap[i+1])[0];if(bull!==b&&!(bull.length>1&&b.length>1)){src=cap.slice(i+1).join("\n")+src;i=l-1}}loose=next||/\n\n(?!\s*$)/.test(item);if(i!==l-1){next=item.charAt(item.length-1)==="\n";if(!loose)loose=next}this.tokens.push({type:loose?"loose_item_start":"list_item_start"});this.token(item,false,bq);this.tokens.push({type:"list_item_end"})}this.tokens.push({type:"list_end"});continue}if(cap=this.rules.html.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:this.options.sanitize?"paragraph":"html",pre:!this.options.sanitizer&&(cap[1]==="pre"||cap[1]==="script"||cap[1]==="style"),text:cap[0]});continue}if(!bq&&top&&(cap=this.rules.def.exec(src))){src=src.substring(cap[0].length);this.tokens.links[cap[1].toLowerCase()]={href:cap[2],title:cap[3]};continue}if(top&&(cap=this.rules.table.exec(src))){src=src.substring(cap[0].length);item={type:"table",header:cap[1].replace(/^ *| *\| *$/g,"").split(/ *\| */),align:cap[2].replace(/^ *|\| *$/g,"").split(/ *\| */),cells:cap[3].replace(/(?: *\| *)?\n$/,"").split("\n")};for(i=0;i<item.align.length;i++){if(/^ *-+: *$/.test(item.align[i])){item.align[i]="right"}else if(/^ *:-+: *$/.test(item.align[i])){item.align[i]="center"}else if(/^ *:-+ *$/.test(item.align[i])){item.align[i]="left"}else{item.align[i]=null}}for(i=0;i<item.cells.length;i++){item.cells[i]=item.cells[i].replace(/^ *\| *| *\| *$/g,"").split(/ *\| */)}this.tokens.push(item);continue}if(top&&(cap=this.rules.paragraph.exec(src))){src=src.substring(cap[0].length);this.tokens.push({type:"paragraph",text:cap[1].charAt(cap[1].length-1)==="\n"?cap[1].slice(0,-1):cap[1]});continue}if(cap=this.rules.text.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"text",text:cap[0]});continue}if(src){throw new Error("Infinite loop on byte: "+src.charCodeAt(0))}}return this.tokens};var inline={escape:/^\\([\\`*{}\[\]()#+\-.!_>])/,autolink:/^<([^ >]+(@|:\/)[^ >]+)>/,url:noop,tag:/^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,link:/^!?\[(inside)\]\(href\)/,reflink:/^!?\[(inside)\]\s*\[([^\]]*)\]/,nolink:/^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,strong:/^_\_([\s\S]+?)_\_(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,em:/^\b_((?:[^_]|_\_)+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,code:/^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,br:/^ {2,}\n(?!\s*$)/,del:noop,text:/^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/};inline._inside=/(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;inline._href=/\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;inline.link=replace(inline.link)("inside",inline._inside)("href",inline._href)();inline.reflink=replace(inline.reflink)("inside",inline._inside)();inline.normal=merge({},inline);inline.pedantic=merge({},inline.normal,{strong:/^_\_(?=\S)([\s\S]*?\S)_\_(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,em:/^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/});inline.gfm=merge({},inline.normal,{escape:replace(inline.escape)("])","~|])")(),url:/^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,del:/^~~(?=\S)([\s\S]*?\S)~~/,text:replace(inline.text)("]|","~]|")("|","|https?://|")()});inline.breaks=merge({},inline.gfm,{br:replace(inline.br)("{2,}","*")(),text:replace(inline.gfm.text)("{2,}","*")()});function InlineLexer(links,options){this.options=options||marked.defaults;this.links=links;this.rules=inline.normal;this.renderer=this.options.renderer||new Renderer;this.renderer.options=this.options;if(!this.links){throw new Error("Tokens array requires a `links` property.")}if(this.options.gfm){if(this.options.breaks){this.rules=inline.breaks}else{this.rules=inline.gfm}}else if(this.options.pedantic){this.rules=inline.pedantic}}InlineLexer.rules=inline;InlineLexer.output=function(src,links,options){var inline=new InlineLexer(links,options);return inline.output(src)};InlineLexer.prototype.output=function(src){var out="",link,text,href,cap;while(src){if(cap=this.rules.escape.exec(src)){src=src.substring(cap[0].length);out+=cap[1];continue}if(cap=this.rules.autolink.exec(src)){src=src.substring(cap[0].length);if(cap[2]==="@"){text=cap[1].charAt(6)===":"?this.mangle(cap[1].substring(7)):this.mangle(cap[1]);href=this.mangle("mailto:")+text}else{text=escape(cap[1]);href=text}out+=this.renderer.link(href,null,text);continue}if(!this.inLink&&(cap=this.rules.url.exec(src))){src=src.substring(cap[0].length);text=escape(cap[1]);href=text;out+=this.renderer.link(href,null,text);continue}if(cap=this.rules.tag.exec(src)){if(!this.inLink&&/^<a /i.test(cap[0])){this.inLink=true}else if(this.inLink&&/^<\/a>/i.test(cap[0])){this.inLink=false}src=src.substring(cap[0].length);out+=this.options.sanitize?this.options.sanitizer?this.options.sanitizer(cap[0]):escape(cap[0]):cap[0];continue}if(cap=this.rules.link.exec(src)){src=src.substring(cap[0].length);this.inLink=true;out+=this.outputLink(cap,{href:cap[2],title:cap[3]});this.inLink=false;continue}if((cap=this.rules.reflink.exec(src))||(cap=this.rules.nolink.exec(src))){src=src.substring(cap[0].length);link=(cap[2]||cap[1]).replace(/\s+/g," ");link=this.links[link.toLowerCase()];if(!link||!link.href){out+=cap[0].charAt(0);src=cap[0].substring(1)+src;continue}this.inLink=true;out+=this.outputLink(cap,link);this.inLink=false;continue}if(cap=this.rules.strong.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.strong(this.output(cap[2]||cap[1]));continue}if(cap=this.rules.em.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.em(this.output(cap[2]||cap[1]));continue}if(cap=this.rules.code.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.codespan(escape(cap[2],true));continue}if(cap=this.rules.br.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.br();continue}if(cap=this.rules.del.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.del(this.output(cap[1]));continue}if(cap=this.rules.text.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.text(escape(this.smartypants(cap[0])));continue}if(src){throw new Error("Infinite loop on byte: "+src.charCodeAt(0))}}return out};InlineLexer.prototype.outputLink=function(cap,link){var href=escape(link.href),title=link.title?escape(link.title):null;return cap[0].charAt(0)!=="!"?this.renderer.link(href,title,this.output(cap[1])):this.renderer.image(href,title,escape(cap[1]))};InlineLexer.prototype.smartypants=function(text){if(!this.options.smartypants)return text;return text.replace(/---/g,"—").replace(/--/g,"–").replace(/(^|[-\u2014\/(\[{"\s])'/g,"$1‘").replace(/'/g,"’").replace(/(^|[-\u2014\/(\[{\u2018\s])"/g,"$1“").replace(/"/g,"”").replace(/\.{3}/g,"…")};InlineLexer.prototype.mangle=function(text){if(!this.options.mangle)return text;var out="",l=text.length,i=0,ch;for(;i<l;i++){ch=text.charCodeAt(i);if(Math.random()>.5){ch="x"+ch.toString(16)}out+="&#"+ch+";"}return out};function Renderer(options){this.options=options||{}}Renderer.prototype.code=function(code,lang,escaped){if(this.options.highlight){var out=this.options.highlight(code,lang);if(out!=null&&out!==code){escaped=true;code=out}}if(!lang){return"<pre><code>"+(escaped?code:escape(code,true))+"\n</code></pre>"}return'<pre><code class="'+this.options.langPrefix+escape(lang,true)+'">'+(escaped?code:escape(code,true))+"\n</code></pre>\n"};Renderer.prototype.blockquote=function(quote){return"<blockquote>\n"+quote+"</blockquote>\n"};Renderer.prototype.html=function(html){return html};Renderer.prototype.heading=function(text,level,raw){return"<h"+level+' id="'+this.options.headerPrefix+raw.toLowerCase().replace(/[^\w]+/g,"-")+'">'+text+"</h"+level+">\n"};Renderer.prototype.hr=function(){return this.options.xhtml?"<hr/>\n":"<hr>\n"};Renderer.prototype.list=function(body,ordered){var type=ordered?"ol":"ul";return"<"+type+">\n"+body+"</"+type+">\n"};Renderer.prototype.listitem=function(text){return"<li>"+text+"</li>\n"};Renderer.prototype.paragraph=function(text){return"<p>"+text+"</p>\n"};Renderer.prototype.table=function(header,body){return"<table>\n"+"<thead>\n"+header+"</thead>\n"+"<tbody>\n"+body+"</tbody>\n"+"</table>\n"};Renderer.prototype.tablerow=function(content){return"<tr>\n"+content+"</tr>\n"};Renderer.prototype.tablecell=function(content,flags){var type=flags.header?"th":"td";var tag=flags.align?"<"+type+' style="text-align:'+flags.align+'">':"<"+type+">";return tag+content+"</"+type+">\n"};Renderer.prototype.strong=function(text){return"<strong>"+text+"</strong>"};Renderer.prototype.em=function(text){return"<em>"+text+"</em>"};Renderer.prototype.codespan=function(text){return"<code>"+text+"</code>"};Renderer.prototype.br=function(){return this.options.xhtml?"<br/>":"<br>"};Renderer.prototype.del=function(text){return"<del>"+text+"</del>"};Renderer.prototype.link=function(href,title,text){if(this.options.sanitize){try{var prot=decodeURIComponent(unescape(href)).replace(/[^\w:]/g,"").toLowerCase()}catch(e){return""}if(prot.indexOf("javascript:")===0||prot.indexOf("vbscript:")===0||prot.indexOf("data:")===0){return""}}var out='<a href="'+href+'"';if(title){out+=' title="'+title+'"'}out+=">"+text+"</a>";return out};Renderer.prototype.image=function(href,title,text){var out='<img src="'+href+'" alt="'+text+'"';if(title){out+=' title="'+title+'"'}out+=this.options.xhtml?"/>":">";return out};Renderer.prototype.text=function(text){return text};function Parser(options){this.tokens=[];this.token=null;this.options=options||marked.defaults;this.options.renderer=this.options.renderer||new Renderer;this.renderer=this.options.renderer;this.renderer.options=this.options}Parser.parse=function(src,options,renderer){var parser=new Parser(options,renderer);return parser.parse(src)};Parser.prototype.parse=function(src){this.inline=new InlineLexer(src.links,this.options,this.renderer);this.tokens=src.reverse();var out="";while(this.next()){out+=this.tok()}return out};Parser.prototype.next=function(){return this.token=this.tokens.pop()};Parser.prototype.peek=function(){return this.tokens[this.tokens.length-1]||0};Parser.prototype.parseText=function(){var body=this.token.text;while(this.peek().type==="text"){body+="\n"+this.next().text}return this.inline.output(body)};Parser.prototype.tok=function(){switch(this.token.type){case"space":{return""}case"hr":{return this.renderer.hr()}case"heading":{return this.renderer.heading(this.inline.output(this.token.text),this.token.depth,this.token.text)}case"code":{return this.renderer.code(this.token.text,this.token.lang,this.token.escaped)}case"table":{var header="",body="",i,row,cell,flags,j;cell="";for(i=0;i<this.token.header.length;i++){flags={header:true,align:this.token.align[i]};cell+=this.renderer.tablecell(this.inline.output(this.token.header[i]),{header:true,align:this.token.align[i]})}header+=this.renderer.tablerow(cell);for(i=0;i<this.token.cells.length;i++){row=this.token.cells[i];cell="";for(j=0;j<row.length;j++){cell+=this.renderer.tablecell(this.inline.output(row[j]),{header:false,align:this.token.align[j]})}body+=this.renderer.tablerow(cell)}return this.renderer.table(header,body)}case"blockquote_start":{var body="";while(this.next().type!=="blockquote_end"){body+=this.tok()}return this.renderer.blockquote(body)}case"list_start":{var body="",ordered=this.token.ordered;while(this.next().type!=="list_end"){body+=this.tok()}return this.renderer.list(body,ordered)}case"list_item_start":{var body="";while(this.next().type!=="list_item_end"){body+=this.token.type==="text"?this.parseText():this.tok()}return this.renderer.listitem(body)}case"loose_item_start":{var body="";while(this.next().type!=="list_item_end"){body+=this.tok()}return this.renderer.listitem(body)}case"html":{var html=!this.token.pre&&!this.options.pedantic?this.inline.output(this.token.text):this.token.text;return this.renderer.html(html)}case"paragraph":{return this.renderer.paragraph(this.inline.output(this.token.text))}case"text":{return this.renderer.paragraph(this.parseText())}}};function escape(html,encode){return html.replace(!encode?/&(?!#?\w+;)/g:/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function unescape(html){return html.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/g,function(_,n){n=n.toLowerCase();if(n==="colon")return":";if(n.charAt(0)==="#"){return n.charAt(1)==="x"?String.fromCharCode(parseInt(n.substring(2),16)):String.fromCharCode(+n.substring(1))}return""})}function replace(regex,opt){regex=regex.source;opt=opt||"";return function self(name,val){if(!name)return new RegExp(regex,opt);val=val.source||val;val=val.replace(/(^|[^\[])\^/g,"$1");regex=regex.replace(name,val);return self}}function noop(){}noop.exec=noop;function merge(obj){var i=1,target,key;for(;i<arguments.length;i++){target=arguments[i];for(key in target){if(Object.prototype.hasOwnProperty.call(target,key)){obj[key]=target[key]}}}return obj}function marked(src,opt,callback){if(callback||typeof opt==="function"){if(!callback){callback=opt;opt=null}opt=merge({},marked.defaults,opt||{});var highlight=opt.highlight,tokens,pending,i=0;try{tokens=Lexer.lex(src,opt)}catch(e){return callback(e)}pending=tokens.length;var done=function(err){if(err){opt.highlight=highlight;return callback(err)}var out;try{out=Parser.parse(tokens,opt)}catch(e){err=e}opt.highlight=highlight;return err?callback(err):callback(null,out)};if(!highlight||highlight.length<3){return done()}delete opt.highlight;if(!pending)return done();for(;i<tokens.length;i++){(function(token){if(token.type!=="code"){return--pending||done()}return highlight(token.text,token.lang,function(err,code){if(err)return done(err);if(code==null||code===token.text){return--pending||done()}token.text=code;token.escaped=true;--pending||done()})})(tokens[i])}return}try{if(opt)opt=merge({},marked.defaults,opt);return Parser.parse(Lexer.lex(src,opt),opt)}catch(e){e.message+="\nPlease report this to https://github.com/chjj/marked.";if((opt||marked.defaults).silent){return"<p>An error occured:</p><pre>"+escape(e.message+"",true)+"</pre>"}throw e}}marked.options=marked.setOptions=function(opt){merge(marked.defaults,opt);return marked};marked.defaults={gfm:true,tables:true,breaks:false,pedantic:false,sanitize:false,sanitizer:null,mangle:true,smartLists:false,silent:false,highlight:null,langPrefix:"lang-",smartypants:false,headerPrefix:"",renderer:new Renderer,xhtml:false};marked.Parser=Parser;marked.parser=Parser.parse;marked.Renderer=Renderer;marked.Lexer=Lexer;marked.lexer=Lexer.lex;marked.InlineLexer=InlineLexer;marked.inlineLexer=InlineLexer.output;marked.parse=marked;if(typeof module!=="undefined"&&typeof exports==="object"){module.exports=marked}else if(typeof define==="function"&&define.amd){define(function(){return marked})}else{this.marked=marked}}).call(function(){return this||(typeof window!=="undefined"?window:global)}());

	return module.exports;
}();


// FORMAT OPTIONS FOR MARKED IMPLEMENTATION

function _Markdown_formatOptions(options)
{
	function toHighlight(code, lang)
	{
		if (!lang && $elm$core$Maybe$isJust(options.defaultHighlighting))
		{
			lang = options.defaultHighlighting.a;
		}

		if (typeof hljs !== 'undefined' && lang && hljs.listLanguages().indexOf(lang) >= 0)
		{
			return hljs.highlight(lang, code, true).value;
		}

		return code;
	}

	var gfm = options.githubFlavored.a;

	return {
		highlight: toHighlight,
		gfm: gfm,
		tables: gfm && gfm.tables,
		breaks: gfm && gfm.breaks,
		sanitize: options.sanitize,
		smartypants: options.smartypants
	};
}


/*
 * Copyright (c) 2010 Mozilla Corporation
 * Copyright (c) 2010 Vladimir Vukicevic
 * Copyright (c) 2013 John Mayer
 * Copyright (c) 2018 Andrey Kuzmin
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

// Vector2

var _MJS_v2 = F2(function(x, y) {
    return new Float64Array([x, y]);
});

var _MJS_v2getX = function(a) {
    return a[0];
};

var _MJS_v2getY = function(a) {
    return a[1];
};

var _MJS_v2setX = F2(function(x, a) {
    return new Float64Array([x, a[1]]);
});

var _MJS_v2setY = F2(function(y, a) {
    return new Float64Array([a[0], y]);
});

var _MJS_v2toRecord = function(a) {
    return { x: a[0], y: a[1] };
};

var _MJS_v2fromRecord = function(r) {
    return new Float64Array([r.x, r.y]);
};

var _MJS_v2add = F2(function(a, b) {
    var r = new Float64Array(2);
    r[0] = a[0] + b[0];
    r[1] = a[1] + b[1];
    return r;
});

var _MJS_v2sub = F2(function(a, b) {
    var r = new Float64Array(2);
    r[0] = a[0] - b[0];
    r[1] = a[1] - b[1];
    return r;
});

var _MJS_v2negate = function(a) {
    var r = new Float64Array(2);
    r[0] = -a[0];
    r[1] = -a[1];
    return r;
};

var _MJS_v2direction = F2(function(a, b) {
    var r = new Float64Array(2);
    r[0] = a[0] - b[0];
    r[1] = a[1] - b[1];
    var im = 1.0 / _MJS_v2lengthLocal(r);
    r[0] = r[0] * im;
    r[1] = r[1] * im;
    return r;
});

function _MJS_v2lengthLocal(a) {
    return Math.sqrt(a[0] * a[0] + a[1] * a[1]);
}
var _MJS_v2length = _MJS_v2lengthLocal;

var _MJS_v2lengthSquared = function(a) {
    return a[0] * a[0] + a[1] * a[1];
};

var _MJS_v2distance = F2(function(a, b) {
    var dx = a[0] - b[0];
    var dy = a[1] - b[1];
    return Math.sqrt(dx * dx + dy * dy);
});

var _MJS_v2distanceSquared = F2(function(a, b) {
    var dx = a[0] - b[0];
    var dy = a[1] - b[1];
    return dx * dx + dy * dy;
});

var _MJS_v2normalize = function(a) {
    var r = new Float64Array(2);
    var im = 1.0 / _MJS_v2lengthLocal(a);
    r[0] = a[0] * im;
    r[1] = a[1] * im;
    return r;
};

var _MJS_v2scale = F2(function(k, a) {
    var r = new Float64Array(2);
    r[0] = a[0] * k;
    r[1] = a[1] * k;
    return r;
});

var _MJS_v2dot = F2(function(a, b) {
    return a[0] * b[0] + a[1] * b[1];
});

// Vector3

var _MJS_v3temp1Local = new Float64Array(3);
var _MJS_v3temp2Local = new Float64Array(3);
var _MJS_v3temp3Local = new Float64Array(3);

var _MJS_v3 = F3(function(x, y, z) {
    return new Float64Array([x, y, z]);
});

var _MJS_v3getX = function(a) {
    return a[0];
};

var _MJS_v3getY = function(a) {
    return a[1];
};

var _MJS_v3getZ = function(a) {
    return a[2];
};

var _MJS_v3setX = F2(function(x, a) {
    return new Float64Array([x, a[1], a[2]]);
});

var _MJS_v3setY = F2(function(y, a) {
    return new Float64Array([a[0], y, a[2]]);
});

var _MJS_v3setZ = F2(function(z, a) {
    return new Float64Array([a[0], a[1], z]);
});

var _MJS_v3toRecord = function(a) {
    return { x: a[0], y: a[1], z: a[2] };
};

var _MJS_v3fromRecord = function(r) {
    return new Float64Array([r.x, r.y, r.z]);
};

var _MJS_v3add = F2(function(a, b) {
    var r = new Float64Array(3);
    r[0] = a[0] + b[0];
    r[1] = a[1] + b[1];
    r[2] = a[2] + b[2];
    return r;
});

function _MJS_v3subLocal(a, b, r) {
    if (r === undefined) {
        r = new Float64Array(3);
    }
    r[0] = a[0] - b[0];
    r[1] = a[1] - b[1];
    r[2] = a[2] - b[2];
    return r;
}
var _MJS_v3sub = F2(_MJS_v3subLocal);

var _MJS_v3negate = function(a) {
    var r = new Float64Array(3);
    r[0] = -a[0];
    r[1] = -a[1];
    r[2] = -a[2];
    return r;
};

function _MJS_v3directionLocal(a, b, r) {
    if (r === undefined) {
        r = new Float64Array(3);
    }
    return _MJS_v3normalizeLocal(_MJS_v3subLocal(a, b, r), r);
}
var _MJS_v3direction = F2(_MJS_v3directionLocal);

function _MJS_v3lengthLocal(a) {
    return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
}
var _MJS_v3length = _MJS_v3lengthLocal;

var _MJS_v3lengthSquared = function(a) {
    return a[0] * a[0] + a[1] * a[1] + a[2] * a[2];
};

var _MJS_v3distance = F2(function(a, b) {
    var dx = a[0] - b[0];
    var dy = a[1] - b[1];
    var dz = a[2] - b[2];
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
});

var _MJS_v3distanceSquared = F2(function(a, b) {
    var dx = a[0] - b[0];
    var dy = a[1] - b[1];
    var dz = a[2] - b[2];
    return dx * dx + dy * dy + dz * dz;
});

function _MJS_v3normalizeLocal(a, r) {
    if (r === undefined) {
        r = new Float64Array(3);
    }
    var im = 1.0 / _MJS_v3lengthLocal(a);
    r[0] = a[0] * im;
    r[1] = a[1] * im;
    r[2] = a[2] * im;
    return r;
}
var _MJS_v3normalize = _MJS_v3normalizeLocal;

var _MJS_v3scale = F2(function(k, a) {
    return new Float64Array([a[0] * k, a[1] * k, a[2] * k]);
});

var _MJS_v3dotLocal = function(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
};
var _MJS_v3dot = F2(_MJS_v3dotLocal);

function _MJS_v3crossLocal(a, b, r) {
    if (r === undefined) {
        r = new Float64Array(3);
    }
    r[0] = a[1] * b[2] - a[2] * b[1];
    r[1] = a[2] * b[0] - a[0] * b[2];
    r[2] = a[0] * b[1] - a[1] * b[0];
    return r;
}
var _MJS_v3cross = F2(_MJS_v3crossLocal);

var _MJS_v3mul4x4 = F2(function(m, v) {
    var w;
    var tmp = _MJS_v3temp1Local;
    var r = new Float64Array(3);

    tmp[0] = m[3];
    tmp[1] = m[7];
    tmp[2] = m[11];
    w = _MJS_v3dotLocal(v, tmp) + m[15];
    tmp[0] = m[0];
    tmp[1] = m[4];
    tmp[2] = m[8];
    r[0] = (_MJS_v3dotLocal(v, tmp) + m[12]) / w;
    tmp[0] = m[1];
    tmp[1] = m[5];
    tmp[2] = m[9];
    r[1] = (_MJS_v3dotLocal(v, tmp) + m[13]) / w;
    tmp[0] = m[2];
    tmp[1] = m[6];
    tmp[2] = m[10];
    r[2] = (_MJS_v3dotLocal(v, tmp) + m[14]) / w;
    return r;
});

// Vector4

var _MJS_v4 = F4(function(x, y, z, w) {
    return new Float64Array([x, y, z, w]);
});

var _MJS_v4getX = function(a) {
    return a[0];
};

var _MJS_v4getY = function(a) {
    return a[1];
};

var _MJS_v4getZ = function(a) {
    return a[2];
};

var _MJS_v4getW = function(a) {
    return a[3];
};

var _MJS_v4setX = F2(function(x, a) {
    return new Float64Array([x, a[1], a[2], a[3]]);
});

var _MJS_v4setY = F2(function(y, a) {
    return new Float64Array([a[0], y, a[2], a[3]]);
});

var _MJS_v4setZ = F2(function(z, a) {
    return new Float64Array([a[0], a[1], z, a[3]]);
});

var _MJS_v4setW = F2(function(w, a) {
    return new Float64Array([a[0], a[1], a[2], w]);
});

var _MJS_v4toRecord = function(a) {
    return { x: a[0], y: a[1], z: a[2], w: a[3] };
};

var _MJS_v4fromRecord = function(r) {
    return new Float64Array([r.x, r.y, r.z, r.w]);
};

var _MJS_v4add = F2(function(a, b) {
    var r = new Float64Array(4);
    r[0] = a[0] + b[0];
    r[1] = a[1] + b[1];
    r[2] = a[2] + b[2];
    r[3] = a[3] + b[3];
    return r;
});

var _MJS_v4sub = F2(function(a, b) {
    var r = new Float64Array(4);
    r[0] = a[0] - b[0];
    r[1] = a[1] - b[1];
    r[2] = a[2] - b[2];
    r[3] = a[3] - b[3];
    return r;
});

var _MJS_v4negate = function(a) {
    var r = new Float64Array(4);
    r[0] = -a[0];
    r[1] = -a[1];
    r[2] = -a[2];
    r[3] = -a[3];
    return r;
};

var _MJS_v4direction = F2(function(a, b) {
    var r = new Float64Array(4);
    r[0] = a[0] - b[0];
    r[1] = a[1] - b[1];
    r[2] = a[2] - b[2];
    r[3] = a[3] - b[3];
    var im = 1.0 / _MJS_v4lengthLocal(r);
    r[0] = r[0] * im;
    r[1] = r[1] * im;
    r[2] = r[2] * im;
    r[3] = r[3] * im;
    return r;
});

function _MJS_v4lengthLocal(a) {
    return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + a[3] * a[3]);
}
var _MJS_v4length = _MJS_v4lengthLocal;

var _MJS_v4lengthSquared = function(a) {
    return a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + a[3] * a[3];
};

var _MJS_v4distance = F2(function(a, b) {
    var dx = a[0] - b[0];
    var dy = a[1] - b[1];
    var dz = a[2] - b[2];
    var dw = a[3] - b[3];
    return Math.sqrt(dx * dx + dy * dy + dz * dz + dw * dw);
});

var _MJS_v4distanceSquared = F2(function(a, b) {
    var dx = a[0] - b[0];
    var dy = a[1] - b[1];
    var dz = a[2] - b[2];
    var dw = a[3] - b[3];
    return dx * dx + dy * dy + dz * dz + dw * dw;
});

var _MJS_v4normalize = function(a) {
    var r = new Float64Array(4);
    var im = 1.0 / _MJS_v4lengthLocal(a);
    r[0] = a[0] * im;
    r[1] = a[1] * im;
    r[2] = a[2] * im;
    r[3] = a[3] * im;
    return r;
};

var _MJS_v4scale = F2(function(k, a) {
    var r = new Float64Array(4);
    r[0] = a[0] * k;
    r[1] = a[1] * k;
    r[2] = a[2] * k;
    r[3] = a[3] * k;
    return r;
});

var _MJS_v4dot = F2(function(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
});

// Matrix4

var _MJS_m4x4temp1Local = new Float64Array(16);
var _MJS_m4x4temp2Local = new Float64Array(16);

var _MJS_m4x4identity = new Float64Array([
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0
]);

var _MJS_m4x4fromRecord = function(r) {
    var m = new Float64Array(16);
    m[0] = r.m11;
    m[1] = r.m21;
    m[2] = r.m31;
    m[3] = r.m41;
    m[4] = r.m12;
    m[5] = r.m22;
    m[6] = r.m32;
    m[7] = r.m42;
    m[8] = r.m13;
    m[9] = r.m23;
    m[10] = r.m33;
    m[11] = r.m43;
    m[12] = r.m14;
    m[13] = r.m24;
    m[14] = r.m34;
    m[15] = r.m44;
    return m;
};

var _MJS_m4x4toRecord = function(m) {
    return {
        m11: m[0], m21: m[1], m31: m[2], m41: m[3],
        m12: m[4], m22: m[5], m32: m[6], m42: m[7],
        m13: m[8], m23: m[9], m33: m[10], m43: m[11],
        m14: m[12], m24: m[13], m34: m[14], m44: m[15]
    };
};

var _MJS_m4x4inverse = function(m) {
    var r = new Float64Array(16);

    r[0] = m[5] * m[10] * m[15] - m[5] * m[11] * m[14] - m[9] * m[6] * m[15] +
        m[9] * m[7] * m[14] + m[13] * m[6] * m[11] - m[13] * m[7] * m[10];
    r[4] = -m[4] * m[10] * m[15] + m[4] * m[11] * m[14] + m[8] * m[6] * m[15] -
        m[8] * m[7] * m[14] - m[12] * m[6] * m[11] + m[12] * m[7] * m[10];
    r[8] = m[4] * m[9] * m[15] - m[4] * m[11] * m[13] - m[8] * m[5] * m[15] +
        m[8] * m[7] * m[13] + m[12] * m[5] * m[11] - m[12] * m[7] * m[9];
    r[12] = -m[4] * m[9] * m[14] + m[4] * m[10] * m[13] + m[8] * m[5] * m[14] -
        m[8] * m[6] * m[13] - m[12] * m[5] * m[10] + m[12] * m[6] * m[9];
    r[1] = -m[1] * m[10] * m[15] + m[1] * m[11] * m[14] + m[9] * m[2] * m[15] -
        m[9] * m[3] * m[14] - m[13] * m[2] * m[11] + m[13] * m[3] * m[10];
    r[5] = m[0] * m[10] * m[15] - m[0] * m[11] * m[14] - m[8] * m[2] * m[15] +
        m[8] * m[3] * m[14] + m[12] * m[2] * m[11] - m[12] * m[3] * m[10];
    r[9] = -m[0] * m[9] * m[15] + m[0] * m[11] * m[13] + m[8] * m[1] * m[15] -
        m[8] * m[3] * m[13] - m[12] * m[1] * m[11] + m[12] * m[3] * m[9];
    r[13] = m[0] * m[9] * m[14] - m[0] * m[10] * m[13] - m[8] * m[1] * m[14] +
        m[8] * m[2] * m[13] + m[12] * m[1] * m[10] - m[12] * m[2] * m[9];
    r[2] = m[1] * m[6] * m[15] - m[1] * m[7] * m[14] - m[5] * m[2] * m[15] +
        m[5] * m[3] * m[14] + m[13] * m[2] * m[7] - m[13] * m[3] * m[6];
    r[6] = -m[0] * m[6] * m[15] + m[0] * m[7] * m[14] + m[4] * m[2] * m[15] -
        m[4] * m[3] * m[14] - m[12] * m[2] * m[7] + m[12] * m[3] * m[6];
    r[10] = m[0] * m[5] * m[15] - m[0] * m[7] * m[13] - m[4] * m[1] * m[15] +
        m[4] * m[3] * m[13] + m[12] * m[1] * m[7] - m[12] * m[3] * m[5];
    r[14] = -m[0] * m[5] * m[14] + m[0] * m[6] * m[13] + m[4] * m[1] * m[14] -
        m[4] * m[2] * m[13] - m[12] * m[1] * m[6] + m[12] * m[2] * m[5];
    r[3] = -m[1] * m[6] * m[11] + m[1] * m[7] * m[10] + m[5] * m[2] * m[11] -
        m[5] * m[3] * m[10] - m[9] * m[2] * m[7] + m[9] * m[3] * m[6];
    r[7] = m[0] * m[6] * m[11] - m[0] * m[7] * m[10] - m[4] * m[2] * m[11] +
        m[4] * m[3] * m[10] + m[8] * m[2] * m[7] - m[8] * m[3] * m[6];
    r[11] = -m[0] * m[5] * m[11] + m[0] * m[7] * m[9] + m[4] * m[1] * m[11] -
        m[4] * m[3] * m[9] - m[8] * m[1] * m[7] + m[8] * m[3] * m[5];
    r[15] = m[0] * m[5] * m[10] - m[0] * m[6] * m[9] - m[4] * m[1] * m[10] +
        m[4] * m[2] * m[9] + m[8] * m[1] * m[6] - m[8] * m[2] * m[5];

    var det = m[0] * r[0] + m[1] * r[4] + m[2] * r[8] + m[3] * r[12];

    if (det === 0) {
        return $elm$core$Maybe$Nothing;
    }

    det = 1.0 / det;

    for (var i = 0; i < 16; i = i + 1) {
        r[i] = r[i] * det;
    }

    return $elm$core$Maybe$Just(r);
};

var _MJS_m4x4inverseOrthonormal = function(m) {
    var r = _MJS_m4x4transposeLocal(m);
    var t = [m[12], m[13], m[14]];
    r[3] = r[7] = r[11] = 0;
    r[12] = -_MJS_v3dotLocal([r[0], r[4], r[8]], t);
    r[13] = -_MJS_v3dotLocal([r[1], r[5], r[9]], t);
    r[14] = -_MJS_v3dotLocal([r[2], r[6], r[10]], t);
    return r;
};

function _MJS_m4x4makeFrustumLocal(left, right, bottom, top, znear, zfar) {
    var r = new Float64Array(16);

    r[0] = 2 * znear / (right - left);
    r[1] = 0;
    r[2] = 0;
    r[3] = 0;
    r[4] = 0;
    r[5] = 2 * znear / (top - bottom);
    r[6] = 0;
    r[7] = 0;
    r[8] = (right + left) / (right - left);
    r[9] = (top + bottom) / (top - bottom);
    r[10] = -(zfar + znear) / (zfar - znear);
    r[11] = -1;
    r[12] = 0;
    r[13] = 0;
    r[14] = -2 * zfar * znear / (zfar - znear);
    r[15] = 0;

    return r;
}
var _MJS_m4x4makeFrustum = F6(_MJS_m4x4makeFrustumLocal);

var _MJS_m4x4makePerspective = F4(function(fovy, aspect, znear, zfar) {
    var ymax = znear * Math.tan(fovy * Math.PI / 360.0);
    var ymin = -ymax;
    var xmin = ymin * aspect;
    var xmax = ymax * aspect;

    return _MJS_m4x4makeFrustumLocal(xmin, xmax, ymin, ymax, znear, zfar);
});

function _MJS_m4x4makeOrthoLocal(left, right, bottom, top, znear, zfar) {
    var r = new Float64Array(16);

    r[0] = 2 / (right - left);
    r[1] = 0;
    r[2] = 0;
    r[3] = 0;
    r[4] = 0;
    r[5] = 2 / (top - bottom);
    r[6] = 0;
    r[7] = 0;
    r[8] = 0;
    r[9] = 0;
    r[10] = -2 / (zfar - znear);
    r[11] = 0;
    r[12] = -(right + left) / (right - left);
    r[13] = -(top + bottom) / (top - bottom);
    r[14] = -(zfar + znear) / (zfar - znear);
    r[15] = 1;

    return r;
}
var _MJS_m4x4makeOrtho = F6(_MJS_m4x4makeOrthoLocal);

var _MJS_m4x4makeOrtho2D = F4(function(left, right, bottom, top) {
    return _MJS_m4x4makeOrthoLocal(left, right, bottom, top, -1, 1);
});

function _MJS_m4x4mulLocal(a, b) {
    var r = new Float64Array(16);
    var a11 = a[0];
    var a21 = a[1];
    var a31 = a[2];
    var a41 = a[3];
    var a12 = a[4];
    var a22 = a[5];
    var a32 = a[6];
    var a42 = a[7];
    var a13 = a[8];
    var a23 = a[9];
    var a33 = a[10];
    var a43 = a[11];
    var a14 = a[12];
    var a24 = a[13];
    var a34 = a[14];
    var a44 = a[15];
    var b11 = b[0];
    var b21 = b[1];
    var b31 = b[2];
    var b41 = b[3];
    var b12 = b[4];
    var b22 = b[5];
    var b32 = b[6];
    var b42 = b[7];
    var b13 = b[8];
    var b23 = b[9];
    var b33 = b[10];
    var b43 = b[11];
    var b14 = b[12];
    var b24 = b[13];
    var b34 = b[14];
    var b44 = b[15];

    r[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
    r[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
    r[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
    r[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
    r[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
    r[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
    r[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
    r[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
    r[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
    r[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
    r[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
    r[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
    r[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
    r[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
    r[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
    r[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

    return r;
}
var _MJS_m4x4mul = F2(_MJS_m4x4mulLocal);

var _MJS_m4x4mulAffine = F2(function(a, b) {
    var r = new Float64Array(16);
    var a11 = a[0];
    var a21 = a[1];
    var a31 = a[2];
    var a12 = a[4];
    var a22 = a[5];
    var a32 = a[6];
    var a13 = a[8];
    var a23 = a[9];
    var a33 = a[10];
    var a14 = a[12];
    var a24 = a[13];
    var a34 = a[14];

    var b11 = b[0];
    var b21 = b[1];
    var b31 = b[2];
    var b12 = b[4];
    var b22 = b[5];
    var b32 = b[6];
    var b13 = b[8];
    var b23 = b[9];
    var b33 = b[10];
    var b14 = b[12];
    var b24 = b[13];
    var b34 = b[14];

    r[0] = a11 * b11 + a12 * b21 + a13 * b31;
    r[1] = a21 * b11 + a22 * b21 + a23 * b31;
    r[2] = a31 * b11 + a32 * b21 + a33 * b31;
    r[3] = 0;
    r[4] = a11 * b12 + a12 * b22 + a13 * b32;
    r[5] = a21 * b12 + a22 * b22 + a23 * b32;
    r[6] = a31 * b12 + a32 * b22 + a33 * b32;
    r[7] = 0;
    r[8] = a11 * b13 + a12 * b23 + a13 * b33;
    r[9] = a21 * b13 + a22 * b23 + a23 * b33;
    r[10] = a31 * b13 + a32 * b23 + a33 * b33;
    r[11] = 0;
    r[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14;
    r[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24;
    r[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34;
    r[15] = 1;

    return r;
});

var _MJS_m4x4makeRotate = F2(function(angle, axis) {
    var r = new Float64Array(16);
    axis = _MJS_v3normalizeLocal(axis, _MJS_v3temp1Local);
    var x = axis[0];
    var y = axis[1];
    var z = axis[2];
    var c = Math.cos(angle);
    var c1 = 1 - c;
    var s = Math.sin(angle);

    r[0] = x * x * c1 + c;
    r[1] = y * x * c1 + z * s;
    r[2] = z * x * c1 - y * s;
    r[3] = 0;
    r[4] = x * y * c1 - z * s;
    r[5] = y * y * c1 + c;
    r[6] = y * z * c1 + x * s;
    r[7] = 0;
    r[8] = x * z * c1 + y * s;
    r[9] = y * z * c1 - x * s;
    r[10] = z * z * c1 + c;
    r[11] = 0;
    r[12] = 0;
    r[13] = 0;
    r[14] = 0;
    r[15] = 1;

    return r;
});

var _MJS_m4x4rotate = F3(function(angle, axis, m) {
    var r = new Float64Array(16);
    var im = 1.0 / _MJS_v3lengthLocal(axis);
    var x = axis[0] * im;
    var y = axis[1] * im;
    var z = axis[2] * im;
    var c = Math.cos(angle);
    var c1 = 1 - c;
    var s = Math.sin(angle);
    var xs = x * s;
    var ys = y * s;
    var zs = z * s;
    var xyc1 = x * y * c1;
    var xzc1 = x * z * c1;
    var yzc1 = y * z * c1;
    var t11 = x * x * c1 + c;
    var t21 = xyc1 + zs;
    var t31 = xzc1 - ys;
    var t12 = xyc1 - zs;
    var t22 = y * y * c1 + c;
    var t32 = yzc1 + xs;
    var t13 = xzc1 + ys;
    var t23 = yzc1 - xs;
    var t33 = z * z * c1 + c;
    var m11 = m[0], m21 = m[1], m31 = m[2], m41 = m[3];
    var m12 = m[4], m22 = m[5], m32 = m[6], m42 = m[7];
    var m13 = m[8], m23 = m[9], m33 = m[10], m43 = m[11];
    var m14 = m[12], m24 = m[13], m34 = m[14], m44 = m[15];

    r[0] = m11 * t11 + m12 * t21 + m13 * t31;
    r[1] = m21 * t11 + m22 * t21 + m23 * t31;
    r[2] = m31 * t11 + m32 * t21 + m33 * t31;
    r[3] = m41 * t11 + m42 * t21 + m43 * t31;
    r[4] = m11 * t12 + m12 * t22 + m13 * t32;
    r[5] = m21 * t12 + m22 * t22 + m23 * t32;
    r[6] = m31 * t12 + m32 * t22 + m33 * t32;
    r[7] = m41 * t12 + m42 * t22 + m43 * t32;
    r[8] = m11 * t13 + m12 * t23 + m13 * t33;
    r[9] = m21 * t13 + m22 * t23 + m23 * t33;
    r[10] = m31 * t13 + m32 * t23 + m33 * t33;
    r[11] = m41 * t13 + m42 * t23 + m43 * t33;
    r[12] = m14,
    r[13] = m24;
    r[14] = m34;
    r[15] = m44;

    return r;
});

function _MJS_m4x4makeScale3Local(x, y, z) {
    var r = new Float64Array(16);

    r[0] = x;
    r[1] = 0;
    r[2] = 0;
    r[3] = 0;
    r[4] = 0;
    r[5] = y;
    r[6] = 0;
    r[7] = 0;
    r[8] = 0;
    r[9] = 0;
    r[10] = z;
    r[11] = 0;
    r[12] = 0;
    r[13] = 0;
    r[14] = 0;
    r[15] = 1;

    return r;
}
var _MJS_m4x4makeScale3 = F3(_MJS_m4x4makeScale3Local);

var _MJS_m4x4makeScale = function(v) {
    return _MJS_m4x4makeScale3Local(v[0], v[1], v[2]);
};

var _MJS_m4x4scale3 = F4(function(x, y, z, m) {
    var r = new Float64Array(16);

    r[0] = m[0] * x;
    r[1] = m[1] * x;
    r[2] = m[2] * x;
    r[3] = m[3] * x;
    r[4] = m[4] * y;
    r[5] = m[5] * y;
    r[6] = m[6] * y;
    r[7] = m[7] * y;
    r[8] = m[8] * z;
    r[9] = m[9] * z;
    r[10] = m[10] * z;
    r[11] = m[11] * z;
    r[12] = m[12];
    r[13] = m[13];
    r[14] = m[14];
    r[15] = m[15];

    return r;
});

var _MJS_m4x4scale = F2(function(v, m) {
    var r = new Float64Array(16);
    var x = v[0];
    var y = v[1];
    var z = v[2];

    r[0] = m[0] * x;
    r[1] = m[1] * x;
    r[2] = m[2] * x;
    r[3] = m[3] * x;
    r[4] = m[4] * y;
    r[5] = m[5] * y;
    r[6] = m[6] * y;
    r[7] = m[7] * y;
    r[8] = m[8] * z;
    r[9] = m[9] * z;
    r[10] = m[10] * z;
    r[11] = m[11] * z;
    r[12] = m[12];
    r[13] = m[13];
    r[14] = m[14];
    r[15] = m[15];

    return r;
});

function _MJS_m4x4makeTranslate3Local(x, y, z) {
    var r = new Float64Array(16);

    r[0] = 1;
    r[1] = 0;
    r[2] = 0;
    r[3] = 0;
    r[4] = 0;
    r[5] = 1;
    r[6] = 0;
    r[7] = 0;
    r[8] = 0;
    r[9] = 0;
    r[10] = 1;
    r[11] = 0;
    r[12] = x;
    r[13] = y;
    r[14] = z;
    r[15] = 1;

    return r;
}
var _MJS_m4x4makeTranslate3 = F3(_MJS_m4x4makeTranslate3Local);

var _MJS_m4x4makeTranslate = function(v) {
    return _MJS_m4x4makeTranslate3Local(v[0], v[1], v[2]);
};

var _MJS_m4x4translate3 = F4(function(x, y, z, m) {
    var r = new Float64Array(16);
    var m11 = m[0];
    var m21 = m[1];
    var m31 = m[2];
    var m41 = m[3];
    var m12 = m[4];
    var m22 = m[5];
    var m32 = m[6];
    var m42 = m[7];
    var m13 = m[8];
    var m23 = m[9];
    var m33 = m[10];
    var m43 = m[11];

    r[0] = m11;
    r[1] = m21;
    r[2] = m31;
    r[3] = m41;
    r[4] = m12;
    r[5] = m22;
    r[6] = m32;
    r[7] = m42;
    r[8] = m13;
    r[9] = m23;
    r[10] = m33;
    r[11] = m43;
    r[12] = m11 * x + m12 * y + m13 * z + m[12];
    r[13] = m21 * x + m22 * y + m23 * z + m[13];
    r[14] = m31 * x + m32 * y + m33 * z + m[14];
    r[15] = m41 * x + m42 * y + m43 * z + m[15];

    return r;
});

var _MJS_m4x4translate = F2(function(v, m) {
    var r = new Float64Array(16);
    var x = v[0];
    var y = v[1];
    var z = v[2];
    var m11 = m[0];
    var m21 = m[1];
    var m31 = m[2];
    var m41 = m[3];
    var m12 = m[4];
    var m22 = m[5];
    var m32 = m[6];
    var m42 = m[7];
    var m13 = m[8];
    var m23 = m[9];
    var m33 = m[10];
    var m43 = m[11];

    r[0] = m11;
    r[1] = m21;
    r[2] = m31;
    r[3] = m41;
    r[4] = m12;
    r[5] = m22;
    r[6] = m32;
    r[7] = m42;
    r[8] = m13;
    r[9] = m23;
    r[10] = m33;
    r[11] = m43;
    r[12] = m11 * x + m12 * y + m13 * z + m[12];
    r[13] = m21 * x + m22 * y + m23 * z + m[13];
    r[14] = m31 * x + m32 * y + m33 * z + m[14];
    r[15] = m41 * x + m42 * y + m43 * z + m[15];

    return r;
});

var _MJS_m4x4makeLookAt = F3(function(eye, center, up) {
    var z = _MJS_v3directionLocal(eye, center, _MJS_v3temp1Local);
    var x = _MJS_v3normalizeLocal(_MJS_v3crossLocal(up, z, _MJS_v3temp2Local), _MJS_v3temp2Local);
    var y = _MJS_v3normalizeLocal(_MJS_v3crossLocal(z, x, _MJS_v3temp3Local), _MJS_v3temp3Local);
    var tm1 = _MJS_m4x4temp1Local;
    var tm2 = _MJS_m4x4temp2Local;

    tm1[0] = x[0];
    tm1[1] = y[0];
    tm1[2] = z[0];
    tm1[3] = 0;
    tm1[4] = x[1];
    tm1[5] = y[1];
    tm1[6] = z[1];
    tm1[7] = 0;
    tm1[8] = x[2];
    tm1[9] = y[2];
    tm1[10] = z[2];
    tm1[11] = 0;
    tm1[12] = 0;
    tm1[13] = 0;
    tm1[14] = 0;
    tm1[15] = 1;

    tm2[0] = 1; tm2[1] = 0; tm2[2] = 0; tm2[3] = 0;
    tm2[4] = 0; tm2[5] = 1; tm2[6] = 0; tm2[7] = 0;
    tm2[8] = 0; tm2[9] = 0; tm2[10] = 1; tm2[11] = 0;
    tm2[12] = -eye[0]; tm2[13] = -eye[1]; tm2[14] = -eye[2]; tm2[15] = 1;

    return _MJS_m4x4mulLocal(tm1, tm2);
});


function _MJS_m4x4transposeLocal(m) {
    var r = new Float64Array(16);

    r[0] = m[0]; r[1] = m[4]; r[2] = m[8]; r[3] = m[12];
    r[4] = m[1]; r[5] = m[5]; r[6] = m[9]; r[7] = m[13];
    r[8] = m[2]; r[9] = m[6]; r[10] = m[10]; r[11] = m[14];
    r[12] = m[3]; r[13] = m[7]; r[14] = m[11]; r[15] = m[15];

    return r;
}
var _MJS_m4x4transpose = _MJS_m4x4transposeLocal;

var _MJS_m4x4makeBasis = F3(function(vx, vy, vz) {
    var r = new Float64Array(16);

    r[0] = vx[0];
    r[1] = vx[1];
    r[2] = vx[2];
    r[3] = 0;
    r[4] = vy[0];
    r[5] = vy[1];
    r[6] = vy[2];
    r[7] = 0;
    r[8] = vz[0];
    r[9] = vz[1];
    r[10] = vz[2];
    r[11] = 0;
    r[12] = 0;
    r[13] = 0;
    r[14] = 0;
    r[15] = 1;

    return r;
});


// eslint-disable-next-line no-unused-vars
var _Texture_load = F6(function (magnify, mininify, horizontalWrap, verticalWrap, flipY, url) {
  var isMipmap = mininify !== 9728 && mininify !== 9729;
  return _Scheduler_binding(function (callback) {
    var img = new Image();
    function createTexture(gl) {
      var texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magnify);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, mininify);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, horizontalWrap);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, verticalWrap);
      if (isMipmap) {
        gl.generateMipmap(gl.TEXTURE_2D);
      }
      gl.bindTexture(gl.TEXTURE_2D, null);
      return texture;
    }
    img.onload = function () {
      var width = img.width;
      var height = img.height;
      var widthPowerOfTwo = (width & (width - 1)) === 0;
      var heightPowerOfTwo = (height & (height - 1)) === 0;
      var isSizeValid = (widthPowerOfTwo && heightPowerOfTwo) || (
        !isMipmap
        && horizontalWrap === 33071 // clamp to edge
        && verticalWrap === 33071
      );
      if (isSizeValid) {
        callback(_Scheduler_succeed({
          $: 0,
          createTexture: createTexture,
          a: width,
          b: height
        }));
      } else {
        callback(_Scheduler_fail(A2(
          $elm_explorations$webgl$WebGL$Texture$SizeError,
          width,
          height
        )));
      }
    };
    img.onerror = function () {
      callback(_Scheduler_fail($elm_explorations$webgl$WebGL$Texture$LoadError));
    };
    if (url.slice(0, 5) !== 'data:') {
      img.crossOrigin = 'Anonymous';
    }
    img.src = url;
  });
});

// eslint-disable-next-line no-unused-vars
var _Texture_size = function (texture) {
  return _Utils_Tuple2(texture.a, texture.b);
};


var _WebGL_guid = 0;

function _WebGL_listEach(fn, list) {
  for (; list.b; list = list.b) {
    fn(list.a);
  }
}

function _WebGL_listLength(list) {
  var length = 0;
  for (; list.b; list = list.b) {
    length++;
  }
  return length;
}

var _WebGL_rAF = typeof requestAnimationFrame !== 'undefined' ?
  requestAnimationFrame :
  function (cb) { setTimeout(cb, 1000 / 60); };

// eslint-disable-next-line no-unused-vars
var _WebGL_entity = F5(function (settings, vert, frag, mesh, uniforms) {
  return {
    $: 0,
    a: settings,
    b: vert,
    c: frag,
    d: mesh,
    e: uniforms
  };
});

// eslint-disable-next-line no-unused-vars
var _WebGL_enableBlend = F2(function (cache, setting) {
  var blend = cache.blend;
  blend.toggle = cache.toggle;

  if (!blend.enabled) {
    cache.gl.enable(cache.gl.BLEND);
    blend.enabled = true;
  }

  // a   b   c   d   e   f   g h i j
  // eq1 f11 f12 eq2 f21 f22 r g b a
  if (blend.a !== setting.a || blend.d !== setting.d) {
    cache.gl.blendEquationSeparate(setting.a, setting.d);
    blend.a = setting.a;
    blend.d = setting.d;
  }
  if (blend.b !== setting.b || blend.c !== setting.c || blend.e !== setting.e || blend.f !== setting.f) {
    cache.gl.blendFuncSeparate(setting.b, setting.c, setting.e, setting.f);
    blend.b = setting.b;
    blend.c = setting.c;
    blend.e = setting.e;
    blend.f = setting.f;
  }
  if (blend.g !== setting.g || blend.h !== setting.h || blend.i !== setting.i || blend.j !== setting.j) {
    cache.gl.blendColor(setting.g, setting.h, setting.i, setting.j);
    blend.g = setting.g;
    blend.h = setting.h;
    blend.i = setting.i;
    blend.j = setting.j;
  }
});

// eslint-disable-next-line no-unused-vars
var _WebGL_enableDepthTest = F2(function (cache, setting) {
  var depthTest = cache.depthTest;
  depthTest.toggle = cache.toggle;

  if (!depthTest.enabled) {
    cache.gl.enable(cache.gl.DEPTH_TEST);
    depthTest.enabled = true;
  }

  // a    b    c    d
  // func mask near far
  if (depthTest.a !== setting.a) {
    cache.gl.depthFunc(setting.a);
    depthTest.a = setting.a;
  }
  if (depthTest.b !== setting.b) {
    cache.gl.depthMask(setting.b);
    depthTest.b = setting.b;
  }
  if (depthTest.c !== setting.c || depthTest.d !== setting.d) {
    cache.gl.depthRange(setting.c, setting.d);
    depthTest.c = setting.c;
    depthTest.d = setting.d;
  }
});

// eslint-disable-next-line no-unused-vars
var _WebGL_enableStencilTest = F2(function (cache, setting) {
  var stencilTest = cache.stencilTest;
  stencilTest.toggle = cache.toggle;

  if (!stencilTest.enabled) {
    cache.gl.enable(cache.gl.STENCIL_TEST);
    stencilTest.enabled = true;
  }

  // a   b    c         d     e     f      g      h     i     j      k
  // ref mask writeMask test1 fail1 zfail1 zpass1 test2 fail2 zfail2 zpass2
  if (stencilTest.d !== setting.d || stencilTest.a !== setting.a || stencilTest.b !== setting.b) {
    cache.gl.stencilFuncSeparate(cache.gl.FRONT, setting.d, setting.a, setting.b);
    stencilTest.d = setting.d;
    // a and b are set in the cache.gl.BACK diffing because they should be the same
  }
  if (stencilTest.e !== setting.e || stencilTest.f !== setting.f || stencilTest.g !== setting.g) {
    cache.gl.stencilOpSeparate(cache.gl.FRONT, setting.e, setting.f, setting.g);
    stencilTest.e = setting.e;
    stencilTest.f = setting.f;
    stencilTest.g = setting.g;
  }
  if (stencilTest.c !== setting.c) {
    cache.gl.stencilMask(setting.c);
    stencilTest.c = setting.c;
  }
  if (stencilTest.h !== setting.h || stencilTest.a !== setting.a || stencilTest.b !== setting.b) {
    cache.gl.stencilFuncSeparate(cache.gl.BACK, setting.h, setting.a, setting.b);
    stencilTest.h = setting.h;
    stencilTest.a = setting.a;
    stencilTest.b = setting.b;
  }
  if (stencilTest.i !== setting.i || stencilTest.j !== setting.j || stencilTest.k !== setting.k) {
    cache.gl.stencilOpSeparate(cache.gl.BACK, setting.i, setting.j, setting.k);
    stencilTest.i = setting.i;
    stencilTest.j = setting.j;
    stencilTest.k = setting.k;
  }
});

// eslint-disable-next-line no-unused-vars
var _WebGL_enableScissor = F2(function (cache, setting) {
  var scissor = cache.scissor;
  scissor.toggle = cache.toggle;

  if (!scissor.enabled) {
    cache.gl.enable(cache.gl.SCISSOR_TEST);
    scissor.enabled = true;
  }

  if (scissor.a !== setting.a || scissor.b !== setting.b || scissor.c !== setting.c || scissor.d !== setting.d) {
    cache.gl.scissor(setting.a, setting.b, setting.c, setting.d);
    scissor.a = setting.a;
    scissor.b = setting.b;
    scissor.c = setting.c;
    scissor.d = setting.d;
  }
});

// eslint-disable-next-line no-unused-vars
var _WebGL_enableColorMask = F2(function (cache, setting) {
  var colorMask = cache.colorMask;
  colorMask.toggle = cache.toggle;
  colorMask.enabled = true;

  if (colorMask.a !== setting.a || colorMask.b !== setting.b || colorMask.c !== setting.c || colorMask.d !== setting.d) {
    cache.gl.colorMask(setting.a, setting.b, setting.c, setting.d);
    colorMask.a = setting.a;
    colorMask.b = setting.b;
    colorMask.c = setting.c;
    colorMask.d = setting.d;
  }
});

// eslint-disable-next-line no-unused-vars
var _WebGL_enableCullFace = F2(function (cache, setting) {
  var cullFace = cache.cullFace;
  cullFace.toggle = cache.toggle;

  if (!cullFace.enabled) {
    cache.gl.enable(cache.gl.CULL_FACE);
    cullFace.enabled = true;
  }

  if (cullFace.a !== setting.a) {
    cache.gl.cullFace(setting.a);
    cullFace.a = setting.a;
  }
});

// eslint-disable-next-line no-unused-vars
var _WebGL_enablePolygonOffset = F2(function (cache, setting) {
  var polygonOffset = cache.polygonOffset;
  polygonOffset.toggle = cache.toggle;

  if (!polygonOffset.enabled) {
    cache.gl.enable(cache.gl.POLYGON_OFFSET_FILL);
    polygonOffset.enabled = true;
  }

  if (polygonOffset.a !== setting.a || polygonOffset.b !== setting.b) {
    cache.gl.polygonOffset(setting.a, setting.b);
    polygonOffset.a = setting.a;
    polygonOffset.b = setting.b;
  }
});

// eslint-disable-next-line no-unused-vars
var _WebGL_enableSampleCoverage = F2(function (cache, setting) {
  var sampleCoverage = cache.sampleCoverage;
  sampleCoverage.toggle = cache.toggle;

  if (!sampleCoverage.enabled) {
    cache.gl.enable(cache.gl.SAMPLE_COVERAGE);
    sampleCoverage.enabled = true;
  }

  if (sampleCoverage.a !== setting.a || sampleCoverage.b !== setting.b) {
    cache.gl.sampleCoverage(setting.a, setting.b);
    sampleCoverage.a = setting.a;
    sampleCoverage.b = setting.b;
  }
});

// eslint-disable-next-line no-unused-vars
var _WebGL_enableSampleAlphaToCoverage = function (cache) {
  var sampleAlphaToCoverage = cache.sampleAlphaToCoverage;
  sampleAlphaToCoverage.toggle = cache.toggle;

  if (!sampleAlphaToCoverage.enabled) {
    cache.gl.enable(cache.gl.SAMPLE_ALPHA_TO_COVERAGE);
    sampleAlphaToCoverage.enabled = true;
  }
};

var _WebGL_disableBlend = function (cache) {
  if (cache.blend.enabled) {
    cache.gl.disable(cache.gl.BLEND);
    cache.blend.enabled = false;
  }
};

var _WebGL_disableDepthTest = function (cache) {
  if (cache.depthTest.enabled) {
    cache.gl.disable(cache.gl.DEPTH_TEST);
    cache.depthTest.enabled = false;
  }
};

var _WebGL_disableStencilTest = function (cache) {
  if (cache.stencilTest.enabled) {
    cache.gl.disable(cache.gl.STENCIL_TEST);
    cache.stencilTest.enabled = false;
  }
};

var _WebGL_disableScissor = function (cache) {
  if (cache.scissor.enabled) {
    cache.gl.disable(cache.gl.SCISSOR_TEST);
    cache.scissor.enabled = false;
  }
};

var _WebGL_disableColorMask = function (cache) {
  var colorMask = cache.colorMask;
  if (!colorMask.a || !colorMask.b || !colorMask.c || !colorMask.d) {
    cache.gl.colorMask(true, true, true, true);
    colorMask.a = true;
    colorMask.b = true;
    colorMask.c = true;
    colorMask.d = true;
  }
};

var _WebGL_disableCullFace = function (cache) {
  cache.gl.disable(cache.gl.CULL_FACE);
};

var _WebGL_disablePolygonOffset = function (cache) {
  cache.gl.disable(cache.gl.POLYGON_OFFSET_FILL);
};

var _WebGL_disableSampleCoverage = function (cache) {
  cache.gl.disable(cache.gl.SAMPLE_COVERAGE);
};

var _WebGL_disableSampleAlphaToCoverage = function (cache) {
  cache.gl.disable(cache.gl.SAMPLE_ALPHA_TO_COVERAGE);
};

var _WebGL_settings = ['blend', 'depthTest', 'stencilTest', 'scissor', 'colorMask', 'cullFace', 'polygonOffset', 'sampleCoverage', 'sampleAlphaToCoverage'];
var _WebGL_disableFunctions = [_WebGL_disableBlend, _WebGL_disableDepthTest, _WebGL_disableStencilTest, _WebGL_disableScissor, _WebGL_disableColorMask, _WebGL_disableCullFace, _WebGL_disablePolygonOffset, _WebGL_disableSampleCoverage, _WebGL_disableSampleAlphaToCoverage];

function _WebGL_doCompile(gl, src, type) {
  var shader = gl.createShader(type);
  // Enable OES_standard_derivatives extension
  gl.shaderSource(shader, '#extension GL_OES_standard_derivatives : enable\n' + src);
  gl.compileShader(shader);
  return shader;
}

function _WebGL_doLink(gl, vshader, fshader) {
  var program = gl.createProgram();

  gl.attachShader(program, vshader);
  gl.attachShader(program, fshader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw ('Link failed: ' + gl.getProgramInfoLog(program) +
      '\nvs info-log: ' + gl.getShaderInfoLog(vshader) +
      '\nfs info-log: ' + gl.getShaderInfoLog(fshader));
  }

  return program;
}

function _WebGL_getAttributeInfo(gl, type) {
  switch (type) {
    case gl.FLOAT:
      return { size: 1, arraySize: 1, type: Float32Array, baseType: gl.FLOAT };
    case gl.FLOAT_VEC2:
      return { size: 2, arraySize: 1, type: Float32Array, baseType: gl.FLOAT };
    case gl.FLOAT_VEC3:
      return { size: 3, arraySize: 1, type: Float32Array, baseType: gl.FLOAT };
    case gl.FLOAT_VEC4:
      return { size: 4, arraySize: 1, type: Float32Array, baseType: gl.FLOAT };
    case gl.FLOAT_MAT4:
      return { size: 4, arraySize: 4, type: Float32Array, baseType: gl.FLOAT };
    case gl.INT:
      return { size: 1, arraySize: 1, type: Int32Array, baseType: gl.INT };
  }
}

/**
 *  Form the buffer for a given attribute.
 *
 *  @param {WebGLRenderingContext} gl context
 *  @param {WebGLActiveInfo} attribute the attribute to bind to.
 *         We use its name to grab the record by name and also to know
 *         how many elements we need to grab.
 *  @param {Mesh} mesh The mesh coming in from Elm.
 *  @param {Object} attributes The mapping between the attribute names and Elm fields
 *  @return {WebGLBuffer}
 */
function _WebGL_doBindAttribute(gl, attribute, mesh, attributes) {
  // The length of the number of vertices that
  // complete one 'thing' based on the drawing mode.
  // ie, 2 for Lines, 3 for Triangles, etc.
  var elemSize = mesh.a.elemSize;

  var idxKeys = [];
  for (var i = 0; i < elemSize; i++) {
    idxKeys.push(String.fromCharCode(97 + i));
  }

  function dataFill(data, cnt, fillOffset, elem, key) {
    var i;
    if (elemSize === 1) {
      for (i = 0; i < cnt; i++) {
        data[fillOffset++] = cnt === 1 ? elem[key] : elem[key][i];
      }
    } else {
      idxKeys.forEach(function (idx) {
        for (i = 0; i < cnt; i++) {
          data[fillOffset++] = cnt === 1 ? elem[idx][key] : elem[idx][key][i];
        }
      });
    }
  }

  var attributeInfo = _WebGL_getAttributeInfo(gl, attribute.type);

  if (attributeInfo === undefined) {
    throw new Error('No info available for: ' + attribute.type);
  }

  var dataIdx = 0;
  var dataOffset = attributeInfo.size * attributeInfo.arraySize * elemSize;
  var array = new attributeInfo.type(_WebGL_listLength(mesh.b) * dataOffset);

  _WebGL_listEach(function (elem) {
    dataFill(array, attributeInfo.size * attributeInfo.arraySize, dataIdx, elem, attributes[attribute.name] || attribute.name);
    dataIdx += dataOffset;
  }, mesh.b);

  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);
  return buffer;
}

/**
 *  This sets up the binding caching buffers.
 *
 *  We don't actually bind any buffers now except for the indices buffer.
 *  The problem with filling the buffers here is that it is possible to
 *  have a buffer shared between two webgl shaders;
 *  which could have different active attributes. If we bind it here against
 *  a particular program, we might not bind them all. That final bind is now
 *  done right before drawing.
 *
 *  @param {WebGLRenderingContext} gl context
 *  @param {Mesh} mesh a mesh object from Elm
 *  @return {Object} buffer - an object with the following properties
 *  @return {Number} buffer.numIndices
 *  @return {WebGLBuffer|null} buffer.indexBuffer - optional index buffer
 *  @return {Object} buffer.buffers - will be used to buffer attributes
 */
function _WebGL_doBindSetup(gl, mesh) {
  if (mesh.a.indexSize > 0) {
    var indexBuffer = gl.createBuffer();
    var indices = _WebGL_makeIndexedBuffer(mesh.c, mesh.a.indexSize);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    return {
      numIndices: indices.length,
      indexBuffer: indexBuffer,
      buffers: {}
    };
  } else {
    return {
      numIndices: mesh.a.elemSize * _WebGL_listLength(mesh.b),
      indexBuffer: null,
      buffers: {}
    };
  }
}

/**
 *  Create an indices array and fill it from indices
 *  based on the size of the index
 *
 *  @param {List} indicesList the list of indices
 *  @param {Number} indexSize the size of the index
 *  @return {Uint32Array} indices
 */
function _WebGL_makeIndexedBuffer(indicesList, indexSize) {
  var indices = new Uint32Array(_WebGL_listLength(indicesList) * indexSize);
  var fillOffset = 0;
  var i;
  _WebGL_listEach(function (elem) {
    if (indexSize === 1) {
      indices[fillOffset++] = elem;
    } else {
      for (i = 0; i < indexSize; i++) {
        indices[fillOffset++] = elem[String.fromCharCode(97 + i)];
      }
    }
  }, indicesList);
  return indices;
}

function _WebGL_getProgID(vertID, fragID) {
  return vertID + '#' + fragID;
}

var _WebGL_drawGL = F2(function (model, domNode) {
  var cache = model.f;
  var gl = cache.gl;

  if (!gl) {
    return domNode;
  }

  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

  if (!cache.depthTest.b) {
    gl.depthMask(true);
    cache.depthTest.b = true;
  }
  if (cache.stencilTest.c !== cache.STENCIL_WRITEMASK) {
    gl.stencilMask(cache.STENCIL_WRITEMASK);
    cache.stencilTest.c = cache.STENCIL_WRITEMASK;
  }
  _WebGL_disableScissor(cache);
  _WebGL_disableColorMask(cache);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);

  function drawEntity(entity) {
    if (!entity.d.b.b) {
      return; // Empty list
    }

    var progid;
    var program;
    var i;

    if (entity.b.id && entity.c.id) {
      progid = _WebGL_getProgID(entity.b.id, entity.c.id);
      program = cache.programs[progid];
    }

    if (!program) {

      var vshader;
      if (entity.b.id) {
        vshader = cache.shaders[entity.b.id];
      } else {
        entity.b.id = _WebGL_guid++;
      }

      if (!vshader) {
        vshader = _WebGL_doCompile(gl, entity.b.src, gl.VERTEX_SHADER);
        cache.shaders[entity.b.id] = vshader;
      }

      var fshader;
      if (entity.c.id) {
        fshader = cache.shaders[entity.c.id];
      } else {
        entity.c.id = _WebGL_guid++;
      }

      if (!fshader) {
        fshader = _WebGL_doCompile(gl, entity.c.src, gl.FRAGMENT_SHADER);
        cache.shaders[entity.c.id] = fshader;
      }

      var glProgram = _WebGL_doLink(gl, vshader, fshader);

      program = {
        glProgram: glProgram,
        attributes: Object.assign({}, entity.b.attributes, entity.c.attributes),
        currentUniforms: {},
        activeAttributes: [],
        activeAttributeLocations: []
      };

      program.uniformSetters = _WebGL_createUniformSetters(
        gl,
        model,
        program,
        Object.assign({}, entity.b.uniforms, entity.c.uniforms)
      );

      var numActiveAttributes = gl.getProgramParameter(glProgram, gl.ACTIVE_ATTRIBUTES);
      for (i = 0; i < numActiveAttributes; i++) {
        var attribute = gl.getActiveAttrib(glProgram, i);
        var attribLocation = gl.getAttribLocation(glProgram, attribute.name);
        program.activeAttributes.push(attribute);
        program.activeAttributeLocations.push(attribLocation);
      }

      progid = _WebGL_getProgID(entity.b.id, entity.c.id);
      cache.programs[progid] = program;
    }

    if (cache.lastProgId !== progid) {
      gl.useProgram(program.glProgram);
      cache.lastProgId = progid;
    }

    _WebGL_setUniforms(program.uniformSetters, entity.e);

    var buffer = cache.buffers.get(entity.d);

    if (!buffer) {
      buffer = _WebGL_doBindSetup(gl, entity.d);
      cache.buffers.set(entity.d, buffer);
    }

    for (i = 0; i < program.activeAttributes.length; i++) {
      attribute = program.activeAttributes[i];
      attribLocation = program.activeAttributeLocations[i];

      if (buffer.buffers[attribute.name] === undefined) {
        buffer.buffers[attribute.name] = _WebGL_doBindAttribute(gl, attribute, entity.d, program.attributes);
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer.buffers[attribute.name]);

      var attributeInfo = _WebGL_getAttributeInfo(gl, attribute.type);
      if (attributeInfo.arraySize === 1) {
        gl.enableVertexAttribArray(attribLocation);
        gl.vertexAttribPointer(attribLocation, attributeInfo.size, attributeInfo.baseType, false, 0, 0);
      } else {
        // Point to four vec4 in case of mat4
        var offset = attributeInfo.size * 4; // float32 takes 4 bytes
        var stride = offset * attributeInfo.arraySize;
        for (var m = 0; m < attributeInfo.arraySize; m++) {
          gl.enableVertexAttribArray(attribLocation + m);
          gl.vertexAttribPointer(attribLocation + m, attributeInfo.size, attributeInfo.baseType, false, stride, offset * m);
        }
      }
    }

    // Apply all the new settings
    cache.toggle = !cache.toggle;
    _WebGL_listEach($elm_explorations$webgl$WebGL$Internal$enableSetting(cache), entity.a);
    // Disable the settings that were applied in the previous draw call
    for (i = 0; i < _WebGL_settings.length; i++) {
      var setting = cache[_WebGL_settings[i]];
      if (setting.toggle !== cache.toggle && setting.enabled) {
        _WebGL_disableFunctions[i](cache);
        setting.enabled = false;
        setting.toggle = cache.toggle;
      }
    }

    if (buffer.indexBuffer) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer.indexBuffer);
      gl.drawElements(entity.d.a.mode, buffer.numIndices, gl.UNSIGNED_INT, 0);
    } else {
      gl.drawArrays(entity.d.a.mode, 0, buffer.numIndices);
    }
  }

  _WebGL_listEach(drawEntity, model.g);
  return domNode;
});

function _WebGL_createUniformSetters(gl, model, program, uniformsMap) {
  var glProgram = program.glProgram;
  var currentUniforms = program.currentUniforms;
  var textureCounter = 0;
  var cache = model.f;
  function createUniformSetter(glProgram, uniform) {
    var uniformName = uniform.name;
    var uniformLocation = gl.getUniformLocation(glProgram, uniformName);
    switch (uniform.type) {
      case gl.INT:
        return function (value) {
          if (currentUniforms[uniformName] !== value) {
            gl.uniform1i(uniformLocation, value);
            currentUniforms[uniformName] = value;
          }
        };
      case gl.FLOAT:
        return function (value) {
          if (currentUniforms[uniformName] !== value) {
            gl.uniform1f(uniformLocation, value);
            currentUniforms[uniformName] = value;
          }
        };
      case gl.FLOAT_VEC2:
        return function (value) {
          if (currentUniforms[uniformName] !== value) {
            gl.uniform2f(uniformLocation, value[0], value[1]);
            currentUniforms[uniformName] = value;
          }
        };
      case gl.FLOAT_VEC3:
        return function (value) {
          if (currentUniforms[uniformName] !== value) {
            gl.uniform3f(uniformLocation, value[0], value[1], value[2]);
            currentUniforms[uniformName] = value;
          }
        };
      case gl.FLOAT_VEC4:
        return function (value) {
          if (currentUniforms[uniformName] !== value) {
            gl.uniform4f(uniformLocation, value[0], value[1], value[2], value[3]);
            currentUniforms[uniformName] = value;
          }
        };
      case gl.FLOAT_MAT4:
        return function (value) {
          if (currentUniforms[uniformName] !== value) {
            gl.uniformMatrix4fv(uniformLocation, false, new Float32Array(value));
            currentUniforms[uniformName] = value;
          }
        };
      case gl.SAMPLER_2D:
        var currentTexture = textureCounter++;
        return function (texture) {
          gl.activeTexture(gl.TEXTURE0 + currentTexture);
          var tex = cache.textures.get(texture);
          if (!tex) {
            tex = texture.createTexture(gl);
            cache.textures.set(texture, tex);
          }
          gl.bindTexture(gl.TEXTURE_2D, tex);
          if (currentUniforms[uniformName] !== texture) {
            gl.uniform1i(uniformLocation, currentTexture);
            currentUniforms[uniformName] = texture;
          }
        };
      case gl.BOOL:
        return function (value) {
          if (currentUniforms[uniformName] !== value) {
            gl.uniform1i(uniformLocation, value);
            currentUniforms[uniformName] = value;
          }
        };
      default:
        return function () { };
    }
  }

  var uniformSetters = {};
  var numUniforms = gl.getProgramParameter(glProgram, gl.ACTIVE_UNIFORMS);
  for (var i = 0; i < numUniforms; i++) {
    var uniform = gl.getActiveUniform(glProgram, i);
    uniformSetters[uniformsMap[uniform.name] || uniform.name] = createUniformSetter(glProgram, uniform);
  }

  return uniformSetters;
}

function _WebGL_setUniforms(setters, values) {
  Object.keys(values).forEach(function (name) {
    var setter = setters[name];
    if (setter) {
      setter(values[name]);
    }
  });
}

// VIRTUAL-DOM WIDGET

// eslint-disable-next-line no-unused-vars
var _WebGL_toHtml = F3(function (options, factList, entities) {
  return _VirtualDom_custom(
    factList,
    {
      g: entities,
      f: {},
      h: options
    },
    _WebGL_render,
    _WebGL_diff
  );
});

// eslint-disable-next-line no-unused-vars
var _WebGL_enableAlpha = F2(function (options, option) {
  options.contextAttributes.alpha = true;
  options.contextAttributes.premultipliedAlpha = option.a;
});

// eslint-disable-next-line no-unused-vars
var _WebGL_enableDepth = F2(function (options, option) {
  options.contextAttributes.depth = true;
  options.sceneSettings.push(function (gl) {
    gl.clearDepth(option.a);
  });
});

// eslint-disable-next-line no-unused-vars
var _WebGL_enableStencil = F2(function (options, option) {
  options.contextAttributes.stencil = true;
  options.sceneSettings.push(function (gl) {
    gl.clearStencil(option.a);
  });
});

// eslint-disable-next-line no-unused-vars
var _WebGL_enableAntialias = F2(function (options, option) {
  options.contextAttributes.antialias = true;
});

// eslint-disable-next-line no-unused-vars
var _WebGL_enableClearColor = F2(function (options, option) {
  options.sceneSettings.push(function (gl) {
    gl.clearColor(option.a, option.b, option.c, option.d);
  });
});

// eslint-disable-next-line no-unused-vars
var _WebGL_enablePreserveDrawingBuffer = F2(function (options, option) {
  options.contextAttributes.preserveDrawingBuffer = true;
});

/**
 *  Creates canvas and schedules initial _WebGL_drawGL
 *  @param {Object} model
 *  @param {Object} model.f that may contain the following properties:
           gl, shaders, programs, buffers, textures
 *  @param {List<Option>} model.h list of options coming from Elm
 *  @param {List<Entity>} model.g list of entities coming from Elm
 *  @return {HTMLElement} <canvas> if WebGL is supported, otherwise a <div>
 */
function _WebGL_render(model) {
  var options = {
    contextAttributes: {
      alpha: false,
      depth: false,
      stencil: false,
      antialias: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false
    },
    sceneSettings: []
  };

  _WebGL_listEach(function (option) {
    return A2($elm_explorations$webgl$WebGL$Internal$enableOption, options, option);
  }, model.h);

  var canvas = _VirtualDom_doc.createElement('canvas');
  var gl = canvas.getContext && (
    canvas.getContext('webgl', options.contextAttributes) ||
    canvas.getContext('experimental-webgl', options.contextAttributes)
  );

  if (gl && typeof WeakMap !== 'undefined') {
    options.sceneSettings.forEach(function (sceneSetting) {
      sceneSetting(gl);
    });

    // Activate extensions
    gl.getExtension('OES_standard_derivatives');
    gl.getExtension('OES_element_index_uint');

    model.f.gl = gl;

    // Cache the current settings in order to diff them to avoid redundant calls
    // https://emscripten.org/docs/optimizing/Optimizing-WebGL.html#avoid-redundant-calls
    model.f.toggle = false; // used to diff the settings from the previous and current draw calls
    model.f.blend = { enabled: false, toggle: false };
    model.f.depthTest = { enabled: false, toggle: false };
    model.f.stencilTest = { enabled: false, toggle: false };
    model.f.scissor = { enabled: false, toggle: false };
    model.f.colorMask = { enabled: false, toggle: false };
    model.f.cullFace = { enabled: false, toggle: false };
    model.f.polygonOffset = { enabled: false, toggle: false };
    model.f.sampleCoverage = { enabled: false, toggle: false };
    model.f.sampleAlphaToCoverage = { enabled: false, toggle: false };

    model.f.shaders = [];
    model.f.programs = {};
    model.f.lastProgId = null;
    model.f.buffers = new WeakMap();
    model.f.textures = new WeakMap();
    // Memorize the initial stencil write mask, because
    // browsers may have different number of stencil bits
    model.f.STENCIL_WRITEMASK = gl.getParameter(gl.STENCIL_WRITEMASK);

    // Render for the first time.
    // This has to be done in animation frame,
    // because the canvas is not in the DOM yet
    _WebGL_rAF(function () {
      return A2(_WebGL_drawGL, model, canvas);
    });

  } else {
    canvas = _VirtualDom_doc.createElement('div');
    canvas.innerHTML = '<a href="https://get.webgl.org/">Enable WebGL</a> to see this content!';
  }

  return canvas;
}

function _WebGL_diff(oldModel, newModel) {
  newModel.f = oldModel.f;
  return _WebGL_drawGL(newModel);
}


function _Url_percentEncode(string)
{
	return encodeURIComponent(string);
}

function _Url_percentDecode(string)
{
	try
	{
		return $elm$core$Maybe$Just(decodeURIComponent(string));
	}
	catch (e)
	{
		return $elm$core$Maybe$Nothing;
	}
}var $author$project$Main$LinkClicked = function (a) {
	return {$: 'LinkClicked', a: a};
};
var $author$project$Main$Reset = function (a) {
	return {$: 'Reset', a: a};
};
var $elm$core$Basics$EQ = {$: 'EQ'};
var $elm$core$Basics$GT = {$: 'GT'};
var $elm$core$Basics$LT = {$: 'LT'};
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0.a;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 'Err', a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 'Failure', a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 'Index', a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 'Ok', a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 'OneOf', a: a};
};
var $elm$core$Basics$False = {$: 'False'};
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 'Just', a: a};
};
var $elm$core$Maybe$Nothing = {$: 'Nothing'};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 'Field':
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 'Nothing') {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'Index':
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'OneOf':
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 'Array_elm_builtin', a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 'Leaf', a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 'SubTree', a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.nodeListSize) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.tail);
		} else {
			var treeLen = builder.nodeListSize * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.nodeList) : builder.nodeList;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.nodeListSize);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.tail);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{nodeList: nodeList, nodeListSize: (len / $elm$core$Array$branchFactor) | 0, tail: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = {$: 'True'};
var $elm$core$Result$isOk = function (result) {
	if (result.$ === 'Ok') {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 'Normal':
			return 0;
		case 'MayStopPropagation':
			return 1;
		case 'MayPreventDefault':
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 'External', a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 'Internal', a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = function (a) {
	return {$: 'NotFound', a: a};
};
var $elm$url$Url$Http = {$: 'Http'};
var $elm$url$Url$Https = {$: 'Https'};
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {fragment: fragment, host: host, path: path, port_: port_, protocol: protocol, query: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 'Nothing') {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Http,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Https,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0.a;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = function (a) {
	return {$: 'Perform', a: a};
};
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(_Utils_Tuple0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0.a;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return _Utils_Tuple0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(_Utils_Tuple0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0.a;
		return $elm$core$Task$Perform(
			A2($elm$core$Task$map, tagger, task));
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2($elm$core$Task$map, toMessage, task)));
	});
var $elm$browser$Browser$application = _Browser_application;
var $author$project$Main$Article = function (a) {
	return {$: 'Article', a: a};
};
var $author$project$Main$ArticleMsg = function (a) {
	return {$: 'ArticleMsg', a: a};
};
var $author$project$Main$Empty = {$: 'Empty'};
var $author$project$Main$Home = function (a) {
	return {$: 'Home', a: a};
};
var $author$project$Main$HomeMsg = function (a) {
	return {$: 'HomeMsg', a: a};
};
var $author$project$Main$Model = F3(
	function (key, url, model) {
		return {key: key, model: model, url: url};
	});
var $author$project$Main$Projects = function (a) {
	return {$: 'Projects', a: a};
};
var $author$project$Main$ProjectsMsg = function (a) {
	return {$: 'ProjectsMsg', a: a};
};
var $author$project$Main$Talk = function (a) {
	return {$: 'Talk', a: a};
};
var $author$project$Main$TalkMsg = function (a) {
	return {$: 'TalkMsg', a: a};
};
var $author$project$Main$Words = function (a) {
	return {$: 'Words', a: a};
};
var $author$project$Main$WordsMsg = function (a) {
	return {$: 'WordsMsg', a: a};
};
var $elm$core$Platform$Cmd$map = _Platform_map;
var $elm$core$Tuple$mapBoth = F3(
	function (funcA, funcB, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			funcA(x),
			funcB(y));
	});
var $elm$core$Tuple$mapFirst = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			func(x),
			y);
	});
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $elm$core$Dict$RBEmpty_elm_builtin = {$: 'RBEmpty_elm_builtin'};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$core$Dict$Black = {$: 'Black'};
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: 'RBNode_elm_builtin', a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = {$: 'Red'};
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Red')) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) && (left.d.$ === 'RBNode_elm_builtin')) && (left.d.a.$ === 'Red')) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1.$) {
				case 'LT':
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 'EQ':
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(_Utils_Tuple0),
			pairs));
};
var $author$project$Common$render = _Platform_outgoingPort(
	'render',
	function ($) {
		return $elm$json$Json$Encode$object(_List_Nil);
	});
var $author$project$Article$init = _Utils_Tuple2(
	{
		bijection: _List_fromArray(
			[
				$elm$core$Maybe$Nothing,
				$elm$core$Maybe$Just(0),
				$elm$core$Maybe$Just(0)
			]),
		open: $elm$core$Dict$fromList(
			_List_fromArray(
				[
					_Utils_Tuple2('berlekamp', false),
					_Utils_Tuple2('nice', true)
				]))
	},
	$author$project$Common$render(
		{}));
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $author$project$Article$subscriptions = function (_v0) {
	return $elm$core$Platform$Sub$none;
};
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm_community$list_extra$List$Extra$getAt = F2(
	function (idx, xs) {
		return (idx < 0) ? $elm$core$Maybe$Nothing : $elm$core$List$head(
			A2($elm$core$List$drop, idx, xs));
	});
var $author$project$Common$ifThenElse = F3(
	function (c, a, b) {
		return c ? a : b;
	});
var $elm$core$Dict$map = F2(
	function (func, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				A2(func, key, value),
				A2($elm$core$Dict$map, func, left),
				A2($elm$core$Dict$map, func, right));
		}
	});
var $elm$core$Basics$not = _Basics_not;
var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $elm_community$list_extra$List$Extra$updateAt = F3(
	function (index, fn, list) {
		if (index < 0) {
			return list;
		} else {
			var tail = A2($elm$core$List$drop, index, list);
			if (tail.b) {
				var x = tail.a;
				var xs = tail.b;
				return _Utils_ap(
					A2($elm$core$List$take, index, list),
					A2(
						$elm$core$List$cons,
						fn(x),
						xs));
			} else {
				return list;
			}
		}
	});
var $elm_community$list_extra$List$Extra$setAt = F2(
	function (index, value) {
		return A2(
			$elm_community$list_extra$List$Extra$updateAt,
			index,
			$elm$core$Basics$always(value));
	});
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$Article$update = F2(
	function (msg, m) {
		switch (msg.$) {
			case 'SetBijection':
				var _v1 = msg.a;
				var i = _v1.a;
				var o = _v1.b;
				return _Utils_Tuple2(
					_Utils_update(
						m,
						{
							bijection: A3($elm_community$list_extra$List$Extra$setAt, i, o, m.bijection)
						}),
					$elm$core$Platform$Cmd$none);
			case 'SetBijectionPrime':
				var i = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						m,
						{
							bijection: A2(
								$elm$core$List$map,
								function (k) {
									return A2(
										$elm$core$Maybe$withDefault,
										$elm$core$Maybe$Nothing,
										A2($elm_community$list_extra$List$Extra$getAt, k, m.bijection));
								},
								A2($elm$core$List$range, 0, i - 1))
						}),
					$author$project$Common$render(
						{}));
			default:
				var str = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						m,
						{
							open: A2(
								$elm$core$Dict$map,
								F2(
									function (k, v) {
										return A3(
											$author$project$Common$ifThenElse,
											_Utils_eq(k, str),
											!v,
											v);
									}),
								m.open)
						}),
					$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Article$ToggleArticleOpen = function (a) {
	return {$: 'ToggleArticleOpen', a: a};
};
var $elm$json$Json$Encode$string = _Json_wrap;
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$virtual_dom$VirtualDom$map = _VirtualDom_map;
var $elm$html$Html$map = $elm$virtual_dom$VirtualDom$map;
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 'Normal', a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $author$project$Common$article = F2(
	function (open, art) {
		if (open.$ === 'Nothing') {
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('w-3/4 mb-12 p-4 border border-flu-300 bg-flu-0 rounded-lg')
					]),
				_List_fromArray(
					[
						A2($elm$html$Html$map, $elm$core$Maybe$Just, art)
					]));
		} else {
			var o = open.a;
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class(
						'w-3/4 mb-12 p-4 border border-flu-300 bg-flu-0 rounded-lg relative ' + A3($author$project$Common$ifThenElse, o, 'h-auto', 'h-16 overflow-y-clip'))
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('absolute m-4 top-[-1px] right-0 h-8 w-8 rounded-full border border-flu-300 grid place-items-center font-light text-flu-600 transition-all hover:bg-flu-50 cursor-pointer'),
								$elm$html$Html$Events$onClick($elm$core$Maybe$Nothing)
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('-translate-y-px pointer-events-none')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										A3($author$project$Common$ifThenElse, o, '-', '+'))
									]))
							])),
						A2($elm$html$Html$map, $elm$core$Maybe$Just, art)
					]));
		}
	});
var $elm$html$Html$iframe = _VirtualDom_node('iframe');
var $elm_explorations$markdown$Markdown$defaultOptions = {
	defaultHighlighting: $elm$core$Maybe$Nothing,
	githubFlavored: $elm$core$Maybe$Just(
		{breaks: false, tables: false}),
	sanitize: true,
	smartypants: false
};
var $elm$core$Maybe$isJust = function (maybe) {
	if (maybe.$ === 'Just') {
		return true;
	} else {
		return false;
	}
};
var $elm_explorations$markdown$Markdown$toHtmlWith = _Markdown_toHtml;
var $elm_explorations$markdown$Markdown$toHtml = $elm_explorations$markdown$Markdown$toHtmlWith($elm_explorations$markdown$Markdown$defaultOptions);
var $author$project$Article$md = function (x) {
	return A2(
		$elm_explorations$markdown$Markdown$toHtml,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('content')
			]),
		x);
};
var $elm$html$Html$Attributes$src = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var $author$project$Article$berlekamp = A2(
	$elm$html$Html$div,
	_List_Nil,
	_List_fromArray(
		[
			$author$project$Article$md('\n# Berlekamp\'s Algorithm\n\nSuppose $\\F_p$ is the finite field of prime order $p$ and $f \\in \\F_p[x]$ is squarefree. How can we find the factors of $f$?\n\nElwyn Berlekamp answered this question in his 1967 paper *[Factoring polynomials over finite fields](https://ieeexplore.ieee.org/document/6768643)*, with what I think is a pretty sweet algorithm. Unfortunately, write-ups on his algorithm seem to fall helplessly into a "definition, proof, repeat" structure. These I find somewhat unmotivating — so here\'s my shot a more organic, hopefully more motivated, write up. We\'re going to think about our problem, *factoring a squarefree polynomial over a finite field*, and chip away at it until we run into Berlekamp\'s algorithm. I hope you find it as interesting as I did.\n\nWe start by stating the obvious — we can theoretically find the factors of $f$ with a brute force search — though this makes for a rather terrible algorithm. Let\'s step back to see if we can find a better approach. Notice that any factorization algorithm doesn\'t really need to find *every* factor. At least, it doesn\'t need to find every factor in one go. If our algorithm can produce even just one non-trivial divisor of $f$ (i.e. a non-unit divisor that isn\'t a unit multiple of $f$), then repeated application of our algorithm will suffice to find every factor. In code, this might look something like the following.\n\n```hs\n-- this code is pretty easy to verify using induction.\nfactor :: Polynomial -> Set Polynomial\nfactor f = case findNonTrivialDivisor f of\n    Just g_1 -> do\n        let g_2 = f / g_1\n        return $ Set.union ( factor g_1 ) ( factor g_2 )\n    Nothing ->\n        return $ Set.singleton f -- f is irreducible\n```\n\nPerhaps the term "non-trivial divisor" is a little obfuscating. We want a non-trivial divisor because *intuitively* we\'re trying to split $f$ into two parts, *meaningfully* — into two parts both containing some of the factors of $f$. '),
			A2(
			$elm$html$Html$iframe,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('quiver-embed w-full h-64 text-center'),
					$elm$html$Html$Attributes$src('https://q.uiver.app/#q=WzAsMyxbMSwwLCJmPShmXzFmXzJmXzMpKGZfNFxcbGRvdHMgZl9uKSJdLFswLDIsImdfMT0oZl8xZl8yZl8zKSJdLFsyLDIsImdfMj0oZl80XFxsZG90cyBmX24pIl0sWzAsMiwiIiwyLHsiY3VydmUiOi0yfV0sWzAsMSwiIiwwLHsiY3VydmUiOjJ9XV0=&embed')
				]),
			_List_Nil),
			$author$project$Article$md('\nAnd once we\'ve found one piece, $g_1 \\in \\F_p[x]$, we can trivially find $g_2 = f / g_1$. With this idea, *splitting the factors $f$*, in mind, it\'s natural to express what we want of $g_1$ as follows:\n\n- We require that $g_1$ divides $f$\n- We require that at least one factor of $f$ divides $g_1$\n- We require that at least one factor of $f$ doesn\'t divide $g_1$\n\nBetter still, we can throw away the first requirement; the map $g \\mapsto \\gcd{(f,\\,g)}$, when applied to a polynomial satisfying (2) and (3), will produce a polynomial satisfying all three requirements. This is obvious, given a couple seconds thought. Alright, so now we\'re trying to find a polynomial $g_1$ such that:\n\n- At least one factor of $f$ divides $g_1$\n- At least one factor of $f$ doesn\'t divide $g_1$\n\nLet\'s turn our attention to the set we\'re searching over - currently, it\'s $\\F_p[x]$, which is pretty big, so it\'d be handy to find a smaller set. One candidate is $D_f = \\set{ g \\in \\F_p[x] \\;|\\; \\deg{g} < \\deg{f} }$ which is both smaller than $\\F_p[x]$ and contains every non-trivial divisor of $f$. But we can do better; with all this talk of divisors, this problem feels very much like $\\text{mod}$ territory. So how about the ring of polynomials $\\text{mod } f$? (Note that this forms a subset of $D_f$)\n\n$$A_f \\; \\defeq \\; \\F_p[x]/\\ideal{f}$$\n\nBefore we do anything, we need to verify that $A_f$ contains all the factors of $f$. Or rather,  whether the factors of $f$ distinct in $A_f$. A tidy application of the chinese remainder theorem gets the job done. Suppose $f$ has factors $f_1,\\,f_2,\\,\\ldots,\\,f_n$. The chinese remainder theorem yields a ring isomorphism\n\n$$ \\begin{aligned} \\phi : A_f \\; \\to& \\;\\; \\F_p[x]/ \\ideal{f_1} \\times \\F_p[x]/ \\ideal{f_2} \\times \\cdots \\times \\F_p[x]/ \\ideal{f_n} \\\\\\\\\n    \\\\\\\\\n    g \\; \\mapsto& \\;\\; (r_1,\\,r_2,\\,\\ldots,\\,r_n)\n\\end{aligned}$$\n\nWe consider how $\\phi$ acts on the factors of $f$. It\'s clear (given a seconds thought) that $\\phi(f_i)$ is zero in its $i^{\\text{th}}$ component and non-zero in every other component (i.e. because each $f_i$ is irreducible, and therefore they do not divide each other). So each factor of $f$ is indeed distinct in $A_f$. Moreover, we can apply $\\phi$ to get another perspective on our $g_1$ requirements. We\'re trying to find a polynomial $g_1$ such that $\\phi(g_1)$ is zero in at least one, but not all, components.\n\nCan we find an even smaller set to search? One thing to consider is that this *"zero in at least one component"* property is preserved under exponentiation by positive integers — so we might think about limiting our set to only those points that are somehow fixed under exponentiation. Holding this thought, let\'s think about the effect of exponentiation different powers. If we think about the set of points fixed (in the normal sense) by exponentiation to any old power (say, two) we\'ll run into something a bit yucky; we might lose the ability add. Suppose $g,\\, h \\in A_f$ are fixed under squaring: $g = g^2$ and $h = h^2$. It follows that $(gh)^2 = gh$, but it does not follow that $(g + h)^2 = g + h$. Instead, try exponentiation to the $p^{\\text{th}}$ power. Consider the map\n\n$$ \\begin{aligned} \\sigma\\_p : A_f \\; \\to& \\;\\; A_f \\\\\\\\\n    g \\; \\mapsto& \\;\\; g^{\\, p}\n\\end{aligned} $$\n\nWe can apply the freshman\'s dream to see that the fixed points of $\\sigma\\_p$ form a ring.\n\n$$ \\begin{aligned}\n    \\forall \\, g,h \\in \\text{fix} (\\sigma\\_p) \\quad\\quad& \\sigma\\_p(gh) = (gh)^p = g^ph^p = gh\\\\\\\\\n    &\\sigma\\_p(g + h) = (g + h)^p = g^p + h^p = g + h\n\\end{aligned} $$\n\nThe fixed points of $\\sigma\\_p$ turn out to be pretty useful, so we\'re going to give them a name.\n\n$$ B_f \\;\\defeq\\; \\text{fix} (\\sigma\\_p)$$\n\nThis is called the Berlekamp subalgebra of $A\\_f$. At a first glance we can see that $B\\_f$ contains many of the points we care about, for instance $g$ with $\\phi(g) = (0, 1, 1, \\ldots, 1)$, but this probably shouldn\'t be enough to sell you on it\'s usefulness. Let\'s keep investigating. It follows from Fermat\'s little theorem that $\\sigma\\_p$ is linear:\n\n$$ \\forall \\, t \\in \\F_p,\\, u,v \\in \\F_p[x] \\quad\\quad \\sigma\\_p(tu + v) = {(tu + v)}^p = t^p u^p + v^p = t\\sigma\\_p(u) + \\sigma\\_p(v) $$\n\nWhich has potential to be a big win for us — it gives a fast method to produce elements of $B_f$. Indeed, watch this:\n\n$$B_f = \\text{fix} (\\sigma\\_p) = \\ker(\\sigma\\_p - \\text{id})$$\n\nWe can encode $(\\sigma\\_p - \\text{id})$ as a matrix, then use Gaussian elimination (or some other method) to produce a basis, $B$, of its nullspace. The elements of $B_f$ are precisely the linear combinations of $B$! But we\'re not done yet. Take some dummy variable $h$. Then the following equality holds in $\\F_p$:\n\n$$ \\prod\\_{c \\in \\F\\_p} (h + c) = h^p - h$$\n\nI plan to write another post to prove this equality (the proof involves an interesting application of combinatorics and of group theory), but for now we\'ll take it as given. To me the $h^p - h$ is just screaming $B_f$, so let\'s replace the dummy $h$ with any $h \\in B\\_f$ to get the following equality (which holds in $\\F\\_p[x]$)\n\n$$\\forall h\\in B\\_f,\\quad \\prod\\_{c \\in \\F\\_p} (h + c) = 0 \\mod f$$\n\nSomewhat magically, this equality basically completes our algorithm. If that $h$ is a non-zero in $B_f$ and a non-unit $F\\_p[x]$ then it must be that one of the $(h + c)$ terms is a multiple of a non-trivial divisor of $f$!\n\n```hs\nfindNonTrivialDivisor :: Polynomial -> Maybe Polynomial\nfindNonTrivialDivisor f = case nullspaceBasis (berlekampMatrix f) of\n    basis | length basis < 2 -> Nothing\n    basis -> do\n        let h = head basis\n        find ( isNonZeroNonUnit ) [ gcd f (h + c) | c <- field ]\n        -- don\'t forget to apply that ^^^ gcd we talked about earlier!\n```\n\nBut we can do better. What if we lift the $\\text{gcd}$ into the product?\n\n$$\\prod\\_{c \\in \\F\\_p} \\gcd{(f,\\,h + c)}$$\n\nAll we\'ve really done is remove some factors from the product - precisely the factors that aren\'t in $f$ - so the product as a whole must still be a multiple of $f$ (i.e. zero $\\text{mod } f$). So every factor in the product is also in $f$, and every factor in $f$ is also in the product. Could they be equal? They are equal if the product has no repeated factors, which is pretty easy to verify:\n\nSuppose for some non-equal $s,\\,t \\in \\F\\_p$ the terms $\\gcd{(f,h+s)}$ and $\\gcd{(f,h+t)}$ share a factor $q$. Then $h+s$ and $h+t$ also share $q$. Moreover, $q$ divides their difference, $s - t$. Since $q$ isn\'t a unit, this is impossible.\n\nSo we get the following equality:\n\n$$f = \\prod\\_{c \\in \\F\\_p} \\gcd{(f,\\,h + c)}$$\n\nUsing this equality we can improve our algorithm:\n\n```hs\nfactorBerlekamp :: Polynomial -> Set Polynomial\nfactorBerlekamp f = case nullspaceBasis (berlekampMatrix f) of\n    basis | length basis < 2 -> do\n        return $ basis\n    basis -> do\n        let h = head basis\n        let terms = filter ( isNonZeroNonUnit ) [ gcd f (h + c) | c <- field ]\n        return $ Set.unionMap factorBerlekamp terms\n```\n\nSo that\'s the general gist of Berlekamp\'s algoritm. Thanks for reading!\n\n*I\'ll leave the following note without proof: the vector space dimension of $B_f$ is equal to the number of factors of $f$. I think this is pretty dang cool.*\n')
		]));
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1.$) {
					case 'LT':
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 'EQ':
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $author$project$Article$SetBijection = function (a) {
	return {$: 'SetBijection', a: a};
};
var $author$project$Article$SetBijectionPrime = function (a) {
	return {$: 'SetBijectionPrime', a: a};
};
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $elm_community$list_extra$List$Extra$count = function (predicate) {
	return A2(
		$elm$core$List$foldl,
		F2(
			function (x, acc) {
				return predicate(x) ? (acc + 1) : acc;
			}),
		0);
};
var $elm_community$list_extra$List$Extra$andThen = $elm$core$List$concatMap;
var $elm_community$list_extra$List$Extra$lift2 = F3(
	function (f, la, lb) {
		return A2(
			$elm_community$list_extra$List$Extra$andThen,
			function (a) {
				return A2(
					$elm_community$list_extra$List$Extra$andThen,
					function (b) {
						return _List_fromArray(
							[
								A2(f, a, b)
							]);
					},
					lb);
			},
			la);
	});
var $elm_community$list_extra$List$Extra$cartesianProduct = function (ll) {
	if (!ll.b) {
		return _List_fromArray(
			[_List_Nil]);
	} else {
		var xs = ll.a;
		var xss = ll.b;
		return A3(
			$elm_community$list_extra$List$Extra$lift2,
			$elm$core$List$cons,
			xs,
			$elm_community$list_extra$List$Extra$cartesianProduct(xss));
	}
};
var $elm$core$List$repeatHelp = F3(
	function (result, n, value) {
		repeatHelp:
		while (true) {
			if (n <= 0) {
				return result;
			} else {
				var $temp$result = A2($elm$core$List$cons, value, result),
					$temp$n = n - 1,
					$temp$value = value;
				result = $temp$result;
				n = $temp$n;
				value = $temp$value;
				continue repeatHelp;
			}
		}
	});
var $elm$core$List$repeat = F2(
	function (n, value) {
		return A3($elm$core$List$repeatHelp, _List_Nil, n, value);
	});
var $elm$core$List$sum = function (numbers) {
	return A3($elm$core$List$foldl, $elm$core$Basics$add, 0, numbers);
};
var $author$project$Article$expand = function (p) {
	return function (lst) {
		return A2(
			$elm$core$List$map,
			function (i) {
				return _Utils_Tuple2(
					A2(
						$elm_community$list_extra$List$Extra$count,
						$elm$core$Basics$eq(i),
						lst),
					i);
			},
			A2($elm$core$List$range, 1, p));
	}(
		A2(
			$elm$core$List$map,
			$elm$core$List$sum,
			$elm_community$list_extra$List$Extra$cartesianProduct(
				A2(
					$elm$core$List$map,
					function (x) {
						return A2(
							$elm$core$List$cons,
							1,
							A2($elm$core$List$repeat, x, 0));
					},
					A2($elm$core$List$range, 0, p - 1)))));
};
var $author$project$Article$mapFirst = F2(
	function (f, lst) {
		if (lst.b) {
			var h = lst.a;
			var t = lst.b;
			return A2(
				$elm$core$List$cons,
				f(h),
				t);
		} else {
			return _List_Nil;
		}
	});
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm_community$list_extra$List$Extra$removeAt = F2(
	function (index, l) {
		if (index < 0) {
			return l;
		} else {
			var _v0 = A2($elm$core$List$drop, index, l);
			if (!_v0.b) {
				return l;
			} else {
				var rest = _v0.b;
				return _Utils_ap(
					A2($elm$core$List$take, index, l),
					rest);
			}
		}
	});
var $author$project$Article$makeBijection = F2(
	function (objects, inlst) {
		if (inlst.b) {
			if (inlst.a.$ === 'Just') {
				var h = inlst.a.a;
				var t = inlst.b;
				return A2(
					$author$project$Article$mapFirst,
					$elm$core$List$cons(
						A2(
							$elm$core$Maybe$withDefault,
							-1,
							A2($elm_community$list_extra$List$Extra$getAt, h, objects))),
					A2(
						$author$project$Article$makeBijection,
						A2($elm_community$list_extra$List$Extra$removeAt, h, objects),
						t));
			} else {
				var _v1 = inlst.a;
				var t = inlst.b;
				return function (l) {
					return A2($elm$core$List$cons, _List_Nil, l);
				}(
					A2(
						$author$project$Article$mapFirst,
						$elm$core$List$cons(
							A2(
								$elm$core$Maybe$withDefault,
								-1,
								A2($elm_community$list_extra$List$Extra$getAt, 0, objects))),
						A2(
							$author$project$Article$makeBijection,
							A2($elm_community$list_extra$List$Extra$removeAt, 0, objects),
							t)));
			}
		} else {
			return _List_fromArray(
				[_List_Nil]);
		}
	});
var $elm_community$list_extra$List$Extra$last = function (items) {
	last:
	while (true) {
		if (!items.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			if (!items.b.b) {
				var x = items.a;
				return $elm$core$Maybe$Just(x);
			} else {
				var rest = items.b;
				var $temp$items = rest;
				items = $temp$items;
				continue last;
			}
		}
	}
};
var $elm$core$Maybe$map2 = F3(
	function (func, ma, mb) {
		if (ma.$ === 'Nothing') {
			return $elm$core$Maybe$Nothing;
		} else {
			var a = ma.a;
			if (mb.$ === 'Nothing') {
				return $elm$core$Maybe$Nothing;
			} else {
				var b = mb.a;
				return $elm$core$Maybe$Just(
					A2(func, a, b));
			}
		}
	});
var $author$project$Article$pairs_ = function (lst) {
	if (lst.b && lst.b.b) {
		var h1 = lst.a;
		var _v1 = lst.b;
		var h2 = _v1.a;
		var t = _v1.b;
		return A2(
			$elm$core$List$cons,
			_Utils_Tuple2(h1, h2),
			$author$project$Article$pairs_(
				A2($elm$core$List$cons, h2, t)));
	} else {
		return _List_Nil;
	}
};
var $author$project$Article$pairs = function (lst) {
	return _Utils_ap(
		$author$project$Article$pairs_(lst),
		A2(
			$elm$core$Maybe$withDefault,
			_List_Nil,
			A3(
				$elm$core$Maybe$map2,
				F2(
					function (a, b) {
						return _List_fromArray(
							[
								_Utils_Tuple2(b, a)
							]);
					}),
				$elm$core$List$head(lst),
				$elm_community$list_extra$List$Extra$last(lst))));
};
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $elm_explorations$linear_algebra$Math$Vector2$add = _MJS_v2add;
var $elm$svg$Svg$Attributes$d = _VirtualDom_attribute('d');
var $author$project$Graph$lerppos = F2(
	function (_v0, v) {
		var bot = _v0.a;
		var top = _v0.b;
		return bot + ((top - bot) * v);
	});
var $elm$core$Basics$round = _Basics_round;
var $author$project$Graph$xpos = F2(
	function (_v0, a) {
		var w = _v0.w;
		var h = _v0.h;
		return $elm$core$String$fromInt(
			$elm$core$Basics$round(
				A2($author$project$Graph$lerppos, w, a)));
	});
var $author$project$Graph$ypos = F2(
	function (_v0, a) {
		var w = _v0.w;
		var h = _v0.h;
		return $elm$core$String$fromInt(
			$elm$core$Basics$round(
				A2($author$project$Graph$lerppos, h, a)));
	});
var $author$project$Graph$toStringTuple = F2(
	function (b, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return A2($author$project$Graph$xpos, b, x) + (' ' + A2($author$project$Graph$ypos, b, y));
	});
var $elm_explorations$linear_algebra$Math$Vector2$toRecord = _MJS_v2toRecord;
var $author$project$Graph$toTuple = function (v) {
	return function (_v0) {
		var x = _v0.x;
		var y = _v0.y;
		return _Utils_Tuple2(x, y);
	}(
		$elm_explorations$linear_algebra$Math$Vector2$toRecord(v));
};
var $author$project$Graph$describePath = F5(
	function (b, s, start, end, control) {
		return (!s) ? ('M' + (A2(
			$author$project$Graph$toStringTuple,
			b,
			$author$project$Graph$toTuple(start)) + (' L' + A2(
			$author$project$Graph$toStringTuple,
			b,
			$author$project$Graph$toTuple(end))))) : ('M' + (A2(
			$author$project$Graph$toStringTuple,
			b,
			$author$project$Graph$toTuple(start)) + (' Q' + (A2($author$project$Graph$toStringTuple, b, control) + (' ' + A2(
			$author$project$Graph$toStringTuple,
			b,
			$author$project$Graph$toTuple(end)))))));
	});
var $elm_explorations$linear_algebra$Math$Vector2$distance = _MJS_v2distance;
var $elm$svg$Svg$Attributes$fill = _VirtualDom_attribute('fill');
var $elm_explorations$linear_algebra$Math$Vector2$fromRecord = _MJS_v2fromRecord;
var $author$project$Graph$fromTuple = function (_v0) {
	var x = _v0.a;
	var y = _v0.b;
	return $elm_explorations$linear_algebra$Math$Vector2$fromRecord(
		{x: x, y: y});
};
var $elm$svg$Svg$trustedNode = _VirtualDom_nodeNS('http://www.w3.org/2000/svg');
var $elm$svg$Svg$g = $elm$svg$Svg$trustedNode('g');
var $elm$svg$Svg$Attributes$markerEnd = _VirtualDom_attribute('marker-end');
var $elm_explorations$linear_algebra$Math$Vector2$normalize = _MJS_v2normalize;
var $elm$svg$Svg$path = $elm$svg$Svg$trustedNode('path');
var $elm_explorations$linear_algebra$Math$Vector2$scale = _MJS_v2scale;
var $elm$svg$Svg$Attributes$stroke = _VirtualDom_attribute('stroke');
var $elm$svg$Svg$Attributes$strokeWidth = _VirtualDom_attribute('stroke-width');
var $elm_explorations$linear_algebra$Math$Vector2$sub = _MJS_v2sub;
var $author$project$Graph$arrowBetweenPoints = F4(
	function (b, s, _v0, _v1) {
		var x1 = _v0.a;
		var y1 = _v0.b;
		var x2 = _v1.a;
		var y2 = _v1.b;
		var start = $author$project$Graph$fromTuple(
			_Utils_Tuple2(x1, y1));
		var midpoint = F2(
			function (start_, end_) {
				return A2(
					$elm_explorations$linear_algebra$Math$Vector2$scale,
					0.5,
					A2($elm_explorations$linear_algebra$Math$Vector2$add, start_, end_));
			});
		var makeNormal = F2(
			function (start_, end_) {
				return $author$project$Graph$fromTuple(
					function (_v2) {
						var x = _v2.a;
						var y = _v2.b;
						return _Utils_Tuple2(-y, x);
					}(
						$author$project$Graph$toTuple(
							$elm_explorations$linear_algebra$Math$Vector2$normalize(
								A2($elm_explorations$linear_algebra$Math$Vector2$sub, end_, start_)))));
			});
		var end = $author$project$Graph$fromTuple(
			_Utils_Tuple2(x2, y2));
		var length = A2($elm_explorations$linear_algebra$Math$Vector2$distance, start, end);
		var normal = A2(makeNormal, start, end);
		var curvemidpoint = A2(
			$elm_explorations$linear_algebra$Math$Vector2$add,
			A2(midpoint, start, end),
			A2($elm_explorations$linear_algebra$Math$Vector2$scale, (0.5 * s) * length, normal));
		var control = F2(
			function (start_, end_) {
				return $author$project$Graph$toTuple(
					A2(
						$elm_explorations$linear_algebra$Math$Vector2$add,
						A2(midpoint, start_, end_),
						A2(
							$elm_explorations$linear_algebra$Math$Vector2$scale,
							(s * A2($elm_explorations$linear_algebra$Math$Vector2$distance, start_, end_)) / 2,
							A2(makeNormal, start_, end_))));
			});
		return A2(
			$elm$svg$Svg$g,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d(
							A5(
								$author$project$Graph$describePath,
								b,
								s,
								start,
								curvemidpoint,
								A2(control, start, curvemidpoint))),
							$elm$svg$Svg$Attributes$fill('none'),
							$elm$svg$Svg$Attributes$stroke('black'),
							$elm$svg$Svg$Attributes$strokeWidth('2'),
							$elm$svg$Svg$Attributes$markerEnd('url(#arrow)')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d(
							A5(
								$author$project$Graph$describePath,
								b,
								s,
								curvemidpoint,
								end,
								A2(control, curvemidpoint, end))),
							$elm$svg$Svg$Attributes$fill('none'),
							$elm$svg$Svg$Attributes$stroke('black'),
							$elm$svg$Svg$Attributes$strokeWidth('2')
						]),
					_List_Nil)
				]));
	});
var $elm$svg$Svg$defs = $elm$svg$Svg$trustedNode('defs');
var $elm$svg$Svg$Attributes$id = _VirtualDom_attribute('id');
var $elm$svg$Svg$marker = $elm$svg$Svg$trustedNode('marker');
var $elm$svg$Svg$Attributes$markerHeight = _VirtualDom_attribute('markerHeight');
var $elm$svg$Svg$Attributes$markerWidth = _VirtualDom_attribute('markerWidth');
var $elm$svg$Svg$Attributes$orient = _VirtualDom_attribute('orient');
var $elm$svg$Svg$Attributes$refX = _VirtualDom_attribute('refX');
var $elm$svg$Svg$Attributes$refY = _VirtualDom_attribute('refY');
var $elm$svg$Svg$Attributes$viewBox = _VirtualDom_attribute('viewBox');
var $author$project$Graph$arrowheadMarker = A2(
	$elm$svg$Svg$defs,
	_List_Nil,
	_List_fromArray(
		[
			A2(
			$elm$svg$Svg$marker,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$id('arrow'),
					$elm$svg$Svg$Attributes$viewBox('0 0 15 15'),
					$elm$svg$Svg$Attributes$refX('5'),
					$elm$svg$Svg$Attributes$refY('5'),
					$elm$svg$Svg$Attributes$markerWidth('6'),
					$elm$svg$Svg$Attributes$markerHeight('6'),
					$elm$svg$Svg$Attributes$orient('auto-start-reverse')
				]),
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d('M 0 0 L 10 5 L 0 10 z'),
							$elm$svg$Svg$Attributes$fill('black')
						]),
					_List_Nil)
				]))
		]));
var $elm$svg$Svg$circle = $elm$svg$Svg$trustedNode('circle');
var $elm$svg$Svg$Attributes$cx = _VirtualDom_attribute('cx');
var $elm$svg$Svg$Attributes$cy = _VirtualDom_attribute('cy');
var $author$project$Graph$flip = F3(
	function (f, b, a) {
		return A2(f, a, b);
	});
var $elm$svg$Svg$foreignObject = $elm$svg$Svg$trustedNode('foreignObject');
var $elm$svg$Svg$Attributes$height = _VirtualDom_attribute('height');
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$svg$Svg$Attributes$overflow = _VirtualDom_attribute('overflow');
var $elm$svg$Svg$Attributes$preserveAspectRatio = _VirtualDom_attribute('preserveAspectRatio');
var $elm$svg$Svg$Attributes$r = _VirtualDom_attribute('r');
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $elm$svg$Svg$svg = $elm$svg$Svg$trustedNode('svg');
var $elm$core$Dict$values = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, valueList) {
				return A2($elm$core$List$cons, value, valueList);
			}),
		_List_Nil,
		dict);
};
var $elm$svg$Svg$Attributes$width = _VirtualDom_attribute('width');
var $elm$svg$Svg$Attributes$x = _VirtualDom_attribute('x');
var $elm$svg$Svg$Attributes$y = _VirtualDom_attribute('y');
var $author$project$Graph$view = function (g) {
	var nodes = $elm$core$Dict$fromList(
		A2(
			$elm$core$List$map,
			function (n) {
				return _Utils_Tuple2(
					n,
					g.view(n));
			},
			g.nodes));
	var edges = A2(
		function (f) {
			return $elm$core$List$map(
				A2($elm$core$Tuple$mapBoth, f, f));
		},
		A2(
			$elm$core$Basics$composeR,
			A2($author$project$Graph$flip, $elm$core$Dict$get, nodes),
			A2(
				$elm$core$Basics$composeR,
				$elm$core$Maybe$map($elm$core$Tuple$second),
				$elm$core$Maybe$withDefault(
					_Utils_Tuple2(0.5, 0.5)))),
		g.edges);
	return A2(
		$elm$svg$Svg$svg,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$width('100%'),
				$elm$svg$Svg$Attributes$height('100%'),
				$elm$svg$Svg$Attributes$preserveAspectRatio('xMidYMid slice'),
				$elm$svg$Svg$Attributes$viewBox(
				A2($author$project$Graph$xpos, g.bbox, 0) + (' ' + (A2($author$project$Graph$ypos, g.bbox, 0) + (' ' + (A2($author$project$Graph$xpos, g.bbox, 1) + (' ' + A2($author$project$Graph$ypos, g.bbox, 1)))))))
			]),
		$elm$core$List$concat(
			_List_fromArray(
				[
					A2(
					$elm$core$List$map,
					function (_v0) {
						var p1 = _v0.a;
						var p2 = _v0.b;
						return A4($author$project$Graph$arrowBetweenPoints, g.bbox, -0.6, p1, p2);
					},
					edges),
					_List_fromArray(
					[$author$project$Graph$arrowheadMarker]),
					A2(
					$elm$core$List$concatMap,
					function (_v1) {
						var h = _v1.a;
						var _v2 = _v1.b;
						var px = _v2.a;
						var py = _v2.b;
						return _List_fromArray(
							[
								A2(
								$elm$svg$Svg$circle,
								_List_fromArray(
									[
										$elm$svg$Svg$Attributes$cx(
										A2($author$project$Graph$xpos, g.bbox, px)),
										$elm$svg$Svg$Attributes$cy(
										A2($author$project$Graph$ypos, g.bbox, py)),
										$elm$svg$Svg$Attributes$overflow('visible'),
										$elm$svg$Svg$Attributes$fill('white'),
										$elm$svg$Svg$Attributes$r('10')
									]),
								_List_Nil),
								A2(
								$elm$svg$Svg$foreignObject,
								_List_fromArray(
									[
										$elm$svg$Svg$Attributes$overflow('visible'),
										$elm$svg$Svg$Attributes$x(
										A2($author$project$Graph$xpos, g.bbox, px)),
										$elm$svg$Svg$Attributes$y(
										A2($author$project$Graph$ypos, g.bbox, py))
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('overflow-visible grid place-items-center w-[25px] h-[25px] -translate-y-1/2 -translate-x-1/2')
											]),
										_List_fromArray(
											[h]))
									]))
							]);
					},
					$elm$core$Dict$values(nodes))
				])));
};
var $author$project$Article$funnyBijection_ = F3(
	function (h, f, lst) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('flex w-max flex-row'),
					A2(
					$elm$html$Html$Attributes$style,
					'height',
					$elm$core$String$fromInt(h) + 'px')
				]),
			_List_fromArray(
				[
					function () {
					var p = $elm$core$List$length(lst);
					var nodes = A2($elm$core$List$range, 1, p);
					return $author$project$Graph$view(
						{
							bbox: {
								h: _Utils_Tuple2(0, 200),
								w: _Utils_Tuple2(0, 300)
							},
							edges: A2(
								$elm$core$List$concatMap,
								$author$project$Article$pairs,
								A2($author$project$Article$makeBijection, nodes, lst)),
							nodes: nodes,
							view: function (i) {
								return _Utils_Tuple2(
									f(i - 1),
									_Utils_Tuple2(i / (p + 1), 0.5));
							}
						});
				}()
				]));
	});
var $elm$core$String$cons = _String_cons;
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $elm$core$Char$fromCode = _Char_fromCode;
var $author$project$Article$math = function (str) {
	return A2(
		$elm_explorations$markdown$Markdown$toHtml,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('md-math')
			]),
		'$' + (str + '$'));
};
var $author$project$Article$mathchar = function (i) {
	return $author$project$Article$math(
		$elm$core$String$fromChar(
			$elm$core$Char$fromCode(97 + i)));
};
var $author$project$Article$funnyBijection = A2($author$project$Article$funnyBijection_, 150, $author$project$Article$mathchar);
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$core$List$intersperse = F2(
	function (sep, xs) {
		if (!xs.b) {
			return _List_Nil;
		} else {
			var hd = xs.a;
			var tl = xs.b;
			var step = F2(
				function (x, rest) {
					return A2(
						$elm$core$List$cons,
						sep,
						A2($elm$core$List$cons, x, rest));
				});
			var spersed = A3($elm$core$List$foldr, step, _List_Nil, tl);
			return A2($elm$core$List$cons, hd, spersed);
		}
	});
var $elm_community$list_extra$List$Extra$intercalate = function (xs) {
	return A2(
		$elm$core$Basics$composeL,
		$elm$core$List$concat,
		$elm$core$List$intersperse(xs));
};
var $author$project$Article$showInt = function (i) {
	if (i === 1) {
		return '';
	} else {
		return $elm$core$String$fromInt(i);
	}
};
var $elm$core$List$sortBy = _List_sortBy;
var $author$project$Article$funnyBicjectionPanel = function (opts) {
	var xc = A2(
		$elm_community$list_extra$List$Extra$count,
		$elm$core$Basics$eq($elm$core$Maybe$Nothing),
		opts);
	var p = $elm$core$List$length(opts);
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('flex flex-col items-center justify-center max-w-[800px] mx-auto my-4 py-4 px-8')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('flex flex-row items-stretch justify-center w-full')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('flex flex-col min-w-1/3 overflow-clip rounded-lg border border-flu-200 p-4 justify-center pointer-events-none')
							]),
						A2(
							$elm$core$List$map,
							function (i) {
								return A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('relative flex flex-row items-center')
										]),
									function () {
										var curr = A2(
											$elm$core$Maybe$withDefault,
											$elm$core$Maybe$Nothing,
											A2($elm_community$list_extra$List$Extra$getAt, i, opts));
										return $elm$core$List$concat(
											_List_fromArray(
												[
													_List_fromArray(
													[
														$author$project$Article$math('(')
													]),
													_List_fromArray(
													[
														A2(
														$elm$html$Html$div,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('cursor-pointer rounded-md pointer-events-auto'),
																$elm$html$Html$Attributes$class(
																A3(
																	$author$project$Common$ifThenElse,
																	_Utils_eq(curr, $elm$core$Maybe$Nothing),
																	'bg-hl-1',
																	'hover:bg-hl-11')),
																$elm$html$Html$Events$onClick(
																_Utils_Tuple2(i, $elm$core$Maybe$Nothing))
															]),
														_List_fromArray(
															[
																$author$project$Article$math('\\large \\,x\\,')
															]))
													]),
													A2(
													$elm$core$List$concatMap,
													function (k) {
														return _List_fromArray(
															[
																$author$project$Article$math('\\large +'),
																A2(
																$elm$html$Html$div,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$class('cursor-pointer rounded-md pointer-events-auto'),
																		$elm$html$Html$Attributes$class(
																		A3(
																			$author$project$Common$ifThenElse,
																			_Utils_eq(
																				curr,
																				$elm$core$Maybe$Just(k)),
																			'bg-hl-1',
																			'hover:bg-hl-11')),
																		$elm$html$Html$Events$onClick(
																		_Utils_Tuple2(
																			i,
																			$elm$core$Maybe$Just(k)))
																	]),
																_List_fromArray(
																	[
																		$author$project$Article$math('\\large \\,1\\,')
																	]))
															]);
													},
													A2(
														$elm$core$List$range,
														0,
														(!i) ? (-1) : ((p - i) - 1))),
													_List_fromArray(
													[
														$author$project$Article$math(')')
													])
												]));
									}());
							},
							A2($elm$core$List$range, 0, p - 1))),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('p-8 my-auto')
							]),
						_List_fromArray(
							[
								$author$project$Article$math('\\overset{\\scriptsize f}{\\longmapsto}')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('w-min px-4 rounded-lg border border-flu-200 flex flex-col justify-center items-center')
							]),
						_List_fromArray(
							[
								$author$project$Article$funnyBijection(opts)
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('flex flex-row items-center justify-center gap-1')
					]),
				$elm$core$List$concat(
					_List_fromArray(
						[
							_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class(' pt-5 ')
									]),
								_List_fromArray(
									[
										$author$project$Article$math(
										'$\\large P(' + ($elm$core$String$fromInt(p) + (') = \\prod_{ 0\\leq i < ' + ($elm$core$String$fromInt(p) + '} (x + i) = \\,$'))))
									]))
							]),
							A2(
							$elm_community$list_extra$List$Extra$intercalate,
							_List_fromArray(
								[
									$author$project$Article$math('\\large + ')
								]),
							A2(
								$elm$core$List$map,
								function (_v0) {
									var a = _v0.a;
									var i = _v0.b;
									return _List_fromArray(
										[
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class(
													A3(
														$author$project$Common$ifThenElse,
														_Utils_eq(i, xc),
														'bg-hl-1',
														''))
												]),
											_List_fromArray(
												[
													$author$project$Article$math(
													'\\large ' + ($author$project$Article$showInt(a) + ('x^{' + ($author$project$Article$showInt(i) + '}'))))
												]))
										]);
								},
								$elm$core$List$reverse(
									A2(
										$elm$core$List$sortBy,
										$elm$core$Tuple$second,
										$author$project$Article$expand(p)))))
						])))
			]));
};
var $elm$core$Basics$modBy = _Basics_modBy;
var $author$project$Article$nice = function (m) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				$author$project$Article$md('\n# Nice Bijection\n\nSuppose $n$ is a natural number and $x$ is a free variable. Consider the following product.\n\n$$P(n) \\; \\defeq \\prod_{0 \\, \\leq \\, i \\, < \\, n} (x + i) \\; = \\; x(x+1)(x+2)\\cdots(x+n-1)$$\n\nCan we say anything about how, in general, $P(n)$ expands? I think this is a fairly interesting question; $P(n)$ feels very structured, but it isn\'t obvious whether that structure will hand us any nice formulas. Let\'s try expanding a few examples.\n\n$$ \\begin{aligned}\n    P(1) \\; &= \\; x \\\\\\\\\n    P(2) \\; &= \\; x^2 + x \\\\\\\\\n    P(3) \\; &= \\; x^3 + 3x^2 + 2x \\\\\\\\\n    P(4) \\; &= \\; x^4 + 6x^3 + 11x^2 + 6x  \\\\\\\\\n    P(5) \\; &= \\; x^5 + 10x^4 + 35x^3 + 50x^2 + 24x \\\\\\\\\n    P(6) \\; &= \\; x^6 + 15 x^5 + 85 x^4 + 225 x^3 + 274 x^2 + 120 x\\\\\\\\\n    P(7) \\; &= \\; x^7 + 21x^6 + 175x^5 + 735x^4 + 1624x^3 + 1764x^2 + 720x\\\\\\\\\n    P(8) \\; &= \\; x^8 + 28 x^7 + 322 x^6 + 1960 x^5 + 6769 x^4 + 13132 x^3 + 13068 x^2 + 5040 x\n\\end{aligned} $$\n\nThat\'s a lot of numbers, and they all look pretty random. The $P(5)$ case does stick out to me though. $10,\\, 35,$ and $50$ are multiples of $5$, and $24$ is almost a multiple of $5$. The $P(7)$ case is similar — $21,\\, 175,\\, 735,\\, 1624,\\,$ and $1764$ are multiples of $7$, and $720$ is almost $721$. $721$ is a multiple of $7$. And I suppose the same pattern holds for $P(2)$ and $P(3)$. Perhaps this pattern is worthy of investigation. Let\'s take a look at $P(n)$ with coefficients modulo $n$\n\n$$ \\begin{aligned}\n    P(2) \\; &\\equiv \\; x^2 - x \\mod 2 \\\\\\\\\n    P(3) \\; &\\equiv \\; x^3 - x \\mod 3 \\\\\\\\\n    P(4) \\; &\\equiv \\; x^4 + 2x^3 - x^2 + 2x \\mod 4 \\\\\\\\\n    P(5) \\; &\\equiv \\; x^5 - x \\mod 5 \\\\\\\\\n    P(6) \\; &\\equiv \\; x^6 + 3 x^5 + x^4 + 3 x^3 - 2 x^2 \\mod 6 \\\\\\\\\n    P(7) \\; &\\equiv \\; x^7 - x \\mod 7 \\\\\\\\\n    P(8) \\; &\\equiv \\; x^8 + 4 x^7 + 2 x^6 + x^4 + 4 x^3 + 4 x^2 \\mod 8\n\\end{aligned} $$\n\nThe cases in which $n$ is prime are all looking suspicious, so let\'s investigate further.\n\n$$ \\begin{aligned}\n    P(2) \\; &\\equiv \\; x^2 - x \\mod 2 \\\\\\\\\n    P(3) \\; &\\equiv \\; x^3 - x \\mod 3 \\\\\\\\\n    P(5) \\; &\\equiv \\; x^5 - x \\mod 5 \\\\\\\\\n    P(7) \\; &\\equiv \\; x^7 - x \\mod 7 \\\\\\\\\n    P(11) \\; &\\equiv \\; x^{11} - x \\mod 11 \\\\\\\\\n    P(13) \\; &\\equiv \\; x^{13} - x \\mod 13 \\\\\\\\\n    P(17) \\; &\\equiv \\; x^{17} - x \\mod 17 \\\\\\\\\n\\end{aligned} $$\n\nSurely that\'s a pattern; these examples beg a question. Is it true that the following statment holds for every prime $p$?\n\n$$ \\prod_{0 \\, \\leq \\, i \\, < \\, p} (x+i) \\;\\; {\\overset{\\scriptsize\\textnormal{?}}{=}} \\;\\; x^p - x \\mod p $$\n\nIn order to answer this question we\'ll have to figure out what\'s going on here. Where do the coefficents in the expansion of $P(p)$ actually come from? We can start by giving them labels. Write\n\n$$P(p) = a\\_1x + a\\_2x^2 + \\cdots + a\\_{p-1}x^{p-1} + x^p$$\n\nWe\'re trying to figure out if it\'s always the case that $a\\_1 \\equiv -1$ and $a\\_2 \\equiv a\\_3 \\equiv \\cdots \\equiv a\\_{p - 1} \\equiv 0$ modulo $p$. Let\'s get $a_1 \\equiv -1$ out of the way. Notice that\n\n$$a_1 = 1\\cdot 2\\cdot 3 \\cdot \\ldots \\cdot (p-1)$$\n\nThe terms of this product are exactly the non-zero elements of the field of integers modulo $p$. It turns out that every term but $1$ and $p-1$ is cancelled by its inverse (though I\'ll not prove it here). This yields $$a_1 = 1\\cdot (p-1) \\equiv -1 \\mod p$$\n\nHow about every other $a_i$? It seems almost magical that they might all conspire to equal zero modulo $p$; this problem seems impenetrable. However we have one foothold — it really seems like some kind of inclusion/exclusion business going on. Let me explain what I mean. A common algorithm for expanding brackets involves taking every possible choice of one term from each brackets, then summing the products of each choice. In the case of $P(3)$ this is as follows.\n\n$$ \\begin{aligned}\n    \\hl{x}(\\hl{x}+1\\,)(\\hl{x}+2\\,) &\\quad \\rightsquigarrow \\quad x\\cdot x\\cdot x = x^3 \\\\\\\\\n    \\hl{x}(\\hl{x}+1)(x+\\hl{2}) &\\quad\\rightsquigarrow\\quad x \\cdot x \\cdot 2 = 2x^2 \\\\\\\\\n    \\hl{x}(x+\\hl{1})(\\hl{x}+2) &\\quad\\rightsquigarrow\\quad x \\cdot 1 \\cdot x = x^2 \\\\\\\\\n    \\hl{x}(x+\\hl{1})(x+\\hl{2}) &\\quad\\rightsquigarrow\\quad x \\cdot 1 \\cdot 2 = 2x\n\\end{aligned} $$\n\n$$ \\implies \\; P(3) \\, = \\, x^3 + 2x^2 + x^2 + 2x $$\n\nDespite the clunkiness of my explanation, I do think this is a very natural idea. Indeed, I\'d bet that you already use this algorithm, perhaps even without realizing it; the *FOIL* method is exactly this algorithm applied to a pair of brackets. Sure, you might say, but does this algorithm actually take us anywhere? To me this idea takes us into combinatorics territory. Instead of thinking about expanding $p$ pairs of brackets we can think about making $p$ choices. The value of each $a_ix^i$ is then the sum of the choices in which we picked $x$, $i$ times. Consider the products from the choices above in which we picked $x$ twice.\n\n$$a\\_2x^2 = \\sum \\; \\text{results of choices with $x$ picked twice } = x^2 + 2x^2 = 3x^2$$\n\nThis is all a bit vague. We need to formalize. Let\'s start by turning our product into a set of sets.\n\n$$ P_p \\; = \\; \\set{\\set{x},\\, \\set{x,\\,1},\\, \\set{x,\\,2},\\, \\ldots \\, ,\\, \\set{x,\\,p-1}} $$\n\nNow we can restate $P(p)$ in terms of $P_p$\n\n$$ P(p) \\; = \\; \\prod\\_{A \\,\\in\\, P\\_p} \\sum\\_{a \\,\\in\\, A} a $$\n\nNext, we\'ll use the cartesian product. Let $A$ be a set of sets (as above).\n\n$$ C(A) \\; \\defeq \\; \\prod\\_{B \\,\\in\\, A} B$$\n\nNow, each element of $C(P_p)$ corresponds to exactly one choice of terms in $P(p)$. We can use $\\hl{\\text{highlight}}$ notation as shorthand (really longhand) for the elements of $C(P_p)$. For example, in the case of $C(P_3)$\n\n$$ \\begin{aligned}\n    \\hl{x}(\\hl{x}+1)(x+\\hl{2}) &\\quad\\defeq\\quad (x,\\,x,\\,2) \\\\\\\\\n    \\hl{x}(x+\\hl{1})(\\hl{x}+2) &\\quad\\defeq\\quad (x,\\,1,\\,x)\n\\end{aligned} $$\n\nWe can now state our algorithm for expanding brackets. Denote the $i^{\\text{th}}$ component of $c \\in C(A)$ with $c_i$. Our algorithm is as follows.\n\n$$ \\prod\\_{B \\,\\in\\, A} \\sum\\_{b \\,\\in\\, B} b \\; = \\; \\sum\\_{c \\,\\in\\, C(A)} \\; \\prod\\_{1 \\, \\leq \\, i \\, \\leq \\, |A|} \\; c_i $$\n\nUsing $\\prod c$ to denote the product of the components of $c$, we can write\n\n$$ P(p) \\; = \\; \\sum\\_{c \\,\\in\\, C(P_p)} \\; \\prod c$$\n\nLet\'s recap. We have these choices $c \\in C(P_p)$, we know the coefficient $a_i$ has something to do with (is a weighted count of?) the choices $c$ in which $x$ appears $i$, and we\'d like to move further into combinatorics territory.\n\nNow, it\'d be great if we found some way to move into a counting problem. But, rather annoyingly, we have this "weighted count" business going on — $(x,\\,x,\\,2)$ and $(x,\\,1,\\,x)$ contribute to $a_2$ differently, despite both containing $x$ twice. It would be nice if our choices had a bit more symmetry to them, if each component of our choices were either $x$ or not $x$; either $x$ or $1$. What if we unfold each $(x+i)$ into a $(x+1+1+\\cdots+1)$?\n\n$$ \\begin{aligned}\n    P(3) \\; &= \\; x(x+1)(x+1+1) \\\\\\\\\n    &= \\; (x^2+x)(x+1+1) \\\\\\\\\n    &= \\; x^2(x+1+1) + x(x+1+1) \\\\\\\\\n    &= \\; x^3+x^2+x^2 + x^2+x+x \\\\\\\\\n\\end{aligned} $$\n\nWe can still apply our algorithm, though we do need to differentiate between the many ones in each set of $P_p$.\n\n$$P\\_p \\;\\defeq\\; \\Big\\\\{\\set{x},\\, \\set{x,\\,1\\_1},\\, \\set{x,\\,1\\_1,\\,1\\_2},\\, \\ldots ,\\, \\\\{\\, x,\\, 1\\_1,\\, 1\\_2,\\, \\ldots,\\, 1\\_{p - 1} \\, \\\\} \\Big\\\\} $$\n\nNow suppose $c \\in C(P_p)$. If $i$ components of $c$ are $x$, we have that $\\prod c = x^i$. It follows that the $a_i$ is equal to the number of distinct choices with $x$ picked $i$ times.\n\n$$a_i = \\Big|\\,\\set{c \\in C(P_p) \\;:\\; x \\text{ appears in } i \\text{ components of } c}\\,\\Big|$$\n\nIn our example, $P(3)$, there are $3$ choices with $x$ picked twice, so $a_2 = 3$.\n\n$$\\begin{aligned}\n    \\hl{x}(x+\\hl{1})(\\hl{x}+1+1) \\; &\\quad \\overset{\\scriptsize\\Pi\\,}{\\longmapsto} \\quad \\; x^2 \\\\\\\\\n    \\hl{x}(\\hl{x} + 1)(x+\\hl{1} + 1) \\; &\\quad \\overset{\\scriptsize\\Pi\\,}{\\longmapsto} \\quad \\; x^2 \\\\\\\\\n    \\hl{x}(\\hl{x} + 1)(x+1+\\hl{1}) \\; &\\quad \\overset{\\scriptsize\\Pi\\,}{\\longmapsto} \\quad \\; x^2\n\\end{aligned}$$\n\nThis is cool, but it\'s still a bit tricky to think about. Can we come up with another perspective on these choices? Let\'s say we generate a choice, starting from the set containing the most terms, then the second most, down to the set containing $x$. Then at the $i^{\\text{th}}$ step in our sequence we have possible choices of $x$ and $p-i$ ones. Let\'s give ourselves some mental breathing room by supposing we never choose $x$, so at the $i^{\\text{th}}$ step we can choose between $p-i$ ones. This is exactly like ordering cards from a deck of $p-1$ cards! Picking the $k^{\\text{th}}$ one corresponds to picking the $k^{\\text{th}}$ remaining card from the deck. We can visualize this in the case of $P(3)$. Denote the king and queen cards with $\\textbf{K}$ and $\\textbf{Q}$.\n\n$$ \\begin{aligned}\n    x\\big(x +\\hl{1} + 1 \\big)\\big(x + \\hl{1} \\big) & \\quad\\, \\rightsquigarrow \\quad x\\big(x + \\hl{\\textbf K} + {\\textbf Q} \\big)\\big(x + \\hl{\\textbf Q\\,}\\big) \\quad \\rightsquigarrow \\quad \\big(\\, {\\textbf K},\\, {\\textbf Q} \\, \\big) \\\\\\\\\n    x\\big(x + 1 + \\hl{1} \\big)\\big(x + \\hl{1} \\big) & \\quad\\, \\rightsquigarrow \\quad x\\big(x + {\\textbf K} + \\hl{\\textbf Q} \\big)\\big(x + \\hl{\\textbf K\\,}\\big) \\quad \\rightsquigarrow \\quad \\big(\\, {\\textbf Q},\\, {\\textbf K} \\, \\big)\n\\end{aligned} $$\n\nSo the fact that $a_1 = 2$ corresponds to the fact that there are $2$ ways to order $2$ cards. Now we\'re pretty close to understanding our whole problem through a nice counting lense — we just need to find a way to understand a choice containing an $x$. Each $1$ represents picking some distinct object. An $x$ ought to represent something meaningfully different. In my imagination I order a scrambled mess of cards by placing them, one at a time, onto a deck. What an $x$ represents starting a new deck? Then $a_i$ is equal to the the number of ways to arrange $p$ cards into $i$ decks. Our only trouble is that the number of remaining cards should decrease after we choose $x$. Let\'s just say the highest available card is always used to start a new pile. This will also make sense of the $(x)$ term of $P(p)$; before you can start ordering cards into decks, you have to start a deck. Again, we can visualize this in the case of $P(3)$.\n\n$$ \\begin{aligned}\n    \\hl{\\text{new pile with \\textbf{K}}}\\big(\\hl{\\text{new pile with \\textbf{Q}}} + {\\textbf Q} + {\\textbf J} \\big)\\big(\\text{new pile with \\textbf J} + \\hl{\\textbf J\\,}\\big) \\quad &\\rightsquigarrow \\quad \\big(\\, {\\textbf K}\\, \\big) \\;\\; \\big(\\, {\\textbf Q},\\, {\\textbf J} \\, \\big) \\\\\\\\\n    \\hl{\\text{new pile with \\textbf{K}}}\\big(\\text{new pile with \\textbf{Q}} + \\hl{\\textbf Q} + {\\textbf J} \\big)\\big(\\text{new pile with \\textbf J} + \\hl{\\textbf J\\,}\\big) \\quad &\\rightsquigarrow \\quad \\big(\\, {\\textbf K},\\, {\\textbf Q},\\, {\\textbf J} \\, \\big) \\\\\\\\\n    \\hl{\\text{new pile with \\textbf{K}}}\\big(\\text{new pile with \\textbf{Q}} + {\\textbf Q} + \\hl{\\textbf J} \\big)\\big(\\text{new pile with \\textbf Q} + \\hl{\\textbf Q\\,}\\big) \\quad &\\rightsquigarrow \\quad \\big(\\, {\\textbf K},\\, {\\textbf J},\\, {\\textbf Q} \\, \\big) \\\\\\\\\n\\end{aligned} $$\n\nTo recap, for $i>1$, the coefficient $a_i$ in the expansion of $P(p)$ is equal to the number of ways to arrange $p$ cards (remember we\'re inlcuding the $x$ term) into $i$ piles, modulo the choice of the first card of each pile. Woah, let\'s simplify this a bit. "An ordered list modulo choice of first element"... could each pile of cards correspond with a cycle? Quick recap on cycles: a cycle of set $A$ is a bijection on $A$ such that the orbit each point is $A$. For instance if $A = \\set{a,\\,b,\\,c}$ then the function $\\set{(a,c),\\,(c,b),\\,(b,a)}$ is a cycle of $A$. A cycle is exactly a connected directed graph such that every vertex has one incoming and one outgoing arrow. Using this fact, we can visualise our cycle as follows.'),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('w-full flex justify-center items-center pt-4 h-[120px]')
					]),
				_List_fromArray(
					[
						A3(
						$author$project$Article$funnyBijection_,
						200,
						$author$project$Article$mathchar,
						_List_fromArray(
							[
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Just(1),
								$elm$core$Maybe$Just(0)
							]))
					])),
				$author$project$Article$md('\nMore generally, every permutation of $A$ can be uniquely decomposed into cycles of partitions of $A$. Maybe, then, $a_i$ is the number permutations in $S_p$ that decompose into $i$ cycles. To verify this, one must show that this correspondence we\'ve established, call it $f$, is indeed a bijection from choices in $C(P_p)$ to permuations in $S_p$. It\'s not hard to construct $f^{-1}$, one can simply follow the algorithm that defines $f$, but in reverse. That in mind, let\'s look at some examples — suppose our set of $p$ objects is $\\set{a,\\,b,\\,c,\\, \\cdots}$. In the case of $P(3)$, the choice $(x,\\,x,\\,x)$ maps to the permuation that decomposes into the set of three $3$ one-cycles, each of which contain one element of $\\set{a,\\,b,\\,c}$\n'),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('w-full mx-auto my-1 flex flex-row justify-center items-center')
					]),
				_List_fromArray(
					[
						$author$project$Article$math('\\hl{x}(\\hl{x} + 1 + 1)(\\hl{x} + 1)'),
						$author$project$Article$math('\\quad\\quad\\overset{\\scriptsize f}{\\longmapsto}'),
						$author$project$Article$funnyBijection(
						_List_fromArray(
							[$elm$core$Maybe$Nothing, $elm$core$Maybe$Nothing, $elm$core$Maybe$Nothing]))
					])),
				$author$project$Article$md('The choice $(x,\\, 1\\_1,\\, x)$ maps to the following permuation; decomposing into a two-cycle and a one-cycle.'),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('w-full mx-auto my-1 flex flex-row justify-center items-center')
					]),
				_List_fromArray(
					[
						$author$project$Article$math('\\hl{x}(x + \\hl{1} + 1)(\\hl{x} + 1)'),
						$author$project$Article$math('\\quad\\quad\\overset{\\scriptsize f}{\\longmapsto}'),
						$author$project$Article$funnyBijection(
						_List_fromArray(
							[
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Just(0),
								$elm$core$Maybe$Nothing
							]))
					])),
				$author$project$Article$md('The choice $(x,\\, 1\\_2,\\, x)$ maps to another permuation.'),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('w-full mx-auto my-1 flex flex-row justify-center items-center')
					]),
				_List_fromArray(
					[
						$author$project$Article$math('\\hl{x}(x + 1 + \\hl{1})(\\hl{x} + 1)'),
						$author$project$Article$math('\\quad\\quad\\overset{\\scriptsize f}{\\longmapsto}'),
						$author$project$Article$funnyBijection(
						_List_fromArray(
							[
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Just(1),
								$elm$core$Maybe$Nothing
							]))
					])),
				$author$project$Article$md('The following tool visualizes arbitrary choices. *Hint: trying clicking an $\\mathit{x}$ or a $\\mathit{1}$ in the tool.*'),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class(' pt-8 pb-4 flex flex-row gap-8 justify-center items-center w-full')
					]),
				A2(
					$elm$core$List$map,
					function (i) {
						return A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick(
									$author$project$Article$SetBijectionPrime(i)),
									$elm$html$Html$Attributes$class(
									'rounded-md py-2 px-3 cursor-pointer hover:bg-flu-200 ' + A3(
										$author$project$Common$ifThenElse,
										_Utils_eq(
											$elm$core$List$length(m.bijection),
											i),
										' bg-flu-200 ',
										''))
								]),
							_List_fromArray(
								[
									$author$project$Article$math(
									'P(' + ($author$project$Article$showInt(i) + ')'))
								]));
					},
					_List_fromArray(
						[3, 5, 7]))),
				A2(
				$elm$html$Html$map,
				$author$project$Article$SetBijection,
				$author$project$Article$funnyBicjectionPanel(m.bijection)),
				$author$project$Article$md('\nGetting back to our original point, we have that $a_i$ is equal to the number of permuations of $p$ objects that decompose into an $i$ cycles. We wanted to show that $a_i$ is a multiple of $p$. So now we want to show "the number of permuations of $p$ objects that decompose into an $i$ cycles" is a multiple of $p$. For $c \\in S\\_p$ denote the set of cycles $c$ decomposes into by $d(c)$. Take\n\n$$A_{p,\\,i} \\,\\defeq\\; \\set{ c \\in (f \\circ C)(P_p) \\,:\\, |d(c)| = i } $$\n\nWe have\n\n$$ a\\_i \\,=\\, \\big| A_{p,\\,i} \\big| $$\n\nNow that we\'re working with a set, we can take a more literal perspective on multiples and divisors. To say that $a\\_i$ is a multiple of $p$ is to say that $A\\_{p,\\,i}$ can be divided into disjoint subsets, each containing $p$ elements. So how might we divide the elements of $A\\_{p,\\,i}$? Perhaps we ought to look at some examples, $A\\_{3,\\,2}$ contains exactly three elements so we don\'t actually need to divide it. Let\'s look at the next smallest case, $A\\_{5,\\,4}$, which contains ten elements. Remember, we\'re trying to split this into (two) disjoint subsets of size five.\n'),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('flex flex-row w-full gap-3 pt-6 px-6 place-center justify-center')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('my-auto')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('$$\\huge \\Bigg\\{$$')
							])),
						A3(
						$author$project$Article$funnyBijection_,
						130,
						$author$project$Article$mathchar,
						_List_fromArray(
							[
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Just(0),
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Nothing
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('my-auto')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('$$\\huge ,$$')
							])),
						A3(
						$author$project$Article$funnyBijection_,
						130,
						$author$project$Article$mathchar,
						_List_fromArray(
							[
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Just(0),
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Nothing
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('my-auto')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('$$\\huge ,$$')
							])),
						A3(
						$author$project$Article$funnyBijection_,
						130,
						$author$project$Article$mathchar,
						_List_fromArray(
							[
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Just(0),
								$elm$core$Maybe$Nothing
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('my-auto')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('$$\\huge ,$$')
							])),
						A3(
						$author$project$Article$funnyBijection_,
						130,
						$author$project$Article$mathchar,
						_List_fromArray(
							[
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Just(0)
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('my-auto')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('$$\\huge ,$$')
							])),
						A3(
						$author$project$Article$funnyBijection_,
						130,
						$author$project$Article$mathchar,
						_List_fromArray(
							[
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Just(1),
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Nothing
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('my-auto')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('$$\\huge ,$$')
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('flex flex-row w-full gap-3 pb-6 px-6 place-center justify-center')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('my-auto')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('$$\\huge \\;$$')
							])),
						A3(
						$author$project$Article$funnyBijection_,
						130,
						$author$project$Article$mathchar,
						_List_fromArray(
							[
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Just(1),
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Nothing
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('my-auto')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('$$\\huge ,$$')
							])),
						A3(
						$author$project$Article$funnyBijection_,
						130,
						$author$project$Article$mathchar,
						_List_fromArray(
							[
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Just(1),
								$elm$core$Maybe$Nothing
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('my-auto')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('$$\\huge ,$$')
							])),
						A3(
						$author$project$Article$funnyBijection_,
						130,
						$author$project$Article$mathchar,
						_List_fromArray(
							[
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Just(2),
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Nothing
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('my-auto')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('$$\\huge ,$$')
							])),
						A3(
						$author$project$Article$funnyBijection_,
						130,
						$author$project$Article$mathchar,
						_List_fromArray(
							[
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Just(2),
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Nothing
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('my-auto')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('$$\\huge ,$$')
							])),
						A3(
						$author$project$Article$funnyBijection_,
						130,
						$author$project$Article$mathchar,
						_List_fromArray(
							[
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Just(3),
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Nothing
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('my-auto')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('$$\\huge \\Bigg\\}$$')
							]))
					])),
				$author$project$Article$md('\nPerhaps, you have some ideas, perhaps you don\'t. I claim that, even in writing out our set, we\'ve stumbled into a hint. The trick is to think about *how many elements each arrow skips*. Look at the order we wrote the elements in. We naturally put first the sets with cycles *skipping no elements*, then those *skipping one element*, and so on. Let\'s rewrite our set in a way that these *element skips* easier to compare. The order of our labels, $a,\\, b ,\\, c ,\\, \\ldots$, is arbitrary; let\'s shift them around to place the label that\'s projecting an arrow first.'),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('flex flex-row w-full gap-3 pt-6 px-6 place-center justify-center')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('my-auto')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('$$\\huge \\Bigg\\{$$')
							])),
						A3(
						$author$project$Article$funnyBijection_,
						130,
						$author$project$Article$mathchar,
						_List_fromArray(
							[
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Just(0),
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Nothing
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('my-auto')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('$$\\huge ,$$')
							])),
						A3(
						$author$project$Article$funnyBijection_,
						130,
						A2(
							$elm$core$Basics$composeR,
							$elm$core$Basics$add(1),
							A2(
								$elm$core$Basics$composeR,
								$elm$core$Basics$modBy(5),
								$author$project$Article$mathchar)),
						_List_fromArray(
							[
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Just(0),
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Nothing
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('my-auto')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('$$\\huge ,$$')
							])),
						A3(
						$author$project$Article$funnyBijection_,
						130,
						A2(
							$elm$core$Basics$composeR,
							$elm$core$Basics$add(2),
							A2(
								$elm$core$Basics$composeR,
								$elm$core$Basics$modBy(5),
								$author$project$Article$mathchar)),
						_List_fromArray(
							[
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Just(0),
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Nothing
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('my-auto')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('$$\\huge ,$$')
							])),
						A3(
						$author$project$Article$funnyBijection_,
						130,
						A2(
							$elm$core$Basics$composeR,
							$elm$core$Basics$add(3),
							A2(
								$elm$core$Basics$composeR,
								$elm$core$Basics$modBy(5),
								$author$project$Article$mathchar)),
						_List_fromArray(
							[
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Just(0),
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Nothing
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('my-auto')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('$$\\huge ,$$')
							])),
						A3(
						$author$project$Article$funnyBijection_,
						130,
						$author$project$Article$mathchar,
						_List_fromArray(
							[
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Just(1),
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Nothing
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('my-auto')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('$$\\huge ,$$')
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('flex flex-row w-full gap-3 pb-6 px-6 place-center justify-center')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('my-auto')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('$$\\huge \\;$$')
							])),
						A3(
						$author$project$Article$funnyBijection_,
						130,
						A2(
							$elm$core$Basics$composeR,
							$elm$core$Basics$add(1),
							A2(
								$elm$core$Basics$composeR,
								$elm$core$Basics$modBy(5),
								$author$project$Article$mathchar)),
						_List_fromArray(
							[
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Just(1),
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Nothing
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('my-auto')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('$$\\huge ,$$')
							])),
						A3(
						$author$project$Article$funnyBijection_,
						130,
						A2(
							$elm$core$Basics$composeR,
							$elm$core$Basics$add(2),
							A2(
								$elm$core$Basics$composeR,
								$elm$core$Basics$modBy(5),
								$author$project$Article$mathchar)),
						_List_fromArray(
							[
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Just(1),
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Nothing
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('my-auto')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('$$\\huge ,$$')
							])),
						A3(
						$author$project$Article$funnyBijection_,
						130,
						A2(
							$elm$core$Basics$composeR,
							$elm$core$Basics$add(3),
							A2(
								$elm$core$Basics$composeR,
								$elm$core$Basics$modBy(5),
								$author$project$Article$mathchar)),
						_List_fromArray(
							[
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Just(1),
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Nothing
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('my-auto')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('$$\\huge ,$$')
							])),
						A3(
						$author$project$Article$funnyBijection_,
						130,
						A2(
							$elm$core$Basics$composeR,
							$elm$core$Basics$add(4),
							A2(
								$elm$core$Basics$composeR,
								$elm$core$Basics$modBy(5),
								$author$project$Article$mathchar)),
						_List_fromArray(
							[
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Just(1),
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Nothing
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('my-auto')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('$$\\huge ,$$')
							])),
						A3(
						$author$project$Article$funnyBijection_,
						130,
						A2(
							$elm$core$Basics$composeR,
							$elm$core$Basics$add(4),
							A2(
								$elm$core$Basics$composeR,
								$elm$core$Basics$modBy(5),
								$author$project$Article$mathchar)),
						_List_fromArray(
							[
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Just(0),
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Nothing
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('my-auto')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('$$\\huge \\Bigg\\}$$')
							]))
					])),
				$author$project$Article$md('\nAh-ha! Now we have two, very obvious, disjoint subsets of size five. This is good; we ought to formalize our *skipping elements* business. When we say "these two memebers of $A\\_{p,\\,i}$ have the same element skips" we really mean "these two memebers of $A\\_{p,\\,i}$ look the same after label shifting". So let\'s formalize label shifting. We begin by swapping our $p$ letter labels $\\set{a,\\,b,\\, c,\\, \\cdots\\,}$ for integers $\\set{0,1,\\ldots, p - 1}$. Now a *label shift* is simply one or more applications of the following shifting function.\n\n$$\\texttt{shift} \\, : \\, j \\; \\longmapsto \\; j + 1 \\mod p$$\n\nThis function is defined on our label, lift it to $A\\_{p,\\,i}$ by partially applying function. Now "two memebers of $A\\_{p,\\,i}$ look the same modulo element shifting" if they are both members of the same orbit of $\\circ\\,\\texttt{shift}$. Notice that every orbit of $\\circ\\,\\texttt{shift}$ has size at most $p$ because $\\texttt{shift}^p = 1$; there are $10$ elements in $A\\_{5,\\,4}$ hence it was split by $\\circ\\,\\texttt{shift}$ into at least two orbits. Now, if we can show that every orbit has exactly $p$ elements, we\'ll be done — we will have solved our whole problem. The orbit-stabilizer theorem is practically calling to us, so let\'s redefine $\\circ\\,\\texttt{shift}$ as a group action on $A\\_{p,\\,i}$. Let $\\Z\\_p$ we the group of integers under addition.\n\n$$ \\begin{aligned}\n\\varphi \\;:\\; \\Z\\_p \\times A\\_{p,\\,i} \\;&\\longrightarrow\\; A\\_{p,\\,i} \\\\\\\\\n(j,\\,c) \\;&\\longmapsto\\; c \\,\\circ\\, \\texttt{shift}^{\\,j}\n\\end{aligned} $$\n\nFirst we ought to note that $\\varphi$ is well defined, following from the commutativity of the diagram:\n'),
				A2(
				$elm$html$Html$iframe,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('quiver-embed w-full h-64 mb-6 text-center'),
						$elm$html$Html$Attributes$src('https://q.uiver.app/#q=WzAsNCxbMCwwLCJTX3AiXSxbMCwyLCJkKFNfcCkiXSxbMiwyLCJkKFNfcCkiXSxbMiwwLCJTX3AiXSxbMSwyLCJcXGNpcmNcXCxcXHRleHR0dHtzaGlmdH1cXFxcIFxcdGV4dHsoYXBwbGllZCBlbGVtZW50LXdpc2UpfSIsMl0sWzAsMSwiZCIsMl0sWzAsMywiXFxjaXJjXFwsXFx0ZXh0dHR7c2hpZnR9Il0sWzIsMywiZF57LTF9IiwyXV0=&embed')
					]),
				_List_Nil),
				$author$project$Article$md('\nNow suppose $c \\in A\\_{p,\\,i}$ with $1 < i < p$. The obrit stabilizer theorem implies that the size of the $\\varphi$ orbit of $c$ divides the size of $\\Z\\_p$. Because $p$ is prime, its only divisors are $p$ and $1$ — for the sake contradiction suppose the orbit of $c$ contains only one $1$ element. Could it really be that $\\varphi\\_j(c) = c$ for every $j$? Let\'s investigate further. For every label $k \\in \\set{0,\\,1,\\,2,\\,\\ldots,\\, p - 1}$ it must be that\n\n$$ c(k) \\;=\\; (\\varphi\\_1(c))(k) \\; = \\; (c \\circ \\texttt{shift})(k) \\; = \\; c(k+1)$$\n\nThis implies that $c$ isn\'t injective, but $c$ is a permuation — it\'s a bijection, so we\'ve reached our contradiction. Instead, it must be that every orbit of $\\varphi$ contains $p$ elements. It follows that $A\\_{p,\\, i}$ can be divided into disjoint subsets of size of $p$, and that $a_i$ is divisable $p$.\n\n$$P(p) \\;\\equiv\\; x^p - x \\mod p$$\n        ')
			]));
};
var $author$project$Article$view = function (m) {
	return A2(
		$elm$core$List$map,
		function (_v0) {
			var k = _v0.a;
			var v = _v0.b;
			return A2(
				$elm$html$Html$map,
				$elm$core$Maybe$withDefault(
					$author$project$Article$ToggleArticleOpen(k)),
				A2(
					$author$project$Common$article,
					A2($elm$core$Dict$get, k, m.open),
					v));
		},
		_List_fromArray(
			[
				_Utils_Tuple2('berlekamp', $author$project$Article$berlekamp),
				_Utils_Tuple2(
				'nice',
				$author$project$Article$nice(m))
			]));
};
var $author$project$Article$page = {init: $author$project$Article$init, subscriptions: $author$project$Article$subscriptions, update: $author$project$Article$update, view: $author$project$Article$view};
var $author$project$Home$init = _Utils_Tuple2(_Utils_Tuple0, $elm$core$Platform$Cmd$none);
var $author$project$Home$subscriptions = function (_v0) {
	return $elm$core$Platform$Sub$none;
};
var $author$project$Home$update = F2(
	function (msg, _v0) {
		return _Utils_Tuple2(_Utils_Tuple0, $elm$core$Platform$Cmd$none);
	});
var $elm$html$Html$a = _VirtualDom_node('a');
var $elm$html$Html$Attributes$href = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var $elm$html$Html$img = _VirtualDom_node('img');
var $author$project$Common$md = function (x) {
	var defaultOptions = $elm_explorations$markdown$Markdown$defaultOptions;
	return A3(
		$elm_explorations$markdown$Markdown$toHtmlWith,
		_Utils_update(
			defaultOptions,
			{
				githubFlavored: $elm$core$Maybe$Just(
					{breaks: true, tables: false}),
				smartypants: true
			}),
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('content')
			]),
		x);
};
var $author$project$Common$mdCodeLike = function (x) {
	return A2(
		$elm_explorations$markdown$Markdown$toHtml,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('content_codelike')
			]),
		x);
};
var $author$project$Home$about = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('space-x-6 flex')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('flex-auto flex flex-col')
				]),
			_List_fromArray(
				[
					$author$project$Common$md('\n# About Me\n\n**Hi, I\'m Joel.** Here\'s a few things I\'ve been up to recently:\n'),
					$author$project$Common$mdCodeLike('\n*2025* Studying an **MRes. in Mathematics** at Macquarie University\n- Thesis project in category theory\n\n*2024* **Tutoring mathematics** at the University of Queensland (UQ)\n\n*2024* Completed a **B. Computer Science (honours)** at UQ\n- Thesis project in computer algebra\n- Received first class honours\n\n*2023* **Software Engineering** at Veitch Lister Consulting\n- Built type systems and programming languages\n\n*2022* Completed a dual **B. Mathematics / B. Computer Science** at UQ\n'),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('mt-3')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('I also like to sing, draw, and write. A copy of my full cv is available '),
							A2(
							$elm$html$Html$a,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$href('./Joel_Richardson_website_cv.pdf'),
									$elm$html$Html$Attributes$class('italic underline')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('here')
								])),
							$elm$html$Html$text('.')
						]))
				])),
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('flex-none w-1/3')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$img,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$src('pfp.jpg'),
							$elm$html$Html$Attributes$class('w-full h-full rounded-lg border border-flu-300 object-cover object-left')
						]),
					_List_Nil)
				]))
		]));
var $author$project$Home$view = function (_v0) {
	return _List_fromArray(
		[
			A2(
			$elm$html$Html$map,
			$elm$core$Maybe$withDefault(_Utils_Tuple0),
			A2($author$project$Common$article, $elm$core$Maybe$Nothing, $author$project$Home$about))
		]);
};
var $author$project$Home$page = {init: $author$project$Home$init, subscriptions: $author$project$Home$subscriptions, update: $author$project$Home$update, view: $author$project$Home$view};
var $author$project$Projects$SetTexture = function (a) {
	return {$: 'SetTexture', a: a};
};
var $author$project$Projects$keys = {a: false, d: false, s: false, w: false};
var $elm$core$Task$onError = _Scheduler_onError;
var $elm$core$Task$attempt = F2(
	function (resultToMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2(
					$elm$core$Task$onError,
					A2(
						$elm$core$Basics$composeL,
						A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
						$elm$core$Result$Err),
					A2(
						$elm$core$Task$andThen,
						A2(
							$elm$core$Basics$composeL,
							A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
							$elm$core$Result$Ok),
						task))));
	});
var $elm_explorations$webgl$WebGL$Texture$Resize = function (a) {
	return {$: 'Resize', a: a};
};
var $elm_explorations$webgl$WebGL$Texture$linear = $elm_explorations$webgl$WebGL$Texture$Resize(9729);
var $elm_explorations$webgl$WebGL$Texture$nearestMipmapLinear = $elm_explorations$webgl$WebGL$Texture$Resize(9986);
var $elm_explorations$webgl$WebGL$Texture$Wrap = function (a) {
	return {$: 'Wrap', a: a};
};
var $elm_explorations$webgl$WebGL$Texture$repeat = $elm_explorations$webgl$WebGL$Texture$Wrap(10497);
var $elm_explorations$webgl$WebGL$Texture$defaultOptions = {flipY: true, horizontalWrap: $elm_explorations$webgl$WebGL$Texture$repeat, magnify: $elm_explorations$webgl$WebGL$Texture$linear, minify: $elm_explorations$webgl$WebGL$Texture$nearestMipmapLinear, verticalWrap: $elm_explorations$webgl$WebGL$Texture$repeat};
var $elm_explorations$webgl$WebGL$Texture$LoadError = {$: 'LoadError'};
var $elm_explorations$webgl$WebGL$Texture$SizeError = F2(
	function (a, b) {
		return {$: 'SizeError', a: a, b: b};
	});
var $elm_explorations$webgl$WebGL$Texture$loadWith = F2(
	function (_v0, url) {
		var magnify = _v0.magnify;
		var minify = _v0.minify;
		var horizontalWrap = _v0.horizontalWrap;
		var verticalWrap = _v0.verticalWrap;
		var flipY = _v0.flipY;
		var expand = F4(
			function (_v1, _v2, _v3, _v4) {
				var mag = _v1.a;
				var min = _v2.a;
				var hor = _v3.a;
				var vert = _v4.a;
				return A6(_Texture_load, mag, min, hor, vert, flipY, url);
			});
		return A4(expand, magnify, minify, horizontalWrap, verticalWrap);
	});
var $elm_explorations$webgl$WebGL$Texture$load = $elm_explorations$webgl$WebGL$Texture$loadWith($elm_explorations$webgl$WebGL$Texture$defaultOptions);
var $elm$core$Result$toMaybe = function (result) {
	if (result.$ === 'Ok') {
		var v = result.a;
		return $elm$core$Maybe$Just(v);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$GLSL$load = A2(
	$elm$core$Task$attempt,
	$elm$core$Result$toMaybe,
	$elm_explorations$webgl$WebGL$Texture$load('data/grass.jpg'));
var $author$project$Projects$init = _Utils_Tuple2(
	{keys: $author$project$Projects$keys, texture: $elm$core$Maybe$Nothing, time: 0.0},
	A2($elm$core$Platform$Cmd$map, $author$project$Projects$SetTexture, $author$project$GLSL$load));
var $author$project$Projects$TimeChange = function (a) {
	return {$: 'TimeChange', a: a};
};
var $elm$browser$Browser$AnimationManager$Delta = function (a) {
	return {$: 'Delta', a: a};
};
var $elm$browser$Browser$AnimationManager$State = F3(
	function (subs, request, oldTime) {
		return {oldTime: oldTime, request: request, subs: subs};
	});
var $elm$browser$Browser$AnimationManager$init = $elm$core$Task$succeed(
	A3($elm$browser$Browser$AnimationManager$State, _List_Nil, $elm$core$Maybe$Nothing, 0));
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$browser$Browser$AnimationManager$now = _Browser_now(_Utils_Tuple0);
var $elm$browser$Browser$AnimationManager$rAF = _Browser_rAF(_Utils_Tuple0);
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$browser$Browser$AnimationManager$onEffects = F3(
	function (router, subs, _v0) {
		var request = _v0.request;
		var oldTime = _v0.oldTime;
		var _v1 = _Utils_Tuple2(request, subs);
		if (_v1.a.$ === 'Nothing') {
			if (!_v1.b.b) {
				var _v2 = _v1.a;
				return $elm$browser$Browser$AnimationManager$init;
			} else {
				var _v4 = _v1.a;
				return A2(
					$elm$core$Task$andThen,
					function (pid) {
						return A2(
							$elm$core$Task$andThen,
							function (time) {
								return $elm$core$Task$succeed(
									A3(
										$elm$browser$Browser$AnimationManager$State,
										subs,
										$elm$core$Maybe$Just(pid),
										time));
							},
							$elm$browser$Browser$AnimationManager$now);
					},
					$elm$core$Process$spawn(
						A2(
							$elm$core$Task$andThen,
							$elm$core$Platform$sendToSelf(router),
							$elm$browser$Browser$AnimationManager$rAF)));
			}
		} else {
			if (!_v1.b.b) {
				var pid = _v1.a.a;
				return A2(
					$elm$core$Task$andThen,
					function (_v3) {
						return $elm$browser$Browser$AnimationManager$init;
					},
					$elm$core$Process$kill(pid));
			} else {
				return $elm$core$Task$succeed(
					A3($elm$browser$Browser$AnimationManager$State, subs, request, oldTime));
			}
		}
	});
var $elm$time$Time$Posix = function (a) {
	return {$: 'Posix', a: a};
};
var $elm$time$Time$millisToPosix = $elm$time$Time$Posix;
var $elm$browser$Browser$AnimationManager$onSelfMsg = F3(
	function (router, newTime, _v0) {
		var subs = _v0.subs;
		var oldTime = _v0.oldTime;
		var send = function (sub) {
			if (sub.$ === 'Time') {
				var tagger = sub.a;
				return A2(
					$elm$core$Platform$sendToApp,
					router,
					tagger(
						$elm$time$Time$millisToPosix(newTime)));
			} else {
				var tagger = sub.a;
				return A2(
					$elm$core$Platform$sendToApp,
					router,
					tagger(newTime - oldTime));
			}
		};
		return A2(
			$elm$core$Task$andThen,
			function (pid) {
				return A2(
					$elm$core$Task$andThen,
					function (_v1) {
						return $elm$core$Task$succeed(
							A3(
								$elm$browser$Browser$AnimationManager$State,
								subs,
								$elm$core$Maybe$Just(pid),
								newTime));
					},
					$elm$core$Task$sequence(
						A2($elm$core$List$map, send, subs)));
			},
			$elm$core$Process$spawn(
				A2(
					$elm$core$Task$andThen,
					$elm$core$Platform$sendToSelf(router),
					$elm$browser$Browser$AnimationManager$rAF)));
	});
var $elm$browser$Browser$AnimationManager$Time = function (a) {
	return {$: 'Time', a: a};
};
var $elm$browser$Browser$AnimationManager$subMap = F2(
	function (func, sub) {
		if (sub.$ === 'Time') {
			var tagger = sub.a;
			return $elm$browser$Browser$AnimationManager$Time(
				A2($elm$core$Basics$composeL, func, tagger));
		} else {
			var tagger = sub.a;
			return $elm$browser$Browser$AnimationManager$Delta(
				A2($elm$core$Basics$composeL, func, tagger));
		}
	});
_Platform_effectManagers['Browser.AnimationManager'] = _Platform_createManager($elm$browser$Browser$AnimationManager$init, $elm$browser$Browser$AnimationManager$onEffects, $elm$browser$Browser$AnimationManager$onSelfMsg, 0, $elm$browser$Browser$AnimationManager$subMap);
var $elm$browser$Browser$AnimationManager$subscription = _Platform_leaf('Browser.AnimationManager');
var $elm$browser$Browser$AnimationManager$onAnimationFrameDelta = function (tagger) {
	return $elm$browser$Browser$AnimationManager$subscription(
		$elm$browser$Browser$AnimationManager$Delta(tagger));
};
var $elm$browser$Browser$Events$onAnimationFrameDelta = $elm$browser$Browser$AnimationManager$onAnimationFrameDelta;
var $author$project$Projects$subscriptions = function (_v0) {
	return $elm$browser$Browser$Events$onAnimationFrameDelta($author$project$Projects$TimeChange);
};
var $author$project$Projects$update = F2(
	function (msg, m) {
		switch (msg.$) {
			case 'SetTexture':
				var t = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						m,
						{texture: t}),
					$elm$core$Platform$Cmd$none);
			case 'SetKeys':
				var k = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						m,
						{keys: k}),
					$elm$core$Platform$Cmd$none);
			default:
				var t = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						m,
						{time: m.time + t}),
					$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Common$bubble = function (art) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('w-1/2 mb-12 p-4 border border-flu-300 bg-flu-0 rounded-lg')
			]),
		_List_fromArray(
			[art]));
};
var $elm_explorations$webgl$WebGL$Internal$DepthTest = F4(
	function (a, b, c, d) {
		return {$: 'DepthTest', a: a, b: b, c: c, d: d};
	});
var $elm_explorations$webgl$WebGL$Settings$DepthTest$less = function (_v0) {
	var write = _v0.write;
	var near = _v0.near;
	var far = _v0.far;
	return A4($elm_explorations$webgl$WebGL$Internal$DepthTest, 513, write, near, far);
};
var $elm_explorations$webgl$WebGL$Settings$DepthTest$default = $elm_explorations$webgl$WebGL$Settings$DepthTest$less(
	{far: 1, near: 0, write: true});
var $elm_explorations$webgl$WebGL$Internal$enableOption = F2(
	function (ctx, option) {
		switch (option.$) {
			case 'Alpha':
				return A2(_WebGL_enableAlpha, ctx, option);
			case 'Depth':
				return A2(_WebGL_enableDepth, ctx, option);
			case 'Stencil':
				return A2(_WebGL_enableStencil, ctx, option);
			case 'Antialias':
				return A2(_WebGL_enableAntialias, ctx, option);
			case 'ClearColor':
				return A2(_WebGL_enableClearColor, ctx, option);
			default:
				return A2(_WebGL_enablePreserveDrawingBuffer, ctx, option);
		}
	});
var $elm_explorations$webgl$WebGL$Internal$enableSetting = F2(
	function (cache, setting) {
		switch (setting.$) {
			case 'Blend':
				return A2(_WebGL_enableBlend, cache, setting);
			case 'DepthTest':
				return A2(_WebGL_enableDepthTest, cache, setting);
			case 'StencilTest':
				return A2(_WebGL_enableStencilTest, cache, setting);
			case 'Scissor':
				return A2(_WebGL_enableScissor, cache, setting);
			case 'ColorMask':
				return A2(_WebGL_enableColorMask, cache, setting);
			case 'CullFace':
				return A2(_WebGL_enableCullFace, cache, setting);
			case 'PolygonOffset':
				return A2(_WebGL_enablePolygonOffset, cache, setting);
			case 'SampleCoverage':
				return A2(_WebGL_enableSampleCoverage, cache, setting);
			default:
				return _WebGL_enableSampleAlphaToCoverage(cache);
		}
	});
var $elm_explorations$webgl$WebGL$entityWith = _WebGL_entity;
var $elm_explorations$webgl$WebGL$entity = $elm_explorations$webgl$WebGL$entityWith(
	_List_fromArray(
		[$elm_explorations$webgl$WebGL$Settings$DepthTest$default]));
var $author$project$GLSL$fragmentShader = {
	src: ' // backported from version 300 es by chat\nprecision highp float;\n\n/* ------------- interface ------------- */\nvarying vec2 uv;\nuniform float u_time;\nuniform sampler2D u_texture;\n\n/* ------------- constants ------------- */\nconst float PI 		= 3.14159265;\nconst float EPSILON = 0.01;\nconst float INF		= 1e20;\nconst int MAX_ITERATIONS = 1000;\n\n/* ------------- helper structs -------- */\nstruct Line {\n    vec3 p;   // point\n    vec3 d;   // direction (not normalised here on purpose)\n    mat3 b;   // basis\n};\n\nstruct RectPlane {\n    vec3 p;   // one corner\n    vec3 u;   // span-vector #1 (width)\n    vec3 v;   // span-vector #2 (height)\n};\n\n/* ------------- rotations ------------- */\nmat2 rot2(float a){\n    float c = cos(a), s = sin(a);\n    return mat2( c, -s,\n                 s,  c);\n}\n/* square matrices are fine in ES 100 so rot3* stay the same */\nmat3 rot3z(float a){\n    float c = cos(a), s = sin(a);\n    return mat3( c,-s,0.,\n                 s, c,0.,\n                 0.,0.,1.);\n}\nmat3 rot3y(float a){\n    float c = cos(a), s = sin(a);\n    return mat3( c,0., s,\n                 0.,1.,0.,\n                -s,0., c);\n}\nmat3 rot3x(float a){\n    float c = cos(a), s = sin(a);\n    return mat3(1.,0.,0.,\n                0., c,-s,\n                0., s, c);\n}\n\nmat3 axisAngle(vec3 axis, float a){\n    axis      = normalize(axis);\n    float s   = sin(a);\n    float c   = cos(a);\n    float ic  = 1.0 - c;\n    return mat3(\n        c + axis.x*axis.x*ic,\n        axis.x*axis.y*ic - axis.z*s,\n        axis.x*axis.z*ic + axis.y*s,\n\n        axis.y*axis.x*ic + axis.z*s,\n        c + axis.y*axis.y*ic,\n        axis.y*axis.z*ic - axis.x*s,\n\n        axis.z*axis.x*ic - axis.y*s,\n        axis.z*axis.y*ic + axis.x*s,\n        c + axis.z*axis.z*ic\n    );\n}\n\nvec3 fromPolar3(vec3 v){\n  return rot3y(v.x) * rot3x(v.y) * vec3(0., 0., v.z);\n}\n\n/* ------------- geometry -------------- */\nfloat linePlaneIntersect(Line line, vec3 planeP, vec3 planeN){\n    float denom = dot(line.d, planeN);\n    if(abs(denom) < EPSILON) return INF;\n    return dot(planeP - line.p, planeN)/denom;\n}\n\n/*  bounded rectangle */\nfloat linePlaneIntersect(Line line, RectPlane pl){\n    vec3 n = normalize(cross(pl.u, pl.v));\n    float denom = dot(line.d, n);\n    if(abs(denom) < EPSILON) return INF;\n\n    float t = dot(pl.p - line.p, n)/denom;\n    vec3  hit = line.p + line.d * t;\n    vec3  rel = hit - pl.p;\n\n    float u = dot(rel, pl.u) / dot(pl.u, pl.u);\n    float v = dot(rel, pl.v) / dot(pl.v, pl.v);\n\n    return (u < -EPSILON || u > 1.+EPSILON ||\n            v < -EPSILON || v > 1.+EPSILON) ? INF : t;\n}\n\nvec3 mirror(vec3 dir, vec3 normal){\n    return dir - 2.0 * dot(dir,normal) / dot(normal,normal) * normal;\n}\n\n/* reflect-and-advance along a “portal” rectangle */\nLine transport(Line ray, float l){\n    RectPlane pl = RectPlane(\n        vec3( 1., -1., 10.),   // corner\n        vec3( 0.,  6.,  0.),   // width  vector\n        vec3(-2.,  0.,  0.)    // height vector\n    );\n\n    float t  = linePlaneIntersect(ray, pl);\n\n    if(t==INF || t<0.0 || t>l) \n    { \n        ray.p += ray.d*l;\n        return ray;\n    }\n\n    ray.p += ray.d*t;\n\n    float scale = 1.0;\n    vec3 n = cross(pl.u,pl.v);\n    ray.d = mirror(ray.d, n);\n    ray.d.x *= scale;\n    ray.d.z *= scale;\n    if (ray.b != mat3(0.))\n    {\n        ray.b = mat3(mirror(ray.b[0], n), mirror(ray.b[1], n), mirror(ray.b[2], n));\n        ray.b[0] *= scale;\n        ray.b[2] *= scale;\n    }\n\n    ray.p += ray.d*(l - t);\n    return ray;\n}\n\n/* ----------- scene SDF --------------- */\nfloat box(vec3 p, vec3 b){\n    vec3 q = abs(p) - b;\n    return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)), 0.0);\n}\n\nfloat torus(vec3 p, vec2 t){\n    vec2 q = vec2(length(p.xz)-t.x, p.y);\n    return length(q)-t.y;\n}\n\nfloat sphere(vec3 p,float r){ return length(p) - r; }\n\nfloat sdf(vec3 p)\n{\n    /* ------------- static floor ---------------------------------- */\n    float floorY = p.y + 1.0;\n\n    /* ------------- wobbling sphere ------------------------------- */\n    float ball = sphere(p - vec3(-2.0,\n                                 0.9 + 0.4*sin(u_time*1.3),\n                                 5.0),\n                        1.0);\n\n    /* ------------- torus that slowly spins ----------------------- */\n    vec3  torPos = p - vec3(3.0, 0.0, 4.0);\n    torPos.xz    = rot2(u_time*0.4) * torPos.xz;\n    float dough  = torus(torPos, vec2(1.2, 0.35));\n\n    /* ------------- tiled boxes for background -------------------- */\n    // vec3  rep    = p;\n    // rep.xz = mod(rep.xz, 10.0) - 2.0;           // repeat every 4 units\n    float cubes  = box(p - vec3(0.0, -0.25, 0.0), vec3(0.5));\n\n    /* ------------- combine --------------------------------------- */\n    return min(min(floorY, ball),\n               min(dough, cubes));\n}\n\nvec3 calcNormal(vec3 p){\n    vec2 h = vec2(EPSILON,0.);\n    return normalize(vec3(\n        sdf(p+h.xyy) - sdf(p-h.xyy),\n        sdf(p+h.yxy) - sdf(p-h.yxy),\n        sdf(p+h.yyx) - sdf(p-h.yyx)\n    ));\n}\n\nLine makeCamera(mat3 b, float t){\n    vec3 pos = vec3( 5.0 * sin(t*0.5),\n                     0.7 * sin(t*0.3) + 1.5,\n                    -4.0 * cos(t*0.5) + 4.0 );\n\n    Line cam = Line(vec3(0.), normalize(pos), b);\n    cam = transport(cam, sqrt(dot(pos, pos)) );\n\n    vec3 tgt = vec3( 0.0, 0.5, 10.0 ); // centre of the mirror\n    cam.d = normalize(tgt - pos);\n\n    return cam;\n}\n\n\nmat3 makeBasis(vec3 fwd){\n    fwd = normalize(fwd);\n\n    vec3 tmpUp = (abs(fwd.y) > 0.99)          // too close to ±Y?\n               ? vec3(0.0, 0.0, 1.0)          // use Z instead\n               : vec3(0.0, 1.0, 0.0);\n\n    vec3 right = normalize(cross(tmpUp, fwd));\n    vec3 up    = cross(fwd, right);           // already unit-length\n\n    return mat3(right, up, fwd);              // columns = (x,y,z)\n}\n\n/* ------------- main ------------------ */\nvoid main(){\n    /* camera pos and dir -------------------------------------------------- */\n\n    float fov = PI * 0.5;\n    mat3 id = mat3(1.);\n    vec3 fwd = normalize( uv.x * fov * 0.5 * id[0] + uv.y * fov * 0.5 * id[1] + id[2] );\n\n    Line cam = makeCamera(makeBasis(fwd), u_time);\n\n    cam.d = cam.b[2];\n    cam.b = mat3(0.);\n\n    /* ray-march ----------------------------------------------------------- */\n    float distAcc = 0.;\n    vec3  color   = vec3(0.5, 0.8, 1.);  // arbitrary start\n\n    for(int i=0;i<MAX_ITERATIONS;++i){\n        float l = sdf(cam.p);\n        if(l < EPSILON){                         /* hit                      */\n            vec3 n = calcNormal(cam.p);\n            float lighting = max(0.05, dot(n, normalize(vec3(0.5,1.,-0.5))));\n            if(cam.p.y + 1. < EPSILON) color = texture2D(u_texture, cam.p.xz).rgb;\n            else color = vec3(1.);\n            color *= lighting;\n            break;\n        }\n        else if(l > 1./EPSILON){ distAcc = INF; break; }\n\n        distAcc += l;\n        cam = transport(cam,l);\n    }\n\n    // color *= max(0.5, 1. / pow(distAcc, 0.1));\n\n    /* cheap distance fog ------------------------------------------------ */\n    float fog = clamp(exp(-0.0001 * distAcc * distAcc), 0.0, 1.0);\n    color = mix(vec3(0.6,0.7,0.8), color, fog);\n\n    /* rim-light accent on silhouettes ----------------------------------- */\n    vec3  viewDir = normalize(cam.d);\n    float rim     = pow(1.0 - max(dot(calcNormal(cam.p), viewDir), 0.0), 3.0);\n    color += 0.25 * rim;\n    color = vec3(pow(color.x, 1.5), pow(color.y, 1.5), pow(color.z, 1.5));\n\n    gl_FragColor = vec4(color,1.);\n}\n',
	attributes: {},
	uniforms: {u_texture: 'u_texture', u_time: 'u_time'}
};
var $elm_explorations$webgl$WebGL$Mesh3 = F2(
	function (a, b) {
		return {$: 'Mesh3', a: a, b: b};
	});
var $elm_explorations$webgl$WebGL$triangles = $elm_explorations$webgl$WebGL$Mesh3(
	{elemSize: 3, indexSize: 0, mode: 4});
var $elm_explorations$linear_algebra$Math$Vector3$vec3 = _MJS_v3;
var $author$project$GLSL$mesh = $elm_explorations$webgl$WebGL$triangles(
	_List_fromArray(
		[
			_Utils_Tuple3(
			{
				position: A3($elm_explorations$linear_algebra$Math$Vector3$vec3, -1, 1, 0)
			},
			{
				position: A3($elm_explorations$linear_algebra$Math$Vector3$vec3, 1, 1, 0)
			},
			{
				position: A3($elm_explorations$linear_algebra$Math$Vector3$vec3, -1, -1, 0)
			}),
			_Utils_Tuple3(
			{
				position: A3($elm_explorations$linear_algebra$Math$Vector3$vec3, -1, -1, 0)
			},
			{
				position: A3($elm_explorations$linear_algebra$Math$Vector3$vec3, 1, 1, 0)
			},
			{
				position: A3($elm_explorations$linear_algebra$Math$Vector3$vec3, 1, -1, 0)
			})
		]));
var $elm_explorations$webgl$WebGL$Internal$Alpha = function (a) {
	return {$: 'Alpha', a: a};
};
var $elm_explorations$webgl$WebGL$alpha = $elm_explorations$webgl$WebGL$Internal$Alpha;
var $elm_explorations$webgl$WebGL$Internal$Antialias = {$: 'Antialias'};
var $elm_explorations$webgl$WebGL$antialias = $elm_explorations$webgl$WebGL$Internal$Antialias;
var $elm_explorations$webgl$WebGL$Internal$Depth = function (a) {
	return {$: 'Depth', a: a};
};
var $elm_explorations$webgl$WebGL$depth = $elm_explorations$webgl$WebGL$Internal$Depth;
var $elm_explorations$webgl$WebGL$toHtmlWith = F3(
	function (options, attributes, entities) {
		return A3(_WebGL_toHtml, options, attributes, entities);
	});
var $elm_explorations$webgl$WebGL$toHtml = $elm_explorations$webgl$WebGL$toHtmlWith(
	_List_fromArray(
		[
			$elm_explorations$webgl$WebGL$alpha(true),
			$elm_explorations$webgl$WebGL$antialias,
			$elm_explorations$webgl$WebGL$depth(1)
		]));
var $author$project$GLSL$vertexShader = {
	src: '\n        attribute vec3 position;\n        varying vec2 uv;\n\n        void main () {\n            gl_Position = vec4(position, 1.0);\n            uv = position.xy;\n        }\n    ',
	attributes: {position: 'position'},
	uniforms: {}
};
var $author$project$GLSL$view = F3(
	function (t, text, a) {
		return A2(
			$elm_explorations$webgl$WebGL$toHtml,
			a,
			_List_fromArray(
				[
					A4(
					$elm_explorations$webgl$WebGL$entity,
					$author$project$GLSL$vertexShader,
					$author$project$GLSL$fragmentShader,
					$author$project$GLSL$mesh,
					{u_texture: text, u_time: t})
				]));
	});
var $author$project$Projects$euclidean = function (m) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				$author$project$Common$md('\n## Noneuclidean Rendering\n'),
				A2(
				$elm$core$Maybe$withDefault,
				$elm$html$Html$text(''),
				A2(
					$elm$core$Maybe$map,
					function (scene) {
						return scene(
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('rounded-md border border-flu-300 overflow-clip aspect-square w-64 mx-auto bg-flu-100')
								]));
					},
					A2(
						$elm$core$Maybe$map,
						$author$project$GLSL$view(m.time / 1000),
						m.texture)))
			]));
};
var $bellroy$elm_embed_youtube$Embed$Youtube$Internal$Youtube$Youtube = F2(
	function (a, b) {
		return {$: 'Youtube', a: a, b: b};
	});
var $bellroy$elm_embed_youtube$Embed$Youtube$Internal$Youtube$attributes = F2(
	function (a, _v0) {
		var youtubeVideoid = _v0.a;
		var listOfAttributes = _v0.b;
		return A2(
			$bellroy$elm_embed_youtube$Embed$Youtube$Internal$Youtube$Youtube,
			youtubeVideoid,
			_Utils_ap(listOfAttributes, a));
	});
var $bellroy$elm_embed_youtube$Embed$Youtube$attributes = $bellroy$elm_embed_youtube$Embed$Youtube$Internal$Youtube$attributes;
var $bellroy$elm_embed_youtube$Embed$Youtube$Internal$Youtube$YoutubeVideoId = function (a) {
	return {$: 'YoutubeVideoId', a: a};
};
var $bellroy$elm_embed_youtube$Embed$Youtube$Internal$Youtube$fromString = function (stringYoutubeVideoid) {
	return A2(
		$bellroy$elm_embed_youtube$Embed$Youtube$Internal$Youtube$Youtube,
		$bellroy$elm_embed_youtube$Embed$Youtube$Internal$Youtube$YoutubeVideoId(stringYoutubeVideoid),
		_List_Nil);
};
var $bellroy$elm_embed_youtube$Embed$Youtube$fromString = $bellroy$elm_embed_youtube$Embed$Youtube$Internal$Youtube$fromString;
var $bellroy$elm_embed_youtube$Embed$Youtube$Internal$Attribute$Height = function (a) {
	return {$: 'Height', a: a};
};
var $bellroy$elm_embed_youtube$Embed$Youtube$Attributes$height = $bellroy$elm_embed_youtube$Embed$Youtube$Internal$Attribute$Height;
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $elm$html$Html$Attributes$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (_v0.$ === 'Just') {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$html$Html$Attributes$height = function (n) {
	return A2(
		_VirtualDom_attribute,
		'height',
		$elm$core$String$fromInt(n));
};
var $elm$html$Html$Attributes$width = function (n) {
	return A2(
		_VirtualDom_attribute,
		'width',
		$elm$core$String$fromInt(n));
};
var $bellroy$elm_embed_youtube$Embed$Youtube$Internal$View$toHtmlAttribute = function (attribute) {
	switch (attribute.$) {
		case 'Width':
			var a = attribute.a;
			return $elm$core$Maybe$Just(
				$elm$html$Html$Attributes$width(a));
		case 'Height':
			var a = attribute.a;
			return $elm$core$Maybe$Just(
				$elm$html$Html$Attributes$height(a));
		case 'LazyLoad':
			return $elm$core$Maybe$Just(
				A2($elm$html$Html$Attributes$attribute, 'loading', 'lazy'));
		default:
			return $elm$core$Maybe$Nothing;
	}
};
var $bellroy$elm_embed_youtube$Embed$Youtube$Internal$View$toHtmlAttributes = function (_v0) {
	var attributes = _v0.b;
	return A2($elm$core$List$filterMap, $bellroy$elm_embed_youtube$Embed$Youtube$Internal$View$toHtmlAttribute, attributes);
};
var $elm$url$Url$addPort = F2(
	function (maybePort, starter) {
		if (maybePort.$ === 'Nothing') {
			return starter;
		} else {
			var port_ = maybePort.a;
			return starter + (':' + $elm$core$String$fromInt(port_));
		}
	});
var $elm$url$Url$addPrefixed = F3(
	function (prefix, maybeSegment, starter) {
		if (maybeSegment.$ === 'Nothing') {
			return starter;
		} else {
			var segment = maybeSegment.a;
			return _Utils_ap(
				starter,
				_Utils_ap(prefix, segment));
		}
	});
var $elm$url$Url$toString = function (url) {
	var http = function () {
		var _v0 = url.protocol;
		if (_v0.$ === 'Http') {
			return 'http://';
		} else {
			return 'https://';
		}
	}();
	return A3(
		$elm$url$Url$addPrefixed,
		'#',
		url.fragment,
		A3(
			$elm$url$Url$addPrefixed,
			'?',
			url.query,
			_Utils_ap(
				A2(
					$elm$url$Url$addPort,
					url.port_,
					_Utils_ap(http, url.host)),
				url.path)));
};
var $elm$url$Url$Builder$toQueryPair = function (_v0) {
	var key = _v0.a;
	var value = _v0.b;
	return key + ('=' + value);
};
var $elm$url$Url$Builder$toQuery = function (parameters) {
	if (!parameters.b) {
		return '';
	} else {
		return '?' + A2(
			$elm$core$String$join,
			'&',
			A2($elm$core$List$map, $elm$url$Url$Builder$toQueryPair, parameters));
	}
};
var $elm$url$Url$Builder$QueryParameter = F2(
	function (a, b) {
		return {$: 'QueryParameter', a: a, b: b};
	});
var $elm$url$Url$percentEncode = _Url_percentEncode;
var $elm$url$Url$Builder$string = F2(
	function (key, value) {
		return A2(
			$elm$url$Url$Builder$QueryParameter,
			$elm$url$Url$percentEncode(key),
			$elm$url$Url$percentEncode(value));
	});
var $elm$url$Url$Builder$int = F2(
	function (key, value) {
		return A2(
			$elm$url$Url$Builder$QueryParameter,
			$elm$url$Url$percentEncode(key),
			$elm$core$String$fromInt(value));
	});
var $bellroy$elm_embed_youtube$Embed$Youtube$Internal$View$toQueryParameters_ = F2(
	function (_v0, attribute) {
		var stringYoutubeVideoId = _v0.a;
		switch (attribute.$) {
			case 'Width':
				return _List_Nil;
			case 'Height':
				return _List_Nil;
			case 'LazyLoad':
				return _List_Nil;
			case 'Autoplay':
				return _List_fromArray(
					[
						A2($elm$url$Url$Builder$string, 'autoplay', '1'),
						A2($elm$url$Url$Builder$string, 'mute', '1')
					]);
			case 'Loop':
				return _List_fromArray(
					[
						A2($elm$url$Url$Builder$string, 'loop', '1'),
						A2($elm$url$Url$Builder$string, 'playlist', stringYoutubeVideoId)
					]);
			case 'Start':
				var a = attribute.a;
				return _List_fromArray(
					[
						A2($elm$url$Url$Builder$int, 'start', a)
					]);
			case 'End':
				var a = attribute.a;
				return _List_fromArray(
					[
						A2($elm$url$Url$Builder$int, 'end', a)
					]);
			case 'Mute':
				return _List_fromArray(
					[
						A2($elm$url$Url$Builder$string, 'mute', '1')
					]);
			case 'ColorRed':
				return _List_fromArray(
					[
						A2($elm$url$Url$Builder$string, 'color', 'red')
					]);
			case 'ColorWhite':
				return _List_fromArray(
					[
						A2($elm$url$Url$Builder$string, 'color', 'white')
					]);
			case 'ModestBranding':
				return _List_fromArray(
					[
						A2($elm$url$Url$Builder$string, 'modestbranding', '1'),
						A2($elm$url$Url$Builder$string, 'showinfo', '1')
					]);
			case 'PlaysInline':
				return _List_fromArray(
					[
						A2($elm$url$Url$Builder$string, 'playsinline', '1'),
						A2($elm$url$Url$Builder$string, 'webkit-playsinline', '1')
					]);
			case 'HideControls':
				return _List_fromArray(
					[
						A2($elm$url$Url$Builder$string, 'controls', '0')
					]);
			case 'DisableKeyboard':
				return _List_fromArray(
					[
						A2($elm$url$Url$Builder$string, 'disablekb', '1')
					]);
			case 'DisableFullscreen':
				return _List_fromArray(
					[
						A2($elm$url$Url$Builder$string, 'fs', '0')
					]);
			case 'VideoAnnotations':
				return _List_fromArray(
					[
						A2($elm$url$Url$Builder$string, 'iv_load_policy', '3')
					]);
			case 'Language':
				var a = attribute.a;
				return _List_fromArray(
					[
						A2($elm$url$Url$Builder$string, 'hl', a)
					]);
			case 'ClosedCaptionsLanguagePreference':
				var a = attribute.a;
				return _List_fromArray(
					[
						A2($elm$url$Url$Builder$string, 'cc_lang_pref', a)
					]);
			default:
				return _List_fromArray(
					[
						A2($elm$url$Url$Builder$string, 'cc_load_policy', '1')
					]);
		}
	});
var $bellroy$elm_embed_youtube$Embed$Youtube$Internal$View$toQueryParameters = function (_v0) {
	var youtubeVideoId = _v0.a;
	var attributes = _v0.b;
	return _Utils_ap(
		A3(
			$elm$core$List$foldl,
			function (a) {
				return $elm$core$Basics$append(
					A2($bellroy$elm_embed_youtube$Embed$Youtube$Internal$View$toQueryParameters_, youtubeVideoId, a));
			},
			_List_Nil,
			attributes),
		_List_fromArray(
			[
				A2($elm$url$Url$Builder$string, 'version', '3'),
				A2($elm$url$Url$Builder$string, 'rel', '0'),
				A2($elm$url$Url$Builder$string, 'enablejsapi', '1')
			]));
};
var $bellroy$elm_embed_youtube$Embed$Youtube$Internal$View$toYoutubeUrl = function (yt) {
	var stringYoutubeVideoid = yt.a.a;
	return {
		fragment: $elm$core$Maybe$Nothing,
		host: 'www.youtube-nocookie.com',
		path: '/embed/' + stringYoutubeVideoid,
		port_: $elm$core$Maybe$Nothing,
		protocol: $elm$url$Url$Https,
		query: $elm$core$Maybe$Just(
			A2(
				$elm$core$String$dropLeft,
				1,
				$elm$url$Url$Builder$toQuery(
					$bellroy$elm_embed_youtube$Embed$Youtube$Internal$View$toQueryParameters(yt))))
	};
};
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $bellroy$elm_embed_youtube$Embed$Youtube$Internal$View$toIframe = function (yt) {
	return A2(
		$elm$html$Html$iframe,
		_Utils_ap(
			_List_fromArray(
				[
					$elm$html$Html$Attributes$src(
					$elm$url$Url$toString(
						$bellroy$elm_embed_youtube$Embed$Youtube$Internal$View$toYoutubeUrl(yt))),
					$elm$html$Html$Attributes$type_('text/html'),
					A2($elm$html$Html$Attributes$attribute, 'allowfullscreen', 'true'),
					A2($elm$html$Html$Attributes$attribute, 'allow', 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen'),
					A2($elm$html$Html$Attributes$attribute, 'frameborder', '0')
				]),
			$bellroy$elm_embed_youtube$Embed$Youtube$Internal$View$toHtmlAttributes(yt)),
		_List_Nil);
};
var $bellroy$elm_embed_youtube$Embed$Youtube$toHtml = $bellroy$elm_embed_youtube$Embed$Youtube$Internal$View$toIframe;
var $bellroy$elm_embed_youtube$Embed$Youtube$Internal$Attribute$Width = function (a) {
	return {$: 'Width', a: a};
};
var $bellroy$elm_embed_youtube$Embed$Youtube$Attributes$width = $bellroy$elm_embed_youtube$Embed$Youtube$Internal$Attribute$Width;
var $author$project$Projects$fluid = A2(
	$elm$html$Html$div,
	_List_Nil,
	_List_fromArray(
		[
			$author$project$Common$md('\n## High Performance Fluid Simulation [[GitHub](https://github.com/JoelWantsCoffee/fluid-sim)]\nA fluid sim coded in C, complete with `CUDA` and `AVX` optimizations. I built this for the (excellent!) *COSC3500: High-Performance Computing* course at UQ. Here\'s a project reflection video.\n'),
			function (x) {
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('w-full flex')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('grow')
							]),
						_List_Nil),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('rounded-md border border-flu-300 overflow-clip bg-flu-100')
							]),
						_List_fromArray(
							[x])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('grow')
							]),
						_List_Nil)
					]));
		}(
			$bellroy$elm_embed_youtube$Embed$Youtube$toHtml(
				A2(
					$bellroy$elm_embed_youtube$Embed$Youtube$attributes,
					_List_fromArray(
						[
							$bellroy$elm_embed_youtube$Embed$Youtube$Attributes$width(480),
							$bellroy$elm_embed_youtube$Embed$Youtube$Attributes$height(270)
						]),
					$bellroy$elm_embed_youtube$Embed$Youtube$fromString('-RVnkuJ1Oao'))))
		]));
var $author$project$Projects$hpolys = A2(
	$elm$html$Html$div,
	_List_Nil,
	_List_fromArray(
		[
			$author$project$Common$md('\n## Polynomial Factoring in Haskell [[GitHub](https://github.com/JoelWantsCoffee/Haskell-Polynomials)]\nMy Honours thesis project, a haskell program to factor polynomials. All built and verified from the ground up.\n')
		]));
var $author$project$Projects$learning = A2(
	$elm$html$Html$div,
	_List_Nil,
	_List_fromArray(
		[
			$author$project$Common$md('\n## Neural Network Image Generation\n')
		]));
var $author$project$Projects$minecraft = A2(
	$elm$html$Html$div,
	_List_Nil,
	_List_fromArray(
		[
			$author$project$Common$md('\n## Programmable Minecraft Computer\n')
		]));
var $author$project$Projects$software = A2(
	$elm$html$Html$div,
	_List_Nil,
	_List_fromArray(
		[
			$author$project$Common$md('\n## Software Renderer\n')
		]));
var $author$project$Projects$sotrue = A2(
	$elm$html$Html$div,
	_List_Nil,
	_List_fromArray(
		[
			$author$project$Common$md('\n## So True! — A Theorem Verifier [[GitHub](https://github.com/mitchellholt/DisneyMusicVEVO-Z-O-M-B-I-E-S-Someday)]\n[Mitchell](https://mitchellholt.github.io/) and I hacked this together at the 2022 UQ Computing Society Hackathon. In theory, it can verify proofs in first-order logic. In practice, it\'s hanging by a thread—it was a fun project.\n')
		]));
var $author$project$Projects$timer = A2(
	$elm$html$Html$div,
	_List_Nil,
	_List_fromArray(
		[
			$author$project$Common$md('\n## Study Timer [[GitHub](https://github.com/JoelWantsCoffee/uni-timer)] [[Website](/uni-timer)]\nA Pomodoro timer I cobbled together in my first year of undergrad. Somehow it seems to have survived beyond graduation in 2022. The background—artfully drawn in Microsoft Paint—captures the atmosphere of Room 102, Building 31A during SWOTVAC, Semester 2, 2019 at UQ.\n')
		]));
var $author$project$Projects$wordle = A2(
	$elm$html$Html$div,
	_List_Nil,
	_List_fromArray(
		[
			$author$project$Common$md('\n## Optimal Wordle\n')
		]));
var $author$project$Projects$view = function (m) {
	return A2(
		$elm$core$List$map,
		$author$project$Common$bubble,
		_List_fromArray(
			[
				$author$project$Projects$hpolys,
				$author$project$Projects$sotrue,
				$author$project$Projects$fluid,
				$author$project$Projects$euclidean(m),
				$author$project$Projects$wordle,
				$author$project$Projects$learning,
				$author$project$Projects$minecraft,
				$author$project$Projects$software,
				$author$project$Projects$timer
			]));
};
var $author$project$Projects$page = {init: $author$project$Projects$init, subscriptions: $author$project$Projects$subscriptions, update: $author$project$Projects$update, view: $author$project$Projects$view};
var $author$project$Talk$init = _Utils_Tuple2(_Utils_Tuple0, $elm$core$Platform$Cmd$none);
var $author$project$Talk$subscriptions = function (_v0) {
	return $elm$core$Platform$Sub$none;
};
var $author$project$Talk$update = F2(
	function (msg, _v0) {
		return _Utils_Tuple2(_Utils_Tuple0, $elm$core$Platform$Cmd$none);
	});
var $author$project$Talk$algebras = A2(
	$elm$html$Html$div,
	_List_Nil,
	_List_fromArray(
		[
			$author$project$Common$md('\n## Algebras of the Tangent Bundle Monad (April 2025) [[Link](https://centre-of-australian-category-theory.github.io/seminar/talks/1854)] [[Slides](/data/1854slides.pdf)]\nMy first talk for the Australian Category Seminar. This talk introduces my MRes project, focusing on algebras of the tangent bundle monad in the category of affine schemes.\n')
		]));
var $author$project$Talk$berlekamp = A2(
	$elm$html$Html$div,
	_List_Nil,
	_List_fromArray(
		[
			$author$project$Common$md('\n## Finding Factors in Berlekamp\'s Algebra (April 2024) [[Slides](https://uqmss.org/assets/slides/2024/wk9_joel_richardson.pdf)]\nMy first talk for the UQ Mathematics Student Society, exploring Berlekamp\'s factoring algorithm. Overall, I\'m quite happy with the result.\n')
		]));
var $author$project$Talk$ssets = A2(
	$elm$html$Html$div,
	_List_Nil,
	_List_fromArray(
		[
			$author$project$Common$md('\n## Simplicial Sets, Simply (August 2024) [[Slides](https://uqmss.org/assets/slides/2024/wk4_joel_richardson.pdf)]\nMy second talk for the UQ Mathematics Student Society, introducing delta sets. In hindsight, I probably should have avoided category-theoretic terminology—it confused more than it clarified. Still, I\'m very pleased with how the visuals turned out.\n')
		]));
var $author$project$Talk$view = function (_v0) {
	return A2(
		$elm$core$List$map,
		$author$project$Common$bubble,
		_List_fromArray(
			[$author$project$Talk$algebras, $author$project$Talk$ssets, $author$project$Talk$berlekamp]));
};
var $author$project$Talk$page = {init: $author$project$Talk$init, subscriptions: $author$project$Talk$subscriptions, update: $author$project$Talk$update, view: $author$project$Talk$view};
var $author$project$Words$ServiceDeskOne = {$: 'ServiceDeskOne'};
var $author$project$Words$init = _Utils_Tuple2($author$project$Words$ServiceDeskOne, $elm$core$Platform$Cmd$none);
var $author$project$Words$subscriptions = function (_v0) {
	return $elm$core$Platform$Sub$none;
};
var $author$project$Words$update = F2(
	function (msg, _v0) {
		var m = msg.a;
		return _Utils_Tuple2(m, $elm$core$Platform$Cmd$none);
	});
var $author$project$Words$serviceDeskOne = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('w-2/5 mx-auto py-16 prose')
		]),
	_List_fromArray(
		[
			$author$project$Common$md('\n# Service Desk One\n\nI cross the room and make it to service desk one. I place my things on the counter and look to the small lady sitting opposite me. Her eyes are fixed on me. \n\n> What are you here for?\n\nHer eyes snap down to the counter, to my forms and my id. She answers her own question. \n\n> A working with children\'s check.\n\nShe says it flatly, her mind obviously elsewhere. Her eyes move along the counter and come to rest on the remnants of my lunch: a plastic tray, covered in quick-sale tags, labelled chopped fruit.\n\n> Lunch!\n> Lunch is good!\n> I just had lunch too.\n> Don\'t worry, I\'m just having some fun.\n\nShe takes up my forms and starts entering something into her computer. She types for a minute, then stops to look at me.\n\n> No. \n> Is this your first time here?\n> Why haven\'t you been here before?\n> You\'re supposed to have new south wales license.\n> If you\'re here for longer than three months, you\'re supposed to request a new south wales license.\n> It\'s... no, no, don\'t worry.\n> The police won\'t know how long you\'ve been here.\n> It\'s a technicality.\n> It\'s up to you, whatever you want.\n\nShe turns back to her computer desk, produces a form, and places it on the counter. \n\n> You fill this in so you can get on the system.\n> I\'ll do this.\n> That is teamwork.\n\nI search the counter top for a pen. She sees me looking, gets down from her chair, walks about a metre to a set of draws, and produces a fresh pen. She gives it to me.\n\n> There are never any pens these days.\n> Teamwork.\n> I\'m just having some fun.\n> Because, look around---\n> No one has fun anymore.\n\nI turn to look around. The waiting room is full of waiting people. They don\'t all look glum; the people standing in front of service desk two are laughing. I turn back to the woman.\n\n> Queensland must be cheaper. \n> It\'s expensive here.\n\nI tell her that I think Brisbane is catching up to Sydney, cost of living wise.\n\n> It\'s because everyone here is running to Brisbane.\n> The people in Brisbane won\'t like it.\n> Soon all the states will be angry at each other.\n> And no one will think about immigrants anymore.\n> Sorry, I\'m just being an immigrant. \n> I\'m just having some fun.\n> No one has fun anymore.\n> And it doesn\'t even matter who you vote for.\n> The greens, one nation---all of the votes will go back to the two parties.\n> And they\'re both the same.\n> Everyone is the same.\n\nShe lowers her voice conspiratorially:\n\n> But I think labour\'s better.\n\nShe quickly returns to her normal volume.\n\n> But I\'m just being an immigrant.\n> I\'m just having fun.\n\nShe trails off for a moment, concentrating on her computer, then starts mumbling to herself as she types.\n\n> Who are you?\n> You are:\n> Joel...\n> William...\n> Richardson...\n> Do you ever think about that?\n\nShe fixes her eyes on me once again.\n\n> That that isn\'t who really who you are?\n> That that\'s just a name some people gave you, and other people call you?\n> You know?\n> Who are you really?\n\n$$ \\ $$\n\n\nI finish filling in my form and slide it across the counter to her. She pushes my ID back to me. \n\n> Teamwork.\n\nShe prints off something and hands it to me---a temporary working with children\'s check, for use until my proper one arrives. I collect my things.\n\n> Do you read?\n> You should read this book.\n> It\'s a wonderful book.\n> The author is brilliant.\n\nShe writes the name of the book on a scrap of paper and slides it across the counter to me.\n\n> Don\'t buy it though.\n> You\'re at the university.\n> You\'re like me -- poor.\n> Get it from the library.\n\nI tell her to have a good afternoon. I wave goodbye.\n\n> Come back sometime.\n> Tell me if you like it.\n')
		]));
var $author$project$Words$Msg = function (a) {
	return {$: 'Msg', a: a};
};
var $author$project$Words$toString = function (m) {
	if (m.$ === 'ServiceDeskOne') {
		return 'Service Desk One';
	} else {
		return 'Blue-tack';
	}
};
var $author$project$Words$sidebarItem = F2(
	function (m, m2) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(
					'font-light ' + A3(
						$author$project$Common$ifThenElse,
						_Utils_eq(m, m2),
						'text-flu-500',
						'text-flu-400 hover:underline cursor-pointer')),
					$elm$html$Html$Events$onClick(
					$author$project$Words$Msg(m2))
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(
					$author$project$Words$toString(m2))
				]));
	});
var $author$project$Words$view = function (m) {
	return _List_fromArray(
		[
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('w-full h-full relative')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('h-full overflow-y-scroll')
						]),
					_List_fromArray(
						[
							function () {
							if (m.$ === 'ServiceDeskOne') {
								return $author$project$Words$serviceDeskOne;
							} else {
								return $elm$html$Html$text('');
							}
						}()
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('absolute top-0 left-0 p-8 flex flex-col gap-2 select-none')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$a,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('w-[0px] text-3xl times-new-roman pb-4 cursor-pointer hover:underline'),
									$elm$html$Html$Attributes$href('/')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Joel Richardson')
								])),
							A2($author$project$Words$sidebarItem, m, $author$project$Words$ServiceDeskOne)
						]))
				]))
		]);
};
var $author$project$Words$page = {init: $author$project$Words$init, subscriptions: $author$project$Words$subscriptions, update: $author$project$Words$update, view: $author$project$Words$view};
var $author$project$Main$init = F2(
	function (url, key) {
		return A2(
			$elm$core$Tuple$mapFirst,
			A2($author$project$Main$Model, key, url),
			function () {
				var _v0 = url.fragment;
				if (_v0.$ === 'Just') {
					switch (_v0.a) {
						case 'articles':
							return A3(
								$elm$core$Tuple$mapBoth,
								$author$project$Main$Article,
								$elm$core$Platform$Cmd$map($author$project$Main$ArticleMsg),
								$author$project$Article$page.init);
						case 'talks':
							return A3(
								$elm$core$Tuple$mapBoth,
								$author$project$Main$Talk,
								$elm$core$Platform$Cmd$map($author$project$Main$TalkMsg),
								$author$project$Talk$page.init);
						case 'projects':
							return A3(
								$elm$core$Tuple$mapBoth,
								$author$project$Main$Projects,
								$elm$core$Platform$Cmd$map($author$project$Main$ProjectsMsg),
								$author$project$Projects$page.init);
						case 'words':
							return A3(
								$elm$core$Tuple$mapBoth,
								$author$project$Main$Words,
								$elm$core$Platform$Cmd$map($author$project$Main$WordsMsg),
								$author$project$Words$page.init);
						default:
							return _Utils_Tuple2($author$project$Main$Empty, $elm$core$Platform$Cmd$none);
					}
				} else {
					return A3(
						$elm$core$Tuple$mapBoth,
						$author$project$Main$Home,
						$elm$core$Platform$Cmd$map($author$project$Main$HomeMsg),
						$author$project$Home$page.init);
				}
			}());
	});
var $elm$core$Platform$Sub$map = _Platform_map;
var $author$project$Main$subscriptions = function (model) {
	var _v0 = model.model;
	switch (_v0.$) {
		case 'Empty':
			return $elm$core$Platform$Sub$none;
		case 'Home':
			var m = _v0.a;
			return A2(
				$elm$core$Platform$Sub$map,
				$author$project$Main$HomeMsg,
				$author$project$Home$page.subscriptions(m));
		case 'Article':
			var m = _v0.a;
			return A2(
				$elm$core$Platform$Sub$map,
				$author$project$Main$ArticleMsg,
				$author$project$Article$page.subscriptions(m));
		case 'Talk':
			var m = _v0.a;
			return A2(
				$elm$core$Platform$Sub$map,
				$author$project$Main$TalkMsg,
				$author$project$Talk$page.subscriptions(m));
		case 'Projects':
			var m = _v0.a;
			return A2(
				$elm$core$Platform$Sub$map,
				$author$project$Main$ProjectsMsg,
				$author$project$Projects$page.subscriptions(m));
		default:
			var m = _v0.a;
			return A2(
				$elm$core$Platform$Sub$map,
				$author$project$Main$WordsMsg,
				$author$project$Words$page.subscriptions(m));
	}
};
var $elm$browser$Browser$Navigation$load = _Browser_load;
var $author$project$Main$setSubModel = F3(
	function (m, f, s) {
		return _Utils_update(
			m,
			{
				model: f(s)
			});
	});
var $author$project$Main$update = F2(
	function (message, model) {
		update:
		while (true) {
			var _v0 = _Utils_Tuple2(message, model.model);
			_v0$8:
			while (true) {
				switch (_v0.a.$) {
					case 'HomeMsg':
						if (_v0.b.$ === 'Home') {
							var msg = _v0.a.a;
							var m = _v0.b.a;
							return A3(
								$elm$core$Tuple$mapBoth,
								A2($author$project$Main$setSubModel, model, $author$project$Main$Home),
								$elm$core$Platform$Cmd$map($author$project$Main$HomeMsg),
								A2($author$project$Home$page.update, msg, m));
						} else {
							break _v0$8;
						}
					case 'TalkMsg':
						if (_v0.b.$ === 'Talk') {
							var msg = _v0.a.a;
							var m = _v0.b.a;
							return A3(
								$elm$core$Tuple$mapBoth,
								A2($author$project$Main$setSubModel, model, $author$project$Main$Talk),
								$elm$core$Platform$Cmd$map($author$project$Main$TalkMsg),
								A2($author$project$Talk$page.update, msg, m));
						} else {
							break _v0$8;
						}
					case 'ProjectsMsg':
						if (_v0.b.$ === 'Projects') {
							var msg = _v0.a.a;
							var m = _v0.b.a;
							return A3(
								$elm$core$Tuple$mapBoth,
								A2($author$project$Main$setSubModel, model, $author$project$Main$Projects),
								$elm$core$Platform$Cmd$map($author$project$Main$ProjectsMsg),
								A2($author$project$Projects$page.update, msg, m));
						} else {
							break _v0$8;
						}
					case 'ArticleMsg':
						if (_v0.b.$ === 'Article') {
							var msg = _v0.a.a;
							var m = _v0.b.a;
							return A3(
								$elm$core$Tuple$mapBoth,
								A2($author$project$Main$setSubModel, model, $author$project$Main$Article),
								$elm$core$Platform$Cmd$map($author$project$Main$ArticleMsg),
								A2($author$project$Article$page.update, msg, m));
						} else {
							break _v0$8;
						}
					case 'WordsMsg':
						if (_v0.b.$ === 'Words') {
							var msg = _v0.a.a;
							var m = _v0.b.a;
							return A3(
								$elm$core$Tuple$mapBoth,
								A2($author$project$Main$setSubModel, model, $author$project$Main$Words),
								$elm$core$Platform$Cmd$map($author$project$Main$WordsMsg),
								A2($author$project$Words$page.update, msg, m));
						} else {
							break _v0$8;
						}
					case 'LinkClicked':
						if (_v0.a.a.$ === 'External') {
							var s = _v0.a.a.a;
							return _Utils_Tuple2(
								model,
								$elm$browser$Browser$Navigation$load(s));
						} else {
							var u = _v0.a.a.a;
							return _Utils_Tuple2(
								model,
								$elm$browser$Browser$Navigation$load(
									$elm$url$Url$toString(u)));
						}
					default:
						var u = _v0.a.a;
						return A2($author$project$Main$init, u, model.key);
				}
			}
			var $temp$message = $author$project$Main$Reset(model.url),
				$temp$model = model;
			message = $temp$message;
			model = $temp$model;
			continue update;
		}
	});
var $elm$core$List$singleton = function (value) {
	return _List_fromArray(
		[value]);
};
var $author$project$Main$topBar = function (s) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('transition-fast w-full p-6 space-x-6 flex text-lg items-center border border-flu-300 bg-flu-0')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$href(''),
						$elm$html$Html$Attributes$class(
						A3(
							$author$project$Common$ifThenElse,
							_Utils_eq($elm$core$Maybe$Nothing, s),
							'',
							'')),
						$elm$html$Html$Attributes$class('cursor-pointer hover:underline font-bold')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Joel Richardson')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('grow')
					]),
				_List_Nil),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('w-1/3 flex space-x-6 items-center')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$href('#projects'),
								$elm$html$Html$Attributes$class(
								A3(
									$author$project$Common$ifThenElse,
									_Utils_eq(
										$elm$core$Maybe$Just('projects'),
										s),
									'font-bold',
									'hover:underline')),
								$elm$html$Html$Attributes$class('flex-1 grow text-right')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Projects')
							])),
						A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$href('#talks'),
								$elm$html$Html$Attributes$class(
								A3(
									$author$project$Common$ifThenElse,
									_Utils_eq(
										$elm$core$Maybe$Just('talks'),
										s),
									'font-bold',
									'hover:underline')),
								$elm$html$Html$Attributes$class('flex-1 grow text-center')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Talks')
							])),
						A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$href('#articles'),
								$elm$html$Html$Attributes$class(
								A3(
									$author$project$Common$ifThenElse,
									_Utils_eq(
										$elm$core$Maybe$Just('articles'),
										s),
									'font-bold',
									'hover:underline')),
								$elm$html$Html$Attributes$class('flex-1 grow text-left')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Articles ')
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('grow')
					]),
				_List_Nil),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('pointer-events-none opacity-0')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Joel Richardson____')
					]))
			]));
};
var $author$project$Main$academic = F2(
	function (model, contents) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('academic w-full h-full bg-flu-50')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('h-[10%] w-full')
						]),
					_List_fromArray(
						[
							$author$project$Main$topBar(model.url.fragment)
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('h-[1px]')
						]),
					_List_Nil),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('h-[90%] w-full overflow-scroll')
						]),
					A3(
						$elm$core$Basics$composeR,
						$elm$html$Html$div(
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('flex flex-col place-items-center space-y-6')
								])),
						$elm$core$List$singleton,
						$elm$core$List$concat(
							_List_fromArray(
								[
									_List_fromArray(
									[
										A2($elm$html$Html$div, _List_Nil, _List_Nil)
									]),
									contents,
									_List_fromArray(
									[
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('w-full p-4 pb-8 text-flu-300 text-center')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('that\'s it - the end.')
											]))
									])
								]))))
				]));
	});
var $author$project$Main$creative = function (contents) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('creative w-full h-full bg-flu-50 overflow-clip')
			]),
		contents);
};
var $author$project$Main$viewInner = function (model) {
	var _v0 = model.model;
	switch (_v0.$) {
		case 'Empty':
			return A2(
				$author$project$Main$academic,
				model,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('text-flu-600 font-bold text-2xl pt-8')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Whoops! There\'s nothing here.')
							]))
					]));
		case 'Home':
			var m = _v0.a;
			return A2(
				$author$project$Main$academic,
				model,
				A2(
					$elm$core$List$map,
					$elm$html$Html$map($author$project$Main$HomeMsg),
					$author$project$Home$page.view(m)));
		case 'Talk':
			var m = _v0.a;
			return A2(
				$author$project$Main$academic,
				model,
				A2(
					$elm$core$List$map,
					$elm$html$Html$map($author$project$Main$TalkMsg),
					$author$project$Talk$page.view(m)));
		case 'Projects':
			var m = _v0.a;
			return A2(
				$author$project$Main$academic,
				model,
				A2(
					$elm$core$List$map,
					$elm$html$Html$map($author$project$Main$ProjectsMsg),
					$author$project$Projects$page.view(m)));
		case 'Article':
			var m = _v0.a;
			return A2(
				$author$project$Main$academic,
				model,
				A2(
					$elm$core$List$map,
					$elm$html$Html$map($author$project$Main$ArticleMsg),
					$author$project$Article$page.view(m)));
		default:
			var m = _v0.a;
			return $author$project$Main$creative(
				A2(
					$elm$core$List$map,
					$elm$html$Html$map($author$project$Main$WordsMsg),
					$author$project$Words$page.view(m)));
	}
};
var $author$project$Main$view = function (model) {
	return {
		body: $elm$core$List$singleton(
			A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('h-screen w-screen p-3')
					]),
				_List_fromArray(
					[
						$author$project$Main$viewInner(model)
					]))),
		title: 'Joel Richardson'
	};
};
var $author$project$Main$main = $elm$browser$Browser$application(
	{
		init: function (_v0) {
			return $author$project$Main$init;
		},
		onUrlChange: $author$project$Main$Reset,
		onUrlRequest: $author$project$Main$LinkClicked,
		subscriptions: $author$project$Main$subscriptions,
		update: $author$project$Main$update,
		view: $author$project$Main$view
	});
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$succeed(
		{}))(0)}});}(this));