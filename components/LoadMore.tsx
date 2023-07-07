import { useRouter } from "next/navigation";
import {useSearchParams} from "next/navigation";
import Button from "./Button";

interface Props  {
    startCursor: string
    endCursor: string
    hasPreviousPage: boolean
    hasNextPage: boolean
}

const LoadMore = ({ startCursor, endCursor, hasPreviousPage, hasNextPage }: Props) => {
    const router = useRouter();
    const searchParams = useSearchParams()

    const isNextPage = hasNextPage || searchParams.get('startcursor')
    const handleNavigation = (type: string) => {
        const currentParams = new URLSearchParams(window.location.search);
        if (type === "prev" && hasPreviousPage) {
            currentParams.delete("endcursor");
            currentParams.set("startcursor", startCursor);
        } else if (type === "next" && isNextPage) {
            currentParams.delete("startcursor");
            currentParams.set("endcursor", endCursor);
        }

        const newSearchParams = currentParams.toString();
        console.log(newSearchParams)
        const newPathname = `${window.location.pathname}?${newSearchParams}`;

        router.push(newPathname);
    };

    return (
        <div className="w-full flexCenter gap-5 mt-10">
            {hasPreviousPage && <Button title="Previous" handleClick={() => handleNavigation('prev')} />}
            {isNextPage  && <Button title="Next" handleClick={() => handleNavigation('next')} />}
        </div>
    );
};

export default LoadMore;