
export default function ServerListSkeleton() {

    return (
        <section className=" bg-neutral-100 rounded-lg px-20 py-10 space-y-4">
            <div className=" border-b-2 text-black">
                <div className="h-10 w-5 rounded-md bg-gray-200" />
            </div>
            <ul>
            <li key={1} className=" hover:border-l-2 pl-6 text-white hover:opacity-80 transition-opacity duration-300">
                <div className=" flex">
                    <div className="h-5 w-5 rounded-md bg-gray-200" />
                    <div className="ml-2 h-6 w-16 rounded-md bg-gray-200 text-sm font-medium" />
                </div>
            </li>
            <li key={2} className=" hover:border-l-2 pl-6 text-white hover:opacity-80 transition-opacity duration-300">
                <div className=" flex">
                    <div className="h-5 w-5 rounded-md bg-gray-200" />
                    <div className="ml-2 h-6 w-16 rounded-md bg-gray-200 text-sm font-medium" />
                </div>
            </li>
            <li key={3} className=" hover:border-l-2 pl-6 text-white hover:opacity-80 transition-opacity duration-300">
                <div className=" flex">
                    <div className="h-5 w-5 rounded-md bg-gray-200" />
                    <div className="ml-2 h-6 w-16 rounded-md bg-gray-200 text-sm font-medium" />
                </div>
            </li>
            </ul>
        </section>
    );
}