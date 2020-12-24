import { add_router, add_router_group } from "hooks/routerhook";
import path from 'path'
import fetch from 'node-fetch'

add_router_group('elearning', () => {
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