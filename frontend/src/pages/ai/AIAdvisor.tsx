import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, TrendingUp, AlertTriangle, MessageSquare, Send, Bot, User, CheckCircle } from 'lucide-react';
import '../dashboard/dashboard.css';

interface ChatMessage {
  id: number;
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

const initialInsights = [
  {
    id: 1,
    type: 'warning',
    title: 'Inventory Alert: Raw Cotton Grade A',
    description: 'Current stock is projected to drop below minimum levels in 3 days based on current weaving production rates. Recommended action: Generate PO for 5,000 kg immediately.',
    icon: <AlertTriangle size={20} color="#d97706" />
  },
  {
    id: 2,
    type: 'opportunity',
    title: 'Production Optimization',
    description: 'Weaving Loom M-02 has been idle for 48 hours. Reassigning Work Order WO-1055 to this machine will increase overall factory throughput by 12%.',
    icon: <TrendingUp size={20} color="#059669" />
  },
  {
    id: 3,
    type: 'quality',
    title: 'Quality Trend Anomaly',
    description: 'Dye penetration failure rate has spiked by 4% in the last 24 hours (Silk Blend Fabric). Suggest halting Dyeing Vat D-01 for immediate calibration.',
    icon: <Sparkles size={20} color="#0284c7" />
  }
];

export const AIInsights: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: 'ai',
      text: "Hello! I am your Avenza Textiles AI Business Advisor. I have full access to our current ERP data including inventory levels, production schedules, quality logs, and employee rosters. \n\nI noticed some supply chain risks regarding our Raw Cotton Grade A today. How can I help you optimize the factory?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Mock AI Response
    setTimeout(() => {
      let aiText = "I'm not entirely sure how to help with that specific request yet. You can try asking me about 'inventory', 'machines', 'quality', or just ask for a 'guide' on how to use the system!";
      
      const lowerInput = userMsg.text.toLowerCase();
      
      // Greetings
      if (lowerInput === 'hi' || lowerInput === 'hello' || lowerInput === 'hey' || lowerInput.includes('good morning') || lowerInput.includes('good afternoon')) {
        aiText = "Hello! I'm ready to help you manage Avenza Textiles. You can ask me about our inventory levels, machine status, quality control, or how to use this platform.";
      } 
      // Guide / Help
      else if (lowerInput.includes('guide') || lowerInput.includes('help') || lowerInput.includes('how to') || lowerInput.includes('what is this')) {
        aiText = "This is the NOVAX Smart Manufacturing ERP. You can navigate using the sidebar on the left.\n\n• Use 'Inventory' to track raw materials.\n• Use 'Production > Machines' to monitor equipment.\n• Use 'Quality' to log inspections.\n• Use 'Administration > Employees' to manage your workforce.\n\nWhat specific module would you like help with?";
      } 
      // Employees
      else if (lowerInput.includes('employee') || lowerInput.includes('staff') || lowerInput.includes('worker') || lowerInput.includes('attendance')) {
        aiText = "Avenza Textiles currently has active employees logged in the system. You can manage them in the 'Employees' and 'Attendance' modules under the Administration tab. Would you like me to generate a summary report of today's attendance?";
      }
      // Inventory
      else if (lowerInput.includes('cotton') || lowerInput.includes('po') || lowerInput.includes('purchase order') || lowerInput.includes('inventory')) {
        aiText = "I have drafted a Purchase Order for 5,000 kg of Raw Cotton Grade A from our primary supplier, Global Threads Inc. Would you like me to send it for Manager approval?";
      } 
      // Machines
      else if (lowerInput.includes('machine') || lowerInput.includes('loom') || lowerInput.includes('equipment')) {
        aiText = "Weaving Loom M-02 is currently idle. I can automatically re-route pending Work Orders to this machine. This will reduce our backlog by 15%. Shall I execute this change?";
      } 
      // Quality
      else if (lowerInput.includes('quality') || lowerInput.includes('dye') || lowerInput.includes('inspection')) {
        aiText = "The quality drop in Dyeing Vat D-01 appears to correlate with a recent temperature fluctuation recorded at 2:00 AM. I have raised an automated maintenance ticket for the engineering team.";
      }

      const aiMsg: ChatMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="erp-dashboard">
      <div className="erp-page-header">
        <div>
          <h1 className="erp-page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={24} color="#0ea5e9" /> AI Business Advisor
          </h1>
          <p className="erp-page-subtitle">Your intelligent copilot for Avenza Textiles operations</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '1.5rem', height: 'calc(100vh - 180px)' }}>
        
        {/* Chat Interface */}
        <div className="erp-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 0, overflow: 'hidden' }}>
          <div className="erp-panel-header" style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
            <h3 className="erp-panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={18} color="#0ea5e9" /> Advisor Chat
            </h3>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', backgroundColor: '#fdfdfd', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {messages.map(msg => (
              <div key={msg.id} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row' }}>
                <div style={{ 
                  width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  backgroundColor: msg.sender === 'ai' ? '#e0f2fe' : '#f1f5f9',
                  color: msg.sender === 'ai' ? '#0ea5e9' : '#64748b'
                }}>
                  {msg.sender === 'ai' ? <Bot size={20} /> : <User size={20} />}
                </div>
                
                <div style={{ 
                  maxWidth: '75%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  backgroundColor: msg.sender === 'ai' ? '#ffffff' : '#0ea5e9',
                  color: msg.sender === 'ai' ? '#334155' : '#ffffff',
                  border: msg.sender === 'ai' ? '1px solid #e2e8f0' : 'none',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}>
                  <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5, fontSize: '0.95rem' }}>{msg.text}</div>
                  <div style={{ fontSize: '0.75rem', marginTop: '8px', textAlign: msg.sender === 'user' ? 'right' : 'left', color: msg.sender === 'ai' ? '#94a3b8' : '#bae6fd' }}>
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e0f2fe', color: '#0ea5e9' }}>
                  <Bot size={20} />
                </div>
                <div style={{ padding: '12px 16px', borderRadius: '12px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#94a3b8', fontStyle: 'italic', fontSize: '0.9rem' }}>
                  Analyzing Avenza Textiles data...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div style={{ padding: '1rem', borderTop: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
            <form onSubmit={handleSend} style={{ display: 'flex', gap: '12px' }}>
              <input 
                type="text" 
                className="erp-input" 
                placeholder="Ask about inventory, machines, quality, or request an action..." 
                value={input}
                onChange={e => setInput(e.target.value)}
                style={{ flex: 1 }}
              />
              <button type="submit" className="erp-btn erp-btn-primary" disabled={!input.trim() || isTyping}>
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>

        {/* Proactive Insights Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#334155', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} color="#64748b" /> Proactive Insights
          </h3>
          
          {initialInsights.map(insight => (
            <div key={insight.id} className="erp-panel" style={{ padding: '1.25rem', borderLeft: `4px solid ${insight.type === 'warning' ? '#f59e0b' : insight.type === 'opportunity' ? '#10b981' : '#0ea5e9'}` }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ padding: '8px', backgroundColor: '#f8fafc', borderRadius: '8px', flexShrink: 0 }}>
                  {insight.icon}
                </div>
                <div>
                  <h4 style={{ margin: '0 0 6px 0', color: '#0f172a', fontSize: '0.95rem' }}>{insight.title}</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
                    {insight.description}
                  </p>
                  
                  <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                    <button className="erp-btn erp-btn-outline" style={{ padding: '4px 8px', fontSize: '0.8rem' }}>Dismiss</button>
                    <button className="erp-btn erp-btn-primary" style={{ padding: '4px 8px', fontSize: '0.8rem' }}>Take Action</button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="erp-panel" style={{ marginTop: 'auto', backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#64748b' }}>
              <CheckCircle size={20} color="#10b981" />
              <span style={{ fontSize: '0.85rem' }}>All other factory systems operating within normal parameters.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
