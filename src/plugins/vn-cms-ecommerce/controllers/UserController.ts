import { User } from "app";
import Cart from "../models/Cart";

export default {
    login: async (req, res) => {

        if (req.method === "GET") return res.json({ error: 'method required is POST' })

        let result: any = await User.login(req.body)

        if (result.data) {
            let cart = await Cart.getCartFromUser(result.data);

            if (cart.data) {
                result.cart = cart.data
            }
        }

        return res.json(result)

    }
}