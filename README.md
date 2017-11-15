# NextJS Boilerplate

## Gettting start
---
just use `npm` or `yarn`
```
npm install
```
or
```
yarn install
```

---

Then use the following command to start develop.
```
npm start
```
or
```
yarn start
```
---

## What's include in the boilerplate?
- NextJS
- Redux
    - Redux-thunk
    - Redux-logger
- Import scss/css file directly into JS
- NProgress Loader

---
## Important Note
- When including `css` or `scss` into `js` file. Please follow the following steps

    1. Import files
    ```jsx
    import stylesheet from '<relative path>';
    ```
    2. Add `<style>` tag into rendered object as following
    ```jsx
    <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
    ```
    For example
    ```jsx
    import React from 'react';
    import pageConnect from '../hoc/pageConnect';
    import stylesheet from './style/parallax.scss';

    export default pageConnect((props) => {
        return (
            <div>
                <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
                ...
            </div>
        );
    })
    ```

---

## Project Structure
```
    ┌── component
    ├── constraint
    │   ├── variables.js
    │   └── variables.scss
    ├── container
    │   └── style
    ├── function
    │   ├── general.js
    │   └── request.js
    ├── hoc
    │   ├── autoBind.js
    │   ├── pageConnect.js
    │   ├── requireLogin.js
    │   ├── requirePrivillege.js
    │   └── style
    ├── next.config.js
    ├── package.json
    ├── pages
    │   ├── _document.js
    │   ├── about.js
    │   ├── index.js
    │   ├── parallax.js
    │   └── style
    │       └── parallax.scss
    ├── postcss.config.js
    ├── redux
    │   ├── actions
    │   │   ├── index.js
    │   │   └── test_actions.js
    │   ├── reducers
    │   │   ├── index.js
    │   │   └── test_reducer.js
    │   ├── store.js
    │   └── types.js
    ├── static
    │   └── resources
    │       └── nprogress.css
    └── yarn.lock
```

Well, pretty much self-explainatory