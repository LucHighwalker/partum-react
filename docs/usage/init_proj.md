## Initialize Existing Project

!> Warning: Only do this if you know what you are doing, as partum requires a specific folder structure to work properly. While this structure can be customized inside the partum.json, it is recommended to only use partum inside partum generated projects.

Partum requires a partum.json file inside the project's root directory in order to generate components and actions.
For existing projects can be done manually or by using `partum --init`.
This accepts the same options as creating a new project.

```partum.json
{
  "name": "newprojredux",
  "jsx": true,
  "redux": true,
  "styleExt": "scss",
  "componentFolders": true,
  "componentPath": "/src/components/",
  "reduxPath": "/src/redux/",
  "actionPath": "/actions/",
  "reducerPath": "/reducers/"
}
```