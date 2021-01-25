<img src="https://consensas-aws.s3.amazonaws.com/icons/passports-github.png" align="right" />

# A schema.org description of a Drug like Moderna

This is a straight instantiation of [`schema:Drug`](https://schema.org/Drug), 
using CDC terminology.

## Notes
CVX and MVX described using [CDC terminology](https://www.cdc.gov/vaccines/programs/iis/downloads/business-rules.pdf)

* CVX (Vaccine Administered) - a numeric string, which identifies the type of vaccine product used.
* MVX (Manufactured) - an alphabetic string that identifies the manufacturer of that vaccine.  CVX + MVX: Taken together, the immunization can be resolved to a trade name (the proprietary name of the product)

Identifiers are constructed in a systematic way (normative):

* `MVX-MOD.CVX-207`
* `CVX-207`
* `MVX-MOD`

## Example

    {
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
    }
