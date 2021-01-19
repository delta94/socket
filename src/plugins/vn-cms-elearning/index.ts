


export enum TableName {
    Course = 'cfd4_elearning_course',
    Payment = 'cfd4_elearning_payment',
    Project = 'cfd4_elearning_project',
    Register = 'cfd4_elearning_register',
    Review = 'cfd4_elearning_review',
    Student = 'cfd4_elearning_student',
    Teacher = 'cfd4_elearning_teacher',
    CoinHistory = 'cfd4_elearning_coin_history'
}

export { default as Course } from './models/Course'
export { default as Payment } from './models/Payment'
export { default as Project } from './models/Project'
export { default as Register } from './models/Register'
export { default as Review } from './models/Review'
export { default as Student } from './models/Student'
export { default as Teacher } from './models/Teacher'
export { default as CoinHistory } from './models/CoinHistory'