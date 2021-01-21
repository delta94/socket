import Product from "../models/Product"

export default {
    home_product: async (req, res) => {
        let { data: discount } = await Product.findMany({ sort: { discount_rate: -1 }, limit: 9 })
        let { data: hot } = await Product.findMany({ sort: { 'stock_item.qty': -1 }, limit: 9 })
        res.json({
            discount,
            hot
        })
    },
    product_id: async (req, res) => {
        let { id } = req.params;
        let { data } = await Product.findOne({ match: { id: parseInt(id) } })
        res.json(data);
    },
    product: async (req, res) => {
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


        let queryField = Product.getQueryFilter(req.query);

        if (Object.keys(queryField).length > 0) {
            query.match = queryField
        }

        let products = await Product.findMany(query);
        res.json(products)
    }
}