# tools/bin

Note the difference between _validation_ and _verification_. 
Verification is the first step, it just confirms that a document
is signed.

Validation takes a verified document and ensures it has required
promises _and_ it checks that the public key belongs to a trusted source.
Validation in the Open Source code is a work in progress, stand by.

## Build Sample Website

    node generate-vaccinations.js \
        --verifier 'https://gist.githubusercontent.com/dpjanes/d2e3b972f56e73c8a85b7cc983c9114e/raw/6fe7f11e19478241e61fce8e36b2f2ba626a9fd0/public.cer.pem' \
        --key ../data/private.key.pem \
		--issuer "https://passport.consensas.com" \
        --host 'passport.consensas.com'

## Tools
### Validation
Test the validation tool - this will go out the internet, fetch 
a signed document, it's validator and tell the result

    node validate.js 'https://consensas.world/did:cns:ABHEZDOYLE' --pretty

### Sign and Verify

Sign a document. Note key has to be decrypted, and that the public key chain
has to be found at the URL

    node sign.js \
		--file ../data/example-vaccination.json \
		--key ../data/private.key.pem \
		--verifier "https://example.org/public.cer.pem"

If you just want to play with tool and don't have the public keychain
upload somewhere, leave out the `--verifier` option. 
However, you'll have to specify it in the verify tool

`sign` also works on stdin

    cat ../data/example-vaccination.json | 
	node sign.js --key ../data/private.key.pem 

To verify a document

    node verify.js --file signed.json 

Or if you need to manually specify the verifier

    node verify.js --file signed.json --verifier ../data/public.cer.pem

Or if you want to use stdin

    cat signed.json | node verify.js --verifier ../data/public.cer.pem

Here's an example of a round-trip 

    cat ../data/example-vaccination.json | 
    node sign.js --key ../data/private.key.pem | 
    node verify.js --verifier ../data/public.cer.pem

### Scanners

Play with Barcode Scanner on a raspberry pi

    nohup python scanner.py

Put the two of them together to scan and verify

    nohup sh scanner.sh
