class User extends Backbone.Model
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

class DualPersonalityUser extends Backbone.Model
  jekyll_workflow:
    initial: 'happy'
    events: [
      { name: 'stub_toe', from: 'happy', to: 'hurting' }
      { name: 'get_massage', from: 'hurting', to: 'happy' }
    ]

  hyde_workflow:
    initial: 'catatonic'
    events: [
      { name: 'stub_toe', from: 'catatonic', to: 'ticked' }
      { name: 'get_massage', from: 'ticked', to: 'catatonic' }
    ]

  initialize: =>
    workflows = [
      { name: 'jekyll_workflow', attrName: 'jekyll_workflow_state' }
      { name: 'hyde_workflow', attrName: 'hyde_workflow_state' }
    ]
    _.extend @, new Backbone.Workflow(@, {}, workflows)

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
      equal model.get('workflow_state'), null

  test 'error for no initial state', =>
    raises =>
      model = new NoInitialFlow()

  test 'user has initial workflow state', =>
    equal @user.get('workflow_blate'), 'visitor'
  
  test 'user has custom initial workflow state', =>
    model = new InitialFlow()
    equal 'user', model.get('workflow_state')
  
  test 'triggerEvent to new state', =>
    equal @user.triggerEvent('signUp'), true
    equal @user.get('workflow_blate'), 'user'
    equal @user.triggerEvent('closeAccount'), true
    equal @user.get('workflow_blate'), 'visitor'

  test 'error if no event for current state', =>
    raises =>
      equal @user.triggerEvent('closeAccount'), false
  
  test 'custom attributes name', =>
    equal @user.get('workflow_blate'), 'visitor'

  module 'triggerEvents',
    setup: =>
      @user = new User()
    
  test 'transition:from', =>
    i = 0
    @user.on 'transition:from:visitor', -> i = 1
    @user.triggerEvent 'signUp'
    equal i, 1
  
  test 'transition:to', =>
    i = 0
    @user.on 'transition:from:visitor', -> i = 1
    @user.on 'transition:to:user', -> i = 2
    @user.triggerEvent 'signUp'
    equal i, 2

  test 'option to persist to server', =>
    @user.triggerEvent 'signUp'

  module 'multiple workflows',
    setup: =>
      @user = new DualPersonalityUser()

  test 'set up two workflows', =>
    equal @user.get('jekyll_workflow_state'), 'happy'
    equal @user.get('hyde_workflow_state'), 'catatonic'

  test 'error on non-existent workflow', =>
    raises =>
      equal @user.triggerEvent('stub_toe', 'fake_workflow'), false

  test 'triggerEvent on two workflows', =>
    equal @user.triggerEvent('stub_toe', 'jekyll_workflow'), true
    equal @user.get('jekyll_workflow_state'), 'hurting'
    equal @user.triggerEvent('stub_toe', 'hyde_workflow'), true
    equal @user.get('hyde_workflow_state'), 'ticked'

  test 'transition:from multiple workflows', =>
    i = 0
    @user.on 'transition:from:jekyll_workflow:happy', -> i = 1
    @user.triggerEvent 'stub_toe', 'jekyll_workflow'
    equal i, 1
  
  test 'transition:to multiple workflows', =>
    i = 0
    @user.on 'transition:from:jekyll_workflow:happy', -> i = 1
    @user.on 'transition:to:jekyll_workflow:hurting', -> i = 2
    @user.triggerEvent 'stub_toe', 'jekyll_workflow'
    equal i, 2

