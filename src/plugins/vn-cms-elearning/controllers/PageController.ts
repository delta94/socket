import { Page } from "app";
import { Student, TableName } from "..";
import Course from "../models/Course";

export default {
    home: async (req, res) => {
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

        let home = await Page.findOne({ match: { slug: 'elearning-home' } });
        res.json({
            offline: offline?.data,
            online: online?.data,
            ...home?.data
        })
    },
    course: async (req, res) => {
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

        res.json({
            offline: offline?.data,
            online: online?.data,
        })
    },
    course_detail: async (req, res) => {
        let { slug } = req.params;

        let result = await Course.findOne({ match: { slug } })
        res.json(result)
    },
    contact: async (req, res) => {
        let { name, phone, email, website, title, content } = req.body;
        let error: any = {}
        if (!name) {
            error['name'] = 'Họ và tên không được dể trống'
        }

        if (!phone) {
            error['phone'] = 'Số điện thoại không được để trống'
        }

        if (!email) {
            error['email'] = 'Email không được để trống'
        }

        if (Object.keys(error).length === 0) return res.json({ success: true })
        return res.json({ error })
    }
}