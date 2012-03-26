(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
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
      if (!this.model.get(this.attrName)) {
        params = {};
        params[this.attrName] = this.model.workflow.initial;
        if (!params[this.attrName]) {
          throw "Set the initial property to your initial workflow state.";
        }
        this.model.set(params, {
          silent: true
        });
      }
    }
    Workflow.prototype.triggerEvent = function(event, opts) {
      var params;
      opts || (opts = {});
      event = _.first(_.select(this.model.workflow.events, __bind(function(e) {
        return e.name === event && e.from === this.model.workflowState();
      }, this)));
      if (event) {
        this.model.trigger("transition:from:" + (this.model.workflowState()));
        params = {};
        params[this.attrName] = event.to;
        this.model.set(params);
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
