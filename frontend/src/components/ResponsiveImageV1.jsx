import mediaManifest from "@/data/mediaManifestV1.json";

const toSrcSet = (items = []) => items.map(({ src, width }) => `${src} ${width}w`).join(", ");

export default function ResponsiveImageV1({ src, alt, sizes = "100vw", ...props }) {
  const cleanSource = src.split("?")[0];
  const variants = mediaManifest[cleanSource];

  if (!variants) return <img src={src} alt={alt} {...props} />;

  return (
    <picture>
      <source type="image/avif" srcSet={toSrcSet(variants.avif)} sizes={sizes} />
      <source type="image/webp" srcSet={toSrcSet(variants.webp)} sizes={sizes} />
      <img src={src} alt={alt} {...props} />
    </picture>
  );
}
