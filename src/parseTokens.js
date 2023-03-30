/**
 * 处理数组、对象循环，结合renderTemplate实现递归
 * @param {array} token 
 * @param {object} data 
 */
import lookup from './lookup'
import renderTemplate from './renderTemplate'

export default function (token, data) {
    let resultStr = '';
    const key = token[1];
    const childTokens = token[2];

    // data中的实际数据，决定循环的方式
    const v = lookup(data, key);

    if (Array.isArray(v)) {
        for (let index = 0; index < v.length; index++) {
            resultStr += renderTemplate(childTokens, {
                ...v[index],
                '.': v[index]
            })
        }
    } else if (typeof v === 'object') {
        resultStr += renderTemplate(childTokens, v);
    }

    return resultStr;
}