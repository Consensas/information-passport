# information-passport 
Information Passport Open Source Code

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

## Contact

Need this for your organization?
Contact [Consensas](mailto:ryan@consensas.com).

Technical support: 
[open an issue](https://github.com/Consensas/information-passport/issues).
Patches more appreciated than "you should do this"

## Components

* docs: documentation, including standards we are defining

* jws: the core signing and verification algorithms -
  this is what NPMing this package gets you

* web: a sample web interface that will scan and verify
  Information Passport QR codes or take QR code entry

* tools: tools for working with IPs. Includes command line
  verification and pretty printing code, interface for 
  barcode scanner on Raspberry Pi (or likely anywhere).

  if you just want to try it, this is the place to go

* test: test code

