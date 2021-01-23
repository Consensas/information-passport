# Information Passports - Technical Description

## Introduction

### What is an Information Passport

An **Information Passport** is a _signed digital document_ that makes some claim,
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

### Technology Stack

Information Passports are built on the following technology stack.
It's helpful to be familiar with these technologies, but deep 
knowledge is not required:

* [JSON](https://www.json.org/json-en.html) -
  The People's Data Serialization
* [Schema](https://schema.org/) - 
  a shard vocabulary for describing things on the Internet and in the real world.
* JSON-LD - encodes semantic data, e.g. Schema data, in JSON
* [Verifiable Credentials](https://www.w3.org/TR/vc-data-model/) - 
  a W3C working group for digitally encoding e.g. a Driver's Licence
* [JSON Web Signing](https://tools.ietf.org/html/rfc7515) - 
  an IETF standard for creating digital signatures and encoding them
  in a way that is compatible with JSON
* [X.509 Cryptography](https://en.wikipedia.org/wiki/X.509) - 
  a venerable standard for public key cryptography, the backbone
  of e.g. TLS / HTTPS / the secure web.
* [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601)
  - for all dates and times
* [Decentralized Identifier](https://www.w3.org/TR/did-core/) _friendly_ - 
  not really a core technology, but useful in concept
* Standard Webstack - HTTP and TCP/IP. No core dependency on 
  blockchains or distributed ledgers.

As our goals include being simple to implement and simple to understand, 
we _constrain_ how these standards are used to get the functionality 
we need but no more. 
For example, all Information Passports are JSON-LD, but you do not need
to use the JSON-LD libraries to work with Information Passports, just JSON.

### Design Goals

* It is easy for humans to read and write. 
* It is easy for machines to parse and generate. These two points should be familiar, 
  they are the design ideals of [JSON](https://www.json.org/json-en.html).
* Open Source Implementation - our inspiration is the early web, where any reasonably
  skilled technologist could pick up it up and do something useful.
  Our open source reference implementation is on GitHub
  at [information-passport](https://github.com/Consensas/information-passport)
  and a reference sample website is at 
  [information-passport-website](https://github.com/Consensas/information-passport-website).
* Non-creepy - minimize the potential for personal information leakage and 
  the need for data centralization
* Secure - obviously
* Revokable - e.g. in the case of security breaches or fraudulently issued credentials
* Renouncable - e.g. having a URL to a passport won't guarentee it will
  verify or validate in the future
* Localized / Internationalized - passports need to work across multiple
  cultures and languages
* Semantic - data should [Linked Data](https://en.wikipedia.org/wiki/Linked_data) 
  friendly. In particular, [Schema](https://schema.org) should
  be the jumping off point for data definitions
* Standards Based - standing on the shoulders of giants, etc. etc. 
* Minimalistic - define the least to do the job, and no more: for example,
  we do not define whether the mobile phone number of a Passport holder needs
  to be recorded
* Open Ended - if you need a Passport system that requires e.g. a mobile phone number,
  it should be straight-forward to build on this standard
* Paper Friendly - an Information Passport should work as well by presenting
  a piece of paper as by doing something "digital"
* Non-app - it should not require an app to be installed on a smart phone. 
  As per above, it should not even require a smart phone! 
  However, if there are app-based passport solutions / "wallets"
  (there are several underway) this standard will likely provide an excellent
  data source.
* ID Entry friendly - ideally, it would be simple to enter some sort of Passport identifier 
  into a website, like you do with e.g. a Credit Card.

### Definitions

Our reference example is 
_David Janes received a COVID-19 Vaccination at the General Hospital. 
Sunrise Long Term Care cannot let him enter the building 
unless he follows the rules set by Western Health_.

This follows the [Verifiable Credentials](https://www.w3.org/TR/vc-data-model/#ecosystem-overview) ecosystem model.

* **Subject** - 
  the entity a Claim is being made about; in the example, "David Janes"
* **Issuer** - 
  the entity making the Claim; in the example, this would most likely be "General Hospital"
  but it could be e.g. the government agency that controls General Hospital.
* **Verifier** - 
  is the entity checking the Claim; in the example, "Sunrise Long Term Care"
* **Verifiable Data Registery** -
  is the entity that holds the rules and the X.509 public keys that will be
  accepted by the Verifier; in this example, it's "Western Health"

## The Standard
### Signing
### Verifying
### Validating
