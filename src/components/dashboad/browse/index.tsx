import Filter from "../../filter/Filter";
import Songs from "../../song/Songs";
const BrowserComponent = () => {

    return (
        <>
            <div className="flex flex-col min-h-screen gap-6 mb-20 text-white bg-black/70 md:p-5 md:flex-row md:items-start">
                {/* <Filter className=" md:w-1/6 md:sticky md:top-0" /> */}
                <Songs className="md:w-full" />
            </div>
        </>
    )
}

export default BrowserComponent;