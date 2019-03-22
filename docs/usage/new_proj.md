## Creating a New Project

You can create a new project in the current directory by using `partum [project name]`.
This supports the following options input after the project name and separated by spaces.
```
  option   (default):   Description.
------------------------------------------------------------------------------
  redux    (false):     Enables redux support. (Currently in development)
  js       (false):     Uses js files instead of jsx... But why would you?
  scss     (css):       Uses scss files for styling.
  sass     (css):       Uses sass files for styling.
```

?> By default, partum will output data from `npm install`. This can be muted by passing in the option `-s` or `--silent`.