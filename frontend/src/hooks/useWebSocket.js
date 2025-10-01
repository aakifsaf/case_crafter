import { useEffect, useRef, useState } from 'react'

export const useWebSocket = (url) => {
  const [messages, setMessages] = useState([])
  const [isConnected, setIsConnected] = useState(false)
  const ws = useRef(null)

  useEffect(() => {
    ws.current = new WebSocket(url)

    ws.current.onopen = () => {
      setIsConnected(true)
      console.log('WebSocket connected')
    }

    ws.current.onclose = () => {
      setIsConnected(false)
      console.log('WebSocket disconnected')
    }

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data)
      setMessages(prev => [...prev, message])
    }

    return () => {
      ws.current?.close()
    }
  }, [url])

  const sendMessage = (message) => {
    if (ws.current && isConnected) {
      ws.current.send(JSON.stringify(message))
    }
  }

  return { messages, sendMessage, isConnected }
}