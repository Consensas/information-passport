/**
 *  samples/jsign.js
 *
 *  David Janes
 *  Consensas
 *  2021-02-09
 *
 *  Experiment with JSON-LD signatures
 */

"use strict"

const ip = require("..")

const fs = require("fs")
const jose = require("node-jose")
const path = require("path")
const jsigs = require("jsonld-signatures")

const FOLDER = path.join(__dirname, "..", "test", "data")

const run = async (files) => {
    const private_pem = await fs.promises.readFile(path.join(FOLDER, "private.key.pem"), "utf-8")
    const public_pem = await fs.promises.readFile(path.join(FOLDER, "public.key.pem"), "utf-8")

    // specify the public key object
    const publicKey = {
      '@context': jsigs.SECURITY_CONTEXT_URL,
      type: 'RsaVerificationKey2018',
      id: 'https://example.com/i/alice/keys/1',
      controller: 'https://example.com/i/alice',
      publicKeyPem: public_pem
    };

    // specify the public key controller object
    const controller = {
      '@context': jsigs.SECURITY_CONTEXT_URL,
      id: 'https://example.com/i/alice',
      publicKey: [publicKey],
      // this authorizes this key to be used for making assertions
      assertionMethod: [publicKey.id]
    };

    // create the JSON-LD document that should be signed
    const doc = {
      '@context': [ {
        schema: 'http://schema.org/',
        /*
        name: 'schema:name',
        homepage: 'schema:url',
        image: 'schema:image',
        */
      },
      jsigs.SECURITY_CONTEXT_URL,
      {
        "@vocab": "http://schema.org/",
      }
    ],

      "name": 'Manu Sporny',
      "schema:homepage": 'https://manu.sporny.org/',
      "schema:image": 'https://manu.sporny.org/images/manu.png'
    };

    // sign the document as a simple assertion
    const {RsaSignature2018} = jsigs.suites;
    const {AssertionProofPurpose} = jsigs.purposes;
    const {RSAKeyPair} = require('crypto-ld');
    const {documentLoaders} = require('jsonld');

    const key = new RSAKeyPair({
        publicKeyPem: public_pem, 
        privateKeyPem: private_pem
    });

    const signed = await jsigs.sign(doc, {
      suite: new RsaSignature2018({key}),
      purpose: new AssertionProofPurpose()
    });


    console.log('Signed document:', JSON.stringify(signed, null, 2))
    return
    // we will need the documentLoader to verify the controller
    const {node: documentLoader} = documentLoaders;

    // verify the signed document
    const result = await jsigs.verify(signed, {
      documentLoader,
      suite: new RsaSignature2018(key),
      purpose: new AssertionProofPurpose({controller})
    });
    if(result.verified) {
      console.log('Signature verified.');
    } else {
      console.log('Signature verification error:', result.error);
    }
    /*
    const private_key = await jose.JWK.asKey(private_pem, 'pem');

    const message = {
        "hello": "world",
    }
    const verifier = "https://example.com/i/pat/keys/5"

    const signed = await ip.crypto.sign(message, private_key, verifier)
    console.log(JSON.stringify(signed, null, 2))
    */
}

run(process.argv.slice(2)).catch(error => {
    console.log(error)
})

