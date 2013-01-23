# Written by Kendall Buchanan (https://github.com/kendagriff)
# MIT License
# Version 0.0.1

class Backbone.Workflow
  constructor: (model, attrs={}, workflows) ->
    @model = model
    @model.workflows = []

    # Add default workflow to list of workflows
    if @model.workflow
      @model.workflow.name = 'default'
      @model.workflow.attrName = attrs?.attrName || 'workflow_state'
      @model.workflows.push @model.workflow

    # Set up multiple workflows
    if workflows
      for w in workflows
        obj = @model[w.name]
        w.initial = obj.initial
        w.events = obj.events
        @model.workflows.push w

    # Set up the model's initial workflow states
    for workflow in @model.workflows
      unless @model.get(workflow.attrName)
        params = {}
        params[workflow.attrName] = workflow.initial
        throw "Set the initial property to your initial workflow state." unless params[workflow.attrName]
        @model.set params, { silent: true }
    
  # Handle transitions between states
  # Usage:
  #   @user.triggerEvent('go')
  #   @user.triggerEvent('go', 'workflow_name')
  triggerEvent: (event, workflowName) ->
    workflow = _.detect(@model.workflows, (w) => w.name is if workflowName then workflowName else 'default')
    if workflow
      event = _.detect(workflow.events, (e) => e.name is event and e.from is @model.get(workflow.attrName))
      if event
        # Trigger transition:from event
        if workflow.name is 'default'
          @model.trigger "transition:from"
          @model.trigger "transition:from:#{@model.get(workflow.attrName)}"
        else
          @model.trigger "transition:from:#{workflow.name}"
          @model.trigger "transition:from:#{workflow.name}:#{@model.get(workflow.attrName)}"

        # Change state
        @model.set workflow.attrName, event.to
        
        # Trigger transition:to event
        if workflow.name is 'default'
          @model.trigger "transition:to"
          @model.trigger "transition:to:#{@model.get(workflow.attrName)}"
        else
          @model.trigger "transition:to:#{workflow.name}"
          @model.trigger "transition:to:#{workflow.name}:#{@model.get(workflow.attrName)}"
        
        return true
      else
        throw "There is no transition '#{event}' for state '#{@model.get(workflow.attrName)}'."
    else
      throw "There is no workflow '#{workflowName}' defined."
    false
