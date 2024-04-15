import { States } from "@/lib/types";



export default function StateSidebar({state,}: Readonly<{state: States;}> ) {
    switch (state) {
        case States.Offline:
            return <Offline />;
        case States.Online:
            return <Online />;
        case States.Idle:
            return <Idle />;
        default:
            return <span>Error</span>;
    }
}


function Offline(){
    return (<span className=" ml-2 text-red-900">[ Offline ]</span>);
}

function Online(){
    return (<span className=" ml-2 text-green-800">[ Online ]</span>);
}

function Idle(){
    return (<span className=" ml-2 text-yellow-800">[ Idle ]</span>);
}