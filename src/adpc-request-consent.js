// This script helps using ADPC’s JavaScript-based approach to request the visitor’s consent.

async function AdpcRequestConsent(consentRequests) {
  // Test for ADPC support.
  if (!navigator.dataProtectionControl) {
    throw new Error('ADPC is not supported by the browser.');
  }

  // Treat a single request as an array containing one request.
  if (!(consentRequests instanceof Array)) consentRequests = [consentRequests];

  const givenConsent = new Set;

  // The ADPC browser interface needs the 'id' and 'text' of each request:
  const consentRequestsList = consentRequests.map(request => ({
    id: request.id,
    text: request.text,
  }));

  // Request the user’s consent decisions
  const userDecisions = await navigator.dataProtectionControl.request(consentRequestsList);

  // Handle the initial response of user decisions.
  updateUserDecisions(userDecisions);

  // Keep listening for any changes to the user’s decisions.
  navigator.dataProtectionControl.addEventListener('decisionchange', (event) => {
    updateUserDecisions(event.userDecisions);
  });

  function updateUserDecisions(userDecisions) {
    // For each consent request we make, check if the decision changed.
    for (const request of consentRequests) {
      if (userDecisions.consent?.includes(request.id)) {
        // This request is consented to…
        if (!givenConsent.has(request.id)) {
          // …but was not consent to previously: handle the change.
          givenConsent.add(request.id);
          request.onConsent();
        }
      } else {
        // This request is not consented to…
        if (givenConsent.has(request.id)) {
          // …but was consented to previously: handle the change.
          // (no need to separately check the 'withdraw' list: no longer
          // getting consent implies the user withdrew consent)
          givenConsent.delete(request.id);
          request.onWithdraw();
        }
      }
    }
  }
}
