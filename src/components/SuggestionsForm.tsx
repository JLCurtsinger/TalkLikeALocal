import React, { useState } from 'react';
import { Send } from 'lucide-react';

export function SuggestionsForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch('https://formspree.io/f/xeoodvya', {
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

  if (submitted) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 text-center">
        <h3 className="text-2xl font-semibold text-green-700 dark:text-green-400 mb-2">Thank you for your suggestion!</h3>
        <p className="text-green-600 dark:text-green-300">We'll review your submission and consider adding it to the site.</p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-4 text-green-700 dark:text-green-400 underline hover:text-green-800 dark:hover:text-green-300"
        >
          Submit another suggestion
        </button>
      </div>
    );
  }

  return (
    <>
      <style>{`
        /* Scoped styles for suggestions form only - reduces visual weight in dark mode */
        #suggestions .suggestions-form-container {
          background-color: white;
        }
        .dark #suggestions .suggestions-form-container {
          background-color: rgba(20, 19, 19, 0.15) !important;
        }
        #suggestions .suggestions-form-input {
          background-color: white;
        }
        .dark #suggestions .suggestions-form-input {
          background-color: rgba(55, 65, 81, 0.25) !important;
        }
      `}</style>
      <form onSubmit={handleSubmit} className="suggestions-form-container bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6 transition-colors">
        <div className="space-y-4">
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              State
            </label>
            <input
              type="text"
              id="state"
              name="state"
              required
              className="suggestions-form-input w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
              placeholder="e.g., West Virginia"
            />
          </div>

          <div>
            <label htmlFor="term" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Term
            </label>
            <input
              type="text"
              id="term"
              name="term"
              required
              className="suggestions-form-input w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
              placeholder="e.g., Kanawha"
            />
          </div>

          <div>
            <label htmlFor="proper-pronunciation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Proper Pronunciation
            </label>
            <input
              type="text"
              id="proper-pronunciation"
              name="proper-pronunciation"
              required
              className="suggestions-form-input w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
              placeholder="e.g., KUH-naw"
            />
          </div>

          <div>
            <label htmlFor="common-mispronunciation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Common Mispronunciation
            </label>
            <input
              type="text"
              id="common-mispronunciation"
              name="common-mispronunciation"
              required
              className="suggestions-form-input w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
              placeholder="e.g., Ka-NAH-wah"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={3}
              className="suggestions-form-input w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
              placeholder="e.g., As in Kanawha County or the Kanawha River"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="suggestions-form-input w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
              placeholder="Enter your email (optional)"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600 transition-colors duration-200"
        >
          <Send className="w-5 h-5" />
          Submit Suggestion
        </button>
      </form>
    </>
  );
}