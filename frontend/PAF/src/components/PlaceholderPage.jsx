import { SparklesIcon } from "@heroicons/react/24/outline";

const PlaceholderPage = ({ title }) => (
  <main className="relative min-h-screen flex-1 overflow-hidden bg-gradient-to-br from-black via-orange-800 to-black">
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-float" />
      <div
        className="absolute bottom-0 right-0 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "3s" }}
      />
    </div>
    <div className="relative z-10 max-w-4xl mx-auto w-full px-4 py-16">
      <div className="glass-card p-10 animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg animate-pulse-glow">
            <SparklesIcon className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text">{title}</h1>
        </div>
        <p className="text-orange-200/80">
          This page is a placeholder. Add your content here.
        </p>
      </div>
    </div>
  </main>
);

export default PlaceholderPage;
