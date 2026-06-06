'use client';

import React, { useState } from 'react';
import { Send, Terminal, Cpu, ArrowRight, Play, CloudLightning } from 'lucide-react';

interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
}

export default function AiSrePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'assistant',
      text: '### 🤖 Antigravity-SRE Platform Copilot\n\nI am online and analyzing the **DevOpsVerse Enterprise Cloud Platform** logs, metrics, and configurations.\n\nHow can I help you troubleshoot today? Select a quick-start scenario or type your query below.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const samplePrompts = [
    'Why is payment-api crashing?',
    'How do I fix latency on checkout requests?',
    'A Falco alert was fired, how do I secure the cluster?',
    'Show me how to optimize our AWS spend.'
  ];

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const newMessages = [...messages, { sender: 'user', text } as ChatMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${backendUrl}/api/ai/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text })
      });
      if (res.ok) {
        const data = await res.json();
        setMessages([...newMessages, { sender: 'assistant', text: data.response }]);
      } else {
        setMessages([...newMessages, { sender: 'assistant', text: '❌ Error: The AI service returned an invalid response. Please verify the API key is configured.' }]);
      }
    } catch (err) {
      setMessages([...newMessages, { sender: 'assistant', text: '❌ Error: Failed to communicate with the NestJS AI Gateway.' }]);
    } finally {
      setLoading(false);
    }
  };

  // Extremely robust, self-contained Markdown formatter
  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    let insideCodeBlock = false;
    let codeBlockContent: string[] = [];
    
    return lines.map((line, idx) => {
      // Handle Code Blocks
      if (line.trim().startsWith('```')) {
        if (insideCodeBlock) {
          insideCodeBlock = false;
          const content = codeBlockContent.join('\n');
          codeBlockContent = [];
          return (
            <div key={idx} className="console-box" style={{ margin: '12px 0', background: '#020408' }}>
              <pre style={{ margin: 0, color: '#38bdf8', fontSize: '12px', whiteSpace: 'pre-wrap' }}>{content}</pre>
            </div>
          );
        } else {
          insideCodeBlock = true;
          return null;
        }
      }

      if (insideCodeBlock) {
        codeBlockContent.push(line);
        return null;
      }

      // Headers
      if (line.startsWith('### ')) {
        return <h4 key={idx} style={{ fontSize: '15px', fontWeight: '700', marginTop: '16px', marginBottom: '8px', color: '#818cf8' }}>{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('## ')) {
        return <h3 key={idx} style={{ fontSize: '17px', fontWeight: '700', marginTop: '20px', marginBottom: '10px', color: '#38bdf8' }}>{line.replace('## ', '')}</h3>;
      }
      if (line.startsWith('# ')) {
        return <h2 key={idx} style={{ fontSize: '20px', fontWeight: '800', marginTop: '24px', marginBottom: '12px' }}>{line.replace('# ', '')}</h2>;
      }

      // Lists
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const listText = line.replace(/^[\s-*]+/, '');
        return <li key={idx} style={{ marginLeft: '20px', fontSize: '13px', color: 'var(--text-main)', marginBottom: '4px' }}>{parseInlineMarkdown(listText)}</li>;
      }
      if (/^\d+\.\s/.test(line.trim())) {
        const numText = line.replace(/^\d+\.\s/, '');
        return <div key={idx} style={{ marginLeft: '12px', fontSize: '13px', color: 'var(--text-main)', marginBottom: '4px' }}>{line.match(/^\d+\.\s/)?.[0]} {parseInlineMarkdown(numText)}</div>;
      }

      // Horizontal Rule
      if (line.trim() === '---') {
        return <hr key={idx} style={{ border: 'none', borderBottom: '1px solid var(--card-border)', margin: '16px 0' }} />;
      }

      // Regular Paragraphs
      if (line.trim() === '') return <div key={idx} style={{ height: '8px' }} />;
      return <p key={idx} style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-main)' }}>{parseInlineMarkdown(line)}</p>;
    });
  };

  // Parses bold (**), inline code (`), and links
  const parseInlineMarkdown = (text: string) => {
    // 1. Match Links [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let parts: any[] = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      const matchIndex = match.index;
      const beforeLink = text.substring(lastIndex, matchIndex);
      
      // Parse formatting in the text before the link
      if (beforeLink) parts.push(...parseFormatting(beforeLink));

      const linkText = match[1];
      const linkUrl = match[2];
      
      parts.push(
        <a key={matchIndex} href={linkUrl} style={{ color: '#38bdf8', textDecoration: 'underline' }}>
          {linkText}
        </a>
      );
      lastIndex = linkRegex.lastIndex;
    }
    
    const remainingText = text.substring(lastIndex);
    if (remainingText) parts.push(...parseFormatting(remainingText));
    
    return parts.length > 0 ? parts : text;
  };

  const parseFormatting = (text: string) => {
    const parts: any[] = [];
    // Split by bold (**), then by inline code (`)
    const boldParts = text.split('**');
    
    boldParts.forEach((boldPart, bIdx) => {
      const isBold = bIdx % 2 === 1;
      const codeParts = boldPart.split('`');
      
      codeParts.forEach((codePart, cIdx) => {
        const isCode = cIdx % 2 === 1;
        const key = `${bIdx}-${cIdx}`;
        
        if (isCode) {
          parts.push(
            <code key={key} style={{ background: '#05070c', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '11px', color: '#f87171' }}>
              {codePart}
            </code>
          );
        } else if (isBold) {
          parts.push(<strong key={key} style={{ fontWeight: '700', color: 'white' }}>{codePart}</strong>);
        } else {
          parts.push(<span key={key}>{codePart}</span>);
        }
      });
    });

    return parts;
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '20px', height: 'calc(100vh - 120px)' }}>
      
      {/* Chat Interface */}
      <div className="glass" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        
        {/* Messages pane */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              style={{ 
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                {msg.sender === 'user' ? 'Operator' : 'Antigravity-SRE'}
              </span>
              <div 
                className="glass" 
                style={{ 
                  padding: '16px 20px', 
                  background: msg.sender === 'user' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                  borderColor: msg.sender === 'user' ? '#6366f1' : 'var(--card-border)',
                  borderRadius: msg.sender === 'user' ? '16px 16px 0 16px' : '16px 16px 16px 0'
                }}
              >
                {renderMarkdown(msg.text)}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span className="pulse-indicator warning" style={{ width: '6px', height: '6px', margin: 0 }}></span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Analysing multi-cloud telemetry and OPA rules...</span>
            </div>
          )}
        </div>

        {/* Input box */}
        <div style={{ padding: '20px', borderTop: '1px solid var(--card-border)', background: 'rgba(5, 7, 12, 0.4)' }}>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(input);
            }}
            style={{ display: 'flex', gap: '12px' }}
          >
            <input 
              disabled={loading}
              type="text" 
              className="form-input" 
              placeholder="Ask the AI SRE about cluster health, container errors, cost improvements..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button 
              disabled={loading}
              type="submit" 
              className="btn-primary" 
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
            >
              <Send size={16} /> Send
            </button>
          </form>
        </div>

      </div>

      {/* Side Quick Actions panel */}
      <div className="glass" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', overflowY: 'auto' }}>
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CloudLightning size={16} color="#fbbf24" /> Quick Scenarios
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            Click on any of the pre-configured incident prompts to test SRE root cause analysis and recommendations.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {samplePrompts.map((prompt, idx) => (
            <button 
              key={idx}
              disabled={loading}
              onClick={() => handleSendMessage(prompt)}
              className="btn-secondary"
              style={{ 
                fontSize: '12px', 
                textAlign: 'left', 
                padding: '12px 14px', 
                lineHeight: '1.4',
                background: 'rgba(255,255,255,0.01)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px'
              }}
            >
              <span>{prompt}</span>
              <ArrowRight size={12} style={{ flexShrink: 0 }} />
            </button>
          ))}
        </div>

        <div className="glass" style={{ padding: '12px', fontSize: '11px', marginTop: 'auto', background: 'rgba(0,0,0,0.2)' }}>
          <div style={{ fontWeight: '700', marginBottom: '6px' }}>AI Troubleshooting Context</div>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.5' }}>
            The AI agent automatically scrapes live telemetry (metrics, logs, traces) and security audit reports to form context before resolving queries.
          </p>
        </div>
      </div>

    </div>
  );
}
