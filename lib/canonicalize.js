/**
 *  lib/canonicalize.js
 *
 *  David Janes
 *  Consensas
 *  2021-01-11
 *
 *  RFC8785 algorithm for Canonical JSON
 *  https://tools.ietf.org/id/draft-rundgren-json-canonicalization-scheme-05.html
 */

"use strict"

/**
 */
const canonicalize = function(object) {
  
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

/**
 */
exports.canonicalize = canonicalize
