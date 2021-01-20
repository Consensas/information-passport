# Signing and Verification: ConsensasRSA2021

The ConsensasRSA2021 is based on W3C's [Linked Data Proofs](https://w3c-ccg.github.io/ld-proofs/).
The core difference is that ConsensasRSA2021 **does not** depend on Linked Data or 
JSON-LD, though fully compatible with it.

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

Here is an example of a signed message

    {
        "@context": {
            "security": "https://w3id.org/security#"
        },
        "hello": "world",
        "security:proof": {
            "security:type": "https://models.consensas.com/security#ConsensasRSA2021",
            "security:proofPurpose": "assertionMethod",
            "security:created": "2021-01-20T13:03:45.450Z",
            "security:nonce": "14182305723832145",
            "security:verificationMethod": "https://example.org/public.cer.pem",
            "security:jws": "eyJhbGciOiJSUzI1NiIsImtpZCI6Im5nc1FzdFVmMDlmTDhwTnRxZHk5V1ctX3BUM0R4TGpLYlF5ZGItR0xPN2cifQ..Np4accZ6rX8N5MFXCYZEaVral45DhGwp2WEsMbsxrIacirruNml8auArmImYo8M57m3cyl8tf8d5wXCwx-1KwijT_uvkAl-v8CBcQU_2CmpJ-WrKvMlcHMm21-LAnxn2bqWnsgWDHX2W2buwDZTIZTfXrAQBl-5Ofa43GccU3TXin5i6feLXc8VVRC89D5kP45kjltSnXdS6cD3ZCjCDJLFLaWb-khaxENK_LrADRm2Zt3r7x-dXsKaKLxtyjYzNg005g5Ws528V6xWfZs5OKOys1VdYLH-1iVApCUGoC6ijlSN2F9CpNrStbGRxrqg-3gTy6zwxp9DOkSp8H7SUtQ"
        }
    }

You can recreate this yourself:
    
	cd information-passport/tools/bin
    node sign.js \
    	--file ../data/hello.json \
    	--key ../data/private.key.pem \
    	--verifier "https://example.org/public.cer.pem"
    	

Here is that message validated (normative format)

    {
        "proof": {
            "type": "https://models.consensas.com/security#ConsensasRSA2021",
            "proofPurpose": "assertionMethod",
            "created": "2021-01-20T13:03:45.450Z",
            "nonce": "14182305723832145",
            "verificationMethod": "https://example.org/public.cer.pem",
            "jws": "eyJhbGciOiJSUzI1NiIsImtpZCI6Im5nc1FzdFVmMDlmTDhwTnRxZHk5V1ctX3BUM0R4TGpLYlF5ZGItR0xPN2cifQ..Np4accZ6rX8N5MFXCYZEaVral45DhGwp2WEsMbsxrIacirruNml8auArmImYo8M57m3cyl8tf8d5wXCwx-1KwijT_uvkAl-v8CBcQU_2CmpJ-WrKvMlcHMm21-LAnxn2bqWnsgWDHX2W2buwDZTIZTfXrAQBl-5Ofa43GccU3TXin5i6feLXc8VVRC89D5kP45kjltSnXdS6cD3ZCjCDJLFLaWb-khaxENK_LrADRm2Zt3r7x-dXsKaKLxtyjYzNg005g5Ws528V6xWfZs5OKOys1VdYLH-1iVApCUGoC6ijlSN2F9CpNrStbGRxrqg-3gTy6zwxp9DOkSp8H7SUtQ"
        },
        "payload": {
            "@context": {
             	"security": "https://w3id.org/security#"
            },
            "hello": "world"
        },
        "chain": [
            {
                "C": "CA",
                "CN": "davidjanes.com",
                "fingerprint": "78:EA:E2:A5:19:FD:A8:35:56:2D:59:B7:B7:20:32:6C:F6:EC:53:E0"
            }
        ]
    }
    
You can recreate this yourself:

	cd information-passport/tools/bin
	node verify.js --file signed.json --verifier ../data/public.cer.pem






