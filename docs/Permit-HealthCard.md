<a href="https://github.com/Consensas/information-passport/tree/main/docs"><img src="https://consensas-aws.s3.amazonaws.com/icons/passports-github.png" align="right" /></a>

# A schema.org description of a Health Card

This extends the concept of a Permit to a Health Card.
Some more modelling may be needed for e.g. US / non-Canadian cards.

## Example

      "schema:permit-healthCard": {
        "@type": "schema:Permit-HealthCard",
        "schema:identifier-healthCard": "•••••••••••••••1111",
        "schema:issuedBy": "CA-ON",
        "schema:validUntil": "2023-12-31"
      },
