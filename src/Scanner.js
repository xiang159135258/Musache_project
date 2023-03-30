export default class Scanner {
    
    constructor(templateStr) {
        this.templateStr = templateStr;
        this.pos = 0; // 指针
        this.tail = templateStr; // 还没走过的字符串，简称：尾巴
    }

    // 功能弱，只是用来跳过指定的内容，没有返回值
    scan(tag) {
        if (this.tail.indexOf(tag) === 0) {
            // 指定内容的长度是多少，就让指针后移多少
            this.pos += tag.length;
            this.tail = this.templateStr.substring(this.pos);
        }
    }

    // 让指进行扫描，直到遇到寻找的内容结束，并且能够返回结束扫描之前走过的字符串
    scanUntil(stopTag) {
        // 记录执行此方法pos指针的起始值
        const pos_backup = this.pos;

        // 扫描stopTag不在首位，而且指针没有到最后，那么继续扫描
        while (!this.eos() && this.tail.indexOf(stopTag) !== 0) {
            this.pos++;
            // 指针从该字符开始，直到最后的全部字符
            this.tail = this.templateStr.substring(this.pos);
        }

        // 返回扫描到stopTag在首位，之前的走过字符串
        return this.templateStr.substring(pos_backup, this.pos);
    }

    // end of string 判断指针是否到头了
    eos() {
        return this.pos >= this.templateStr.length;
    }
}