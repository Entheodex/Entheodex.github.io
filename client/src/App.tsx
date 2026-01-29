import { Switch, Route, Router as WouterRouter } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "./pages/Home";
import { IdleMelter } from "./components/IdleMelter";

/**
 * Main App Component
 * 
 * Root component that sets up routing, state management, and global UI.
 * 
 * Routing:
 * - Uses Wouter with useHashLocation hook for static hosting compatibility
 * - Hash-based routing (e.g., /#/path) works with GitHub Pages and static hosts
 * - All navigation should use <Link href="/path"> syntax (NOT <Link to="/path">)
 * 
 * State Management:
 * - React Query for server data fetching
 * - LocalStorage for session persistence
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Hash-based routing for static hosting compatibility */}
      <WouterRouter hook={useHashLocation}>
        
       <div 
  className="fixed inset-0 z-0 opacity-100 pointer-events-none"
  style={{
    backgroundImage: `url("https://images.squarespace-cdn.com/content/v1/54d62664e4b092010cefeec8/1613932153688-YQXOUZBBK8OB8S239FF2/podcast.jpg")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  }}
/>
        

        {/* 2. Main Wrapper: Handles the full screen height and scroll */}
        <div className="min-h-screen w-full text-white relative overflow-x-hidden">
          
          {/* 3. Centered Container: Limits width for EVERYTHING inside (Cards, Melter, Header) */}
          <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">
            
            {/* The Melter is now INSIDE the centered box */}
            <IdleMelter />

            <header className="text-center mb-12 mt-8">
               <h1 className="text-5xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                 THE ENTHEODEX
               </h1>
            </header>

            <main>
              <Switch>
                <Route path="/" component={Home} />
                <Route component={NotFound} />
              </Switch>
            </main>

          </div>
        </div>

        <Toaster />
        
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;