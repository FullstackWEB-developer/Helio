# Front-end deployment instructions

## Installing packages commands:
Use the package manager **npm** to install dependencies: 
```bash
npm install
```

Install **bable/core** package manually if **babel-plugin-jsx-remove-data-test-id** will not work:
```bash
npm i @babel/core  
```
Install **craco** to use npm scripts:

```bash
npm install @craco/craco --save
```
**_NOTE:_**  We use this to get all the benefits of create-react-app and customization without using 'eject' by adding a single craco.config.js file at the root of your application and customize your eslint, babel, postcss configurations and many more.<br>

## Launching project locally:
```bash
npm start
```

## Running unit tests:
```bash
npm run test a
```