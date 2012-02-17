# Written by Kendall Buchanan (https://github.com/kendagriff)
# MIT License
# Version 0.0.1

class Backbone.Workflow
  constructor: (model) ->
    @model = model

    # Set up the model's initial workflow state
    @model.set { workflow_state: _.keys(@model.workflow.states)[0] },
      { silent: true }
    
  # Handle transitions between states
  # Usage:
  #   @user.transition('go')
  transition: (event) ->
    state = @model.workflow.states[@model.workflowState()]
    e = state.events[event]
    if e
      @model.set({ workflow_state: e.transitionsTo })

      # Handle Callbacks
      # upper = event.charAt(0)
      cb = @model["on#{event.charAt(0).toUpperCase()}#{event.substr(1, event.length-1)}"]
      cb() if cb
      true
    else
      false

  workflowState: -> @model.get('workflow_state')