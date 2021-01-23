import { getAllModel } from "core/Model";
import { getModel } from "core/model/MongoDB";
import { add_router } from "hooks/routerhook";
import { User, Ecommerce, Token } from "app/";
import { JWTMiddleware } from "app/models/Token";
import { Cart } from "plugins/vn-cms-ecommerce";

// console.log(Ecommerce.Attribute)

add_router('test', (req, res) => {
    let models = getAllModel();
    let result = {};
    for (let i in models) {
        result[i] = {
            _fields: models[i]._fields
        }
    }
    res.json(result)
})

add_router('/login', async (req, res) => {

    if (req.method === "GET") return res.json({ error: 'method required is POST' })

    let { username, password, email } = req.body


    let { data, error } = await User.login({
        email: email || username, password
    })

    let result: any = { data, error }



    if (data) {
        let cart = await Cart.getCartFromUser(data);

        if (cart.data) {
            result.cart = cart.data
        }
    }

    return res.json(result)
})

add_router('/logout', async (req, res) => {

    let { _id } = req.body

    let result = await Token.deleteById(_id);

    return res.json(result)
})


add_router('/register', async (req, res) => {
    if (req.method === "GET") return res.json({ error: 'method required is POST' })


    let { body } = req;
    let result = await User.register(body)


    return res.json(result)
})


add_router('/update-profile', JWTMiddleware, async (req, res) => {
    if (req.method === "GET") return res.json({ error: 'method required is POST' })

    let result = await User.updateInfo({
        ...req.user,
        ...req.body
    });

    return res.json(result)
})

