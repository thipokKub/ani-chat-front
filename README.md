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
- When including `css` or `scss` into `js` file. Please noted that the imported `css` or `scss` wiil be in `String` format.

- To applied the imported styles, please use `withStyle` higher order component. which located in `/hoc` folder. But `withStyle` cannot wrapped `pageConnect`. Please either applied `withStyle` before using `pageConnect` or adding options in pageConnect.
- The agrument for `stylesheets` is an array of strings. As the example below write
    ```jsx
        [stylesheet]
    ```
- It is actually refer to array of stylesheet not just a placeholder. In case there is multiple stylesheets, the agrument will look something like this.
    ```jsx
        [stylesheet1, stylesheet2, ...]
    ```
- Please follow the following steps.

    1. Import files
    ```jsx
    import stylesheet from '<relative path>';
    ```

    2. Applied style

        2.1 Use pageConnect only (This should be used only components in `/pages` folder).

        ```jsx
        class pageComponent extends Component {
            ...
        }

        ...

        export default pageConnect(pageComponent, {
            stylesheets: [stylesheet]
        })
        ```

        2.2 Use `withStyle` with any other HOC.

        ```jsx
        class someCompoent extends Component {
            ...
        }

        ...

        export default pageConnect(autoBind(someComponent), {
            stylesheets: [stylesheet]
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