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
      params[@attrName] = @model.workflow.initial
      throw "Set the initial property to your initial workflow state." unless params[@attrName]
      @model.set params, { silent: true }
    
  # Handle transitions between states
  # Usage:
  #   @user.triggerEvent('go')
  triggerEvent: (event, opts) ->
    opts ||= {}

    event = _.first(_.select(@model.workflow.events, (e) => e.name is event and e.from is @model.workflowState()))
    if event
      # Trigger transition:from event
      @model.trigger "transition:from:#{@model.workflowState()}"

      # Change state
      params = {}
      params[@attrName] = event.to
      @model.set params
      
      # Trigger transition:to event
      @model.trigger "transition:to:#{@model.workflowState()}"
      
      true
    else
      throw "There is no transition '#{event}' for state '#{@model.workflowState()}'."
      false

  workflowState: -> @model.get(@attrName)
