import Hook from '../../core/Hook'
import MySQL from '../../core/model/MySQL'

let mysql = new MySQL


function init(app, server) {
    app.get('/mysql', async (req, res) => {
        let result = await mysql.find('author');
        res.json(result);
    })
    // 
}



Hook.add_action('before-router', init)
