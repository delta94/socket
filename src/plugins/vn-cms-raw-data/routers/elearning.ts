import { add_router, add_router_group } from "hooks/routerhook"

import rp from "request-promise";
import { rawAPI, rawHTML } from "..";
import { CoinHistory, Course, Register, Student, Teacher } from "plugins/vn-cms-elearning";
import { Page } from "app";

add_router_group('elearning', () => {
    add_router('raw', async (req, res) => {
        // let teacher = await rawTeacher();

        // let teacherResult = await Teacher.insertMany(teacher)
        // console.log('teacherResult', teacherResult)

        // let courses = await rawCourse();

        // let courseResult = await Course.insertMany(courses)
        // console.log('courseResult', courseResult)


        // let student = await rawStudent()

        // let studentResult = await Student.insertMany(student)
        // console.log('studentResult', studentResult)



        // let register = await rawRegister()
        // let registerResult = await Register.insertMany(register)
        // console.log('registerResult', registerResult)


        // let coin = await rawCoinHistory();
        // let coinResult = await CoinHistory.insertMany(coin)
        // console.log('coinResult', coinResult)


        let home = await rawHome();
        let result = await Page.insertOrUpdate({ ...home, slug: 'elearning-home' }, { slug: 'elearning-home' });

        res.json({
            home: result
            // coin,
            // teacher,
            // courses,
            // student,
            // register,
            // teacherResult,
            // courseResult,
            // studentResult,
            // registerResult,
            // coinResult
        })

    })


})



async function rawHome() {
    let html = await rawHTML('https://www.cfdtraining.vn/')
    let review: any = []

    let item = html.window.document.querySelectorAll('.testimonial .text .ct')
    item.forEach(e => {
        review.push({
            name: e.querySelector('.info .name h4').textContent,
            content: e.querySelector('.content').textContent,
            date: e.querySelector('.bottom span').textContent,
            fb: e.querySelector('.bottom a').href
        })
    })

    html.window.document.querySelectorAll('.testimonial .images picture img').forEach((e: any, i: number) => {
        review[i].cover = e.getAttribute('data-flickity-lazyload')
    })

    let gallery: any = []
    html.window.document.querySelectorAll('.section-gallery .list img').forEach((e: any) => {
        gallery.push(e.getAttribute('data-flickity-lazyload'))
    })

    return {
        review,
        gallery
    };
}



async function rawTeacher() {
    let teacher = await rawAPI('https://www.cfdtraining.vn/api/rest/cfd_teacher')

    return teacher.map(e => {
        e.avatar = fixErrorImg(e.avatar)

        return e
    })
}


async function rawStudent() {
    let student = await rawAPI('https://www.cfdtraining.vn/api/rest/cfd_student')
    return student.map(e => {
        e.avatar = fixErrorImg(e.avatar)
        return e
    })
}

async function rawCoinHistory() {
    let coins = await rawAPI('https://www.cfdtraining.vn/api/rest/cfd_coin_history')
    return coins.map(e => {
        e.student = parseInt(e.cfd_student)

        delete e.cfd_student
        delete e.cfd_student_detail
        delete e.cfd_course_register_detail

        e.course_register = parseInt(e.cfd_course_register)
        delete e.cfd_course_register
        delete e.cfd_course_register_detail



        return e
    })
}


async function rawCourse() {
    let courses = await rawAPI('https://www.cfdtraining.vn/api/rest/cfd_course')
    return courses.map(e => {
        e.benefits = JSON.parse(e.benefits || null)
        e.cfd_teacher = JSON.parse(e.cfd_teacher || null)

        e.teacher = e.cfd_teacher[0].id
        delete e.cfd_teacher;

        e.content = JSON.parse(e.content || null)
        e.mentor = JSON.parse(e.mentor || null)

        e.mentor = e.mentor.map(e => {
            return e.id
        })

        delete e.meta
        e.required = JSON.parse(e.required || null)

        e.thumbnail = fixErrorImg(e.thubnail)
        delete e.thubnail

        return e;
    })
}


async function rawRegister() {
    let reisgter = await rawAPI('https://www.cfdtraining.vn/api/rest/cfd_course_register')
    return reisgter.map(e => {

        e.student = parseInt(e.cfd_student)
        e.course = parseInt(e.cfd_course)

        delete e.cfd_student
        delete e.cfd_course
        delete e.cfd_student_detail
        delete e.cfd_course_detail
        e.payment = JSON.parse(e.payment || null)


        return e
    })
}


function rawProject() {
    return rawAPI('https://www.cfdtraining.vn/api/rest/cfd_project')
}

function fixErrorImg(obj) {
    try {
        obj = JSON.parse(obj || null)
        if (obj) {
            obj.link = 'https://www.cfdtraining.vn/' + obj.link
            if (obj.thumbnail['thubnail-1']) {
                obj.thumbnail['thumbnail-1'] = 'https://www.cfdtraining.vn/' + obj.thumbnail['thubnail-1']
                delete obj.thumbnail['thubnail-1']
            }

            if (obj.thumbnail['thubnail-2']) {
                obj.thumbnail['thumbnail-2'] = 'https://www.cfdtraining.vn/' + obj.thumbnail['thubnail-2']
                delete obj.thumbnail['thubnail-2']
            }
        }


        return obj
    } catch (err) {
        return null
    }

}