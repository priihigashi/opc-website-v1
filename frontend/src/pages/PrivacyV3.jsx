import FooterV2 from "@/components/FooterV2";
import { analyticsEnabled } from "@/lib/analytics";

// V3 corrects the Contact Enquiries section. V2 described a mail-app-only form,
// which stopped being true when /api/enquiries shipped: the form now submits to
// our own endpoint. The endpoint does not store message or contact details, but
// it does emit limited operational logs. This page states that distinction.
//
// The analytics wording reads the SAME build-time flag the analytics module
// uses, so the page physically cannot claim the site has no analytics while
// analytics is running, or advertise analytics that is switched off. Whichever
// way the site is built, this section describes what actually happens.
export default function PrivacyV3() {
  return (
    <div className="min-h-screen bg-[#09090B] pt-24 text-[#FAFAFA]">
      <main className="mx-auto max-w-4xl px-6 pb-24 pt-16 md:px-10 md:pb-32">
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#CBCC10]">Privacy</p>
        <h1 className="mt-5 font-head text-5xl uppercase leading-[0.92] sm:text-7xl">
          Your Information,
          <span className="block font-editorial normal-case">handled clearly.</span>
        </h1>

        <div className="mt-12 space-y-9 rounded-[22px] border border-white/10 bg-white/[0.045] p-6 text-base leading-relaxed text-white/75 backdrop-blur-xl sm:p-10">
          <section>
            <h2 className="font-head text-2xl uppercase text-white">Contact Enquiries</h2>
            <p className="mt-3">When you send the enquiry form, it goes to our website's own contact service, which emails it to us. This website does not store your message, name, email address, or phone number in a database or account. The email remains in our business inbox like any other message you send us. We use what you send only to answer you, and we do not sell it or share it for advertising.</p>
            <p className="mt-3">If our contact service is unavailable, the form opens your own email application with the details filled in instead, so nothing is lost. In that case your message is sent to us only if you choose to send it.</p>
          </section>
          <section>
            <h2 className="font-head text-2xl uppercase text-white">Keeping the Form Clean</h2>
            <p className="mt-3">To filter automated spam, apply rate limits, and diagnose delivery problems, our contact service keeps limited operational logs for each attempt. They may include the outcome, selected service, spam-check reasons, and a short, scrambled fingerprint of the connection rather than your IP address. These logs never contain your message, name, email address, or phone number.</p>
          </section>
          <section>
            <h2 className="font-head text-2xl uppercase text-white">Website Analytics</h2>
            {analyticsEnabled ? (
              <>
                <p className="mt-3">We use Google Analytics to understand how the website is used overall — which pages people read, and which of them lead to an enquiry. It helps us see what is useful and what is not.</p>
                <p className="mt-3"><strong className="text-white">We never send your enquiry to analytics.</strong> Your name, email address, phone number and the message you write are not shared with Google or any analytics provider. When an enquiry is sent we record only two things: which service was selected, and which page it was sent from.</p>
                <p className="mt-3">We also count two anonymous interactions: tapping our phone number, and clicking a &ldquo;start a project&rdquo; button. For each we record only where on the site it was tapped and which page you were on — never who tapped it.</p>
                <p className="mt-3">Advertising storage, advertising personalisation and advertising user data are switched off by default, so this data is not used to build an advertising profile of you or to follow you to other websites.</p>
              </>
            ) : (
              <p className="mt-3">This website is not currently running any analytics or measurement service. No analytics cookie is set and no usage data is sent to a third party.</p>
            )}
          </section>
          <section>
            <h2 className="font-head text-2xl uppercase text-white">Technical Information</h2>
            <p className="mt-3">Our hosting provider may process standard technical information—such as an IP address, browser type, device information, and request logs—to deliver, secure, and maintain the site. This website does not use advertising trackers, and it does not sell or share your information for advertising.</p>
          </section>
          <section>
            <h2 className="font-head text-2xl uppercase text-white">External Services</h2>
            <p className="mt-3">Links to email, phone, maps, reviews, or other third-party services open those providers. Their own privacy policies apply after you leave this website.</p>
          </section>
          <section>
            <h2 className="font-head text-2xl uppercase text-white">Questions</h2>
            <p className="mt-3">For privacy questions, email <a className="text-[#CBCC10] underline-offset-4 hover:underline" href="mailto:contact@oakpark-construction.com">contact@oakpark-construction.com</a>.</p>
          </section>
          <p className="border-t border-white/10 pt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">Last updated August 25, 2026</p>
        </div>
      </main>
      <FooterV2 />
    </div>
  );
}
