import { getModel } from "core/model/MongoDB";
import { add_router } from "hooks/routerhook";
import { TableName } from "..";

add_router('/product', async (req, res) => {
    let { page, limit, sort }: any = req.query;
    if (!page) page = 1;
    if (!limit) limit = 15;
    if (!sort) sort = '_id.-1'

    sort = sort.split('.')
    let sortVal = parseInt(sort.pop());

    sort = {
        [sort.join('.')]: sortVal
    }

    let query: any = {
        page, limit, sort
    }


    let queryField = getModel(TableName.Product).getQueryFilter(req.query);

    if (Object.keys(queryField).length > 0) {
        query.match = queryField
    }

    let products = await getModel(TableName.Product).findMany(query);
    res.json(products)
})


add_router('/product/:id', async (req, res) => {
    let { id } = req.params;
    let { data } = await getModel(TableName.Product).findOne({ match: { id: parseInt(id) } })
    res.json(data);
})


add_router('/categories', async (req, res) => {
    let { data } = await getModel(TableName.Category).findMany({ limit: 100 });
    res.json(data)
})

add_router('/home/product', async (req, res) => {
    let { data: discount } = await getModel(TableName.Product).findMany({ sort: { discount_rate: -1 }, limit: 9 })
    let { data: hot } = await getModel(TableName.Product).findMany({ sort: { 'stock_item.qty': -1 }, limit: 9 })
    res.json({
        discount,
        hot
    })
})

add_router('order', async (req, res) => {
    return res.json({ success: true })
    let result = await getModel(TableName.Cart).insertOne(req.body);

    res.json(result)
})