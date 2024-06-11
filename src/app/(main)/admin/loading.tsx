import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-grow  items-center justify-center ">
      <div className="p-10">
        {" "}
        <Loader className="animate-spin" />
      </div>
    </div>
  );
}
