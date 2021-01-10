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

    let { data } = await getModel('user').findOne({ match: { username, password } });

    if (!data) {
        return res.json(data)
    }

    return res.json({ error: 'Username hoặc passowrd không đúng' });
})