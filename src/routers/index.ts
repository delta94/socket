import { getAllModel } from "core/Model";
import { add_router } from "hooks/routerhook";
add_router('test', (req, res) => {
    let models = getAllModel();
    console.log(models)
    let result = {};
    for(let i in models){
        result[i] = {
            _fields: models[i]._fields
        }
    }
    res.json(result)
})