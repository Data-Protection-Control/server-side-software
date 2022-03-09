# ADPC server-side software

This repository provides a simple utility and example to help websites use [Advanced Data Protection Control (ADPC)](https://dataprotectioncontrol.org).

As explained in detail [specification][], ADPC defines two equivalent mechanisms: one based on HTTP headers, and one based on a JavaScript interface in the browser. For many websites, the JavaScript approach may be simpler to try out, and is therefore the one demonstrated in this repository.

## Usage

 1. Copy the script `adpc-request-consent.js` into your website and include it with a `<script>` tag. It will define a global function `AdpcRequestConsent`.
 2. Define one or more consent requests. Each such request must have the following attributes:
  - `id`: The [request identifier][] (a short string to identify this request)
  - `text`: The textual description of the data processing, required for obtaining legally valid consent.
  - `onConsent()`: A callback function that is triggered if the user consents to this processing. In this function you can initiate the processing.
  - `onWithdraw()`: A callback function that is triggered if the user withdraws their consent for this processing. In this function you can stop the processing, delete collected data, etc.
 3. Invoke `AdpcRequestConsent`, passing it the consent requests as an `Array`.

### Example

The below example requests consent for a single processing purpose:

    <!-- 1. Include the helper script -->
    <script src="adpc-request-consent.js"></script>

    <script>
    // 2. Define the request(s)
    const consentRequests = [
      {
        id: "content_recommendation",
        text: "Creating an interest profile based on the pages you visit, to recommend you more interesting content.",
        onConsent: () => {
          // …enable content personalisation here…
        },
        onWithdraw: () => {
          // …disable content personalisation here…
        },
      }
    ];

    // 3. Request consent.
    AdpcRequestConsent(consentRequests)
    </script>

See this example in context in [`src/example.html`](src/example.html).

## Testing it out

To test your website’s usage of ADPC, you could use the [browser extension][].

## See also

- This module by jucktnich uses ADPC, while also providing an in-page, cookie-based consent banner as fallback for browsers that do not support ADPC: <https://github.com/jucktnich/adpc-compatibility-mode>


[specification]: https://www.dataprotectioncontrol.org/spec/
[browser extension]: https://www.dataprotectioncontrol.org/prototype/
[request identifier]: https://www.dataprotectioncontrol.org/spec/#dfn-request-identifier
