import { getAllModel } from "core/Model";
import { getModel } from "core/model/MongoDB";
import { add_router } from "hooks/routerhook";
import { User, Ecommerce, Token } from "app/";
import { JWTMiddleware } from "app/models/Token";

// console.log(Ecommerce.Attribute)

add_router('test', (req, res) => {
    let models = getAllModel();
    console.log(models)
    let result = {};
    for (let i in models) {
        result[i] = {
            _fields: models[i]._fields
        }
    }
    res.json(result)
})

add_router('/login', async (req, res) => {

    let { username, password } = req.body

    let { data, error } = await User.login({
        email: username, password
    })

    return res.json({ data, error })


    // let { data } = await getModel('user').findOne({ match: { email: username, password } });

    if (data) {

        delete data.passowrd;

        let { data: token } = await getModel('token').findOne({ match: { email: username, password } });

        return res.json(data)
    }

    return res.json({ error: 'Username hoặc passowrd không đúng' });


    // let { email, password, accessToken: reqAccessToken } = req.body;

    // // let {data: user, error: userError} = await User.findOne({email});
    // // let { data: token, error: tokenError } = Token.findOne({email})

    // let [{ data: user, error: userError }, { data: token, error: tokenError }] = await Promise.all([User.findOne({ match: { email } }), Token.findOne({ match: { email } })])



    // if (user) {

    //     let { _id, avatar, name } = user;

    //     const accessToken = generateAccessToken(user);

    //     const refreshToken = jwt.sign({ email, _id }, (window as any).process.env.REFRESH_TOKEN_SECRET)

    //     let { data, error } = await User.updateOne({ _id }, { accessToken, refreshToken });
    //     console.log(data, error);

    //     // let [data, error] = await Token.insertOrUpdate({
    //     //     accessToken, refreshToken, user: user._id, email: user.email
    //     // })
    //     if (data) {
    //         return res.json({ accessToken, refreshToken, email, _id, avatar, name })
    //     } else {
    //         return res.sendStatus(500)
    //     }
    // } else {
    //     // return res.sendStatus(403)

    //     return res.json({
    //         error: 1, message: {
    //             email: 'Email not exists'
    //         }
    //     })
    // }
})

add_router('/logout', async (req, res) => {

    let { _id } = req.body

    let result = await Token.deleteById(_id);

    return res.json(result)
})


add_router('/register', async (req, res) => {

    let { body } = req;
    let result = await User.register(body)


    return res.json(result)
})


add_router('/update-profile', JWTMiddleware, async (req, res) => {

    let result = await User.updateInfo({
        ...req.user,
        ...req.body
    });

    return res.json(result)
    if (result.error) {
        return res.json(result)
    }



    return res.json({ error: 'Username hoặc passowrd không đúng' });
})

