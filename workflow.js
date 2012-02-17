(function() {
  Backbone.Workflow = (function() {
    function Workflow(model) {
      this.model = model;
      this.model.set({
        workflow_state: _.keys(this.model.workflow.states)[0]
      }, {
        silent: true
      });
    }
    Workflow.prototype.transition = function(event) {
      var cb, e, state;
      state = this.model.workflow.states[this.model.workflowState()];
      e = state.events[event];
      if (e) {
        this.model.set({
          workflow_state: e.transitionsTo
        });
        cb = this.model["on" + (event.charAt(0).toUpperCase()) + (event.substr(1, event.length - 1))];
        if (cb) {
          cb();
        }
        return true;
      } else {
        return false;
      }
    };
    Workflow.prototype.workflowState = function() {
      return this.model.get('workflow_state');
    };
    return Workflow;
  })();
}).call(this);
