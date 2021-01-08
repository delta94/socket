import { getModel } from "core/model/MongoDB";
import { add_router } from "hooks/routerhook";
import { TableName } from "..";

add_router('/product', async (req, res) => {

    let query: any = {}

    
    let queryField = getModel(TableName.Product).getQueryFilter(req.query);
    
    if(Object.keys(queryField).length > 0){
        query.match = queryField
    }

    console.log(query)

    let products = await getModel(TableName.Product).findMany(query);
    res.json(products)
})


add_router('/categories', async (req, res) => {


    

    let { data } = await getModel(TableName.Category).findMany({ limit: 100 });
    res.json(data)
})