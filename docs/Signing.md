# ConsensasRSA2021 signing standard

The ConsensasRSA2021 is based on W3C's [Linked Data Proofs](https://w3c-ccg.github.io/ld-proofs/).
The core difference is that ConsensasRSA2021 does not depend on *Linked Data* or 
JSON-LD, though it should be fully compatible with it

## Details
### Canonical JSON

Canonical JSON is defined by [RFC8785](https://tools.ietf.org/html/rfc8785).
It ensures that given any JSON message, we can create exactly the same
representation.

### Signing Algorithm

* ensure "@context" contains `"security": "https://w3id.org/security#"`
* remove `security:proof` from message
* canonical version of message
* create proof without signature, e.g. containing `security:created` and `security:nonce`,
  plus all the other framing details. Make a canonical version 

## Example

    {
      "@context": {
        "security": "https://w3id.org/security#"
      },
      "hello": "world",
      "name": "signed/02.in.json",
      "security:proof": {
        "security:type": "https://models.consensas.com/security#ConsensasRSA2021",
        "security:proofPurpose": "assertionMethod",
        "security:created": "2021-01-18T10:10:26.179Z",
        "security:nonce": "123456789",
        "security:verificationMethod": "https://example.com/i/pat/keys/5",
        "security:jws": "eyJhbGciOiJSUzI1NiIsImtpZCI6Im5nc1FzdFVmMDlmTDhwTnRxZHk5V1ctX3BUM0R4TGpLYlF5ZGItR0xPN2cifQ..YwUnk6zLO6IT131fxotlNsiSSOmq9OFEOSS1T7rCv4W5DwxD77PiQirUKGIl9DLPMahtXfbie3tehScMD6sZJR62Oqf1LkskeovjzhLQTpVDD2AjugCljnZpNcSXtCGx6EqesDO47xkrgeexHPpXcw1WG3RUoqQEb6CeGfj5kiPYzWmfo7sYjaW0wpLiFgGGVK5UOGo1nsHgXgiqjOsjxXlTjLnHpLZUVpx0AMvkrPprltN0i_biLN3B3XF52ng9wyQBuOUQe7p334oju0y9WfhQWFAy0iR-SJpmYFmbCBfuuDjBkW3w9rpLgT-DR4WtW_lZnpuk7OZ8TXGY_KmzsQ"
      }
    }

