<img src="https://consensas-aws.s3.amazonaws.com/icons/passports-github.png" align="right" />

# A schema.org description of a Hospital

This is a straight instantiation of [`schema:Hospital`](https://schema.org/Hospital).
Nothing clever is needed here at all, except that we 
recommend you use codes for Country and Region (if possible).

## Example

	{
        "@context": {
	        "schema:": "https://schema.org"
        },
        "@type": "schema:Hospital",
        "schema:name": "General Hospital",
        "schema:address": {
            "@type": "schema:PostalAddress",
            "schema:streetAddress": "21 Wingbat Way",
            "schema:addressCountry": "CA",
            "schema:addressRegion": "BC"
        }
    }
    
 

