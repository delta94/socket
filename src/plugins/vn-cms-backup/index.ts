import { getAllModel, getModel } from "core/Model";
import ModelPattern, { ModelAbstract } from "core/pattern/ModelPattern";
import { add_router, add_router_group } from "hooks/routerhook";
import fs from 'fs';


const getDocuments = async function (collection: ModelPattern, callback) {
    const query = {};  // this is your query criteria
    let { data } = await collection.find(query)
    callback(data);

};





add_router_group('backup', () => {
    add_router('/database', (req, res) => {
        let all = getAllModel()
        let dir = 'storage/backup/database/';
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