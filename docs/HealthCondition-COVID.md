<img src="https://consensas-aws.s3.amazonaws.com/icons/passports-github.png" align="right" />

# A schema.org description of a Health Condition like COVID-19

This is a straight instantiation of [`schema:MedicalCondition`](https://schema.org/MedicalCondition), 
using [ICD-10](https://en.wikipedia.org/wiki/ICD-10) terminology.

## Example

    {
        "@type": "schema:MedicalCondition",
        "schema:name": "COVID-19",
        "schema:identifier": "U07",
        "schema:code": {
          "@type": "schema:MedicalCode",
          "schema:codeValue": "U07",
          "schema:codingSystem": "ICD-10"
        }
    }
