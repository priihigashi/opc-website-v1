import ContactV8 from "./ContactV8";

// Release-safe contact version. V5 and V6 stay intact for comparison and
// rollback; this routed version removes the unverified response-time promise.
export default function ContactV9() {
  return (
    <ContactV8
      kickerClassName="contact-kicker-v2"
      metaClassName="text-[#09090B]/82"
      phoneClassName="font-semibold"
      addressClassName="font-semibold text-[#09090B]"
      successMessage="Thank you — your enquiry was sent to Oak Park Construction."
    />
  );
}
