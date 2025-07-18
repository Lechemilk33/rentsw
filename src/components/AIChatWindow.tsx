import React, { useState } from 'react'
import { Send, Bot } from 'lucide-react'
import { Card, Button, Input, Badge, Loading } from './ui'

interface ChatMessage {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

interface AIChatWindowProps {
  className?: string
}

/**
 * AI Chat Window Component
 * 
 * Professional chat UI placeholder for future AI integration.
 * Provides clean interface for user interaction with AI assistant.
 * Currently handles basic message state - ready for AI backend integration.
 */
const AIChatWindow: React.FC<AIChatWindowProps> = ({ className = '' }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: '🤖 How can I help you today?',
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // TODO: Replace with actual AI integration
    // Placeholder AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Thanks for your message! AI integration is coming soon. For now, I can help you navigate the fleet management system.',
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Card 
      className={`h-96 flex flex-col ${className}`} 
      variant="elevated"
      elevation="lg"
      padding="none"
    >
      {/* Chat Header */}
      <div className="flex items-center space-x-3 p-6 border-b border-gray-100">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg">AI Vroomy Chat</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-sm text-gray-500">Your fleet management assistant</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                message.isUser
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                  : 'bg-white text-gray-900 border border-gray-200'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.text}</p>
              <p className={`text-xs mt-2 ${
                message.isUser ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>
        ))}

        {/* Enhanced Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-900 px-4 py-3 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-xs text-gray-500">AI is typing...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Input Area */}
      <div className="p-6 border-t border-gray-100 bg-white">
        <div className="flex space-x-3">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about fleet status, maintenance, or analytics..."
            className="flex-1"
            disabled={isTyping}
            variant="outlined"
            size="md"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            size="md"
            icon={Send}
            iconPosition="right"
            variant="primary"
            loading={isTyping}
            aria-label="Send message"
            className="px-6"
          >
            Send
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-3 flex items-center justify-between">
          <span>Press Enter to send</span>
          <span className="flex items-center space-x-1">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            <span>AI integration coming soon</span>
          </span>
        </p>
      </div>
    </Card>
  )
}

export default AIChatWindow
