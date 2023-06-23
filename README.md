# xmtp-quickstart-vuejs@3

This template should help get you started developing with Vue 3 in Vite.

### Buffer is not defined
#### VueCLI

If you are usign older versions of Vue which used vue-cli proceed with these steps:

1. Install the webpack package:

```bash
npm install --save-dev webpack
```
2. Then, in your vue.config.js, add the following:

```jsx
const webpack = require('webpack');

module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      })
    ]
  },
  transpileDependencies: true
}
```

This configuration tells Webpack to provide Buffer whenever it's used, without having to explicitly import it.

3. Then, in your main.js:

```jsx
import { Buffer } from 'buffer';
window.Buffer = window.Buffer || Buffer;
```# xmtp-quickstart-vuejs
# xmtp-quickstart-vuejs
