import Category from "../models/Category";

export default {
    index: async (req, res) => {
        let { data, error } = await Category.findMany({ limit: 100, sort: { _id: 1 } });
        res.json(data)
    }
}