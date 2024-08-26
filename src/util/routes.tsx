
import DashboardPage from "../pages/dashboad"
import LoginPage from "../pages/login"
import SignUpPage from "../pages/signup"
import Home from "../pages/home"
export const publicRoutes=[
    {
        path:'/',
        elements:<Home/>
    },
    {
        path:'/login',
        elements:<LoginPage/>
    },
    {
        path:'/signup',
        elements:<SignUpPage/>
    }
]

export const privateRoutes=[
    {
        path:'/dashboard',
        elements:<DashboardPage/>
    }
]