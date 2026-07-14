import Image from "next/image";
import Link from "next/link";

export default function SiteHeader({
  headerRef,
}: {
  headerRef?: React.Ref<HTMLElement>;
}) {
  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-10 border-b border-black/10 bg-white/90 backdrop-blur"
    >
      <div className="flex items-center px-6 py-4">
        <Link href="/form" aria-label="Halkin home">
          <Image
            src="/halkinLogo.svg"
            alt="Halkin"
            width={132}
            height={30}
            priority
            className="h-7 w-auto"
          />
        </Link>
      </div>
    </header>
  );
}
