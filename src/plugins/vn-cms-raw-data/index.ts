import Hook from '../../core/Hook'
import MySQL from '../../core/model/MySQL'
import { getModel } from '../../core/model/MongoDB';
import { add_router, add_router_group } from 'hooks/routerhook';
import { JSDOM } from 'jsdom';
import fs from 'fs'
import path from 'path'
import rp from "request-promise";
import phantom from 'phantom'
import { TableName } from 'plugins/vn-cms-ecommerce';


let loadJsSite = async (url) => {
    const instance = await phantom.create();
    const page = await instance.createPage();
    await page.on('onResourceRequested', function (requestData) {
        console.info('Requesting', requestData.url);
    });

    const status = await page.open(url);
    const content = await page.property('content');
    // console.log(content);
    // let $ = cheerio.load(content);

    await instance.exit();

    return new JSDOM(content);
}



let getBrand = async (dom) => {
    let name = dom.window.document.querySelector('[itemProp="brand"] [itemProp="name"]').getAttribute('content')
    let url = dom.window.document.querySelector('[itemProp="brand"] [itemProp="url"]').getAttribute('content').replace('/thuong-hieu/', '')
    let { data } = await getModel(TableName.Brand).findOne({ match: { slug: url } })
    console.log(data);
    if (!data) {
        await getModel(TableName.Brand).insertOne({ name, slug: url })
    }
}

let getFAQ = async (url) => {
    let id = getID(url)

    let dom = await rp({
        uri: `https://tiki.vn/product/${id}/hoi-dap`,
        transform: function (body) {
            //Khi lấy dữ liệu từ trang thành công nó sẽ tự động parse DOM
            return new JSDOM(body);
        },
    })
    let items: any = []
    dom.window.document.querySelectorAll('.question-answer-content .item').forEach(e => {
        items.push({
            question: e.querySelector('.name')?.textContent,
            answer: e.querySelector('.ans-content')?.textContent,
            like: parseInt(e.querySelector('.number')?.textContent || '0'),
            date: e.querySelector('.tiki-support-ans')?.textContent.replace('Tiki trả lời vào', '').replace(/\//g, '-')
        })
    })

    return items;
}

let getUser = async (userData) => {
    let { data } = await getModel(TableName.Customer).findOne({ match: { id: userData.id } })
    if (!data) {
        getModel(TableName.Customer).insertOne({ userData })
    }
}



let insertReview = async (review) => {

}


function ChangeToSlug(title) {
    var slug;

    //Lấy text từ thẻ input title 

    //Đổi chữ hoa thành chữ thường
    slug = title.toLowerCase().trim();

    //Đổi ký tự có dấu thành không dấu
    slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
    slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
    slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
    slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
    slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
    slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
    slug = slug.replace(/đ/gi, 'd');
    //Xóa các ký tự đặt biệt
    slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
    //Đổi khoảng trắng thành ký tự gạch ngang
    slug = slug.replace(/ /gi, "-");
    //Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
    //Phòng trường hợp người nhập vào quá nhiều ký tự trắng
    slug = slug.replace(/\-\-\-\-\-/gi, '-');
    slug = slug.replace(/\-\-\-\-/gi, '-');
    slug = slug.replace(/\-\-\-/gi, '-');
    slug = slug.replace(/\-\-/gi, '-');
    //Xóa các ký tự gạch ngang ở đầu và cuối
    slug = '@' + slug + '@';
    slug = slug.replace(/\@\-|\-\@|\@/gi, '');
    slug = slug.replace(/ /g, '')
    slug = slug.replace(/-{2,}/g, '-')

    //In slug ra textbox có id “slug”
    return slug;
}

let categoryInsert = 0;
let getCateogry = async () => {
    let categories = await rp({
        uri: `https://api.tiki.vn/shopping/v2/mega_menu`,
        transform: function (body) {
            //Khi lấy dữ liệu từ trang thành công nó sẽ tự động parse DOM
            return JSON.parse(body).data
        },
    })

    let insertCat = async (menu) => {
        let { item } = menu;
        if (item) {
            let { data, error } = await getModel(TableName.Category).insertOne({
                id: parseInt(item.url.replace(/[^0-9]/g, '')),
                parent_id: parseInt(item.parent_id),
                position: parseInt(item.position),
                status: parseInt(item.status),
                title: item.title,
                slug: ChangeToSlug(item.title + `-id${item.url.replace(/[^0-9]/g, '')}`)
            })

            if (error) {
                console.log(error)
            } else {
                console.log('categoryInsert', ++categoryInsert)

            }
        }


        // if (Array.isArray(menu.sub)) {
        //     menu.sub.forEach(e => {
        //         insertCat(e)
        //     })
        // }
    }

    categories.forEach(e => {
        insertCat(e)
    })

    // insertCat({
    //     sub: categories
    // })
}




let getReview = async (url) => {
    let id = getID(url)

    let reviews = await rp({
        uri: `https://tiki.vn/api/v2/reviews?product_id=${id}&sort=score%7Cdesc,id%7Cdesc,stars%7Call&page=1&limit=1000&include=comments`,
        transform: function (body) {
            //Khi lấy dữ liệu từ trang thành công nó sẽ tự động parse DOM
            return JSON.parse(body)
        },
    })

    reviews.data.forEach(e => insertReview(e))

    // reviews.data = reviews.data
    // delete reviews.sort_options
    // delete reviews.review_photo
    // delete reviews.paging
    // delete reviews.exclude_image
    return {
        rating_average: reviews.rating_average,
        review_photo: reviews.review_photo,
        reviews_count: reviews.reviews_count,
        stars: reviews.stars,
    }
}

let getID = (url) => {
    let number = parseInt(url.replace('.html', '').split("").reverse().join(""))

    return number.toString().split("").reverse().join("")
}
let insertProductCount = 0;

let sleep = async (time) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(true)
        }, time)
    })
}

let insertProduct = async (id, catID) => {

    let item = await rp({
        uri: `https://tiki.vn/api/v2/products/${id}?include=tag,images,gallery,promotions,badges,stock_item,variants,product_links,discount_tag,ranks,breadcrumbs,top_features,cta_desktop`,
        transform: function (body) {
            //Khi lấy dữ liệu từ trang thành công nó sẽ tự động parse DOM
            try {
                return JSON.parse(body)
            } catch (err) {
                console.log('insertProduct error', id)
                insertProduct(id, catID);
                return false;
            }
        },
    })
    if (item) {
        let { error, data } = await getModel(TableName.Product).insertOrUpdate({
            id: item.id,
            sku: item.sku,
            badges: item.badges,
            badges_new: item.badges_new || undefined,
            brand: item.brand?.id || null,
            brand_name: item.brand_name,
            categories: catID,
            option_color: item.option_color || undefined,
            configurable_options: item.configurable_options,
            configurable_products: item?.configurable_products?.map(e => ({
                images: e.images
            })),
            // current_seller,
            description: item.description,
            discount: item.discount,
            discount_rate: item.discount_rate,
            images: item.images,
            inventory_status: item.inventory_status,
            name: item.name,
            other_sellers: [],
            price: item.list_price,
            real_price: item.price,
            price_usd: item.price_usd,
            rating_average: item.rating_average,
            review_count: item.review_count,
            short_description: item.short_description,
            specifications: item.specifications,
            stock_item: item.stock_item,
            thumbnail_url: item.thumbnail_url,
            top_features: item.top_features,
            type: item.type,
            slug: item.url_key
        }, { id: item.id });

        if (error) {
            console.log('insertProductCount error', error, item.id)
        } else {

            console.log('insertProductCount', ++insertProductCount)
        }

    }


}

let getProductFromCategory = async (catID, page = 1, skip = 0) => {
    if (skip) {
        page = Math.round(skip / 300)

    }

    if (page > 33) return;

    if (catID) {
        console.log('getProductFromCategory page,', page)

        let jsonObject = await rp({
            uri: `https://tiki.vn/api/v2/products?limit=300&category=${catID}&page=${page}`,
            transform: function (body) {
                //Khi lấy dữ liệu từ trang thành công nó sẽ tự động parse DOM
                try {

                    let jsonObject = JSON.parse(body)
                    console.log('getProductFromCategory length:', jsonObject?.data?.length)
                    return jsonObject;
                } catch (err) {
                    console.log('catID, page', catID, page)
                    return false;
                }
            },
        })

        if (jsonObject) {
            let { paging, data } = jsonObject;

            for (let i in data) {
                let e = data[i]
                insertProduct(e.id, catID)
                await sleep(200);
            }
            sleep(200);
            if (paging.current_page < paging.last_page) {
                await getProductFromCategory(catID, paging.current_page + 1)
            }
        }



    }
}


add_router_group('raw', () => {
    add_router('category', async (req, res) => {
        getCateogry();
        res.json({ success: true })
    })


    add_router('product', async (req, res) => {
        // getProductFromCategory(1789);
        // getProductFromCategory(4221);
        // getProductFromCategory(1815, 25);
        // getProductFromCategory(1846);
        // getProductFromCategory(1801);
        // getProductFromCategory(1975, 3);
        // getProductFromCategory(17166, 3);
        // getProductFromCategory(8322, 3);

        let { data: categories } = await getModel(TableName.Category).findMany();
        for (let i in categories) {
            await getProductFromCategory(categories[i].id)
        }

        // for (let i of ['1882', '1883', '4384', '2549', '1520', '1975', '8594', '17166', '8322', '11312']) {
        //     console.log('cat: ', i)
        //     await getProductFromCategory(i)
        // }

        res.json({ success: true })
    })
    add_router('demo', async (req, res) => {
        // const dom = new JSDOM(fs.readFileSync(path.join(__dirname, 'raws/1')));

        let products = ['67085908', '37694867', '59043375']



        let Product = getModel('ecommerce_product')
        let uri = `https://tiki.vn/api/v2/products/1340069?platform=web&include=tag,images,gallery,promotions,badges,stock_item,variants,product_links,discount_tag,ranks,breadcrumbs,top_features,cta_desktop`
        let dom = await rp({
            uri,
            transform: function (body) {
                //Khi lấy dữ liệu từ trang thành công nó sẽ tự động parse DOM
                return JSON.parse(body);
            },
        })

        console.log(dom)



        // let dom = await loadJsSite('https://tiki.vn/smart-tivi-samsung-4k-55-inch-ua55tu8500-p50702921.html')

        // console.log(dom.window.document.querySelector('.style__StyledNotiMessage-sc-18zbm1q-0'))
        // getBrand(dom)
        // getCategory(dom)
        // let faq = getFAQ(uri)
        // getReview(uri)
        // console.log({
        //     "sku": "F" + Math.round(Math.random() * 100000000),
        //     "stock": true,
        //     "name": dom.window.document.querySelector("h1").textContent,
        //     "image": [].map.bind(dom.window.document.querySelectorAll(".review-images__list img"))((e: any) => e.src),
        //     "specifications": dom.window.document.querySelector("table").outerHTML,
        //     "price": dom.window.document.querySelector('meta[itemProp="price"]').getAttribute('content'),
        //     "currency": "vnđ",
        //     "main_description": dom.window.document.querySelector('.ToggleContent__View-sc-1hm81e2-0').outerHTML,
        //     "review": await getReview(uri),
        //     "star": dom.window.document.querySelector('meta[itemProp="ratingValue"]').getAttribute('content'),
        //     faq,
        //     "store": "5ff2d67a223c8c18c83c4395",
        //     "brand": "5ff2c65663a9610bd85836ab",
        //     "category": "5ff2dd9939b8f02c54ef9b21"
        // })

        // try {
        //     Product.insertOne({
        //         "sku": "F" + Math.round(Math.random() * 100000000),
        //         "stock": dom.window.document.querySelector('.style__StyledNotiMessage-sc-18zbm1q-0') ? true : false,
        //         "name": dom.window.document.querySelector("h1").textContent,
        //         "image": [].map.bind(dom.window.document.querySelectorAll(".review-images__list img"))((e: any) => e.src),
        //         "specifications": dom.window.document.querySelector("table").innerHTML,
        //         "price": dom.window.document.querySelector('.product-price__current-price').textContent.replace(/[\.|₫| ]/g, ''),
        //         "currency": "vnđ",
        //         "main_description": dom.window.document.querySelector('.ToggleContent__View-sc-1hm81e2-0').innerHTML,
        //         "reviews": [],
        //         "star": 5,
        //         "faq": [],
        //         "store": "5ff2d67a223c8c18c83c4395",
        //         "brand": "5ff2c65663a9610bd85836ab",
        //         "category": "5ff2dd9939b8f02c54ef9b21"
        //     })
        // } catch (er) {
        //     console.log('error', file, er);

        // }

        // fs.readdir(path.join(__dirname, 'raws'), (err: any, files: any) => {
        //     files.forEach(file => {
        //         let dom = new JSDOM(fs.readFileSync(path.join(__dirname, `raws/${file}`)));
        //         try {
        //             Product.insertOne({
        //                 "sku": "F" + Math.round(Math.random() * 100000000),
        //                 "stock": true,
        //                 "fresh": 120,
        //                 "delivery_day": 1,
        //                 "name": dom.window.document.querySelector("h1").textContent,
        //                 "image": [].map.bind(dom.window.document.querySelectorAll(".review-images__list img"))((e: any) => e.src),
        //                 "specifications": dom.window.document.querySelector("table").innerHTML,
        //                 "price": dom.window.document.querySelector('.product-price__current-price').textContent.replace(/[\.|₫| ]/g, ''),
        //                 "currency": "vnđ",
        //                 "main_description": dom.window.document.querySelector('.ToggleContent__View-sc-1hm81e2-0').innerHTML,
        //                 "reviews": [],
        //                 "star": 5,
        //                 "faq": [],
        //                 "store": "5ff2d67a223c8c18c83c4395",
        //                 "brand": "5ff2c65663a9610bd85836ab",
        //                 "category": "5ff2dd9939b8f02c54ef9b21"
        //             })
        //         } catch (er) {
        //             console.log('error', file, er);

        //         }

        //         console.log(file);
        //     });
        // });

        res.json({
            success: true
        })



    })

})
