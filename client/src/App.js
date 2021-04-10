import React from "react";
import "./App.css";
import {Switch, Route} from "react-router-dom";
import Footer from "./components/Footer/Footer.jsx";
import Header from "./components/Header/Header.jsx";
import Home from "./components/Body/Home/Home";
//import Catalogue from "./components/Body/Home/Catalogue/Catalogue";
import ProductDetail from "./components/Body/ProductComponents/ProductDetail/ProductDetail";
import AddProduct from "./components/Body/Admin/AddProduct/AddProduct";
import AdminCategoryPanel from "./components/Body/Admin/AdminCategoryPanel/AdminCategoryPanel";
import AddCategory from "./components/Body/Admin/AddCategory/AddCategory";
import EditProduct from "./components/Body/Admin/EditProduct/EditProduct";
import EditCategory from "./components/Body/Admin/EditCategory/EditCategory";
import Admin from "./components/Body/Admin/Admin";
import ProductAddCategory from "./components/Body/Admin/ProductAddCategory/ProductAddCategory";
import CategoryCatalogue from "./components/Body/Home/Catalogue/CategoryCatalogue";
import Cart from "./components/Body/CartComponents/Cart/Cart";
import Register from "./components/Body/user/Register";
import UsersPanel from "./components/Body/Admin/UsersPanel/UsersPanel";
import Login from "./components/Body/user/Login";
import OrdersPanel from "./components/Body/Admin/OrdersPanel/OrdersPanel";

//import AdminProductDetail from "./components/Body/Admin/AdminProductDetail/AdminProductDetail.jsx;
import AdminProductDetail from "./components/Body/Admin/AdminProductDetail/AdminProductDetail.jsx";
import Me from "./components/Body/user/Me/Me";
import NavBarMe from "./components/Body/user/Me/NavBarMe";
import HistorialCompras from "./components/Body/user/Me/HistorialCompras";
import Profile from "./components/Body/user/Me/Profile";
import Checkout from "./components/Body/CartComponents/Checkout/Checkout";
import CheckoutUnlogin from "./components/Body/CartComponents/Checkout/CheckoutUnlogin";
import PasswordResetButton from "./components/Body/user/PasswordResetButton/PasswordResetButton"
import PasswordResetForm from "./components/Body/user/PasswordResetForm/PasswordResetForm"
import CkoMpFail from "./components/Body/CartComponents/Checkout/CkoMpFail";
import CkoMpSuccess from "./components/Body/CartComponents/Checkout/CkoMpSuccess";

function App() {
    return (
        <>
            <Route path="/" render={() => <Header/>}></Route>
            <Switch>
                <div className="App">
                    <Route path="/" exact render={() => <Home/>}/>
                    <Route
                        exact
                        path="/product-category"
                        render={() => <CategoryCatalogue/>}
                    />
                    {/* <Route path="/products" exact render={() => <Catalogue />} />  */}
                    <Route
                        exact
                        path="/products/:id"
                        render={({match}) => <ProductDetail match={match}/>}
                    />
                    <Route path="/admin" exact render={() => <Admin/>}/>
                    <Route path="/register" exact render={() => <Register/>}/>
                    <Route path="/login" exact render={() => <Login/>}/>
                    {/*<Route path="/me" render={() => <NavBarMe/>}/>*/}
                    <Route path="/me" exact render={() => <Me/>}/>
                    <Route
                        path="/me/historial"
                        exact
                        render={() => <HistorialCompras/>}
                    />
                    <Route path="/me/profile" exact render={() => <Profile/>}/>
                    <Route path="/cart" exact render={() => <Cart/>}/>
                    <Route path="/admin/products" exact render={() => <AddProduct/>}/>

                    <Route
                        path="/admin/edit_product/:id"
                        exact
                        render={({match}) => <EditProduct match={match}/>}
                    />
                    <Route
                        path="/admin/product_detail/:id"
                        exact
                        render={({match}) => <AdminProductDetail match={match}/>}
                    />
                    <Route
                        path="/admin/categories"
                        exact
                        render={() => <AdminCategoryPanel/>}
                    />
                    <Route
                        path="/admin/add_categories"
                        exact
                        render={() => <AddCategory/>}
                    />
                    <Route
                        path="/admin/edit_category/:id"
                        exact
                        render={({match}) => <EditCategory match={match}/>}
                    />
                    <Route
                        path="/admin/productAddCategory"
                        exact
                        render={() => <ProductAddCategory/>}
                    ></Route>
                    <Route
                        path="/admin/orders"
                        exact
                        render={() => <OrdersPanel/>}
                    ></Route>
                    <Route
                        path="/admin/users"
                        exact
                        render={() => <UsersPanel/>}
                    ></Route>
                    <Route
                        path="/checkout/:orderId"
                        exact
                        render={({match}) => <Checkout match={match}/>}
                    />
                    <Route
                        path="/checkoutunlogin"
                        exact
                        render={() => <CheckoutUnlogin/>}
                    />
                    <Route
                        path="/password_reset"
                        exact
                        render={() => <PasswordResetButton/>}
                    />
                    <Route
                        path="/password_reset_form/:id"
                        exact
                        render={({match}) => <PasswordResetForm match={match}/>}
                    />
                    <Route
                        path="/mercadopago/fail"
                        exact
                        render={() => <CkoMpFail/>}
                    />
                    <Route
                        path="/mercadopago/success"
                        exact
                        render={() => <CkoMpSuccess/>}
                    />
                </div>
            </Switch>
            <Footer/>
        </>
    );
}

export default App;
