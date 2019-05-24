const babel = require('babel-core');
const plugin = require('../index.js');


var example = `
import {Button, Table} from 'components';
import {Affix, Input} from 'antd';
import axios from 'axios';
`;


it('work without from key', () => {
    const { code } = babel.transform(example, {
        plugins: [
            [
                plugin,
                {
                    to: 'components/es/${name}',
                },
            ],
        ],
    });
    expect(code).toMatchSnapshot();
});


it('work without to key', () => {
    const { code } = babel.transform(example, {
        plugins: [
            [
                plugin,
                {
                    from: 'components',
                },
            ],
        ],
    });
    expect(code).toMatchSnapshot();
});

it('work with to key', () => {
    const { code } = babel.transform(example, {
        plugins: [
            [
                plugin,
                {
                    from: 'components',
                    to: 'components/es/${name}',
                },
            ],
        ],
    });
    expect(code).toMatchSnapshot();
});

it('work use CamelCase & without to key', () => {
    const { code } = babel.transform(example, {
        plugins: [
            [
                plugin,
                {
                    from: 'components',
                    useCamelCase: true,
                },
            ],
        ],
    });
    expect(code).toMatchSnapshot();
});

it('work with style key & without to key & use CamelCase', () => {
    const { code } = babel.transform(example, {
        plugins: [
            [
                plugin,
                {
                    from: 'components',
                    useCamelCase: true,
                    style: 'components/es/${name}/style.less',
                },
            ],
        ],
    });
    expect(code).toMatchSnapshot();
});

it('work with multiple plugins', () => {
    const { code } = babel.transform(example, {
        plugins: [
            [
                plugin,
                {
                    from: 'components',
                    useCamelCase: true,
                    style: 'components/es/${name}/style.less',
                },
            ],
            [
                plugin,
                {
                    from: 'antd',
                    to: 'antd/es/${name}',
                    style: 'antd/es/${name}/style.less',
                },
            ]
        ],
    });
    expect(code).toMatchSnapshot();
});