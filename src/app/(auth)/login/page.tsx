import { UserAuthForm } from "@/components/form/user-auth-form";
import Image from "next/image";
const _constant = {
  imageUrl:
    "https://images.unsplash.com/photo-1609510038916-9328a3c86966?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  alt: "background-image",
  size: "flex flex-grow h-screen w-full",
};
export default function LoginForm({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  return (
    <div className="min-h-screen  flex items-center relative">
      <Image
        fill
        src={_constant.imageUrl}
        alt={_constant.alt}
        className="absolute w-full h-full "
      />
      <div className="absolute w-full h-full bg-black/30 " />
      <UserAuthForm searchParams={searchParams} className="z-[100]" />
    </div>
  );
}
