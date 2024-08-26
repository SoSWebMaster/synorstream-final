import Filter from "../../filter/Filter";
import Songs from "../../song/Songs";

const FavoritesComponent=()=>{
    return (
        <>
            <div className="flex min-h-screen gap-6 mb-20 text-white bg-black/70 md:p-5 ">
               <Filter className=" md:w-1/6 md:sticky md:top-0" />
               <Songs className="md:w-5/6" />
            </div>
        </>
    )
}

export default FavoritesComponent;