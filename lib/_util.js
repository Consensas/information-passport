/**
 *  lib/_util.js
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

exports.isString = v => typeof v === 'string';
exports.isArray = v => Array.isArray(v)

exports.SECURITY_KEY = "security"
exports.SECURITY_VALUE = "https://w3id.org/security#"

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
