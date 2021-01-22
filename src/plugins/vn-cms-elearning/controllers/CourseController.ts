import { Course } from ".."
import Register from "../models/Register";

export default {
    register: async (req, res) => {
        let { slug } = req.params
        let { user } = req;
        let { name, phone, email, fb, payment, note } = req.body
        let course = await Course.findOne({ match: { slug } })

        let error: any = {}
        if (!name) {
            error.name = 'Họ và tên không được dể trống'
        }
        if (!phone) {
            error.phone = 'Số điện thoại không được dể trống'

        }
        if (!email) {
            error.email = 'Email không được dể trống'

        }
        if (!fb) {
            error.fb = 'Facebook URL không được dể trống'

        }

        if (Object.keys(error).length > 0) {
            return res.json({ error })
        }

        if (course.data) {

            let result = await Register.insertOne({
                id: Math.round(Math.random() * 10000000000000000000),
                student: user.id,
                course: course.data.id,
                trang_thai: 'cho-xet-duyet',
                payment_method: 'Thanh toán tiền mặt',
                title: `${user.title} đã đăng ký khoá học ${course.data.title} [${course.data.course_type === 'offline' ? 'Offline' : 'Online'}]`,
                money: course.data.money,
                name, phone, email, fb, payment, note
            })
            if (result.data) return res.json({ success: 'Đăng ký khoá học thành công' })
            return res.json(result)
        } else {
            return res.json({ error: 'Khoá học không tồn tại' })
        }
    }
}