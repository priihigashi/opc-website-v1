import FooterV3 from "@/components/FooterV3";
import { analyticsEnabled } from "@/lib/analytics";

// V6 reflects the launched lead log: valid enquiries are copied to OPC's
// private Google Sheet as well as delivered by email.
export default function PrivacyV6() {
  return (
    <div className="min-h-screen bg-[#09090B] pt-24 text-[#FAFAFA]">
      <main className="mx-auto max-w-4xl px-6 pb-24 pt-16 md:px-10 md:pb-32">
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#CBCC10]">Privacy</p>
        <h1 className="mt-5 font-head text-5xl uppercase leading-[0.92] sm:text-7xl">Your Information,<span className="block font-editorial normal-case">handled clearly.</span></h1>
        <div className="mt-12 space-y-9 rounded-[22px] border border-white/10 bg-white/[0.045] p-6 text-base leading-relaxed text-white/75 backdrop-blur-xl sm:p-10">
          <section><h2 className="font-head text-2xl uppercase text-white">Contact Enquiries</h2><p className="mt-3">When you use the enquiry form, the information you enter first goes through our website&apos;s validation and spam controls. Valid enquiries are saved in Oak Park Construction&apos;s private Google Workspace lead log and delivered to our business inbox so our team can respond and track follow-up.</p><p className="mt-3">The lead log may contain your submission time, name, email address, optional phone number, service choice, message and the page where you sent the form. Access is limited to authorized Oak Park Construction team members.</p>{process.env.REACT_APP_WEB3FORMS_KEY ? <p className="mt-3">Web3Forms also receives those submitted details to deliver the enquiry to our business inbox and may store them under its privacy policy. Its published maximum is three years unless a shorter plan period applies or the information is deleted earlier. See the <a className="text-white underline decoration-white/35 underline-offset-4 transition hover:decoration-white" href="https://web3forms.com/privacy" target="_blank" rel="noreferrer">Web3Forms Privacy Policy</a>.</p> : <p className="mt-3">Our contact service delivers the enquiry to our business inbox when direct email delivery is available.</p>}<p className="mt-3">We use what you send to answer and manage your enquiry. We do not sell it or share it for advertising.</p></section>
          <section><h2 className="font-head text-2xl uppercase text-white">Keeping the Form Clean</h2><p className="mt-3">To filter automated spam, apply rate limits and diagnose delivery problems, our contact service keeps limited operational logs for each attempt. They may include the outcome, selected service, spam-check reasons and a short, scrambled fingerprint of the connection rather than your IP address. These logs never contain your message, name, email address or phone number.</p></section>
          <section><h2 className="font-head text-2xl uppercase text-white">Website Analytics</h2>{analyticsEnabled ? <><p className="mt-3">We use Google Analytics to understand how the website is used overall, including which pages people read and which pages lead to an enquiry.</p><p className="mt-3"><strong className="text-white">We never send your enquiry to analytics.</strong> Your name, email address, phone number and message are not shared with Google Analytics. When an enquiry is sent, analytics records only the selected service and source page.</p><p className="mt-3">Advertising storage, advertising personalization and advertising user data are switched off by default.</p></> : <p className="mt-3">This website is not currently running any analytics or measurement service.</p>}</section>
          <section><h2 className="font-head text-2xl uppercase text-white">Technical Information</h2><p className="mt-3">Our hosting and service providers may process standard technical information such as an IP address, browser type, device information and request logs to deliver, secure and maintain the site.</p></section>
          <section><h2 className="font-head text-2xl uppercase text-white">Questions</h2><p className="mt-3">For privacy questions, email <a className="text-[#CBCC10] underline-offset-4 hover:underline" href="mailto:contact@oakpark-construction.com">contact@oakpark-construction.com</a>.</p></section>
          <p className="border-t border-white/10 pt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">Last updated September 8, 2026</p>
        </div>
      </main><FooterV3 />
    </div>
  );
}
