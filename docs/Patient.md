<a href="https://github.com/Consensas/information-passport/tree/main/docs"><img src="https://consensas-aws.s3.amazonaws.com/icons/passports-github.png" align="right" /></a>

# A schema.org description of a Patient

This is a straight instantiation of [`schema:Patient`](https://schema.org/Patient).

It would be nice if there was a straight forward way to indicate data
has been redacted, but we're OK with this for now.

## Example

    {
        "@type": "schema:Patient",
        "schema:additionalName": "P",
        "schema:birthDate": "••••-••-01",
        "schema:familyName": "Janes",
        "schema:givenName": "David",
        "schema:permit-healthCard": <HealthCard>
    }
