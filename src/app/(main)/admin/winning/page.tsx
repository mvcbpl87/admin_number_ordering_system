import WinningUI from "./components/winning-ui";

export const revalidate = 0;
export default function WinningPage(){
    return(
        <div className="flex flex-col flex-1 flex-grow gap-2 bg-muted/40 p-4  md:p-10">
        <WinningUI/>
      </div>
    )
}