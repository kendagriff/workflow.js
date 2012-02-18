(function() {
  Backbone.Workflow = (function() {
    Workflow.prototype.attrName = 'workflow_state';
    function Workflow(model, attrs) {
      var params;
      if (attrs == null) {
        attrs = {};
      }
      this.model = model;
      if (attrs.attrName) {
        this.attrName = attrs.attrName;
      }
      if (!this.model.get('workflow_state')) {
        params = {};
        params[this.attrName] = _.keys(this.model.workflow.states)[0];
        this.model.set(params, {
          silent: true
        });
      }
    }
    Workflow.prototype.transition = function(event) {
      var cb, e, params, state;
      state = this.model.workflow.states[this.model.workflowState()];
      e = state.events[event];
      if (e) {
        this.model.trigger("transition:from:" + (this.model.workflowState()));
        params = {};
        params[this.attrName] = e.transitionsTo;
        this.model.set(params);
        cb = this.model["on" + (event.charAt(0).toUpperCase()) + (event.substr(1, event.length - 1))];
        if (cb) {
          cb();
        }
        this.model.trigger("transition:to:" + (this.model.workflowState()));
        return true;
      } else {
        throw "There is no transition '" + event + "' for state '" + (this.model.workflowState()) + "'.";
        return false;
      }
    };
    Workflow.prototype.workflowState = function() {
      return this.model.get(this.attrName);
    };
    return Workflow;
  })();
}).call(this);
