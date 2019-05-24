const babel = require('babel-core');
const plugin = require('./index.js');

var example = `
import {Button, Table} from 'components';
import {Affix, Input} from 'antd';
import axios from 'axios';
`;

const { code } = babel.transform(example, {
    plugins: [
        [
            plugin,
            {
                from: 'components',
                to: 'components/es/${name}',
                style: 'components/es/${name}.less'
            },
        ],
        [
            plugin,
            {
                from: 'antd',
                to: 'antd/es/${name}',
                style: 'antd/es/${name}.less'
            },
        ]
    ]
});

console.log(code);