/**
 * Renders a verified portfolio image as AVIF -> WebP -> JPEG, driven entirely by the
 * T-203 export manifest. Never invents a filename and never guesses a dimension.
 *
 * `image.w` / `image.h` are the REAL pixel dimensions of the largest derivative, so the
 * browser reserves the correct box and nothing shifts as it loads. The previous
 * implementation hard-coded 1800x1013 on every image, which mis-declared the shape of
 * all 34 portrait photographs.
 */
function srcSet(image, ext) {
  return image.widths.map((w) => `${image.src}-${w}w.${ext} ${w}w`).join(", ");
}

function fallbackSrc(image) {
  const mid = image.widths[Math.min(1, image.widths.length - 1)];
  return `${image.src}-${mid}w.jpg`;
}

export default function PortfolioPicture({ image, sizes, className = "", eager = false, style, pictureClassName = "block h-full w-full" }) {
  // <picture> is an inline wrapper by default, so an h-full <img> inside it has no
  // resolved height to work against and renders at its intrinsic aspect — overflowing
  // its box and sliding under the caption. Making the wrapper a block that fills the
  // container is what gives h-full something real to resolve against.
  return (
    <picture className={pictureClassName}>
      <source type="image/avif" srcSet={srcSet(image, "avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(image, "webp")} sizes={sizes} />
      <img
        src={fallbackSrc(image)}
        srcSet={srcSet(image, "jpg")}
        sizes={sizes}
        width={image.w}
        height={image.h}
        alt={image.alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        fetchpriority={eager ? "high" : undefined}
        className={className}
        style={style}
        data-testid="portfolio-picture"
        data-phase={image.phase}
        data-orientation={image.orientation}
      />
    </picture>
  );
}
