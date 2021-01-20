

import { add_router, add_router_group } from "hooks/routerhook";
import path from 'path'
import fetch from 'node-fetch'
import { CoinHistory, Course, Student, TableName } from "..";
import { Page, Token, User } from "app";
import { JWTMiddleware } from "app/models/Token";
import Register from "../models/Register";


add_router('elearning-home', async (req, res) => {


    let course = await Course.findMany();
    res.json(course)
})



add_router_group('elearning', () => {
    add_router_group('v4', () => {
        add_router('home', async (req, res) => {
            let offline = await Course.findMany({
                match: { course_type: "offline" },
                sort: { id: -1 },
                select: ['thumbnail', 'short_description', 'title', 'course_status', 'id', 'slug', 'course_type', 'teacher.avatar', 'teacher.title'],
                join: [
                    {
                        from: TableName.Teacher,
                        localField: 'teacher',
                        foreignField: 'id',
                        multi: false
                    }
                ]
            })

            let online = await Course.findMany({
                match: { course_type: "online" },
                limit: 3,
                sort: { id: -1 },
                select: ['thumbnail', 'short_description', 'title', 'course_status', 'id', 'slug', 'course_type', 'teacher.avatar', 'teacher.title'],
                join: [
                    {
                        from: TableName.Teacher,
                        localField: 'teacher',
                        foreignField: 'id',
                        multi: false
                    }
                ]
            })

            let review = await Student.findMany({
                limit: 8,
                select: ['review', 'title', 'avatar', 'created_time', 'facebook'],
                match: {
                    review: {
                        $exists: true
                    }
                }
            })

            let home = await Page.findOne({ match: { slug: 'elearning-home' } });
            res.json({
                offline: offline?.data,
                online: online?.data,
                ...home?.data
            })
        })

        add_router('login', async (req, res) => {
            if (req.method === "GET") return res.json({ error: 'method required is POST' })

            let { username, password, email } = req.body

            let { data, error } = await User.login({
                email: email || username, password
            })


            let result: any = { data, error }




            return res.json(result)
        })


        add_router('/register', async (req, res) => {
            if (req.method === "GET") return res.json({ error: 'method required is POST' })
            let { username, email } = req.body

            let { body } = req;
            let result = await User.register({ ...body, email: email || username })


            return res.json(result)
        })




        add_router('profile/course', JWTMiddleware, async (req, res) => {
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
        })

        add_router('profile/payment', JWTMiddleware, async (req, res) => {
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
        })

        add_router('profile/coint', JWTMiddleware, async (req, res) => {
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
        })
    })

    add_router('/', (req, res) => {

        res.sendFile(path.join(__dirname, 'views/login.html'));
    })

    add_router('signup', (req, res) => {
        let { code } = req.query;
        if (!code) {
            return res.send({
                success: false,
                message: 'Error: no code'
            })
        }

        fetch('https://github.com/login/oauth/access_token', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                client_id: 'Iv1.4b40382c26376e2e',
                client_secret: '11607a2d9637cb7ad17907adec2b6cc268010de9',
                code
            })
        })
            .then(res1 => res1.json())
            .then(res1 => {
                res.json(res1)
            })

        console.log('code', code)
    })
})