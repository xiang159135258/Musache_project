/**
 * 传入一维的tokens，实现按照层级结构进行折叠
 * @param {array} tokens 
 * @returns 
 */

export default function (tokens) {
    // 最终结果
    let nestedTokens = [];

    // 栈结构，存放小tokens。栈顶的tokens数组中当前操作的这个tokens的第三项小数组
    let sections = [];

    /**
     * 收集器，默认指向nestedTkens结果数组
     * 当匹配到 # 的时候，改变收集器的指向，指向到当前token中新开辟的下一个维度的token
     * 当匹配到 / 的时候，改变收集器的指向，判断当前栈sections是否有值？有值，则指向当前的栈顶；没值，则指向最终结果 nestedTokens
     */
    let collector = nestedTokens

    for (let index = 0; index < tokens.length; index++) {
        const token = tokens[index];
        switch (token[0]) {
            case '#':
                // 收集当前维度的 子项
                collector.push(token);
                // 入栈
                sections.push(token);
                // 给当前匹配到的 #开头的token数组，开辟下标为2的下一个维度的子项，并且值为[]
                // 修正当前的收集器指向 新开辟的子项
                collector = token[2] = [];
                break
            case '/':
                //出栈
                sections.pop();

                collector = sections.length
                    ? sections[sections.length - 1][2]
                    : nestedTokens;
                break
            default:
                // 无需关心当前是什么维度，没有匹配到 # 或者 、 字符串时，直接收集token即可
                collector.push(token);
        }
    }

    return nestedTokens;
}