import {BrowserRouter as Router, Routes, Route, useLocation} from "react-router-dom"
import {Sidebar} from "@/components/navigation/Sidebar"
import {MobileNav} from "@/components/navigation/MobileNav"
import {UserInfoBar} from "@/components/UserInfoBar"
import {Toaster} from "@/components/ui/toaster"
import {useTheme} from "@/hooks/useTheme"
import {useSidebar} from "@/hooks/useSidebar"
import {SidebarProvider} from "@/contexts/SidebarContext"
import {ProtectedRoute} from "@/components/ProtectedRoute"
import {cn} from "@/lib/utils"
import {Home} from "@/pages/Home"
import {Login} from "@/pages/Login"
import {Register} from "@/pages/Register"
import {Campaigns} from "@/pages/Campaigns"
import {OPIDashboard} from "@/pages/OPIDashboard"
import {MetricsChart} from "@/pages/MetricsChart"
import {FinancialReport} from "@/pages/FinancialReport"
import {PlanFact} from "@/pages/PlanFact"
import {UnitEconomics} from "@/pages/UnitEconomics"
import {DDS} from "@/pages/DDS"
import {Heatmap} from "@/pages/Heatmap"
import {PreDelivery} from "@/pages/PreDelivery"
import {Organization} from "@/pages/Organization"
import {Employees} from "@/pages/Employees"
import {Access} from "@/pages/Access"
import {Automation} from "@/pages/Automation"
import {AdvertisingRNP} from "@/pages/AdvertisingRNP"
import {Partners} from "@/pages/Partners"
import {ReferralAbout} from "@/pages/ReferralAbout"
import {ReferralOverview} from "@/pages/ReferralOverview"
import {ReferralNetwork} from "@/pages/ReferralNetwork"
import {ReferralIncome} from "@/pages/ReferralIncome"
import {ReferralPayments} from "@/pages/ReferralPayments"
import {ReferralSettings} from "@/pages/ReferralSettings"
import {Provider} from "react-redux";
import {store} from '@/store'

function AppContent() {
    const location = useLocation()
    const showSidebar = !["/", "/login", "/register"].includes(location.pathname)
    useTheme()
    const {isOpen} = useSidebar()

    return (
        <div className="min-h-screen bg-background flex w-full">
            {showSidebar && <Sidebar/>}
            {showSidebar && <MobileNav/>}
            <main className={cn(
                "flex-1 flex flex-col transition-all duration-300",
                showSidebar && isOpen ? "md:ml-64" : "ml-0 w-full"
            )}>
                {showSidebar && <UserInfoBar/>}
                <div className="flex-1 overflow-auto w-full">
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/register" element={<Register/>}/>
                        <Route
                            path="/campaigns"
                            element={
                                <ProtectedRoute>
                                    <Campaigns/>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <OPIDashboard/>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/management/opi-dashboard"
                            element={
                                <ProtectedRoute>
                                    <OPIDashboard/>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/management/opi-dashboard/chart"
                            element={
                                <ProtectedRoute>
                                    <MetricsChart/>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/management/opi-fin-report"
                            element={
                                <ProtectedRoute>
                                    <FinancialReport/>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/management/plan-fact"
                            element={
                                <ProtectedRoute>
                                    <PlanFact/>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/management/unit-economics"
                            element={
                                <ProtectedRoute>
                                    <UnitEconomics/>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/management/dds"
                            element={
                                <ProtectedRoute>
                                    <DDS/>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/management/heatmap"
                            element={
                                <ProtectedRoute>
                                    <Heatmap/>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/management/pre-delivery"
                            element={
                                <ProtectedRoute>
                                    <PreDelivery/>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/campaigns"
                            element={
                                <ProtectedRoute>
                                    <Organization/>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/settings/employees"
                            element={
                                <ProtectedRoute>
                                    <Employees/>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/settings/access"
                            element={
                                <ProtectedRoute>
                                    <Access/>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/management/ai-automation"
                            element={
                                <ProtectedRoute>
                                    <Automation/>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/management/advertising-rnp"
                            element={
                                <ProtectedRoute>
                                    <AdvertisingRNP/>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/partners"
                            element={
                                <ProtectedRoute>
                                    <Partners/>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/referral/about"
                            element={
                                <ProtectedRoute>
                                    <ReferralAbout/>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/referral/overview"
                            element={
                                <ProtectedRoute>
                                    <ReferralOverview/>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/referral/network"
                            element={
                                <ProtectedRoute>
                                    <ReferralNetwork/>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/referral/income"
                            element={
                                <ProtectedRoute>
                                    <ReferralIncome/>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/referral/payments"
                            element={
                                <ProtectedRoute>
                                    <ReferralPayments/>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/referral/settings"
                            element={
                                <ProtectedRoute>
                                    <ReferralSettings/>
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </div>
            </main>
            <Toaster/>
        </div>
    )
}

function App() {
    return (
        <Provider store={store}>
            <Router>
                <SidebarProvider>
                    <AppContent/>
                </SidebarProvider>
            </Router>
        </Provider>
    )
}

export default App
