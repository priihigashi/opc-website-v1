import ContactV5 from "./ContactV5";

// Release-safe contact version. V5 and V6 stay intact for comparison and
// rollback; this routed version removes the unverified response-time promise.
export default function ContactV7() {
  return (
    <ContactV5
      kickerClassName="contact-kicker-v2"
      metaClassName="text-[#09090B]/82"
      phoneClassName="font-semibold"
      addressClassName="font-semibold text-[#09090B]"
      successMessage="Thank you — your enquiry was sent to Oak Park Construction."
    />
  );
}
