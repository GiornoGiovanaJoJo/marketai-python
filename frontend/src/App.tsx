import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'

// Auth pages
import Login from '@/pages/Login/Login'
import Register from '@/pages/Register'

// Main pages  
import Home from '@/pages/Home'
import { Dashboard } from '@/pages/Dashboard'
import { Campaigns } from '@/pages/Campaigns'

// Advertising
import AdvertisingRNP from '@/pages/AdvertisingRNP'
import DDS from '@/pages/DDS'

// Reports
import FinancialReport from '@/pages/FinancialReport/FinancialReport'
import PlanFact from '@/pages/PlanFact'
import UnitEconomics from '@/pages/UnitEconomics'
import MetricsChart from '@/pages/MetricsChart'
import Heatmap from '@/pages/Heatmap'

// Organization
import { Organization } from '@/pages/Organization'
import { Employees } from '@/pages/Employees'
import Partners from '@/pages/Partners'
import { Access } from '@/pages/Access'

// Automation
import Automation from '@/pages/Automation'
import PreDelivery from '@/pages/PreDelivery'

// OPI
import OPIDashboard from '@/pages/OPIDashboard'

// Referral
import ReferralOverview from '@/pages/ReferralOverview'
import ReferralNetwork from '@/pages/ReferralNetwork'
import ReferralIncome from '@/pages/ReferralIncome'
import ReferralAbout from '@/pages/ReferralAbout'
import ReferralPayments from '@/pages/ReferralPayments'
import ReferralSettings from '@/pages/ReferralSettings'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/campaigns" element={<Campaigns />} />

          {/* Advertising */}
          <Route path="/advertising/rnp" element={<AdvertisingRNP />} />
          <Route path="/advertising/dds" element={<DDS />} />

          {/* Reports */}
          <Route path="/reports/financial" element={<FinancialReport />} />
          <Route path="/reports/plan-fact" element={<PlanFact />} />
          <Route path="/reports/unit-economics" element={<UnitEconomics />} />
          <Route path="/reports/metrics" element={<MetricsChart />} />
          <Route path="/reports/heatmap" element={<Heatmap />} />

          {/* Organization */}
          <Route path="/organization" element={<Organization />} />
          <Route path="/organization/employees" element={<Employees />} />
          <Route path="/organization/partners" element={<Partners />} />
          <Route path="/organization/access" element={<Access />} />

          {/* Automation */}
          <Route path="/automation" element={<Automation />} />
          <Route path="/automation/pre-delivery" element={<PreDelivery />} />

          {/* OPI */}
          <Route path="/opi" element={<OPIDashboard />} />

          {/* Referral */}
          <Route path="/referral" element={<ReferralOverview />} />
          <Route path="/referral/network" element={<ReferralNetwork />} />
          <Route path="/referral/income" element={<ReferralIncome />} />
          <Route path="/referral/about" element={<ReferralAbout />} />
          <Route path="/referral/payments" element={<ReferralPayments />} />
          <Route path="/referral/settings" element={<ReferralSettings />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Global toast notifications */}
        <Toaster />
      </div>
    </Router>
  )
}

export default App
