import { ObjectID } from "mongodb";
import Cart from "../models/Cart";

export default {
    cart: async (req, res) => {
        let { user } = req.body
        user = new ObjectID(user)

        let match = { user, status: 'cart' };
        let result = await Cart.insertOrUpdate({
            ...req.body,
            user,
            status: 'cart'
        }, match)

        return res.json(result)
    },
    update: async (req, res) => {
        let { _id } = req.params
        let { add, remove, decrement, increment, shipping, payment } = req.body

        let match = {};
        if (_id) {
            match = { _id }
        }
        let result = await Cart.insertOrUpdate(req.body, match)

        return res.json(result)
    },
    order: async (req, res) => {
        let { _id } = req.body
        let match;
        if (_id) {
            match = { _id }
        }
        let result = await Cart.insertOrUpdate(req.body, match)

        return res.json(result)
    }
}