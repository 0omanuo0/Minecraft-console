import ConfigOpts from "@/components/server/config_opt";
import { getServer } from "@/lib/get_server_data"

export default async function Servers({ params }: { params: { id: string } }) {
    const server = await getServer(params.id);
    console.log(server);
    if (!server) return <></>;
    return (
        <section>
            <form method="post"  className=" bg-neutral-100 rounded-lg px-20 py-10 space-y-4">
                <div className="flex border-b-2 pb-4">
                    <h1 className="text-2xl text-black">Configuration</h1>
                    <nav id="base" className="relative hidden lg:flex items-center ml-auto pr-20">
                        <button type="submit"
                            className=" bg-[#6cabad] hover:bg-[#0E8388] duration-300 transition-colors px-6 rounded-xl h-fit pt-1 pb-2 text-red-50 shadow-lg tracking-wide">Apply</button>
                    </nav>
                </div>
                <ConfigOpts default_values={server.config}></ConfigOpts>
            </form>
        </section>
    )

}