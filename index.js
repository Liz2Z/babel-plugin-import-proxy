// plugin configs 

// from,
// to,
// useCamelCase, // 使用驼峰式命名规则 default false
// formatName,
// 

/**
 * 按需加载插件
 * 将 import {Button, Table} from 'ui';
 * 转换成  =>
 * import Button from 'ui/lib/button';
 * import Table from 'ui/lib/table';
 * 
 */

module.exports = function ({ types: t }) {
    return {
        name: 'import-proxy',
        visitor: {
            // 访问 import 声明语句
            ImportDeclaration(path, state) {
                const node = path.node;
                const {
                    from, // import {Button} from 'components'; 'components' is `from`
                    to = `${from}/lib/\${name}`,  // import Button from 'components/lib/button'; 'components/lib/${name}' is `to`
                    useCamelCase,  // 使用驼峰式命名规则 default false
                    nameFormatter,
                    style,
                } = state.opts;
                // 匹配资源路径
                if (!from || node.source.value !== from) {
                    return;
                }
                // 检测有没有默认模式的引入 import x from 'source';
                const hasImportDefaultSpecifier = node.specifiers.some(item => t.isImportDefaultSpecifier(item));
                if (hasImportDefaultSpecifier) {
                    return;
                }
                // 生成新节点
                const newNodeArr = node.specifiers.reduce((arr, item) => {
                    const localName = item.local.name;
                    // 
                    const formatedName = nameFormatter
                        ? nameFormatter(localName)
                        : useCamelCase
                            ? camelize(localName)
                            : hyphenate(localName);
                    // import x from 'to/xx';
                    const newJsImportNode = t.importDeclaration(
                        [t.importDefaultSpecifier(t.identifier(localName))],
                        t.stringLiteral(to.replace('${name}', formatedName)),
                    );
                    arr.push(newJsImportNode);
                    // import x from 'to/xx.css';
                    if (style) {
                        const newStyleImportNode = t.importDeclaration(
                            [],
                            t.stringLiteral(style.replace('${name}', formatedName)),
                        );
                        arr.push(newStyleImportNode);
                    }
                    return arr;
                }, []);

                // 替换节点 
                path.replaceWithMultiple(newNodeArr);

            },
        },
    };
};


/**
 * Camelize a hyphen-delimited string.
 * 将一个有分隔符的字符串转化成 驼峰式
 */
const camelizeRE = /-(\w)/g
const camelize = (str) => {
    return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '');
};

/**
 * 字符串首字母大写
 */
// const capitalize = (str) => {
//     return str.charAt(0).toUpperCase() + str.slice(1);
// };

/**
 * 把一个驼峰字符串转成 用字符串连接的形式
 */
const hyphenateRE = /\B([A-Z])/g
const hyphenate = (str) => {
    return str.replace(hyphenateRE, '-$1').toLowerCase();
};
