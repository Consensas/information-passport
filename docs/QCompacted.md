<a href="https://github.com/Consensas/information-passport/tree/main/docs"><img src="https://consensas-aws.s3.amazonaws.com/icons/passports-github.png" align="right" /></a>

# QName Compacted JSON-LD

We propose that data be, wherever possible, encoded in 
what we are calling "QName Compacted JSON-LD".

This is entirely proposed to make it easier to use JSON-LD
as a human and as a programmer, yet still get all the
semantic benefits from using JSON-LD.

The TL;DR is rather than using key like `name`, 
you use the [QName](https://en.wikipedia.org/wiki/QName) `schema:name` instead.

## Example

Consider this record:

    {
      "@context": "http://schema.org/",
      "@type": "Person",
      "schema:name": "Jane Doe",
      "jobTitle": "Professor",
      "telephone": "(425) 123-4567",
      "url": "http://www.janedoe.com"
    }

Here's the replace context

    {
      "@context": {
        "schema": "http://schema.org/"
       }
    }

And here's the QName Compacted JSON-LD

    {
      "@context": {
        "schema": "http://schema.org/"
      },
      "@type": "schema:Person",
      "schema:jobTitle": "Professor",
      "schema:name": "Jane Doe",
      "schema:telephone": "(425) 123-4567",
      "schema:url": {
        "@id": "http://www.janedoe.com"
      }
    }
