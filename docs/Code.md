<a href="https://github.com/Consensas/information-passport/tree/main/docs"><img src="https://consensas-aws.s3.amazonaws.com/icons/passports-github.png" align="right" /></a>

# Code

## Introduction
### What is an Information Passport?
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

## API

We assume you are doing first

    const ip = require("information-passport")

Sample code can be found in the `samples` and `test` folder.

### Sign a JSON document

Add `jws:proof` to a JSON record, as per the 
the `ConsensasRSA2021` standard.
Read more [here](QCompacted.md).

    ip.crypto.sign(message, private_key, verifier)

* `message` is a JSON record
* `private_key` is a PEM encoded private key, a string
* `verifier` is a URL, where the public key certificate chain can be found

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

        const v = await ip.crypto.verify(signed, async proof => {
            return fs.promises.readFile(path.join(FOLDER, "public.cer.pem"), "utf8")
        })


### Valdate a JSON document
