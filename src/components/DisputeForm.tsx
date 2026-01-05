import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { states } from '../data/states';
import { cultures } from '../data/cultures';

interface DisputeFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DisputeForm({ isOpen, onClose }: DisputeFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [selectedType, setSelectedType] = useState('state');
  const [selectedItem, setSelectedItem] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch('https://formspree.io/f/mdoqwjeg', {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        setSubmitted(true);
        form.reset();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  if (!isOpen) return null;

  if (submitted) {
    return (
      <>
        <style>{`
          /* Match SuggestionsForm styling for Dispute modal in dark mode */
          .dispute-modal-container {
            background-color: white;
          }
          .dark .dispute-modal-container {
            background-color: rgba(20, 19, 19, 0.1) !important;
          }
        `}</style>
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="dispute-modal-container bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full relative">
          <button
            onClick={() => {
              setSubmitted(false);
              onClose();
            }}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-green-600 dark:text-green-400 mb-2">
              Thank you for your submission!
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              We'll review your dispute and update our database accordingly.
            </p>
          </div>
        </div>
      </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        /* Match SuggestionsForm styling for Dispute modal in dark mode */
        .dispute-modal-container {
          background-color: white;
        }
        .dark .dispute-modal-container {
          background-color: rgba(20, 19, 19, 0.98) !important;
        }
        .dispute-form-input {
          background-color: white;
        }
        .dark .dispute-form-input {
          background-color: rgba(55, 65, 81, 0.25) !important;
        }
      `}</style>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="dispute-modal-container bg-white dark:bg-gray-800 rounded-lg w-full max-w-md max-h-[90vh] flex flex-col relative">
        {/* Header - Fixed at top */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 id="modal-title" className="text-2xl font-semibold dark:text-white">Dispute a Term</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <form id="disputeForm" onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type
              </label>
              <select
                name="type"
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setSelectedItem('');
                }}
                className="dispute-form-input w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                required
              >
                <option value="state">State</option>
                <option value="culture">Culture</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {selectedType === 'state' ? 'State' : 'Culture'}
              </label>
              <select
                name={selectedType}
                value={selectedItem}
                onChange={(e) => setSelectedItem(e.target.value)}
                className="dispute-form-input w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                required
              >
                <option value="">Select {selectedType === 'state' ? 'a state' : 'a culture'}</option>
                {selectedType === 'state'
                  ? states.map(state => (
                      <option key={state.abbreviation} value={state.name}>
                        {state.name}
                      </option>
                    ))
                  : cultures.map(culture => (
                      <option key={culture.name} value={culture.name}>
                        {culture.name}
                      </option>
                    ))
                }
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Term
              </label>
              <input
                type="text"
                name="term"
                required
                className="dispute-form-input w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                placeholder="Enter the term"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Current Pronunciation
              </label>
              <input
                type="text"
                name="current_pronunciation"
                required
                className="dispute-form-input w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                placeholder="How it's currently shown"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Corrected Pronunciation
              </label>
              <input
                type="text"
                name="corrected_pronunciation"
                required
                className="dispute-form-input w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                placeholder="How it should be pronounced"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description/Credentials
              </label>
              <textarea
                name="description"
                required
                rows={3}
                className="dispute-form-input w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                placeholder="Please explain your reasoning and any relevant credentials or experience"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                className="dispute-form-input w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                placeholder="Enter your email (optional)"
              />
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
              Note: In cases where multiple pronunciations are correct, we may list both.
            </p>
          </form>
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="submit"
            form="disputeForm"
            className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600 transition-colors duration-200"
          >
            Submit Dispute
          </button>
        </div>
      </div>
    </div>
    </>
  );
}