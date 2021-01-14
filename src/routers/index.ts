import { getAllModel } from "core/Model";
import { getModel } from "core/model/MongoDB";
import { add_router } from "hooks/routerhook";
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

    let { data } = await getModel('user').findOne({ match: { email: username, password } });

    if (data) {
        return res.json(data)
    }

    return res.json({ error: 'Username hoặc passowrd không đúng' });
})


add_router('/register', async (req, res) => {

    let { body } = req;
    let { error, data } = await getModel('user').insertOne(body)

    if (data) {
        return res.json(data)
    }

    return res.json(error)
})


add_router('/update-profile', async (req, res) => {

    let { username } = req.body

    let { data } = await getModel('user').findOne({ match: req.body });

    if (data) {
        return res.json(data)
    }

    return res.json({ error: 'Username hoặc passowrd không đúng' });
})

