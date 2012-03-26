# Written by Kendall Buchanan (https://github.com/kendagriff)
# MIT License
# Version 0.0.1

class Backbone.Workflow
  attrName: 'workflow_state'

  constructor: (model, attrs={}) ->
    @model = model

    # Customize the workflow attribute name
    @attrName = attrs.attrName if attrs.attrName

    # Set up the model's initial workflow state
    unless @model.get(@attrName)
      params = {}
      params[@attrName] = _.keys(@model.workflow.states)[0]
      @model.set params, { silent: true }
    
  # Handle transitions between states
  # Usage:
  #   @user.transition('go')
  transition: (event, opts) ->
    opts ||= {}
    state = @model.workflow.states[@model.workflowState()]
    e = state.events[event]
    if e
      # Trigger transition:from event
      @model.trigger "transition:from:#{@model.workflowState()}"

      # Change state
      params = {}
      params[@attrName] = e.transitionsTo
      @model.set params

      # Handle user defined callback
      # upper = event.charAt(0)
      cb = @model["on#{event.charAt(0).toUpperCase()}#{event.substr(1, event.length-1)}"]
      cb() if cb

      # Trigger transition:to event
      @model.trigger "transition:to:#{@model.workflowState()}"

      true
    else
      throw "There is no transition '#{event}' for state '#{@model.workflowState()}'."
      false

  workflowState: -> @model.get(@attrName)
