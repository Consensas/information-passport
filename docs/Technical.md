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

### Technology Stack

Information Passports are built on the following technology stack:

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
* [X.509 Cryptography]() -
* [Decentralized Identifier](https://www.w3.org/TR/did-core/) _friendly_ - 
  not really a core technology, but useful in concept

As our goals include being simple to implement and simple to understand, 
we _constrain_ how these standards are used to get the functionality 
we need but no more. 
For example, all Information Passports are JSON-LD, but you do not need
to use the JSON-LD libraries to work with Information Passports, just JSON.

### Design Goals

* It is easy for humans to read and write. 
* It is easy for machines to parse and generate. These two points should be familiar, 
  they are the design ideals of [JSON](https://www.json.org/json-en.html): 
* Open Source Implmenetation - our inspiration is the early web, where any reasonably
  skilled technologist could pick up it up and do something useful.
  Our open source reference implementation is on GitHub
  at [information-passport](https://github.com/Consensas/information-passport)
  and a reference sample website is at 
  [information-passport-website](https://github.com/Consensas/information-passport-website).
* Non-creepy - minimize the potential for personal information leakage and 
  the need for data centralization
* Secure - obviously
* Minimalistic - define the least to do the job, and no more: for example,
  we do not define whether the mobile phone number of a Passport holder needs
  to be recorded
* Open Ended - if you need a Passport system that requires e.g. a mobile phone number,
  it should be straight-forward to build on this standard
* Paper Friendly - 
* Non-app - it should not require an app to be installed on  
* Data Entry
