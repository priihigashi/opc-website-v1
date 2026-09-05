import { interpretResponse, networkFallback } from "./contactSubmit.js";

const ENDPOINT = "/api/enquiries";
const failedDelivery = () => interpretResponse(502, {});
const readBody = async (response) => {
  const body = await response.json().catch(() => null);
  return body && typeof body === "object" && !Array.isArray(body) ? body : {};
};

async function postViaWeb3Forms(payload, { accessKey, page, fetchImpl }) {
  try {
    const response = await fetchImpl("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `New enquiry — ${payload.service || "Oak Park Construction"}`,
        from_name: "Oak Park Construction website",
        name: payload.name,
        email: payload.email,
        phone: payload.phone || "",
        service: payload.service || "",
        message: payload.message || "",
        page,
      }),
    });
    const body = await readBody(response);
    return response.ok && body.success === true ? { kind: "sent" } : failedDelivery();
  } catch {
    return failedDelivery();
  }
}

// The provider is called only after the first-party validation/spam response.
// There is deliberately no automatic retry: a network failure may follow delivery.
export async function postEnquiry(payload, { accessKey = "", page = "", fetchImpl = fetch } = {}) {
  let response;
  try {
    response = await fetchImpl(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, deliveryProvider: accessKey ? "web3forms" : "smtp" }),
    });
  } catch {
    return networkFallback();
  }
  const body = await readBody(response);
  if (response.ok && body.code === "validated") {
    if (!accessKey) return networkFallback();
    return postViaWeb3Forms(payload, { accessKey, page, fetchImpl });
  }
  return interpretResponse(response.status, body);
}
