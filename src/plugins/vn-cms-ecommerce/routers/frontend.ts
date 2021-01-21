import { add_router, add_router_group } from "hooks/routerhook";
import CartController from "../controllers/CartController";
import CategoryController from "../controllers/CategoryController";
import ProductController from "../controllers/ProductController";
import ProfileController from "../controllers/ProfileController";
import UserController from "../controllers/UserController";

add_router('/product', ProductController.product)

add_router('/product/:id', ProductController.product_id)

add_router('/categories', CategoryController.index)

add_router('/home/product', ProductController.home_product)


add_router_group('ecommerce/v1', () => {
    add_router('login', 'post', UserController.login)

    add_router('order', 'post', CartController.order)

    add_router('cart', 'post', CartController.cart)

    add_router('update-cart/:_id', 'post', CartController.update)

    add_router('profile/notification', ProfileController.notification)

    add_router('profile/order', ProfileController.order)

    add_router('profile/wishlist', ProfileController.wishlist)
})