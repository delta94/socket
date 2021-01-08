import { getModel } from "core/model/MongoDB";
import { add_router } from "hooks/routerhook";
import { TableName } from "..";

add_router('/product', async (req, res) => {
    let products = await getModel(TableName.Product).findMany({match: {categories: 4221}});
    res.json(products)
})