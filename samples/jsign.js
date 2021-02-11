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

const signature_ld = require("jsonld-signatures")
const crypto_ld = require("crypto-ld")
const json_ld = require("jsonld")

const nodeDocumentLoader = json_ld.documentLoaders.node();
const customLoader = async (url, options) => {

    if (url === "https://example.com/i/alice/keys/1") {
        const public_pem = await fs.promises.readFile(path.join(FOLDER, "public.key.pem"), "utf-8")
        console.log("HERE")
        return {
           "type": "RsaVerificationKey2018",

            publicKeyPem: public_pem,
        }
    }


    /*
  if(url in CONTEXTS) {
    return {
      contextUrl: null, // this is for a context via a link header
      document: CONTEXTS[url], // this is the actual document that was loaded
      documentUrl: url // this is the actual context URL after redirects
    };
  }
  // call the default documentLoader
    */
  return nodeDocumentLoader(url);
};
// jsonld.documentLoader = customLoader;

const FOLDER = path.join(__dirname, "..", "test", "data")

const run = async (files) => {
    const private_pem = await fs.promises.readFile(path.join(FOLDER, "private.key.pem"), "utf-8")
    const public_pem = await fs.promises.readFile(path.join(FOLDER, "public.key.pem"), "utf-8")

    // specify the public key object
    const publicKey = {
        '@context': signature_ld.SECURITY_CONTEXT_URL,
        type: 'RsaVerificationKey2018',
        id: 'https://example.com/i/alice/keys/1',
        controller: 'https://example.com/i/alice',
        publicKeyPem: public_pem,
    };

    // specify the public key controller object
    const controller = {
        '@context': signature_ld.SECURITY_CONTEXT_URL,
        id: 'https://example.com/i/alice',
        publicKey: [publicKey],
        // this authorizes this key to be used for making assertions
        assertionMethod: [publicKey.id]
    };

    // create the JSON-LD document that should be signed
    const doc = {
        "@context": [
            {
                schema: 'http://schema.org/',
            },
            signature_ld.SECURITY_CONTEXT_URL,
        ],
        "schema:name": 'Manu Sporny',
        "schema:homepage": 'https://manu.sporny.org/',
        "schema:image": 'https://manu.sporny.org/images/manu.png'
    };

    // sign the document as a simple assertion
    const key = new crypto_ld.RSAKeyPair({
        publicKeyPem: public_pem, 
        privateKeyPem: private_pem
    });

    const signed = await signature_ld.sign(doc, {
        suite: new signature_ld.suites.RsaSignature2018({
            key: key, 
            verificationMethod: 'https://example.com/i/alice/keys/1',
        }),
        purpose: new signature_ld.purposes.AssertionProofPurpose()
    })

    console.log('Signed document:', JSON.stringify(signed, null, 2))

    // we will need the documentLoader to verify the controller
    const {node: documentLoader} = json_ld.documentLoaders;
    // console.log(documentLoader)
    // return

    // verify the signed document
    const result = await signature_ld.verify(signed, {
        // documentLoader,
        documentLoader: customLoader,
        suite: new signature_ld.suites.RsaSignature2018(key),
        purpose: new signature_ld.purposes.AssertionProofPurpose({controller})
    })
    if (result.verified) {
        console.log('Signature verified')
    } else {
        console.log('Signature verification error:', result.error)
    }
}

run(process.argv.slice(2)).catch(error => {
    console.log(error)
})

