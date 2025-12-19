import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

import Home from "../pages/Home/Home";
import Agendamento from "../pages/Home/Agendamento";
import Inbound from "../pages/Home/Inbound";
import Inventario from "../pages/Home/Inventario";
import Mobile from "../pages/Home/Mobile";
import Outbound from "../pages/Home/Outbound";
import Relatorio from "../pages/Home/Relatorio";
import Login from "../pages/Login";
import Cadastro from "../pages/Cadastro";


export default function AppRoutes() {
return (
    <Routes>
  
    <Route element={<MainLayout />}>
        <Route path="/home" element={<Home />} />     
        <Route path="/agendamento" element={<Agendamento />} />
        <Route path="/inbound" element={<Inbound />} />
        <Route path="/inventario" element={<Inventario/>} />
        <Route path="/mobile" element={<Mobile/>} />
        <Route path="/outbound" element={<Outbound/>} />
        <Route path="/relatorio" element={<Relatorio/>} />
    </Route>
    
    
    <Route  element={<AuthLayout />}>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
    </Route>
</Routes>
);
}