import ChatView from "@/components/workspace/ChatView";
import CodeView from "@/components/workspace/CodeView";
import ExportButton from "@/components/workspace/ExportButton";

export default function Workspace() {
    return(
        <div className='p-10'>
            <div className='flex justify-end mb-4'>
                <ExportButton />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-7'>
                <ChatView/>
                <div className='col-span-2'>
                    <CodeView/>
                </div>
            </div>
        </div>
    )
}