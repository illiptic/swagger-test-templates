'use strict';

var strObj = require('string');

var TYPE_JSON = 'application/json';

// http://goo.gl/LFoiYG
function is(lvalue, rvalue, options) {
  if (arguments.length < 3) {
    throw new Error('Handlebars Helper \'is\' needs 2 parameters');
  }

  if (lvalue !== rvalue) {
    return options.inverse(this);
  } else {
    return options.fn(this);
  }
}

// http://goo.gl/LFoiYG
function ifCond(v1, v2, options) {
  if (arguments.length < 3) {
    throw new Error('Handlebars Helper \'ifCond\' needs 2 parameters');
  }
  if (v1.length > 0 || v2) {
    return options.fn(this);
  }
  return options.inverse(this);
}

/**
 * determines if content types are able to be validated
 * @param  {string} type     content type to be evaluated
 * @param  {boolean} noSchema whether or not there is a defined schema
 * @param  {Object} options  handlebars built-in options
 * @returns {boolean}          whether or not the content can be validated
 */
function validateResponse(type, noSchema, options) {
  if (arguments.length < 3) {
    throw new Error('Handlebars Helper \'validateResponse\'' +
      'needs 2 parameters');
  }

  if (!noSchema && type === TYPE_JSON) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
}

/**
 * replaces path params with obvious indicator for filling values
 * (i.e. if any part of the path is surrounded in curly braces {})
 * @param  {string} path  request path to be pathified
 * @param  {object} pathParams contains path parameters to replace with
 * @returns {string}          pathified string
 */
function pathify(path, pathParams) {
  var r;

  if (arguments.length < 3) {
    throw new Error('Handlebars Helper \'pathify\'' +
      ' needs 2 parameters');
  }

  if ((typeof path) !== 'string') {
    throw new TypeError('Handlebars Helper \'pathify\'' +
      'requires path to be a string');
  }

  if ((typeof pathParams) !== 'object') {
    throw new TypeError('Handlebars Helper \'pathify\'' +
      'requires pathParams to be an object');
  }

  if (Object.keys(pathParams).length > 0) {
    var re = new RegExp(/(?:\{+)(.*?(?=\}))(?:\}+)/g);
    var re2;
    var matches = [];
    var m = re.exec(path);
    var i;

    while (m) {
      matches.push(m[1]);
      m = re.exec(path);
    }

    for (i = 0; i < matches.length; i++) {
      var match = matches[i];

      re2 = new RegExp('(\\{+)' + match + '(?=\\})(\\}+)');

      if (typeof (pathParams[match]) !== 'undefined' &&
          pathParams[match] !== null) {
        // console.log("Match found for "+match+": "+pathParams[match]);
        path = path.replace(re2, pathParams[match]);
      } else {
        // console.log("No match found for "+match+": "+pathParams[match]);
        path = path.replace(re2, '{' + match + ' PARAM GOES HERE}');
      }
    }
    return path;
  }

  r = new RegExp(/(?:\{+)(.*?(?=\}))(?:\}+)/g);
  return path.replace(r, '{$1 PARAM GOES HERE}');
}

/**
 * split the long description into multiple lines
 * @param  {string} len  parameterized length.
 *          Must be registered by partial call (currying), so that the resulting
 *          function registered with handlebars takes only 'description'.
 * @param  {string} description  request description to be splitted
 * @returns {string}        multiple lines
 */
function length(len, description) {
  if (arguments.length < 2) {
    throw new Error('Handlebar Helper \'length\'' +
    ' needs 1 parameter');
  }

  if ((typeof description) !== 'string') {
    throw new TypeError('Handlebars Helper \'length\'' +
      'requires path to be a string');
  }
  return strObj(description).truncate(len - 50).s;
}

module.exports = {
  is: is,
  ifCond: ifCond,
  validateResponse: validateResponse,
  pathify: pathify,
  length: length
};
