'use client';
import React, {useContext, useEffect, useState, useCallback} from "react";
import {
    SandpackProvider,
    SandpackLayout,
    SandpackCodeEditor,
    SandpackPreview,
    SandpackFileExplorer,
  } from "@codesandbox/sandpack-react";

import {LOOKUP} from "@/data/Lookup";
import axios from 'axios';
import { MessageContext } from '@/providers/MessageContext';
import { useConvex, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useParams } from 'next/navigation';
import Prompt from "@/data/Prompt";
import { Loader2Icon, Settings } from 'lucide-react';
import ModelSelector from "@/components/ModelSelector";

const CodeView = () => {
    const {id}=useParams()
    const [activeTab,setActiveTab]=useState('code')
    const [Files,setFiles]=useState(LOOKUP.DEFAULT_FILE)
    const messageContext = useContext(MessageContext)
    
    if (!messageContext) {
      throw new Error('MessageContext is not defined');
    }
    
    const { messages, selectedModel, setSelectedModel } = messageContext;
    const [loading,setLoading]=useState(false)
    const [showModelSelector, setShowModelSelector] = useState(false);
    const UpdateFiles=useMutation(api.workspace.UpdateFiles)
    const convex= useConvex();

    useEffect(()=>{
      id&&GetFiles()
    },[id, GetFiles])
  
    const GetFiles=useCallback(async()=>{
      setLoading(true)
      const result= await convex.query(api.workspace.GetUserWorkSpace,{
        workspaceId:id as Id<"workspaces">
      })
      const mergeFiles= {...result?.fileData}
      setFiles(mergeFiles)
      setLoading(false)
    },[id, convex])
  
    const GenerateAiCode=useCallback(async()=>{
      setActiveTab('code')
      setLoading(true)
      const PROMPT= JSON.stringify(messages)+" "+Prompt.CODE_GEN_PROMPT
      const result= await axios.post('/api/openrouter-code',{
        prompt: PROMPT,
        modelId: selectedModel
      })
      const aiResponse=result.data
      const mergeFiles= {...Files,...aiResponse?.files}
      setFiles(mergeFiles)
      await UpdateFiles({
        workspaceId:id as Id<"workspaces">,
        fileData:aiResponse?.files
      })
      setLoading(false)
    }, [messages, selectedModel, Files, UpdateFiles, id])
  
    return (
      <div className='relative'>
        {/* Model Selector */}
        <div className="flex justify-end mb-2">
          <div className="relative">
            <button
              onClick={() => setShowModelSelector(!showModelSelector)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
            >
              <Settings className="h-4 w-4" />
              Model: {selectedModel.split('/')[1]}
            </button>
            {showModelSelector && (
              <div className="absolute right-0 top-full mt-2 z-50">
                <ModelSelector 
                  selectedModel={selectedModel} 
                  onModelChange={setSelectedModel}
                  purpose="code"
                />
              </div>
            )}
          </div>
        </div>

        <div className='bg-[#181818] w-full p-2 border -mt-10'>
          <div className='flex gap-3 items-center justify-center flex-wrap shrink-0 bg-black p-1 w-[140px] rounded-full'>
            <h2 className={`text-sm cursor-pointer ${activeTab=='code'&& 'text-blue-500 bg-blue-500 bg-opacity-25  p-1 px-2 rounded-full  '}`}
            onClick={()=>setActiveTab('code')}>Code</h2>
            <h2 className={`text-sm cursor-pointer ${activeTab=='preview'&& 'text-blue-500 bg-blue-500 bg-opacity-25  p-1 px-2 rounded-full  '}`}
            onClick={()=>setActiveTab('preview')}>Preview</h2>
          </div>
        </div>
        <SandpackProvider template='react' theme={'dark'} 
        files={Files}
        options={{
          externalResources:['https://unpkg.com/@tailwindcss/browser@4']
        }}
        customSetup={{
          dependencies:{
            ...LOOKUP.DEPENDENCY
          }
        }}
        >
      <SandpackLayout>
       {activeTab=='code'&& <>
  
        <SandpackFileExplorer style={{height:'74vh'}} initialCollapsedFolder={["components/","/public/"]} />
        <SandpackCodeEditor style={{height:'74vh'}}/>
        </>}
  
        {activeTab=='preview'&& <>
        <SandpackPreview style={{height:'74vh'}} showNavigator={true}/>
        </>}
        
      </SandpackLayout>
    </SandpackProvider>
    { loading&& <div className='p-10 bg-gray-900 opacity-60 gap-1 absolute top-0 rounded-lg w-full h-full flex items-center justify-center'>
      <Loader2Icon className={`animate-spin  h-10 w-10 text-white `}/>
      <h2 className='text-white font-semibold text-xl'>Generating code...</h2>
    </div>}
      </div>
    )
  }
  
  export default CodeView