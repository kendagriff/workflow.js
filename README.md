# workflow.js

Finite-state machine (FSM) for Backbone.js – works as a drop-in extension of Backbone.Model. What's it got on other JS-based state machines? It's simple, and has an intuitive syntax. This FSM is loosely modeled after the [Ruby workflow gem from geekq](https://github.com/geekq/workflow).

### Dependencies
* JQuery
* [Backbone.js](http://documentcloud.github.com/backbone/) (Tested in 0.9.1, but probably works in most previous versions.)
* [Underscore.js](http://documentcloud.github.com/underscore/) (Tested in 1.3.1, but same as above – probably works in past versions.)

## Setup

Just add these dependencies to your site's `<head>`, **in order**:

```
<script src="jquery.js"></script>
<script src="underscore.js"></script>
<script src="backbone.js"></script>
<script src="workflow.js"></script>
```

## Usage

Let's start with a complete example (given in [CoffeeScript](http://coffeescript.org/)):

```
class User extends Backbone.Model
  defaults:
    signed_up_at: null

  workflow:
    initial: 'visitor'
    events: [
      { name: 'signUp', from: 'visitor', to: 'user' }
      { name: 'bail', from: 'visitor', to: 'lostUser' }
      { name: 'closeAccount', from: 'user', to: 'visitor' }
      { name: 'promote', from: 'user', to: 'superUser' }
    ]

  initialize: =>
    _.extend @, new Backbone.Workflow(@)
  
  onSignUp: =>
    @set { signed_up_at: new Date() }


user = new User()
user.workflowState() # => "visitor"

user.triggerEvent('signUp')
user.workflowState() # => "user"
user.get('signed_up_at') # => Fri Feb 17 2012 17:07:41 GMT-0700 (MST)
```

Here's a more detailed rundown.

### Step 1: Extend Backbone.Model

Add this code to your `initialize` function:

```
initialize: =>
    _.extend @, new Backbone.Workflow(@)
```

### Step 2: Define Your Workflow

Create an object named `workflow`, as a property on your model, and define its events and states:

```
class User extends Backbone.Model
  workflow:
    initial: 'visitor'
    events: [
      { name: 'signUp', from: 'visitor', to: 'user' }
      { name: 'bail', from: 'visitor', to: 'lostUser' }
      { name: 'closeAccount', from: 'user', to: 'visitor' }
      { name: 'promote', from: 'user', to: 'superUser' }
    ]
```

### Step 3: Instantiate Your Model

The helper function `workflowState()` will always return your model's current state.

```
user = new User()
user.workflowState() # => "visitor"
```

### Step 5: Initiate a Transition

```
user.triggerEvent('signUp')
user.workflowState() # => "user"
```

## Binding Events To Transitions

Perhaps the most helpful feature of workflow.js is the ability to bind Backbone events to transitions in your views (or model). For example:

```
user.bind 'transition:from:visitor', -> alert("I'll only be a visitor for a moment longer!")
```

Or, its near equivalent:

```
user.bind 'transition:to:user', -> alert("I'm no longer just a visitor!")
```

Transitions are handled before (`transition:from`), and after (`transition:to`), the user defined call back.

## Customizations

Customize workflow.js by passing an attributes hash to the Backbone.Workflow constructor:

```
new Backbone.Workflow(@, { attrName: 'my_custom_db_field' })
```

Configurable parameters include:

* `attrName`: Backbone.Model attribute used to persist state at the server level. Default is `workflow_state`.

