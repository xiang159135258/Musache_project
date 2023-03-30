import Scanner from './Scanner'
import nestedToken from './nestedTokens'

/**
 * 将模板字符串转换为tokens数组
 * @param {string} templateStr 
 */
export default function parseTemplateToTokens(templateStr) {
    let tokens = [];

    // 实例化一个扫描器，构造时提供一个参数，这个参数就是字符串
    // 也就是说这个扫描器就是针对这个字符串工作的
    const scanner = new Scanner(templateStr);

    let words;
    //让扫描器工作
    while (!scanner.eos()) {
        //收集标记开始之前的文字
        words = scanner.scanUntil('{{');
        if (words != '') {
            // 存起来
            tokens.push(['text', words]);
        }
        // 过双大括号
        scanner.scan('{{');

        //收集标记开始之前的文字
        words = scanner.scanUntil('}}');
        if (words != '') {
            // 判断words里面的首字符
            if (words[0] === '#') {
                tokens.push(['#', words.substring(1)]);
            } else if (words[0] === '/') {
                tokens.push(['/', words.substring(1)]);
            } else {
                tokens.push(['name', words]);
            }
        }
        scanner.scan('}}');
    }

    return nestedToken(tokens);
}