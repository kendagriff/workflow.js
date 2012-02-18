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
    _.extend @, new Backbone.Workflow(@, { attrName: 'workflow_blate' })
  
  onSignUp: =>
    @set 'signed_up_at', new Date()

class InitialFlow extends Backbone.Model
  workflow:
    states:
      visitor: {}
      user: {}
  
  initialize: =>
    @set 'workflow_state', 'user', { silent: true }
    _.extend @, new Backbone.Workflow(@)
  
class NoWorkflow extends Backbone.Model

$(document).ready ->

  module 'workflow',
    setup: =>
      @user = new User()

  test 'do nothing if no workflow state is delcared', =>
    ok =>
      model = new NoWorkflow()
      equal model.workflowState(), null

  test 'user has initial workflow state', =>
    equal @user.workflowState(), 'visitor'
  
  test 'user has custom initial workflow state', =>
    model = new InitialFlow()
    equal 'user', model.workflowState()
  
  test 'transition to new state', =>
    equal @user.transition('signUp'), true
    equal @user.workflowState(), 'user'
    equal @user.transition('closeAccount'), true
    equal @user.workflowState(), 'visitor'
  
  test 'throw error if no transition for current state', =>
    raises =>
      equal @user.transition('yo'), false
  
  test 'call user defined method for transition', =>
    equal @user.transition('signUp'), true
    equal @user.workflowState(), 'user'
    notEqual @user.get('signed_up_at'), null
  
  test 'custom attributes name', =>
    equal @user.get('workflow_blate'), @user.workflowState()


