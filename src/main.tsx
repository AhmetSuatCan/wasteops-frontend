import React from 'react'
import ReactDOM from 'react-dom/client'
import router from "./routes";
import { RouterProvider } from "react-router-dom";
import '../style.css'
import 'leaflet/dist/leaflet.css';


ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
)

