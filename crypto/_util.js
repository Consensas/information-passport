/**
 *  crypto/_util.js
 *
 *  David Janes
 *  Consensas
 *  2021-01-11
 */

"use strict"

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

exports.SECURITY_TYPE = "https://models.consensas.com/security#ConsensasRSA2021"
exports.SECURITY_PROOF_PURPOSE = "assertionMethod"

/**
 *  Can be shimmed for testing
 */
exports.make_timestamp = () => new Date().toISOString()
exports.make_nonce = () => `${Math.random()}`.substring(2)

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
