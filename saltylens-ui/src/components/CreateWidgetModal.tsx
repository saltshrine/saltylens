import React, { useState } from 'react';
import { X, TrendingUp, BarChart3, Hash } from 'lucide-react';
import type { WidgetType } from '../types/dashboard';

interface CreateWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; type: WidgetType; eventName: string }) => void;
}

const MOCK_EVENTS = [
  'page_view',
  'user_signup',
  'payment_success',
  'button_click',
  'api_request'
];

export const CreateWidgetModal: React.FC<CreateWidgetModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<WidgetType>('LINE');
  const [eventName, setEventName] = useState(MOCK_EVENTS[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, type, eventName });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 w-full max-w-lg rounded-2xl border border-slate-800 shadow-2xl overflow-hidden font-sans">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-100">Create New Widget</h2>
          <button 
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 transition rounded-md p-1 hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            
            {/* Input: Widget Title */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Widget Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Weekly Signups"
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition"
              />
            </div>

            {/* Input: Chart Type (Card Selector) */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Visualization Type
              </label>
              <div className="grid grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setType('LINE')}
                  className={`flex flex-col items-center justify-center p-4 border rounded-xl transition ${
                    type === 'LINE' 
                      ? 'border-amber-500 bg-amber-500/10 text-amber-400' 
                      : 'border-slate-800 bg-slate-950 text-slate-500 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  <TrendingUp className="h-6 w-6 mb-2" />
                  <span className="text-xs font-semibold">Line Chart</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setType('BAR')}
                  className={`flex flex-col items-center justify-center p-4 border rounded-xl transition ${
                    type === 'BAR' 
                      ? 'border-amber-500 bg-amber-500/10 text-amber-400' 
                      : 'border-slate-800 bg-slate-950 text-slate-500 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  <BarChart3 className="h-6 w-6 mb-2" />
                  <span className="text-xs font-semibold">Bar Chart</span>
                </button>

                <button
                  type="button"
                  onClick={() => setType('METRIC')}
                  className={`flex flex-col items-center justify-center p-4 border rounded-xl transition ${
                    type === 'METRIC' 
                      ? 'border-amber-500 bg-amber-500/10 text-amber-400' 
                      : 'border-slate-800 bg-slate-950 text-slate-500 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  <Hash className="h-6 w-6 mb-2" />
                  <span className="text-xs font-semibold">Metric Card</span>
                </button>
              </div>
            </div>

            {/* Input: Metric Event Source */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Event Source
              </label>
              <select
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition appearance-none"
              >
                {MOCK_EVENTS.map(event => (
                  <option key={event} value={event}>{event}</option>
                ))}
              </select>
              <p className="mt-2 text-xs text-slate-500">
                Select the raw event data that will populate this widget.
              </p>
            </div>

          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 bg-slate-900/50 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-slate-950 transition shadow-sm"
            >
              Create Widget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};