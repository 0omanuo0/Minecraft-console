import ConfigOpts from "@/components/server/config_opt";
import { getServer } from "@/lib/get_server_data"
import { sendConfig } from "@/lib/pushServerData";
import { useFormStatus } from "react-dom";
import { CheckIcon } from "@heroicons/react/24/outline";

export default async function Servers({ params }: { params: { id: string } }) {
    const server = await getServer(params.id);
    if (!server) return <></>;

    // const formData = useFormStatus().data;


    return (
        <section>
            <form
                action={
                    async (formData: FormData) => {
                        "use server";
                        sendConfig(formData, params.id)
                    }
                }
                className="bg-neutral-100 rounded-lg px-20 py-10 space-y-4"
            >
                <div className="flex border-b-2 px-10 -mx-10 pb-4 items-center mb-10">
                    <h1 className="text-2xl text-black">Configuration</h1>
                    <nav id="base" className="relative hidden lg:flex items-center ml-auto pr-10 ">
                        <button type="submit"
                            className=" bg-[#6cabad] hover:bg-[#0E8388] duration-300 transition-colors p-3 px-4 rounded-xl h-fit text-red-50 shadow-lg tracking-wide"
                            ><CheckIcon className="w-6"/></button>
                    </nav>
                </div>
                <ul key={"optList"} className=" text-neutral-600 list-none grid grid-cols-1 lg:grid-cols-2 grid-flow-row gap-3 items-center">
                    <ConfigOpts default_values={server.config}></ConfigOpts>
                </ul>
            </form>
        </section>
    )
}
