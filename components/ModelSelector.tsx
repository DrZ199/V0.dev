'use client';

import React, { useState, useEffect } from 'react';
import { OPENROUTER_MODELS, DEFAULT_MODEL } from '@/configs/OpenRouterModels';
import { ChevronDown, Zap, Brain, Database } from 'lucide-react';

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  purpose?: 'chat' | 'code';
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ 
  selectedModel, 
  onModelChange, 
  purpose = 'chat' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [models, setModels] = useState(OPENROUTER_MODELS);

  const selectedModelData = models.find(model => model.id === selectedModel);

  const getModelIcon = (modelId: string) => {
    if (modelId.includes('gpt') || modelId.includes('openai')) {
      return <Brain className="h-4 w-4" />;
    } else if (modelId.includes('gemini') || modelId.includes('google')) {
      return <Zap className="h-4 w-4" />;
    } else if (modelId.includes('llama') || modelId.includes('meta')) {
      return <Database className="h-4 w-4" />;
    }
    return <Brain className="h-4 w-4" />;
  };

  const getRecommendedModels = () => {
    if (purpose === 'code') {
      return models.filter(model => 
        model.supportsJSON && 
        (model.id.includes('gpt') || model.id.includes('gemini') || model.id.includes('llama'))
      );
    }
    return models;
  };

  const recommendedModels = getRecommendedModels();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-700"
      >
        {selectedModelData && getModelIcon(selectedModelData.id)}
        <span className="font-medium">
          {selectedModelData ? selectedModelData.name : 'Select Model'}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          <div className="p-3 border-b border-gray-700">
            <h3 className="text-sm font-semibold text-gray-300 mb-1">
              {purpose === 'code' ? 'Recommended for Code Generation' : 'Available Models'}
            </h3>
            <p className="text-xs text-gray-500">
              {purpose === 'code' 
                ? 'Models that support structured JSON output for code generation' 
                : 'All available AI models from OpenRouter'
              }
            </p>
          </div>

          <div className="p-2">
            {recommendedModels.map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  onModelChange(model.id);
                  setIsOpen(false);
                }}
                className={`w-full p-3 rounded-lg text-left hover:bg-gray-700 transition-colors ${
                  selectedModel === model.id ? 'bg-gray-700 border border-blue-500' : 'border border-transparent'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1 text-blue-400">
                    {getModelIcon(model.id)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-medium text-white text-sm">
                        {model.name}
                      </h4>
                      {selectedModel === model.id && (
                        <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
                          Selected
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                      {model.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>{(model.contextWindow / 1000).toFixed(0)}K context</span>
                      <span>{model.supportsJSON ? 'JSON ✅' : 'JSON ❌'}</span>
                      <span>${(model.pricing.input * 1000).toFixed(2)}/1K tokens</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {purpose === 'chat' && (
            <>
              <div className="p-3 border-t border-gray-700">
                <h3 className="text-sm font-semibold text-gray-300 mb-1">All Models</h3>
                <p className="text-xs text-gray-500">Complete list of available models</p>
              </div>
              <div className="p-2">
                {models
                  .filter(model => !recommendedModels.some(rec => rec.id === model.id))
                  .map((model) => (
                    <button
                      key={model.id}
                      onClick={() => {
                        onModelChange(model.id);
                        setIsOpen(false);
                      }}
                      className={`w-full p-3 rounded-lg text-left hover:bg-gray-700 transition-colors ${
                        selectedModel === model.id ? 'bg-gray-700 border border-blue-500' : 'border border-transparent'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1 text-gray-400">
                          {getModelIcon(model.id)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-medium text-white text-sm">
                              {model.name}
                            </h4>
                            {selectedModel === model.id && (
                              <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
                                Selected
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                            {model.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span>{(model.contextWindow / 1000).toFixed(0)}K context</span>
                            <span>{model.supportsJSON ? 'JSON ✅' : 'JSON ❌'}</span>
                            <span>${(model.pricing.input * 1000).toFixed(2)}/1K tokens</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ModelSelector;