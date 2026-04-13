export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <span className="text-lg font-semibold text-gray-900">VideoChat AI</span>
            <p className="text-sm text-gray-500">
              Transcribe videos and generate AI-powered completions
            </p>
          </div>
          
          <nav className="flex gap-6">
            <a 
              href="/terms" 
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Terms of Service
            </a>
            <a 
              href="/privacy" 
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Privacy Policy
            </a>
          </nav>
        </div>
        
        <div className="mt-8 border-t border-gray-100 pt-8">
          <p className="text-center text-sm text-gray-500">
            © {year} VideoChat AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
