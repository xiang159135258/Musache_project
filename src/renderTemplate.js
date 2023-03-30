/**
 * 将tokens和data结合，生成DOM字符串
 * @param {array} tokens 
 * @param {object} data 
 * @returns 
 */
import lookup from './lookup'
// console.log(lookup({a: {b: {c: '我才是结果'}}}, 'a.b.c'))
import parseTokens from './parseTokens'

export default function (tokens, data) {
    let templateStr = '';

    for (let index = 0; index < tokens.length; index++) {
        const token = tokens[index];

        const type = token[0];
        const key = token[1];

        if (type === 'name') {
            templateStr += lookup(data, key);
        } else if (type === 'text') {
            templateStr += key;
        } else if (type === '#') {
            templateStr += parseTokens(token, data);
        }
    }

    return templateStr;
}