import { getAllModel, getModel } from "core/Model";
import { ModelInterface } from "core/pattern/ModelPattern";
import { add_router, add_router_group } from "hooks/routerhook";
import dateformat from 'dateformat';
import fs from 'fs';


const getDocuments = async function (collection: ModelInterface, callback) {
    const query = {};  // this is your query criteria
    let { data } = await collection.findMany(query)
    callback(data);

};




add_router_group('backup', () => {
    add_router('/database', (req, res) => {
        console.log('aaaaaaaaaaa')

        let all = getAllModel()
        var now: any = new Date()

        now = 'backup-' + dateformat(now, 'dd-mm-yyyy-HH-MM-ss')

        let dir = `storage/backup/database/${now}/`;

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }


        for (let i in all) {
            getDocuments(all[i], (docs) => {
                try {

                    fs.writeFileSync(`${dir}${i}.json`, JSON.stringify(docs));
                    console.log(`Write ${i} file done.`);
                }
                catch (err) {
                    console.log(`Error writing to file ${i}`, err)
                }
            })
        }
        res.json({ success: true })
    })
})