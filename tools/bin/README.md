# tools/bin

Note the difference between _validation_ and _verification_. 
Verification is the first step, it just confirms that a document
is signed.

Validation takes a verified document and ensures it has required
promises _and_ it checks that the public key belongs to a trusted source.
Validation in the Open Source code is a work in progress, stand by.

Test the validation tool

    node validate.js 'https://consensas.world/did:cns:ABHEZDOYLE' --pretty

Play with Barcode Scanner on a raspberry pi

    nohup python scanner.py

Put the two of them together to scan and verify

    nohup sh scanner.sh

Sign a document (note key has to be decrypted)

    node sign.js --in ../data/example-vaccination.json --key ../data/private.key.pem

Also works from stdin

    cat ../data/example-vaccination.json | node sign.js --key ../data/private.key.pem


