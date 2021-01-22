import { User } from "app"
import { ObjectID } from "mongodb"
import { CoinHistory, TableName } from ".."
import Register from "../models/Register"

export default {
    login: async (req, res) => {
        if (req.method === "GET") return res.json({ error: 'method required is POST' })

        let { username, password, email } = req.body

        let { data, error } = await User.login({
            email: email || username, password
        })


        let result: any = { data, error }

        return res.json(result)
    },
    register: async (req, res) => {
        if (req.method === "GET") return res.json({ error: 'method required is POST' })
        let { username, email } = req.body

        let { body } = req;
        let result = await User.register({ ...body, email: email || username })


        return res.json(result)
    },
    update: async (req, res) => {
        let { user } = req;
        if (user?._id) {
            let result = await User.updateOne({ _id: new ObjectID(user._id) }, req.body)
            return res.json(result)
        }
        return res.json({ error: 'User not exists!' })
    },
    profile_course: async (req, res) => {
        if (req.method === "GET") return res.json({ error: 'method requred is POST' })

        // let { accessToken } = req.body;

        let courses = await Register.findMany({
            match: {
                student: req.user.id
            },
            join: [
                {
                    from: TableName.Course,
                    localField: 'course',
                    foreignField: 'id',
                    multi: false
                }
            ],
            select: ['trang_thai', 'course.title', 'course.thumbnail', 'course.opening_time', 'course.opening_time', 'course.course_status', 'course.course_type', 'course.count_video', 'course.slug']
        })

        res.json(courses)
    },
    profile_payment: async (req, res) => {
        if (req.method === "GET") return res.json({ error: 'method requred is POST' })

        // let { accessToken } = req.body;

        let courses = await Register.findMany({
            match: {
                student: req.user.id
            },
            limit: 1000,
            join: [
                {
                    from: TableName.Course,
                    localField: 'course',
                    foreignField: 'id',
                    multi: false
                }
            ],
            select: ['trang_thai', 'payment', 'course.title']
        })

        res.json(courses)
    },
    profile_coin: async (req, res) => {
        if (req.method === "GET") return res.json({ error: 'method requred is POST' })

        // let { accessToken } = req.body;
        let courses = await CoinHistory.findMany({
            match: {
                student: req.user.id
            },
            limit: 1000,
            join: [
                // {
                //     from: TableName.Course,
                //     localField: 'course',
                //     foreignField: 'id',
                //     multi: false
                // },
                // {
                //     from: TableName.Register,
                //     localField: 'course_register',
                //     foreignField: 'id',
                //     multi: false
                // },
                // {
                //     from: TableName.Course,
                //     localField: 'course_register.course',
                //     foreignField: 'id',
                //     multi: false
                // },
            ],
            select: ['coint', 'created_time', 'title', 'trang_thai']
        })

        res.json(courses)
    }
}