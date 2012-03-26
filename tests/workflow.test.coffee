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
    _.extend @, new Backbone.Workflow(@, { attrName: 'workflow_blate' })

class InitialFlow extends Backbone.Model
  workflow:
    initial: 'visitor'

  initialize: =>
    @set 'workflow_state', 'user', { silent: true }
    _.extend @, new Backbone.Workflow(@)
  
class NoInitialFlow extends Backbone.Model
  workflow: {}

  initialize: => _.extend @, new Backbone.Workflow(@)

class NoWorkflow extends Backbone.Model

$(document).ready ->

  module 'basic workflow',
    setup: =>
      @user = new User()

  test 'do nothing if no workflow state is delcared', =>
    ok =>
      model = new NoWorkflow()
      equal model.workflowState(), null

  test 'error for no initial state', =>
    raises =>
      model = new NoInitialFlow()

  test 'user has initial workflow state', =>
    equal @user.workflowState(), 'visitor'
  
  test 'user has custom initial workflow state', =>
    model = new InitialFlow()
    equal 'user', model.workflowState()
  
  test 'triggerEvent to new state', =>
    equal @user.triggerEvent('signUp'), true
    equal @user.workflowState(), 'user'
    equal @user.triggerEvent('closeAccount'), true
    equal @user.workflowState(), 'visitor'

  test 'error if no event for current state', =>
    raises =>
      equal @user.triggerEvent('closeAccount'), false
  
  test 'custom attributes name', =>
    equal @user.get('workflow_blate'), @user.workflowState()

  module 'triggerEvents',
    setup: =>
      @user = new User()
    
  test 'triggerEvent:from', =>
    i = 0
    @user.on 'transition:from:visitor', -> i = 1
    @user.triggerEvent 'signUp'
    equal i, 1
  
  test 'triggerEvent:to', =>
    i = 0
    @user.on 'transition:from:visitor', -> i = 1
    @user.on 'transition:to:user', -> i = 2
    @user.triggerEvent 'signUp'
    equal i, 2

  test 'option to persist to server', =>
    @user.triggerEvent 'signUp'





