
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Index from './pages/Index';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import AdminDashboard from './pages/AdminDashboard';
import MidwifeDashboard from './pages/MidwifeDashboard';
import NotFound from './pages/NotFound';
import Districts from './pages/admin/Districts';
import EditDistrict from './pages/admin/EditDistrict';
import CreateDistrict from './pages/admin/CreateDistrict';
import Facilities from './pages/admin/Facilities';
import EditFacility from './pages/admin/EditFacility';
import CreateFacility from './pages/admin/CreateFacility';
import Forms from './pages/admin/Forms';
import CreateForm from './pages/admin/CreateForm';
import MidwifeForms from './pages/midwife/Forms';
import FillForm from './pages/midwife/FillForm';
import Account from './pages/midwife/Account';
import UsersIndex from './pages/admin/users/UsersIndex';
import RolesIndex from './pages/admin/users/RolesIndex';
import PermissionsIndex from './pages/admin/users/PermissionsIndex';
import ApiKeys from './pages/admin/api/ApiKeys';
import ApiDocumentation from './pages/admin/api/ApiDocumentation';
import GeneralSettings from './pages/admin/settings/GeneralSettings';
import Mothers from './pages/admin/Mothers';
import MidwifeMothers from './pages/midwife/Mothers';
import AddMother from './pages/midwife/AddMother';
import MotherDetails from './pages/midwife/MotherDetails';
import Personnel from './pages/admin/Personnel';
import CreatePersonnel from './pages/admin/CreatePersonnel';
import { Toaster } from './components/ui/toaster';
import './App.css';
import { createDefaultAdmin } from './utils/createAdminUser';

function App() {
  useEffect(() => {
    // Create default admin user on application startup
    createDefaultAdmin();
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />
        <Route path="/admin/districts" element={<Districts />} />
        <Route path="/admin/districts/edit/:id" element={<EditDistrict />} />
        <Route path="/admin/districts/new" element={<CreateDistrict />} />
        <Route path="/admin/districts/create" element={<Navigate to="/admin/districts/new" replace />} />
        <Route path="/admin/facilities" element={<Facilities />} />
        <Route path="/admin/facilities/edit/:id" element={<EditFacility />} />
        <Route path="/admin/facilities/new" element={<CreateFacility />} />
        <Route path="/admin/facilities/create" element={<Navigate to="/admin/facilities/new" replace />} />
        <Route path="/admin/forms" element={<Forms />} />
        <Route path="/admin/forms/new" element={<CreateForm />} />
        <Route path="/admin/forms/create" element={<Navigate to="/admin/forms/new" replace />} />
        <Route path="/admin/mothers" element={<Mothers />} />
        <Route path="/admin/personnel" element={<Personnel />} />
        <Route path="/admin/personnel/new" element={<CreatePersonnel />} />
        <Route path="/admin/personnel/create" element={<Navigate to="/admin/personnel/new" replace />} />
        
        {/* Admin User Management Routes */}
        <Route path="/admin/users" element={<UsersIndex />} />
        <Route path="/admin/users/roles" element={<RolesIndex />} />
        <Route path="/admin/users/permissions" element={<PermissionsIndex />} />
        <Route path="/admin/settings" element={<Navigate to="/admin/settings/general" replace />} />
        
        {/* Admin API Routes */}
        <Route path="/admin/api/keys" element={<ApiKeys />} />
        <Route path="/admin/api/documentation" element={<ApiDocumentation />} />
        <Route path="/admin/api" element={<Navigate to="/admin/api/keys" replace />} />
        
        {/* Admin Settings Routes */}
        <Route path="/admin/settings/general" element={<GeneralSettings />} />
        
        {/* Midwife Routes */}
        <Route path="/midwife" element={<MidwifeDashboard />} />
        <Route path="/midwife/dashboard" element={<Navigate to="/midwife" replace />} />
        <Route path="/midwife/forms" element={<MidwifeForms />} />
        <Route path="/midwife/forms/:id" element={<FillForm />} />
        <Route path="/midwife/account" element={<Account />} />
        <Route path="/midwife/mothers" element={<MidwifeMothers />} />
        <Route path="/midwife/mothers/:id" element={<MotherDetails />} />
        <Route path="/midwife/mothers/add" element={<AddMother />} />
        <Route path="/midwife/mothers/new" element={<Navigate to="/midwife/mothers/add" replace />} />
        <Route path="/midwife/mothers/create" element={<Navigate to="/midwife/mothers/add" replace />} />
        <Route path="/midwife/register-mother" element={<Navigate to="/midwife/mothers/add" replace />} />
        <Route path="/register-mother" element={<Navigate to="/midwife/mothers/add" replace />} />
        <Route path="/search" element={<Navigate to="/midwife/mothers" replace />} />
        
        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
