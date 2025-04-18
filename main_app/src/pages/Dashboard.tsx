
import React from 'react';
import { 
  BarChart2, Trash2, Map, AlertTriangle, 
  Droplets, ArrowUpRight, TrendingUp, Activity 
} from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import StreamlitEmbed from '../components/StreamlitEmbed';

const Dashboard = () => {
  return (
    <div className="pt-20 min-h-screen flex flex-col">
      {/* Page Header */}
      <header className="py-8 px-4">
        <div className="container mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Waste Detection Dashboard</h1>
            <p className="text-foreground/70">
              Monitor and analyze marine waste detection metrics and trends
            </p>
          </div>
          
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
            <DashboardCard 
              title="Total Waste Detected" 
              value={2587} 
              unit="tons" 
              icon={Trash2}
              trend={12}
            />
            <DashboardCard 
              title="Active Detection Points" 
              value={156} 
              icon={Map}
              trend={-8}
              color="warning"
            />
            <DashboardCard 
              title="Critical Areas" 
              value={23} 
              icon={AlertTriangle}
              trend={5}
              color="danger"
            />
            <DashboardCard 
              title="Water Quality Index" 
              value={72} 
              unit="%" 
              icon={Droplets}
              trend={4}
              color="success"
            />
          </div>
        </div>
      </header>
      
      {/* Main Dashboard Content */}
      <main className="flex-1 px-4 pb-12">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main chart section */}
            <div className="lg:col-span-2 glass-container rounded-xl p-5">
              <div className="flex justify-between items-center mb-5">
                <h2 className="font-semibold flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-ocean" />
                  Waste Detection Trends
                </h2>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm rounded-md bg-secondary">Daily</button>
                  <button className="px-3 py-1 text-sm rounded-md bg-secondary/50">Weekly</button>
                  <button className="px-3 py-1 text-sm rounded-md bg-secondary/50">Monthly</button>
                </div>
              </div>
              
              {/* Placeholder for chart */}
              <div className="bg-secondary/50 rounded-lg h-64 flex items-center justify-center">
                <span className="text-foreground/50">Chart visualization will appear here</span>
              </div>
              
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="p-3 rounded-lg bg-secondary/50">
                  <div className="text-sm text-foreground/70 mb-1">Plastic Waste</div>
                  <div className="flex items-baseline">
                    <span className="text-xl font-semibold">1,245</span>
                    <span className="text-xs text-foreground/50 ml-1">tons</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50">
                  <div className="text-sm text-foreground/70 mb-1">Industrial</div>
                  <div className="flex items-baseline">
                    <span className="text-xl font-semibold">865</span>
                    <span className="text-xs text-foreground/50 ml-1">tons</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50">
                  <div className="text-sm text-foreground/70 mb-1">Other</div>
                  <div className="flex items-baseline">
                    <span className="text-xl font-semibold">477</span>
                    <span className="text-xs text-foreground/50 ml-1">tons</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Side panel */}
            <div className="glass-container rounded-xl p-5">
              <div className="flex justify-between items-center mb-5">
                <h2 className="font-semibold flex items-center">
                  <Activity className="w-4 h-4 mr-2 text-ocean" />
                  Recent Detections
                </h2>
                <button className="text-ocean text-sm flex items-center">
                  View All
                  <ArrowUpRight className="w-3 h-3 ml-1" />
                </button>
              </div>
              
              <div className="space-y-4">
                {[
                  { location: "Pacific Coast, CA", time: "2 hours ago", amount: "15.3 tons", type: "Plastic" },
                  { location: "Gulf of Mexico", time: "5 hours ago", amount: "23.7 tons", type: "Industrial" },
                  { location: "Great Lakes", time: "8 hours ago", amount: "8.2 tons", type: "Mixed" },
                  { location: "Atlantic Coast, FL", time: "12 hours ago", amount: "11.9 tons", type: "Plastic" },
                  { location: "Caribbean Sea", time: "1 day ago", amount: "31.5 tons", type: "Industrial" }
                ].map((item, index) => (
                  <div key={index} className="p-3 border border-white/5 rounded-lg hover:bg-secondary/30 transition-colors">
                    <div className="flex justify-between">
                      <div className="font-medium">{item.location}</div>
                      <span className="text-xs text-foreground/50">{item.time}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <div className="text-foreground/70 text-sm">{item.type}</div>
                      <div className="text-sm font-medium">{item.amount}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Streamlit Embed Section */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Model Integration</h2>
            <p className="text-foreground/70 mb-6">
              Access our Streamlit-powered AI waste detection model directly from the dashboard.
            </p>
            <StreamlitEmbed url="https://seadetection.streamlit.app/" height="600px" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
