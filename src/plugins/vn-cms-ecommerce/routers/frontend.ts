import { getModel } from "core/model/MongoDB";
import { add_router } from "hooks/routerhook";
import { TableName } from "..";

add_router('/product', async (req, res) => {
    let { page, limit, sort }: any = req.query;
    if (!page) page = 1;
    if (!limit) limit = 15;
    if (!sort) sort = '_id.-1'

    sort = sort.split('.')

    sort = {
        [sort[0]]: parseInt(sort[1])
    }

    let query: any = {
        page, limit, sort
    }


    let queryField = getModel(TableName.Product).getQueryFilter(req.query);

    if (Object.keys(queryField).length > 0) {
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