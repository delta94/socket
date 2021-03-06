

const patternEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const patternPhone = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
const patternUrl = /https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}/gi;

const requiredMsg = 'This field is required';
const patternMsg = 'This field not match with pattern';

export default function validate(data: any, rules: any, message = {}, exclude = false): { error?: any, data?: any } {
    let errorObj = {}

    for (let i in rules) {
        if (i in data) {
            let rule = rules[i],
                value = data[i];

            if(typeof value === 'string'){
                value = value.trim()
            }
            

            if (rule.required) {
                let msg = message?.[i]?.required || requiredMsg
                if (!value) {
                    errorObj[i] = msg
                    continue;
                }
            }

            if (rule.pattern) {
                let msg = message?.[i]?.pattern || patternMsg
                let pattern = rule.pattern;
                if (pattern === 'email') pattern = patternEmail;
                if (pattern === 'url') pattern = patternUrl;

                if (!pattern.test(value)) {
                    errorObj[i] = msg
                    continue;
                }
            }

            if(Array.isArray(rule.enum)){
                if(!rule.enum.include(value)){
                    errorObj[i] = `${i} require include [${rule.enum.join()}]`
                }
            }
        }
    }

    // exclude field of data not in rules
    if (exclude) {
        for (let i in data) {
            if (!(i in rules)) {
                delete data[i]
            }
        }
    }

    if (Object.keys(errorObj).length > 0) {
        return { error: errorObj }
    }
    
    return { data };
}