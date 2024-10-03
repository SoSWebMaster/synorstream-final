import Songs from "../../song/Songs";
const BrowserComponent2 = () => {

    return (
        <>
            <div className="flex flex-col min-h-screen gap-6 mb-20 text-white bg-black/70 md:p-5 md:flex-row md:items-start">
                <Songs className="md:w-full" />
            </div>
        </>
    )
}

export default BrowserComponent2;