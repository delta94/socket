import Cache from "core/Cache";
import { getModel } from "core/model/MongoDB";
import { add_router } from "hooks/routerhook";

add_router('blog', async (req, res) => {

    let data = await Cache.rememeber('index', async () => {
        let Blog = getModel('blog_post');
        let { data, paginate } = await Blog.find()
        return { data, paginate }
    })
    res.json(data)
})

add_router('clear-cache', (req, res) => {
    Cache.forget();

    res.json({ sucess: true })
})