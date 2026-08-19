import Footer from "@/components/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#09090B] pt-24 text-[#FAFAFA]">
      <main className="mx-auto max-w-4xl px-6 pb-24 pt-16 md:px-10 md:pb-32">
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#CBCC10]">
          Privacy
        </p>
        <h1 className="mt-5 font-head text-5xl uppercase leading-[0.92] sm:text-7xl">
          Your Information,
          <span className="block font-editorial normal-case">handled clearly.</span>
        </h1>

        <div className="mt-12 space-y-9 rounded-[22px] border border-white/10 bg-white/[0.045] p-6 text-base leading-relaxed text-white/75 backdrop-blur-xl sm:p-10">
          <section>
            <h2 className="font-head text-2xl uppercase text-white">Contact Enquiries</h2>
            <p className="mt-3">
              This website does not create customer accounts or store contact-form submissions.
              The enquiry button opens your own email application. Your message is sent to Oak Park
              Construction only if you choose to send it.
            </p>
          </section>

          <section>
            <h2 className="font-head text-2xl uppercase text-white">Technical Information</h2>
            <p className="mt-3">
              Our hosting provider may process standard technical information—such as an IP address,
              browser type, device information, and request logs—to deliver, secure, and maintain the site.
              This website does not currently use advertising trackers or marketing cookies.
            </p>
          </section>

          <section>
            <h2 className="font-head text-2xl uppercase text-white">External Services</h2>
            <p className="mt-3">
              Links to email, phone, maps, reviews, or other third-party services open those providers.
              Their own privacy policies apply after you leave this website.
            </p>
          </section>

          <section>
            <h2 className="font-head text-2xl uppercase text-white">Questions</h2>
            <p className="mt-3">
              For privacy questions, email{" "}
              <a className="text-[#CBCC10] underline-offset-4 hover:underline" href="mailto:contact@oakpark-construction.com">
                contact@oakpark-construction.com
              </a>.
            </p>
          </section>

          <p className="border-t border-white/10 pt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
            Last updated August 19, 2026
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
