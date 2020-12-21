# Hook
## 1. What is hook?
- Hook are functions that can be applied to and Action or Filter in system. Action and Filter in system that can be modified theme, plugin, core to change the default system functionality.
- Hook use two method is:
  -  add_action(<span style="color: red">name</span>: string, callback: (...<span style="color: yellow">params</span>) : <span style="color: pink">any (1)</span> )  : defined action with **name** and behavior of action, **params** is 
  -  do_action(<span style="color: red">**name**</span>: string, <span style="color: yellow">params</span>: [] ) : <span style="color: pink">any (1)</span> : defined where action with **name** can be call
  
## 2. How to use?
- Step 1: Define behavior of action
   ```
   add_action('after_get_data', (data) => {
       data = data.filter(e => e.status === 'published')
       return data;
   })
- Step 2: Call action where you want
    ```
    ....
    data = do_action('after_get_data', data) // data get from database
    // after do_action call, data will be filter status === 'publised'
## 3. Rule for register new Hook