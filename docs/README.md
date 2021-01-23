# Information Passport Documentation

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

## Standards Proposed

Some of these can also be found on [Medium](https://dpjanes.medium.com/).

### Schema.org extensions

* [A schema.org extension for semantically describing Vaccinations](Vaccination.md) 
* [A schema.org description of a Drug like Moderna](Drug-Moderna.md) 
* [A schema.org description of a Health Condition like COVID-19](HealthCondition-COVID.md) 

### W3C related

* [ConsensasRSA2021 signing standard](Signing.md)
* [QName Compacted JSON-LD](QCompacted.md)
