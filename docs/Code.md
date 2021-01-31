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


## Code

The Node.JS code documentation is [here](Code.md)

### Node.JS Signing and Verification

The Node.JS library for signing and verifying
JSON documents is [here](../tools/jws)
It can be used server-side or embedded into your web app 
using webpack, etc.. It implemets 
the [ConsensasRSA2021 signing standard](Signing.md),
which should be able to drop into Linked Data Proofs
and Veriable Credentials

