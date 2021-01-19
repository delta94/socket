import MongoDB, { getModel } from "core/model/MongoDB";
import { add_router } from "hooks/routerhook";
import { ObjectID } from "mongodb";
import { Cart, TableName } from "..";

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
    let { data, error } = await getModel(TableName.Category).findMany({ limit: 100, sort: { _id: 1 } });
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
    let { _id } = req.body
    let match;
    if (_id) {
        match = { _id }
    }
    let result = await Cart.insertOrUpdate(req.body, match)

    return res.json(result)
})

add_router('cart', async (req, res) => {
    let { _id, user } = req.body
    let match = {};
    if (_id) {
        match = { _id }
    }

    user = new ObjectID(user)
    let result = await Cart.insertOrUpdate({
        ...req.body,
        user,
        status: 'cart'
    }, match)

    return res.json(result)
})

add_router('update-cart', async (req, res) => {
    let { _id } = req.body
    let match = {};
    if (_id) {
        match = { _id }
    }
    let result = await Cart.insertOrUpdate(req.body, match)

    return res.json(result)
})


// add_router('/save-order', async (req, res) => {

// })

add_router('/profile/notification', async (req, res) => {

})

add_router('/profile/order', async (req, res) => {

})

add_router('/profile/wishlist', async (req, res) => {

})

// Phân trang, 
// Chuẩn bị tài liệu cho react-router-dom
// Chuẩn bị tài liệu cho nodejs lớp online