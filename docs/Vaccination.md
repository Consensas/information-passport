<a href="https://github.com/Consensas/information-passport/tree/main/docs"><img src="https://consensas-aws.s3.amazonaws.com/icons/passports-github.png" align="right" /></a>

# A schema.org extension for semantically describing Vaccinations

This document describes a [schema.org](https://schema.org) compatible Type for semantically recording a Vaccination — that is a particular type of Vaccination treatment that is available, but not for example, that Vaccination being to given to someone (we will describe this in another document).

## Details

High level, a Vaccination consists of a drug that’s being used and a health condition that is being treated. Obviously any vocabulary can be used for describing individual drugs or health conditions (many countries have their own) but we prefer to use the CDC’s guidance for drug names and ICD-10 for recording diseases (what is being treated).

With the record defined here, you now have:
* a definition of a treatment type
* what drug it uses
* what it treats

## Semantics

The following Extension Type is defined:

* `schema:MedicalTherapy-Vaccination` - based on `[schema:MedicalTherapy](https://schema.org/MedicalTherapy)`

The following Extension Properties are defined:

* `schema:identifier-cvx`
* `schema:identifier-mvx`

Also note the following:

* `schema:name` - is the human readable name, which should clearly indicate what the treatment is
* `schema:identifier` - a unique code that combines the manufacturer, drug code, and condition being treated
* `schema:drug` - required, the exact drug being used
* `schema:healthCondition` - required, what is being treated

CVX and MVX describe using [CDC terminology](https://www.cdc.gov/vaccines/programs/iis/downloads/business-rules.pdf)

* CVX (Vaccine Administered) - a numeric string, which identifies the type of vaccine product used.
* MVX (Manufactured) - an alphabetic string that identifies the manufacturer of that vaccine.  CVX + MVX: Taken together, the immunization can be resolved to a trade name (the proprietary name of the product)

Identifiers are constructed in a systematic way (normative):

* `MVX-MOD.CVX-207`
* `CVX-207`
* `MVX-MOD`

## Example

    {
      "@context": {
        "schema:": "https://schema.org"
      },
      "@type": "schema:MedicalTherapy-Vaccination",
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
      "schema:identifier": "MVX-MOD.CVX-207.U07",
      "schema:name": "Moderna COVID-19 Vaccine"
    }

