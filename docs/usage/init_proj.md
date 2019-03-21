## Initialize Existing Project

!> Warning: This is generally not recommended as partum requires a specific file structure to work properly. 

Partum requires a partum.json file inside the project's root directory in order to generate components and actions.
For existing projects can be done manually or by using `partum --init`.
This accepts the same options as creating a new project.

```partum.json
{
  "name": "example",
  "jsx": true,
  "redux": false,
  "styleExt": "scss"
}
```