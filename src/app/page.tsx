import { Title } from "@/components/title";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <Title />
      <ul className="list-disc list-inside flex flex-col gap-4">
        <li>@jean_mono</li>
        <li>@jean_mono</li>
        <li>@jean_mono</li>
        <li>@jean_mono</li>
      </ul>
      <Link
        href="/add"
        className="absolute bottom-0 left-0 w-full py-4 border-t text-4xl font-bold text-center"
      >
        +
      </Link>
    </>
  );
}
