<a href="https://github.com/Consensas/information-passport/tree/main/docs"><img src="https://consensas-aws.s3.amazonaws.com/icons/passports-github.png" align="right" /></a>

# Validation Proposal

## Introduction

This document describes a system for "validating" claims 
in W3C Verifiable Credentials. 
Validation, for this document, means ensuring that a claim
conforms to a set of business rules.

The motivation for this proposal is
that even if we standard claim types, we 
still have to deal with

* multiple vaccination types, being rolled out over time
* multiple coding systems for describing vaccinations (EU, Canada, US…)
* different passport types: Vaccination, Tests…
* rules being changed over time by jurisdiction

Ideally we'd be able to update these business rules
without pushing code updates to Validators. That is,
the rules are "soft", they are entirely data-defined.

Although the system described here is mainly about Vaccination
Passports, it obviously can be applied to other credential types.

## Baseline

This system assumes that all claims are JSON-like data in "document" format. 
By documents, we mean basically a de-normalized hierarchical database record,
in the sense that NoSQL databases like MongoDB do.

Note that this is unlikely to work well with "graph" type
structures such as RDF triples or FHIR objects, unless a pre-processing
step is introduced to normalize them somehow.

Ideally, all claims would be proposed by Issuers exactly as they're 
intended to be consumed. We envision however that if claims are
expressed as JSON-LD, we can "recontexualize" the claim so it
can be consumed exactly as the business rules intend.

Also note that validation should require checking how the signature
specifies a signing key of someone we trust. However, this is
not dealt with here

## The System

This is an introduction document

### Sample Rules

Obviously these are somewhat silly rules, 
but should be good enough for illustration.

We're showing the rules in YAML, but I 
expect that these will be compiled to JSON
for actual delivery to end Validators.


The `context` bit describes how input JSON-LD
documents should be recontextualized. 
_I'm considering that maybe this should be
pushed into the individual rules_.

The `rules` is an array of business rules: at 
least one of these must match (and there's a concept, 
not shown here of a `reject` rule, of which 
none should match).

In each rule:

- `credential` must match at least one of the `@type`
  of the claim
- `credentialSubject` is a (simplified) _MongoDB-type query_.
  the query is tested against the `vc:credentialSubject`
  of the VC

    ---
    version: 1.0
    context:
      "schema": "http://schema.org"
      "security": "https://w3id.org/security#"
      "vc": "https://www.w3.org/2018/credentials/v1"

    rules:
    - name: "People born on or before January 1, 1980"
      credential: vc:PersonCredential
      credentialSubject:
        schema:birthDate: 
          "$lte": "1980-01-01"

    - name: "People born before January 1, 1980"
      credential: vc:PersonCredential
      credentialSubject:
        schema:birthDate: 
          "$lt": "1980-01-01"

    - name: "People born on or after January 1, 1980"
      credential: vc:PersonCredential
      credentialSubject:
        schema:birthDate: 
          "$gte": "1980-01-01"

    - name: "People named David"
      credential: vc:PersonCredential
      credentialSubject:
        schema:givenName: "Joanne"

### Sample Claims

For illustration, here's a couple of Verifiable
Claims that we will test again the rules above.
I've left out `@context` for space reasons
and `vc:PersonCredential` etc. are just made up
by me for illustration.

    [
      {
        "@type": [
          "vc:VerifiableCredential",
          "vc:PersonCredential"
        ],
        "vc:credentialSubject": {
          "@type": "schema:Person",
          "schema:additionalName": null,
          "schema:birthDate": "1980-01-01",
          "schema:familyName": "Rubio",
          "schema:givenName": "Andrew",
          "schema:name": "Andrew Rubio"
        },
        "vc:issuanceDate": "2021-01-29T12:30:42.993Z",
        "vc:issuer": "https://passport.consensas.com"
      },
      {
        "@type": [
          "vc:VerifiableCredential",
          "vc:PlaceCredential"
        ],
        "vc:credentialSubject": {
          "@type": "schema:Place",
          "schema:address": {
            "@type": "schema:Address",
            "schema:addressCountry": "CA",
            "schema:addressRegion": "BC"
          },
          "schema:name": "General Hospital"
        },
        "vc:issuanceDate": "2021-01-29T12:30:42.993Z",
        "vc:issuer": "https://passport.consensas.com"
      },
      {
        "@type": [
          "vc:VerifiableCredential",
          "vc:PersonCredential"
        ],
        "vc:credentialSubject": {
          "@type": "schema:Person",
          "schema:additionalName": null,
          "schema:birthDate": "1960-01-01",
          "schema:familyName": "Jones",
          "schema:givenName": "Locker",
          "schema:name": "Locker Jones"
        },
        "vc:issuanceDate": "2021-01-29T12:30:42.993Z",
        "vc:issuer": "https://passport.consensas.com"
      },
      {
        "@type": [
          "vc:VerifiableCredential",
          "vc:PersonCredential"
        ],
        "vc:credentialSubject": {
          "@type": "schema:Person",
          "schema:additionalName": null,
          "schema:birthDate": "1980-01-01",
          "schema:familyName": "Rubio",
          "schema:givenName": "Andrew"
        },
        "vc:issuanceDate": "2021-01-29T12:30:42.993Z",
        "vc:issuer": "https://passport.consensas.com"
      },
      {
        "@type": [
          "vc:VerifiableCredential",
          "vc:PersonCredential"
        ],
        "vc:credentialSubject": {
          "@type": "schema:Person",
          "schema:additionalName": null,
          "schema:birthDate": "2001-02-01",
          "schema:familyName": "Jelkins",
          "schema:givenName": "Joanne",
          "schema:name": "Joanne Jelkins"
        },
        "vc:issuanceDate": "2021-01-29T12:30:42.993Z",
        "vc:issuer": "https://passport.consensas.com"
      }
    ]

      
### Results

## End Notes

Versioning

