// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // Add HEX/RGB equivalents for colors used in your resume preview
        // that might be causing issues.
        // Find these from the official Tailwind docs for your version.
        // Example:
        'blue-50': '#EFF6FF',   // Example, get actual from docs
        'blue-200': '#BFDBFE',
        'blue-500': '#3B82F6',
        'blue-600': '#2563EB',
        'blue-700': '#1D4ED8',
        'gray-50': '#F9FAFB',
        'gray-100': '#F3F4F6',
        'gray-200': '#E5E7EB',
        'gray-300': '#D1D5DB',
        'gray-500': '#6B7280',
        'gray-600': '#4B5563',
        'gray-700': '#374151',
        'gray-800': '#1F2937',
        'green-600': '#16A34A',
        'red-100': '#FEE2E2',
        'red-600': '#DC2626',
        // ... any other colors you use in the preview template
      },
    },
  },
  plugins: [],
  safelist: [
    'text-lg',
    'text-sm',
    'leading-6',
    'font-medium',
    'text-gray-900',
    'text-gray-500',
    'text-gray-700',
    'text-white',
    'bg-gray-600',
    'bg-opacity-50',
    'bg-white',
    'bg-blue-500',
    'bg-gray-300',
    'hover:bg-blue-600',
    'hover:bg-gray-400',
    'rounded-md',
    'shadow-lg',
    'space-x-3',
    'space-x-4',
    'inset-0',
    'top-20',
    'mt-2',
    'mt-3',
    'mt-4',
    'p-2',
    'p-5',
    'px-4',
    'py-2',
    'w-96',
    'w-full',
    'h-full',
    'fixed',
    'relative',
    'flex',
    'justify-end',
    'items-center',
    'overflow-y-auto'
  ]
}