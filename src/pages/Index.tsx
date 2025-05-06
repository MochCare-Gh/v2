
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-3xl mx-auto"
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
          MOCHCare
        </h1>
        <p className="mt-6 text-xl text-slate-600">
          An intelligent system designed to help midwives, healthcare administrators, and personnel
          efficiently manage maternal records and healthcare services.
        </p>
        
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="h-12 rounded-xl px-8">
            <Link to="/midwife">
              Midwife Dashboard
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 rounded-xl px-8">
            <Link to="/admin">
              Admin Dashboard
            </Link>
          </Button>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full"
      >
        <div className="glass-card p-6 rounded-xl flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <h3 className="text-lg font-semibold">Streamlined Workflow</h3>
          <p className="mt-2 text-sm text-slate-600">
            Efficiently manage mother registrations, visits, and healthcare services with an intuitive interface.
          </p>
        </div>
        
        <div className="glass-card p-6 rounded-xl flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-semibold">Comprehensive Records</h3>
          <p className="mt-2 text-sm text-slate-600">
            Maintain complete maternal health records with easy access to historical data and visit information.
          </p>
        </div>
        
        <div className="glass-card p-6 rounded-xl flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
          </div>
          <h3 className="text-lg font-semibold">Insightful Analytics</h3>
          <p className="mt-2 text-sm text-slate-600">
            Gain valuable insights into maternal healthcare metrics with detailed reports and analytics.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
