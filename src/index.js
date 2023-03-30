import parseTemplateTokens from './parseTemplateTokens'
import renderTemplate from './renderTemplate'

const myTemplateEngine = {
    render(templateStr, data) {
        const tokens = parseTemplateTokens(templateStr);
        console.log('tokens', tokens);

        const domStr = renderTemplate(tokens, data);
        console.log('domStr', domStr);

        let container = document.getElementById('container');
        container.innerHTML = domStr; // 上树
        container = null;
    }
}


// 测试用例
const templateStr = `
    <div>
        <ol>
            {{#students}}
            <li class="hobbies">
                学生{{name}}的爱好
                <ol>
                    {{#hobbies}}
                    <li>{{one}}</li>
                    <li>{{two}}</li>
                    {{/hobbies}}
                </ol>
            </li>
            {{/students}}
        </ol>
    </div>
`;
const data = {
    students: [
        {name: '小明', hobbies: { one: '游戏', two: '打球' }},
        {name: '小强', hobbies: { one: '游戏', two: '打球' }},
        {name: '小王', hobbies: { one: '游戏', two: '打球' }}
    ]
    
}

// 执行
myTemplateEngine.render(templateStr, data);