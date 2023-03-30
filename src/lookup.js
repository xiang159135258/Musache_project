/**
 * 根据传入的字符串寻找对象中的值
 * @param {object} data 
 * @param {string} keyName
 */

export default function lookup(data, keyName) {
    if (!data) return data;
    let temp = data;

    // 字符串中传值 "." 且 本身不是 "."
    if (keyName.indexOf('.') != 0 && keyName !== '.') {
        const keys = keyName.split('.');
        for (let index = 0; index < keys.length; index++) {
            const key = keys[index];
            // 有值才往下找
            if (temp[key]) {
                temp = temp[key];
            } else {
                throw new Error('寻找的值不存在');
            }
        }
    } else {
        temp = temp[keyName];
    }

    return temp;
}
