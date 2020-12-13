function Hook(){
    var action_list = {};

    

    this.add_action = function(name, callback){

        // console.log('add_action', name)

        // if(name in action_list){
        //     action_list[name].forEach(e => callback(...e));
        // }

        if(name){
            if(!(name in action_list)){
                action_list[name] = [];
            }

            action_list[name].push(callback);

            // if(name === 'init-model'){
            //     console.log('add_action',name,callback)
            // }
        }

        
    }

    this.do_action = async function(name , parameters = []){
        // if(name === 'init-model'){
        //     console.log('add_action',name,action_list[name])
        // }
        
        // console.log('do_action',name)
        // if(name){
        //     if(!(name in action_list)){
        //         action_list[name] = [];
        //     }

        //     action_list[name].push(parameters);
        // }
        let result = {}

        if(name in action_list){
            for(let i in action_list[name]){
                let obj = await action_list[name][i](...parameters);
                result = {...result, ...obj}
            }
            
        }

        return result;
    }
}

export default new Hook;