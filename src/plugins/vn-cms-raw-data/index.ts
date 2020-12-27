import Hook from '../../core/Hook'
import MySQL from '../../core/model/MySQL'
import { getModel } from '../../core/model/MongoDB';


// let mysql = new MySQL

// async function getAuthor() {
//     let { data } = await mysql.find('author', 2000);

//     for (let i in data) {
//         data[i].avatar = 'https://picsum.photos/300/300'
//     }

//     let { data } = await getModel('blog_author').insertMany(data)

//     return data;
// }


// async function getCategory() {
//     let { data } = await mysql.find('category', 2000);
//     let category = await getModel('blog_category').insertMany(data)

//     return category;
// }

// async function getTag() {
//     let { data } = await mysql.find('tag', 2000);
//     let tag = await getModel('blog_tag').insertMany(data)

//     return tag;
// }

// async function getUser() {
//     let { data } = await mysql.find('user', 2000);

//     for (let i in data) {
//         data[i].avatar = 'https://picsum.photos/300/300'
//     }

//     data = await getModel('blog_user').insertMany(data)

//     return data;
// }

// async function getPost() {

//     // let { data } = await mysql.find('posts', 10000);
//     // let category = await getModel('blog_categiry').find();
//     // return category;
//     // for(let i in data){
//     //     mysql.find('category_posts',1)
//     //     .then(({data, error}) => {
//     //         if(data){
//     //             data = data?.[0]
//     //             if(data){

//     //             }
//     //         }
//     //     })
//     // }
//     let { data: category } = await getModel('blog_category').findMany();
//     let { data: tags } = await getModel('blog_tag').findMany();
//     let { data: authors } = await getModel('blog_author').findMany();

//     let { data } = await mysql.find('posts', 10000);
//     let j = 0;

//     for (let i in data) {
//         let cat = category[Math.round(Math.random() * (category.length - 1))]._id
//         let tag1 = tags[Math.round(Math.random() * (tags.length - 1))]._id
//         let tag2 = tags[Math.round(Math.random() * (tags.length - 1))]._id
//         let author = authors[Math.round(Math.random() * (authors.length - 1))]._id


//         let tag: any[] = [];
//         tag.push(tag1)
//         if (tag1 !== tag2) {
//             tag.push(tag2)
//         }

//         data[i].author = author;
//         data[i].tags = tag
//         data[i].categories = [cat]
//         data[i].cover = 'https://picsum.photos/1400/700'

//         // getModel('blog_post').updateOne({ _id: data[i]._id }, {
//         //     category: [cat],
//         //     tags: tag,
//         //     author: author
//         // })
//         //     .then(res => {
//         //         console.log(++j)
//         //     })
//     }

//     let m = await getModel('blog_post').insertMany(data)

//     return m;

//     return { data };


//     // return m;
// }

// async function getComment() {
//     let { data } = await mysql.find('comment', 10000);

//     let { data: posts } = await getModel('blog_post').findMany();
//     let { data: users } = await getModel('blog_user').findMany();

//     for (let i in data) {
//         let p = posts[Math.round(Math.random() * (posts.length - 1))]._id;
//         let u = users[Math.round(Math.random() * (users.length - 1))]._id;

//         data[i].post = p;
//         data[i].user = u;

//     }


//     let m = await getModel('blog_comment').insertMany(data)

//     return m;
// }


function init(app, server) {
    app.get('/mysql', async (req, res) => {
        // let author = await getAuthor();
        // let user = await getUser();
        // let result = await getCategory();
        // let result = await getTag();
        // let post = await getPost();
        // let comment = await getComment();
        // res.json(comment);
    })

}



Hook.add_action('before-router', init)
