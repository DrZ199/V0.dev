'use client';

import React, { useContext, useEffect, useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { UserDetailContext } from '@/context/UserDetailContext';
import { Trash2, Code, MessageSquare, Plus, Calendar } from 'lucide-react';
import Link from 'next/link';

interface Workspace {
  _id: Id<'workspaces'>;
  _creationTime: number;
  user: Id<'users'>;
  message: Array<{ role: string; content: string; timestamp: number }>;
  fileData?: Record<string, { code: string }>;
  title?: string;
  createdAt: number;
  updatedAt: number;
}

const Dashboard = () => {
  const userDetailContext = useContext(UserDetailContext);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);

  const getUserData = useQuery(api.user.GetUser,
    userDetailContext?.userDetail?.email ? { email: userDetailContext.userDetail.email } : "skip"
  );
  
  const getAllWorkspaces = useQuery(api.workspace.GetAllUserWorkspaces,
    getUserData?._id ? { userId: getUserData._id } : "skip"
  );

  const deleteWorkspace = useMutation(api.workspace.DeleteWorkspace);

  useEffect(() => {
    if (getAllWorkspaces) {
      setWorkspaces(getAllWorkspaces);
      setLoading(false);
    }
  }, [getAllWorkspaces]);

  const handleDeleteWorkspace = async (workspaceId: Id<'workspaces'>) => {
    if (confirm('Are you sure you want to delete this workspace?')) {
      try {
        await deleteWorkspace({ workspaceId });
        setWorkspaces(prev => prev.filter(ws => ws._id !== workspaceId));
      } catch (error) {
        console.error('Error deleting workspace:', error);
      }
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getWorkspaceTitle = (workspace: Workspace) => {
    if (workspace.title) {
      return workspace.title;
    }
    if (workspace.message && workspace.message.length > 0) {
      const firstUserMessage = workspace.message.find(msg => msg.role === 'user');
      if (firstUserMessage) {
        return firstUserMessage.content.substring(0, 50) + (firstUserMessage.content.length > 50 ? '...' : '');
      }
    }
    return 'Untitled Workspace';
  };

  if (!userDetailContext?.userDetail?.name) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please sign in to view your dashboard</h2>
          <Link href="/" className="text-blue-500 hover:text-blue-600">Go to Home</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Your Workspaces</h1>
            <p className="text-gray-400">Manage your AI-generated projects and continue coding</p>
          </div>
          <Link href="/">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors">
              <Plus className="h-5 w-5" />
              Create New
            </button>
          </Link>
        </div>

        {workspaces.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-12 text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-700 rounded-full mb-4">
                <Code className="h-8 w-8 text-blue-500" />
              </div>
              <h2 className="text-2xl font-semibold text-white mb-2">No workspaces yet</h2>
              <p className="text-gray-400 mb-6">Start by creating your first AI-powered project</p>
              <Link href="/">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 transition-colors">
                  <Plus className="h-5 w-5" />
                  Create Workspace
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces.map((workspace) => (
              <div key={workspace._id} className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors border border-gray-700">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-white line-clamp-2">
                    {getWorkspaceTitle(workspace)}
                  </h3>
                  <button
                    onClick={() => handleDeleteWorkspace(workspace._id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(workspace.createdAt)}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    {workspace.message?.length || 0} messages
                  </div>
                </div>

                {workspace.fileData && Object.keys(workspace.fileData).length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-1 text-sm text-gray-400 mb-2">
                      <Code className="h-4 w-4" />
                      {Object.keys(workspace.fileData).length} files
                    </div>
                    <div className="text-xs text-gray-500">
                      {Object.keys(workspace.fileData).slice(0, 3).join(', ')}
                      {Object.keys(workspace.fileData).length > 3 && '...'}
                    </div>
                  </div>
                )}

                <Link href={`/workspace/${workspace._id}`}>
                  <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors">
                    Open Workspace
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;