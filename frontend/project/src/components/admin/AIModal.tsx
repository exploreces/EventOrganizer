import React, { useState, useEffect } from 'react';
import { X, Bot, Send, Loader2 } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  date: string;
  location?: string;
}

interface AiModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
}

interface AiSuggestion {
  id: string;
  category: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

const AiModal: React.FC<AiModalProps> = ({ isOpen, onClose, event }) => {
  const [suggestions, setSuggestions] = useState<AiSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');

  // Mock AI suggestions data
  const mockSuggestions: AiSuggestion[] = [
    {
      id: '1',
      category: 'Venue',
      title: 'Book venue 2 months ahead',
      description: 'Popular venues get booked quickly. Consider booking your venue at least 2 months in advance to ensure availability.',
      priority: 'high'
    },
    {
      id: '2',
      category: 'Catering',
      title: 'Plan for dietary restrictions',
      description: 'Survey guests about dietary restrictions and allergies. Plan for vegetarian, vegan, and gluten-free options.',
      priority: 'medium'
    },
    {
      id: '3',
      category: 'Budget',
      title: 'Set aside 10% contingency',
      description: 'Always allocate 10% of your total budget for unexpected expenses that may arise during planning.',
      priority: 'high'
    },
    {
      id: '4',
      category: 'Timeline',
      title: 'Create detailed timeline',
      description: 'Break down your event into hourly segments with specific tasks and responsible persons assigned.',
      priority: 'medium'
    },
    {
      id: '5',
      category: 'Entertainment',
      title: 'Book entertainment early',
      description: 'Popular DJs, bands, or speakers get booked months in advance. Secure entertainment as soon as venue is confirmed.',
      priority: 'medium'
    },
    {
      id: '6',
      category: 'Communications',
      title: 'Send invitations 3-4 weeks prior',
      description: 'Send formal invitations 3-4 weeks before the event. Follow up with non-responders 1 week before.',
      priority: 'low'
    }
  ];

  const mockAiResponse = `Based on your event "${event.title}" scheduled for ${new Date(event.date).toLocaleDateString()}, here are some AI-powered recommendations:

**Key Planning Areas:**
• **Venue Selection**: Since your event is ${event.location ? `at ${event.location}` : 'location TBD'}, ensure the space accommodates your expected guest count with 20% buffer room.

• **Timeline Management**: Start planning at least 8-12 weeks before your event date. Critical tasks should be completed 2-3 weeks prior.

• **Budget Allocation**: Typical breakdown - Venue (40%), Catering (30%), Entertainment (15%), Decorations (10%), Miscellaneous (5%).

**AI Insights:**
Based on similar events, success factors include early venue booking, clear communication with vendors, and having backup plans for outdoor elements.

**Next Steps:**
1. Confirm guest count and venue capacity
2. Create vendor shortlist and get quotes
3. Set up communication timeline with stakeholders
4. Plan contingency options for weather/logistics

Would you like me to elaborate on any specific aspect of your event planning?`;

  useEffect(() => {
    if (isOpen) {
      loadAiSuggestions();
    }
  }, [isOpen]);

  const loadAiSuggestions = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSuggestions(mockSuggestions);
      setAiResponse(mockAiResponse);
      setLoading(false);
    }, 1500);
  };

  const handleAskAi = () => {
    if (!userInput.trim()) return;

    setLoading(true);
    // Simulate AI response
    setTimeout(() => {
      const mockResponse = `Great question about "${userInput}"!

Based on your event details, here's what I recommend:

• **Immediate Action**: Focus on the high-priority items first, especially venue and catering arrangements.

• **Timeline Consideration**: Given your event date, you have a good window to plan effectively if you start now.

• **Budget Tip**: Consider getting quotes from multiple vendors to compare pricing and services.

• **Pro Tip**: Create a shared planning document with all stakeholders to keep everyone aligned.

Is there a specific area you'd like me to dive deeper into?`;

      setAiResponse(mockResponse);
      setUserInput('');
      setLoading(false);
    }, 1000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Bot className="text-purple-600" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">AI Event Planner</h2>
              <p className="text-sm text-gray-600">{event.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {loading && !suggestions.length ? (
            <div className="flex items-center justify-center h-40">
              <div className="flex items-center gap-3 text-purple-600">
                <Loader2 className="animate-spin" size={24} />
                <span>AI is analyzing your event...</span>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* AI Response Section */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Bot size={20} className="text-purple-600" />
                  AI Recommendations
                </h3>
                <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {aiResponse}
                </div>
              </div>

              {/* Quick Suggestions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Smart Suggestions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {suggestions.map((suggestion) => (
                    <div key={suggestion.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          {suggestion.category}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(suggestion.priority)}`}>
                          {suggestion.priority}
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-800 mb-2">{suggestion.title}</h4>
                      <p className="text-sm text-gray-600">{suggestion.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Ask AI Section */}
        <div className="border-t p-4 bg-gray-50">
          <div className="flex gap-3">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask AI anything about your event planning..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              onKeyPress={(e) => e.key === 'Enter' && handleAskAi()}
              disabled={loading}
            />
            <button
              onClick={handleAskAi}
              disabled={loading || !userInput.trim()}
              className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
              Ask AI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiModal;