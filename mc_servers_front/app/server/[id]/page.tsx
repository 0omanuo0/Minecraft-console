
export default function Servers({ params }: { params: { id: string } }) {

    return (
        <section className="space-y-8">
            <div className="h-auto w-full bg-neutral-200 shadow-inner px-2 py-6 rounded-lg grid">
                <nav id="base" className="relative hidden lg:flex  ml-auto pr-20">
                    {/* <div className="h-div">
                                <a>Autoscroll:</a>
                                <label className="switch">
                                    <input type="checkbox" id="scroll" checked={true}>
                                        
                                    </input>
                                </label>
                            </div> */}
                </nav>
                <div className="h-[50vh] overflow-y-scroll border p-4" id="log_data">
                </div>
            </div>
            <div className="w-full">
                <form id="command-form" className="mb-4">
                    <input type="text" id="content" name="content" autoComplete="off"
                        className="w-full relative bg-gray-50 ring-0 outline-none border border-neutral-500 text-neutral-900 placeholder-violet-700 text-sm rounded-lg focus:ring-violet-500  focus:border-violet-500 block p-2.5 checked:bg-emerald-500"
                        placeholder="Command...">
                    </input>
                </form>
                <div id="autoOPT" className="cursor-div">
                    <ul className="list-none">
                        <li className="list_opt" id="OPTIONS"></li>
                    </ul>
                </div>
            </div>
        </section>
    )

}