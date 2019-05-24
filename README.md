# babel-plugin-import-proxy
a babel plugin for 'import' syntax proxy

## Function

```javascript
import {Button, Table} from 'packageName';
```
tranform to
```javascript
import Button from 'packageName/lib/Button';
import Table from 'packageName/lib/Table';
```
<br/>
or

```javascript
import {Button, Table} from 'packageName';
```
tranform to
```javascript
import Button from 'packageName/lib/Button';
import Button from 'packageName/lib/Button/style.less';
import Table from 'packageName/lib/Table';
import Table from 'packageName/lib/Table/style.less';
```

etc.



## Usage

in a babel'config file, e.g. `.babelrc`
```javascript
"plugins": [
    [
      "import-proxy",
      {
          from: "packageName",
          to: "packageName/lib/${name}",
          // style: "packageName/lib/${name}/style.less",  // default undefined not required
          // useCamelCase: true, // default: false not required
      }
    ]
]
```
