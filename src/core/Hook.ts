class Hook {
    action_list = {};



    add_action(name, callback) {

        // console.log('add_action', name)

        // if(name in action_list){
        //     action_list[name].forEach(e => callback(...e));
        // }

        if (name) {
            if (!(name in this.action_list)) {
                this.action_list[name] = [];
            }

            this.action_list[name].push(callback);

            // if(name === 'init-model'){
            //     console.log('add_action',name,callback)
            // }
        }


    }

    async do_action(name, parameters: any = []): Promise<{ cache?: {} }> {
        // if(name === 'init-model'){
        //     console.log('add_action',name,this.action_list[name])
        // }

        // console.log('do_action',name)
        // if(name){
        //     if(!(name in this.action_list)){
        //         this.action_list[name] = [];
        //     }

        //     this.action_list[name].push(parameters);
        // }
        let result = {}

        if (name in this.action_list) {
            for (let i in this.action_list[name]) {
                let obj = await this.action_list[name][i](...parameters);
                result = { ...result, ...obj }
            }

        }

        return result;
    }
}

export default new Hook;

// export function add_router(){

// }