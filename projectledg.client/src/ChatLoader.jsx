import React from 'react'

export default function ChatLoader() {
    return (
        <div className="flex items-center space-x-2 p-4 bg-gray-100 rounded-lg max-w-[100px] dark:bg-darkSurface">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
    )
}