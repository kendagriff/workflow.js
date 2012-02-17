# workflow.js

Finite state machine (FSM) for Backbone.js – works as a drop-in extension of Backbone.Model. What's it got on other JS-based state machines? It's simple, and has an intuitive syntax.

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

Let's start with a complete example.

```
class User extends Backbone.Model
  defaults:
    signed_up_at: null

  workflow:
    states:
      visitor:
        events:
          signUp: { transitionsTo: 'user' }
          bail: { transitionsTo: 'lostUser' }
      user:
        events:
          closeAccount: { transitionsTo: 'visitor' }
          promote: { transitionsTo: 'superUser' }
      superUser: {}
      lostVisitor: {}

  initialize: =>
    _.extend @, new Backbone.Workflow(@)
  
  onSignUp: =>
    @set { signed_up_at: new Date() }
```

### Step 1: Extend Backbone.Model

Add this code to your `initialize` function:

```
initialize: =>
    _.extend @, new Backbone.Workflow(@)
```
