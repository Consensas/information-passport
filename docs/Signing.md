# ConsensasRSA2021 signing standard

The ConsensasRSA2021 is based on W3C's [Linked Data Proofs](https://w3c-ccg.github.io/ld-proofs/).
The core difference is that ConsensasRSA2021 does not depend on *Linked Data* or 
JSON-LD, though it should be fully compatible with it

## Details
### Canonical JSON

Canonical JSON is defined by [RFC8785](https://tools.ietf.org/html/rfc8785).
It ensures that given any JSON message, we can create exactly the same
representation.

## QName Compacted JSON-LD

See [QCompacted](QCompacted.md). 
The proof SHOULD (maybe MUST?) be encoded using QName Compacted JSON-LD.

## JOSE

[Javascript Object Signing and Encryption](https://datatracker.ietf.org/wg/jose/documents/) 
is used for [JSON Web Signatures RFC 7515](https://datatracker.ietf.org/doc/rfc7515/).

Also see Node.JS [implementation](https://www.npmjs.com/package/node-jose).

### Signing Algorithm

* ensure "@context" contains `"security": "https://w3id.org/security#"`
* remove `security:proof` from message
* make a canonical version of message
* create proof without signature, e.g. containing `security:created` and `security:nonce`,
  plus all the other framing details. 
* make a canonical version of the proof
* sign _canonical message_ "\n" _canonical proof_ using JOSE JWS RS256
* detach the payload from the proof (the middle bit, between the "."s)
* add the signature to the proof

### Verifying Algorithm

* detach proof from message
* detail JWS from proof
* using the signing algorithm, rebuild the canonical message and canonical proof
* using the `verificationMethod`, retrieve the complete Public Key PEM
* rebuild the JWS and compare to the one that came in the proof

### Components of `security:proof`

* `security:type` - always "https://models.consensas.com/security#ConsensasRSA2021"
* `security:proofPurpose` - always `assertionMessage`
* `security:created` - a UTC ISO Time
* `security:nonce` - a randomly generated string, to prevent replays 
* `security:verificationMethod` - the place to get the Public Key - the complete chain - to verify the JWS, in PEM format
  (consider allowing JSON serialization). The leaf key should be first, the CA/Root key last.
* `security:jws` - the detached JWS signature, as computed by the algorthm

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

