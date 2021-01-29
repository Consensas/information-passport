<a href="https://github.com/Consensas/information-passport/tree/main/docs"><img src="https://consensas-aws.s3.amazonaws.com/icons/passports-github.png" align="right" /></a>

# Vaccination Passport encoded as a W3C Verifiable Credential

A [Verifiable Credential](https://www.w3.org/TR/vc-data-model/) is a way to 
"express [credentials] on the Web in a way that is cryptographically secure, privacy respecting, 
and machine-verifiable".

The W3C spec seems somewhat loosey-goosey around the edges, but there's a fair
bit of consensus in the Covid Credentials world that this is the way to go.

Note we added a new Credential Type called `vc:HealthCredential`.
I've [opened an issue on W3C](https://github.com/w3c/vc-data-model/issues/763),
but who knows whether this will go anywhere - they don't seem to have the
types nailed down, though 
[Health/Medical are mentioned in their use cases](https://www.w3.org/TR/vc-use-cases/).

## Example

All the verifiable credential semantics are indicated as `vc:`. 
Note the use of 
[QName Compacted JSON-LD](https://github.com/Consensas/information-passport/blob/main/docs/QCompacted.md).

    {
      "@context": {
        "schema:": "https://schema.org",
        "security": "https://w3id.org/security#",
        "vc": "https://www.w3.org/2018/credentials/v1"
      },
      "@type": [
        "vc:VerifiableCredential",
        "vc:HealthCredential"
      ],
      "vc:issuer": "https://consensas.world",
      "vc:issuanceDate": "2021-01-29T12:00:40.805Z",
      "vc:credentialSubject": {
        "@context": {
          "schema:": "https://schema.org"
        },
        "@type": "schema:MedicalRecord-Vaccination",
        "schema:identifier": "MED-PVR-0200-210108-1002",
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
        "w3did:id": "did:cns:ABHEZDOYLE"
      },
      "security:proof": {
        "security:type": "https://models.consensas.com/security#ConsensasRSA2021",
        "security:proofPurpose": "assertionMethod",
        "security:created": "2021-01-29T12:00:40.817Z",
        "security:nonce": "5161405714943441",
        "security:verificationMethod": "https://consensas.world/did/did:cns:ABHEZDOYLE.pem",
        "security:jws": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImJrU1pMZmlGQ01aMkNyOGF0Z0RCOVJhQWlfcHRlY2NkSGczckxBUFVhNUkifQ..Rc9MDk6exumVQhYUWk_U4-PfUntWEZCwNLqH4h9Z_IGNCa5oXAN5fZRywtl9FLRFMKrVwRGjdPLDkmNMcF6FOfpzTH2Hl-51tWuFXoGRvPKh0RqrE72XOmb3g1YXPHOjm8ynv-E8NHUZGV4oewBFD_eG6mfRFqJ6AhQbgIEXA_VDKYN0zvl30aGDC-TChs3EL0HnVQd_FxF-JmQNoUpcNV1Ps1RV829BRr0E0R5JPIlq5aP0P9pjzTxf9MNHCoLLaOPk922YJelugWExHuJDriqE-k77fl2Ik9sgTMaMd4kd90HA8N3kyn4mRTPvHukqMeycsa773b1cRZc8yAWc0w"
      }
    }
