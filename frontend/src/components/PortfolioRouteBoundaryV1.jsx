import { Component } from "react";
import { useLocation } from "react-router-dom";

class PortfolioRouteErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidUpdate(previousProps) {
    if (this.state.error && previousProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <main className="flex min-h-screen items-center justify-center bg-[#09090B] px-6 pb-20 pt-32 text-[#FAFAFA]">
        <section className="w-full max-w-xl rounded-[22px] border border-white/12 bg-white/[0.045] p-7 text-center shadow-[0_30px_100px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:p-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#CBCC10]">Portfolio loading pause</p>
          <h1 className="mt-5 font-head text-4xl uppercase sm:text-5xl">This page did not finish loading.</h1>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-white/70">
            The project photographs are safe. Reload this page to reconnect to the latest website files.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-full bg-[#CBCC10] px-6 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#09090B]"
            >
              Reload page
            </button>
            <button
              type="button"
              onClick={() => window.location.assign("/portfolio")}
              className="rounded-full border border-white/25 px-6 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white transition-colors hover:border-white/50"
            >
              Return to portfolio
            </button>
          </div>
        </section>
      </main>
    );
  }
}

export default function PortfolioRouteBoundaryV1({ children }) {
  const location = useLocation();
  const resetKey = `${location.pathname}${location.search}${location.hash}`;

  return (
    <PortfolioRouteErrorBoundary resetKey={resetKey}>
      {children}
    </PortfolioRouteErrorBoundary>
  );
}
