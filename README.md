# NextJS Boilerplate

## Gettting start
---
Use `npm` to install all the dependencies with command below.
```
npm install
```

Then use the following command to start develop.
```
npm start
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

- To applied the imported styles, please use `withStyle` higher order component or `enhancedComponent`. which located in `/hoc` folder. If you want to connect to redux store please use `enhancedComponent`.
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

        2.1 Use `enhancedComponent`. [Detailed is in section below]

        2.2 Use `withStyle` with any other HOC.

        ```jsx
        import withStyle from '../hoc/withStyle'

        class someCompoent extends Component {
            ...
        }

        ...

        export default withStyle(someComponent, {
            stylesheets: [stylesheet]
        })
        ```
- `withErrorCatch` hoc will accept 1 object as its parameters. There are 2 property that affect this hoc. `onError` callback and `onErrorJSX` to generate fallbeck jsx object.
- `enhancedComponent` hoc will accept 1 object as its parameter. This parameter is `option` parameter which can contain the following property.
    - `enableRedux` - `[Boolean]` - Enable or disable connecting to redux. This is enabled by default.
    - `reduxOption` - `[Object]` - Option for redux usage. If no `reduxOption` is present when `enableRedux` is `true`. Then it will connect all redux store and actions.
        - `stateName` - `[Array of String]` - Name of selected store.
        - `dispatchName` - `[Array of String]` - Name of selected actions.
    - `styleUrls` - `[Array of Stylesheet(s)]` - Array of the imported Stylesheet(s). It can be `css` or `scss` file.
    - `headOption` - `[Array of Object]` - Array of `head` component to be inserted.
        - `tag` - `[String]` - Name of tag
        - `content` - `[Any]` - Content or child of tag
        - `option` - `[Object]` - property to be added to tag

    Example usage
    ```jsx
    import enhancedComponent from '../hoc/enhancedComponent'
    import stylesheetA from '<some place>'
    import stylesheetB from '<some other place>'

    ...

    class ABC extends Component {
        ...
    }

    export default enhancedComponent(ABC, {
        enableRedux: true,
        headOption: [{
            tag: 'title',
            content: 'index page'
        }],
        reduxOption: {
            stateName: ["someState"],
            dispatchName: ["someAction", "someOtherAction"]
        },
        styleUrls: [stylesheetA, styleSheetB]
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
    |       └── ...
    ├── function
    │   ├── general.js
    │   └── ...
    ├── hoc
    │   ├── style
    │   |   └── ...
    │   ├── enhancedComponent.js
    │   ├── withErrorCatch.js
    │   ├── withStyle.js
    │   └── ...
    ├── next.config.js
    ├── package.json
    ├── pages
    │   └── style
    │   |   └── index.scss
    │   ├── _document.js
    │   ├── index.js
    │   └── ...
    ├── postcss.config.js
    ├── redux
    │   ├── actions
    │   │   ├── index.js
    │   │   └── ...
    │   ├── reducers
    │   │   ├── index.js
    │   │   └── ...
    │   ├── store.js
    │   └── types.js
    ├── static
    │   └── resources
    │       └── ...
    └── yarn.lock
```

Well, pretty much self-explainatory.

- `component`
    - This folder will contain all components (self-state). I encourage to use `props` as much as possible. Try not to set inner state to props in `constructor` or `componentWillReceiveProps`. I considered it anti-pattern and very counter-productive.
- `container`
    - This foler contain all `smart component` or `container`. Which will bind to the redux store.
- `function`
    - This folder contain regularly used user defined function. It is nice to have it all in one place, trust me.
- `hoc`
    - This folder conatin predefined Higher-Order-Component (HOC).
- `pages`
    - This folder `is` required by `NextJS`. So I'm not going to talk about it.
- `redux`
    - This folder contain all relevant file structure for redux. There are 2 files, and 2 sub folders.
        - `actions`
            - This folder contain at least 1 file. `index.js` file.
                - `index.js`
                    - This file merge all actions in the folder to the same object for the ease in implementing HOC above.
        - `reducers`
            - This folder contain at least 1 file. `index.js` file.
                - `index.js`
                    - This file merge all redux store in the folder to the same object.
        - `store.js`
            - This file defined store and middlewares that applied to it.
        - `types.js`
            - This file defined types for all actions in action creators.
- `static`
    - This folder contain all resouces. Such as external CSS libraries, Javascript libraries, or Images.
    - As of `NextJS` document goes, this should be accessed within custom `<Document>` section as linked [here](https://github.com/zeit/next.js/#custom-document).
- `Other files`
    - I have preconfig them already. By intensive googling of course. So please don't change the code. Or else you will be having a bad time.

---

Good Luck! 

