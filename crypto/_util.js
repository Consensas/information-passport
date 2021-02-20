/**
 *  crypto/_util.js
 *
 *  David Janes
 *  Consensas
 *  2021-01-11
 */

"use strict"

const _ = require("lodash")

// https://stackoverflow.com/a/33332038/96338
exports.isDictionary = d => {
   return (d === void 0 || d === null || Array.isArray(d) || typeof d == 'function' || d.constructor === Date ) ?
           false : (typeof d == 'object')
}

exports.isBuffer = v => v instanceof Buffer
exports.isString = v => typeof v === 'string';
exports.isTimestamp = v => typeof v === 'string' && v.match(/^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d([.]\d\d\d)?Z$/)
exports.isArray = v => Array.isArray(v)

exports.SECURITY_KEY = "security"
exports.SECURITY_VALUE = "https://w3id.org/security#"

exports.SECURITY_TYPE = "https://cccc4.ca/vc#CanonicalRSA2021"
exports.SECURITY_PROOF_PURPOSE = "assertionMethod"

/**
 *  Can be shimmed for testing
 */
exports.make_timestamp = () => new Date().toISOString()
exports.make_nonce = () => `${Math.random()}`.substring(2)

/**
 */
exports.recontext = (message, ncontext) => {
    const _util = exports
    const ip = require("..")
    const context = message["@context"]
    if (_util.isString(context) || _util.isDictionary(context)) {
        message["@context"] = [
            context,
            "https://w3id.org/security/v2"
        ]
    } else if (_util.isArray(context)) {
        message["@context"] = [].concat([
            context,
            "https://w3id.org/security/v2"
        ])
    } else {
        message["@context"] = [
            "https://w3id.org/security/v2"
        ]
    }

    return message["@context"]
}

/**
 */
exports.coerce = {}

exports.coerce.list = (v, otherwise) => {
    if (_.isNull(v)) {
        return otherwise
    } else if (_.isUndefined(v)) {
        return otherwise
    } else if (_.isArray(v)) {
        return v
    } else {
        return [ v ]
    }
}

exports.coerce.first = (v, otherwise) => {
    if (_.isNull(v)) {
        return otherwise
    } else if (_.isUndefined(v)) {
        return otherwise
    } else if (_.isArray(v)) {
        if (v.length) {
            return v[0]
        } else {
            return otherwise
        }
    } else {
        return v
    }
}

/**
 *  Deep Clone
 */
exports.clone = oo => {
    let no = oo;
    if (oo && typeof oo === 'object') {
        no = Object.prototype.toString.call(oo) === "[object Array]" ? [] : {};
        for (let i in oo) {
            no[i] = exports.clone(oo[i]);
        }
    }

    return no
}


/*
 *  RFC8785 algorithm for Canonical JSON
 *  https://tools.ietf.org/id/draft-rundgren-json-canonicalization-scheme-05.html
 */
exports.canonicalize = function(object) {
      let buffer = '';
      serialize(object);
      return buffer;
  
      function serialize(object) {
          if (object === null || typeof object !== 'object' ||
              object.toJSON != null) {
              /////////////////////////////////////////////////
              // Primitive type or toJSON - Use ES6/JSON     //
              /////////////////////////////////////////////////
              buffer += JSON.stringify(object);
  
          } else if (Array.isArray(object)) {
              /////////////////////////////////////////////////
              // Array - Maintain element order              //
              /////////////////////////////////////////////////
              buffer += '[';
              let next = false;
              object.forEach((element) => {
                  if (next) {
                      buffer += ',';
                  }
                  next = true;
                  /////////////////////////////////////////
                  // Array element - Recursive expansion //
                  /////////////////////////////////////////
                  serialize(element);
              });
              buffer += ']';
  
          } else {
              /////////////////////////////////////////////////
              // Object - Sort properties before serializing //
              /////////////////////////////////////////////////
              buffer += '{';
              let next = false;
              Object.keys(object).sort().forEach((property) => {
                  if (next) {
                      buffer += ',';
                  }
                  next = true;
                  ///////////////////////////////////////////////
                  // Property names are strings - Use ES6/JSON //
                  ///////////////////////////////////////////////
                  buffer += JSON.stringify(property);
                  buffer += ':';
                  //////////////////////////////////////////
                  // Property value - Recursive expansion //
                  //////////////////////////////////////////
                  serialize(object[property]);
              });
              buffer += '}';
          }
      }
};
