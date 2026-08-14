import Image from "next/image";

/**
 * Renders a real product photo when one is set, otherwise the CSS-only
 * glass "bottle" placeholder — never a broken <img> or an empty box.
 */
export default function ProductImage({
  src,
  alt,
  className = "",
  sizes,
  fill = true,
}: {
  src?: string | null;
  alt: string;
  className?: string;
  sizes?: string;
  fill?: boolean;
}) {
  if (!src) {
    return <div className={`product-silhouette ${className}`} />;
  }

  if (fill) {
    // `className` must establish both a position context (`relative` or
    // `absolute inset-0` against an already-positioned parent) and a size
    // (explicit dimensions or `aspect-*`) — next/image's `fill` sizes
    // itself against this element, not the other way around.
    return (
      <div className={`overflow-hidden ${className}`}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes ?? "(max-width: 640px) 50vw, 300px"}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={400}
      height={500}
      sizes={sizes}
      className={`object-cover ${className}`}
    />
  );
}
