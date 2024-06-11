import Image from "next/image";

export const IconImage = ({ alt, src }: { alt?: string; src?: string }) => {
  const style = `rounded-lg w-6 h-6 relative`;
  const img = "rounded-full border border-black/20";
  if (!alt || !src) return;
  return (
    <div className={style}>
      <Image
        fill
        priority
        className={img}
        alt={alt}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        style={{ objectFit: "contain" }}
        src={src}
      />
    </div>
  );
};
