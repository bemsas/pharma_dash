"use client"

import { useEffect, useState } from "react"
import SwaggerUIReact from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"

interface SwaggerUIProps {
  url: string
}

export default function SwaggerUI({ url }: SwaggerUIProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="swagger-ui-container">
      <SwaggerUIReact url={url} />
      <style jsx global>{`
        .swagger-ui .topbar {
          display: none;
        }
        .swagger-ui .info {
          margin: 20px 0;
        }
        .swagger-ui .scheme-container {
          box-shadow: none;
          padding: 0;
        }
        .swagger-ui-container {
          margin: 0 -24px;
        }
        .swagger-ui .opblock-tag {
          font-size: 18px;
        }
        .swagger-ui .opblock .opblock-summary-operation-id, 
        .swagger-ui .opblock .opblock-summary-path, 
        .swagger-ui .opblock .opblock-summary-path__deprecated {
          font-size: 14px;
        }
      `}</style>
    </div>
  )
}
