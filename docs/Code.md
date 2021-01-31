<a href="https://github.com/Consensas/information-passport/tree/main/docs"><img src="https://consensas-aws.s3.amazonaws.com/icons/passports-github.png" align="right" /></a>

# Code

## What is an Information Passport?
An **[Information Passport](https://github.com/Consensas/information-passport/tree/main/docs#information-passport)** 
is a _signed digital document_ that makes some claim,
for example "So and so was Vaccinated against COVID-19 on a certain date".
If the _signature_ matches the _public key_ of the digital document, the
document is **Verified**.
If the **Claim** made in the document checks against a set of (use-defined) rules
_and_ the "fingerprint" of the public key is known, we say the document is
**Validated**.

A **Vaccination Passport** is an Information Passport that 
provides digital proof of a Vaccination.
A **Test Passport** is an Information Passport that provides
digital proof a some test having been performed.


## Installation

The current published version

    npm install information-passport

If you want the current development version 
(things move quickly):

    npm install https://github.com/Consensas/information-passport.git

## Testing

All core code will have a complete test suite. Use

    npm test 

or

    npm run cover

## API

We assume you are doing first

    const ip = require("information-passport")

Sample code can be found in the `samples` and `test` folder.

### Sign a JSON document

Add `jws:proof` to a JSON record, as per the 
the [`ConsensasRSA2021` standard](QCompacted.md). 

    Promise ip.crypto.sign(JSON message, String private_key, URI verifier)

* `message` is a JSON record
* `private_key` is a PEM encoded private key
* `verifier` is a URI, where the public key certificate chain can be found

This returns a promise that resolves to the signed JSON record, which
looks like this:

    {
      "@context": {
        "security": "https://w3id.org/security#"
      },
      "hello": "world",
      "security:proof": {
        "security:type": "https://models.consensas.com/security#ConsensasRSA2021",
        "security:proofPurpose": "assertionMethod",
        "security:created": "2021-01-18T10:10:26.179Z",
        "security:nonce": "123456789",
        "security:verificationMethod": "https://example.com/i/pat/keys/5",
        "security:jws": "ey...7w"
      }
    }

Note that this _isn't_ a [W3C Verifiable Credential](https://www.w3.org/TR/vc-data-model/)… 
but it can be used to sign one.

### Verify a JSON document

Verify that a document with a signature is correctly signed.

    Promise ip.crypto.verify(JSON signed, Promise prover(String verifier))

* `signed` is the signed JSON record
* `prover` is a function that returns a promise.
  It takes a single argument, the `verifier` which is 
  a URI to retrieve the public key certificate chain,
  which should be returned as a String

If something goes wrong - e.g. verification fails in any way - an Error is thrown.
This returns a Promise which resolves to a record that looks like this:

    {
      "proof": {
        "type": "https://models.consensas.com/security#ConsensasRSA2021",
        "proofPurpose": "assertionMethod",
        "created": "2021-01-18T10:10:26.179Z",
        "nonce": "123456789",
        "verificationMethod": "https://example.com/i/pat/keys/5",
        "jws": "ey...w"
      },
      "payload": {
        "@context": {
          "security": "https://w3id.org/security#"
        },
        "hello": "world"
      },
      "chain": [
        {
          "C": "CA",
          "CN": "davidjanes.com",
          "fingerprint": "78:EA:E2:A5:19:FD:A8:35:56:2D:59:B7:B7:20:32:6C:F6:EC:53:E0"
        }
      ]
    }

Where:

* `proof` is the proof that was in the JSON record, with the `security:` 
  QNames stripped off (for easy of programming)
* `payload` is the original message - note that `@context` may be 
  added or modified
* `chain` is an Array that contains the fingerprints and basic details
  about the Certificate Chain, in strict bottom up order of Leaf
  to Root. There is no requirement for more than a single Leaf certificate
  though!

Remember that **Verification** only checks to see if signature is good.
It does not tell you if the public key is one you should trust,
or if the data is meaningful in any way.

### Valdate a Verifiable Claim

In progress
