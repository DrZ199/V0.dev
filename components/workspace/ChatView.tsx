'use client';
import { useConvex, useMutation } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import React, {useContext, useEffect, useState, useCallback} from "react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { MessageContext } from "@/providers/MessageContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import Image  from "next/image";
import {ArrowRight, Link, Loader2Icon, Settings} from "lucide-react";
import {LOOKUP} from "@/data/Lookup";
import Prompt from "@/data/Prompt";
import axios from "axios";
import ModelSelector from "@/components/ModelSelector";

const ChatView = () => {
    const {id} = useParams();
    const convex = useConvex();
    const messageContext = useContext(MessageContext);
    const userDetailContext = useContext(UserDetailContext);

  if (!messageContext || !userDetailContext) {
    throw new Error('MessageContext or UserDetailContext is not defined');
  }

  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const { messages, setMessages, selectedModel, setSelectedModel } = messageContext;
  const UpdateMessages= useMutation(api.workspace.UpdateMessages)
  const router = useRouter();

  // Get context values safely
  const userDetail = userDetailContext?.userDetail;

  const GetWorkspaceData = useCallback(async () => {
    try {
      const result = await convex.query(api.workspace.GetUserWorkSpace, {
        workspaceId: id as Id<"workspaces">,
      });
      setMessages(result?.message );
    } catch (error) {
      console.error("Error fetching workspace data:", error);
    }
  }, [id, convex, setMessages]);

  const GetAiResponse= useCallback(async ()=>{
    setLoading(true)
    const PROMPT= JSON.stringify(messages)+ " "+Prompt.CHAT_PROMPT
    const result = await axios.post('/api/openrouter-chat',{
       prompt:PROMPT,
       modelId: selectedModel
    })
    const aiResponse={role:'ai',content:result.data.result,timestamp: Date.now()}
    setMessages((prev: Array<{role: string, content: string, timestamp: number}> )=>[...prev,aiResponse]);
    // console.log("ai:",result.data.result)
    await UpdateMessages({
      message: [...messages,aiResponse],
      workspaceId:id as Id<"workspaces">
    })
    setLoading(false)
  }, [messages, selectedModel, id, UpdateMessages, setMessages])

  const onGenerate=(input: string )=>{
      setMessages((prev: Array<{role: string, content: string, timestamp: number}> )=>[...prev,{role:'user',content:input, timestamp: Date.now()}]);
      setUserInput('');
  }

  useEffect(() => {
    if(!userDetail?.name) {
        router.push('/');
    }
  }, [userDetail, router]);

  useEffect(() => {
    if(id){
        GetWorkspaceData();
    }
  }, [id, GetWorkspaceData]);

  useEffect(()=>{
    if(messages.length > 0){
       const role= messages[messages.length-1].role;
        if(role === 'user'){
          GetAiResponse()
        }
    }
  },[messages, GetAiResponse])

  // Early return after all hooks
  if(!userDetailContext || !messageContext) {
    console.error("UserDetailContext or MessageContext is not available");
    return null;
  }

  return (
    <div className='relative h-[76vh] flex flex-col'>
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
                purpose="chat"
              />
            </div>
          )}
        </div>
      </div>

      <div className='flex-1 overflow-y-scroll no-scrollbar'>

      {Array.isArray(messages) && messages?.map((msg: {role: string, content: string, timestamp: number}, index: number) => {
        return (
          <div key={index} className='bg-[#272727] p-3 rounded-lg m-2 flex gap-5 itmes-start '>
            {msg.role === 'user' && (
              <Image
              src={userDetail?.pic || ''}
              alt='User'
              width={35}
              height={35}
              className='rounded-full'
              />
            )}
            <div className='flex-1'>
              <div className='flex justify-between items-start'>
                <h2 className='mt-1' >{msg.content}</h2>
                <span className='text-xs text-gray-400 ml-2 whitespace-nowrap'>
                  {new Date(msg.timestamp).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </div>
        );
      })}
      { loading&& <div className='bg-[#272727] p-3 rounded-lg  m-2 flex gap-5 itmes-start'>
              <Loader2Icon className='animate-spin'/>
              <h2>Generating response...</h2>
            </div>
      }
      </div>
      {/* Input */}
      <div className="p-5 border rounded-xl max-w-xl w-full mt-3 bg-[#151515]">
        <div className="flex gap-2 ">
          <textarea
            placeholder={LOOKUP.INPUT_PLACEHOLDER}
            className="outline-none bg-transparent w-full h-24 max-h-56 resize-none"
            onChange={(e) => setUserInput(e.target.value)}
            value={userInput}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onGenerate(userInput);
              }
            }}
          />
          {userInput && (
           <ArrowRight
             onClick={() => onGenerate(userInput)}
             className="bg-blue-500 p-2 h-10 w-10 rounded-md cursor-pointer hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
           />
          )}
        </div>
        <div>
          <Link className="h-5 w-5" />
        </div>
      </div>
    </div>
    
  )

}

export default ChatView;