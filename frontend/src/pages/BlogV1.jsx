// JSX adaptation of the blog body layout in TailGrids Play (MIT):
// blog-grids.html lines 238-319 and blog-details.html lines 322-453 at
// https://github.com/TailGrids/play-tailwind/tree/84814d9c2a33f09dbd449245dc6feb635049a649
// OPC navigation, footer, colors, fonts, images and article text are retained.
// See ../blog/TAILGRIDS_LICENSE.
import { Fragment, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import FooterV3 from "@/components/FooterV3";
import posts from "@/blog/posts.json";
import { articleBlocks } from "@/blog/figureBlocks.mjs";
import { orderedItems, tableRows } from "@/blog/markdownBlocks.mjs";

function Inline({ value }) {
  const parts = value.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, index) => {
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const external = /^https?:\/\//.test(link[2]);
      return <a key={index} href={link[2]} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} className="text-[#A1A300] underline underline-offset-4 hover:text-[#747600]">{link[1]}</a>;
    }
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index} className="font-semibold text-[#111113]">{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*")) return <em key={index}>{part.slice(1, -1)}</em>;
    return <Fragment key={index}>{part}</Fragment>;
  });
}

function ArticleBody({ post }) {
  const blocks = articleBlocks(post);
  return <div className="flow-root space-y-6 text-[16px] leading-[1.85] text-[#4D4D4A] md:text-[17px]">
    {blocks.map((item, index) => {
      if (item.type === "figure") {
        const layout = item.figure.layout || "wide";
        const placement = layout === "left" ? "lg:float-left lg:mr-8" : layout === "right" ? "lg:float-right lg:ml-8" : "";
        return <figure key={index} className={`!my-10 w-full ${layout === "wide" ? "clear-both" : `lg:w-[45%] ${placement}`}`}><img src={item.figure.src} alt={item.figure.alt} loading="lazy" decoding="async" className="w-full rounded-[5px] object-cover" /><figcaption className="mt-3 text-sm leading-relaxed text-[#66675F]">{item.figure.caption}</figcaption></figure>;
      }
      const block = item.text;
      if (block.startsWith("## ")) return <h2 key={index} className="!mt-12 clear-both font-head text-3xl font-semibold leading-tight text-[#111113]">{block.slice(3)}</h2>;
      if (block.startsWith("### ")) return <h3 key={index} className="!mt-9 clear-both font-head text-2xl font-semibold leading-tight text-[#111113]">{block.slice(4)}</h3>;
      const table = tableRows(block);
      if (table) return <div key={index} className="overflow-x-auto"><table className="w-full min-w-[560px] border-collapse text-left text-sm"><thead><tr>{table.header.map((cell, i) => <th key={i} className="border-b-2 border-[#CBCC10] p-3 align-top text-[#111113]"><Inline value={cell} /></th>)}</tr></thead><tbody>{table.rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j} className="border-b border-[#DAD9D2] p-3 align-top"><Inline value={cell} /></td>)}</tr>)}</tbody></table></div>;
      const ordered = orderedItems(block);
      if (ordered) return <ol key={index} className="list-decimal space-y-3 pl-6">{ordered.map((item, i) => <li key={i}><Inline value={item} /></li>)}</ol>;
      if (block.startsWith("- ")) return <ul key={index} className="list-disc space-y-3 pl-6">{block.split(/\n(?=- )/).map((item, i) => <li key={i}><Inline value={item.replace(/^- /, "").replace(/\n\s+/g, " ")} /></li>)}</ul>;
      return <p key={index}><Inline value={block.replace(/\n/g, " ")} /></p>;
    })}
  </div>;
}

function Card({ post }) {
  const excerpt = post.content.split(/\n\s*\n/)[0].replace(/\n/g, " ");
  return <article className="group">
    <div className="mb-8 overflow-hidden rounded-[5px]">
      <Link to={`/${post.slug}`} className="block">{post.image ? <img src={post.image} alt={post.imageAlt} loading="lazy" className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:rotate-2 group-hover:scale-110" /> : <div className="flex aspect-[16/10] flex-col justify-between bg-[#111113] p-8 text-[#F5F3EB]"><span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#CBCC10]">Oak Park Construction / Journal</span><span className="max-w-md font-head text-3xl leading-tight">{post.title}</span></div>}</Link>
    </div>
    <p className="mb-6 inline-block rounded-[5px] bg-[#CBCC10] px-4 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-[#09090B]">{post.date}</p>
    <h2 className="mb-4 font-head text-[27px] font-semibold leading-tight text-[#111113]"><Link to={`/${post.slug}`} className="hover:text-[#747600]">{post.title}</Link></h2>
    <p className="max-w-[370px] text-base leading-relaxed text-[#55564F]">{excerpt}</p>
    <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#73746D]">{post.category}</p>
  </article>;
}

export default function BlogV1() {
  const { pathname } = useLocation();
  const slug = pathname === "/blog" ? null : pathname.slice(1);
  const post = posts.find((item) => item.slug === slug);
  useEffect(() => { window.scrollTo(0, 0); }, [post]);
  return <div className="min-h-screen bg-[#F5F3EB] font-body">
    <main className="pt-[4.5rem]">
      <div className="border-b border-[#DAD9D2] bg-[#EEEDE6]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#66675F]">Oak Park Construction / Journal</p>
          <h1 className="mt-5 max-w-4xl font-head text-5xl font-semibold leading-[1.04] tracking-tight text-[#111113] md:text-7xl">{post ? post.title : "Ideas for building well."}</h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#55564F]">{post ? `${post.category} · By ${post.author}` : "Practical guidance for planning, building and improving a South Florida home."}</p>
        </div>
      </div>
      {slug && !post ? <div className="mx-auto max-w-7xl px-6 py-20 md:px-10"><h2 className="font-head text-3xl text-[#111113]">Article unavailable</h2><Link className="mt-5 inline-block underline" to="/blog">Back to blog</Link></div> : post ?
        <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-20">
          <Link to="/blog" className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#66675F] hover:text-[#111113]">← All articles</Link>
          <div className={post.image ? "relative mt-8 h-[300px] overflow-hidden rounded-[5px] md:h-[400px] lg:h-[500px]" : "relative mt-8 flex min-h-[180px] items-end rounded-[5px] bg-[#111113]"}>
            {post.image && <img src={post.image} alt={post.imageAlt} className="h-full w-full object-cover" />}
            <div className={post.image ? "absolute inset-0 flex items-end bg-gradient-to-t from-[#09090B]/85 via-transparent to-transparent p-5 text-white sm:p-8" : "p-6 text-white sm:p-8"}>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em]">By {post.author} <span className="mx-3">·</span> {post.date}</p>
            </div>
          </div>
          <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(220px,1fr)]">
            <article className="min-w-0"><ArticleBody post={post} /></article>
            <aside className="h-fit border-t-2 border-[#CBCC10] bg-white p-7 text-sm leading-relaxed text-[#55564F] lg:sticky lg:top-28"><p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#111113]">About this article</p><p className="mt-5">By Oak Park Construction</p><p className="mt-2">Published {post.date}</p><p className="mt-5">Practical guidance for planning and building in South Florida. Project requirements vary by address and scope.</p><Link to="/portfolio" className="mt-6 inline-block font-mono text-[11px] uppercase tracking-[0.15em] text-[#737500] underline underline-offset-4">See our work</Link></aside>
          </div>
        </div> :
        <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:py-[120px]"><div className="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">{posts.map((item) => <Card key={item.slug} post={item} />)}</div></section>}
    </main>
    <div className="bg-[#09090B] text-[#FAFAFA]"><FooterV3 /></div>
  </div>;
}
