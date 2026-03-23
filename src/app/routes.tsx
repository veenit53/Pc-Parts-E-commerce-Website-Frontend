import { createBrowserRouter } from "react-router";
import { HomePage } from "./pages/home-page";
import { LoginPage } from "./pages/login-page";
import { RegisterPage } from "./pages/register-page";
import { ProductListingPage } from "./pages/product-listing-page";
import { ProductDetailPage } from "./pages/product-detail-page";
import { ProfilePage } from "./pages/profile-page";
import { AdminDashboard } from "./pages/admin-dashboard";
import { AdminProductsPage } from "./pages/admin-product-page";
import { AddProductPage } from "./pages/admin-add-product-page";
import { EditProductPage } from "./pages/edit-product-page";
import { AdminOrdersPage } from "./pages/admin-order-page";
import { CartPage } from "./pages/cart-page";
import { CheckoutPage } from "./pages/checkout-page";
import { OrderSuccessPage } from "./pages/order-success-page";
import { OrdersPage } from "./pages/orders-page";
import { OrderDetailsPage } from "./pages/order-detail-page";
import { PCBuilderPage } from "./pages/pc-builder-page";

export const router = createBrowserRouter([
    { path: "/", element: <HomePage /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/register", element: <RegisterPage /> },
    { path: "/products", element: <ProductListingPage /> },
    { path: "/products/:category", element: <ProductListingPage /> },
    { path: "/product/:id", element: <ProductDetailPage /> },
    { path: "/profile", element: <ProfilePage /> },
    { path: "/admin", element: <AdminDashboard /> },
    { path: "/admin/products", element: <AdminProductsPage /> },
    { path: "/admin/products/add", element: <AddProductPage /> },
    { path: "/admin/products/edit/:id", element: <EditProductPage /> },
    { path: "/admin/orders", element: <AdminOrdersPage /> },
    { path: "/cart", element: <CartPage /> },
    { path: "/checkout", element: <CheckoutPage /> },
    { path: "/order-success/:id", element: <OrderSuccessPage /> },
    { path: "/orders", element: <OrdersPage /> },
    { path: "/orders/:id", element: <OrderDetailsPage /> },
    { path: "/pc-builder", element: <PCBuilderPage /> }

]);
