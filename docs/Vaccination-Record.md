<a href="https://github.com/Consensas/information-passport/tree/main/docs"><img src="https://consensas-aws.s3.amazonaws.com/icons/passports-github.png" align="right" /></a>

# A schema.org extension for semantically describing a Vaccination Record

This document describes a [schema.org](https://schema.org) compatible Type for 
a Vaccination Record, that is:

* a [Vaccination](Vaccination.md), 
* given to a [Patient](Patient.md) with a particular [Health Card](Permit-HealthCard.md)
* at a [Hospital or Clinic](Hospital.md)
* at a particular time

Likely this will be extended to include "by a particular doctor / nurse / health practioner",
though that is not critical for what we are trying to accomplish right now.

## Example

    {
      "@type": "schema:MedicalRecord-Vaccination",
      "schema:name": "David P Janes - Moderna COVID-19 Vaccine",
      "schema:patient": <Patient>
      "schema:location": <HOSPITAL>,
      "schema:primaryPrevention": <VACCINATION>,
      "schema:treatmentDate": "2021-01-06",
    }

which fully expanded looks like

    {
      "@context": {
        "schema:": "https://schema.org",
        "security": "https://w3id.org/security#"
      },
      "@type": "schema:MedicalRecord-Vaccination",
      "schema:location": {
        "@context": {
          "schema:": "https://schema.org"
        },
        "@type": "schema:Hospital",
        "schema:name": "General Hospital",
        "schema:identifier": "MSC-PLC-0200-1001-2101",
        "schema:address": {
          "@type": "schema:PostalAddress",
          "schema:addressCountry": "CA",
          "schema:addressRegion": "BC"
        }
      },
      "schema:name": "David P Janes - Moderna COVID-19 Vaccine",
      "schema:patient": {
        "@type": "schema:Patient",
        "schema:additionalName": "P",
        "schema:birthDate": "••••-••-01",
        "schema:familyName": "Janes",
        "schema:givenName": "David"
      },
      "schema:permit-healthCard": {
        "@type": "schema:Permit-HealthCard",
        "schema:identifier-healthCard": "•••••••••••••••1111",
        "schema:issuedBy": "CA-ON",
        "schema:validUntil": "2023-12-31"
      },
      "schema:primaryPrevention": {
        "@context": {
          "schema:": "https://schema.org"
        },
        "@type": "schema:MedicalTherapy-Vaccination",
        "schema:name": "Moderna COVID-19 Vaccine",
        "schema:identifier": "MVX-MOD.CVX-207",
        "schema:drug": {
          "@type": "schema:Drug",
          "schema:name": "Moderna COVID-19 Vaccine",
          "schema:identifier": "MVX-MOD.CVX-207",
          "schema:code": {
            "@type": "schema:MedicalCode",
            "schema:codeValue": "MVX-MOD.CVX-207",
            "schema:codingSystem": "CDC-MVX.CVX"
          },
          "schema:description": "COVID-19, mRNA, LNP-S, PF, 100 mcg/0.5 mL dose",
          "schema:identifier-cvx": "CVX-207",
          "schema:manufacturer": {
            "@type": "schema:Organization-CDC-MVX",
            "schema:name": "Moderna US, Inc.",
            "schema:identifier": "MVX-MOD",
            "schema:identifier-mvx": "MVX-MOD"
          }
        },
        "schema:healthCondition": {
          "@type": "schema:MedicalCondition",
          "schema:name": "COVID-19",
          "schema:identifier": "U07",
          "schema:code": {
            "@type": "schema:MedicalCode",
            "schema:codeValue": "U07",
            "schema:codingSystem": "ICD-10"
          }
        },
        "schema:identifier-cvx": "CVX-207",
        "schema:identifier-mvx": "MVX-MOD"
      },
      "schema:treatmentDate": "2021-01-06",
     }
