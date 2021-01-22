

import { add_router, add_router_group } from "hooks/routerhook";
import path from 'path'
import fetch from 'node-fetch'
import { CoinHistory, Course, Student, TableName } from "..";
import { Page, Token, User } from "app";
import { JWTMiddleware } from "app/models/Token";
import Register from "../models/Register";
import PageController from "../controllers/PageController";
import UserController from '../controllers/UserController'
import CourseController from "../controllers/CourseController";




add_router_group('elearning', () => {
    add_router_group('v4', () => {
        add_router('home', PageController.home)

        add_router('courses', PageController.course)

        add_router('contact', 'post', PageController.contact)

        add_router('login', 'post', UserController.login)

        add_router('/register', 'post', UserController.register)

        add_router('profile/update', 'post', JWTMiddleware, UserController.update)

        add_router('profile/course', JWTMiddleware, UserController.profile_course)

        add_router('profile/payment', JWTMiddleware, UserController.profile_payment)

        add_router('profile/coint', JWTMiddleware, UserController.profile_coin)

        add_router('course/:slug', PageController.course_detail)

        add_router('course-register/:slug', 'post', JWTMiddleware, CourseController.register)
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