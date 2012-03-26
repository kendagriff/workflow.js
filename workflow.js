(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Backbone.Workflow = (function() {
    function Workflow(model, attrs, workflows) {
      var obj, params, w, workflow, _i, _j, _len, _len2, _ref;
      if (attrs == null) {
        attrs = {};
      }
      this.model = model;
      this.model.workflows = [];
      if (this.model.workflow) {
        this.model.workflow.name = 'default';
        this.model.workflow.attrName = (attrs != null ? attrs.attrName : void 0) || 'workflow_state';
        this.model.workflows.push(this.model.workflow);
      }
      if (workflows) {
        for (_i = 0, _len = workflows.length; _i < _len; _i++) {
          w = workflows[_i];
          obj = this.model[w.name];
          w.initial = obj.initial;
          w.events = obj.events;
          this.model.workflows.push(w);
        }
      }
      _ref = this.model.workflows;
      for (_j = 0, _len2 = _ref.length; _j < _len2; _j++) {
        workflow = _ref[_j];
        if (!this.model.get(workflow.attrName)) {
          params = {};
          params[workflow.attrName] = workflow.initial;
          if (!params[workflow.attrName]) {
            throw "Set the initial property to your initial workflow state.";
          }
          this.model.set(params, {
            silent: true
          });
        }
      }
    }
    Workflow.prototype.triggerEvent = function(event, workflowName) {
      var workflow;
      workflow = _.detect(this.model.workflows, __bind(function(w) {
        return w.name === (workflowName ? workflowName : 'default');
      }, this));
      if (workflow) {
        event = _.detect(workflow.events, __bind(function(e) {
          return e.name === event && e.from === this.model.get(workflow.attrName);
        }, this));
        if (event) {
          if (workflow.name === 'default') {
            this.model.trigger("transition:from:" + (this.model.get(workflow.attrName)));
          } else {
            this.model.trigger("transition:from:" + workflow.name + ":" + (this.model.get(workflow.attrName)));
          }
          this.model.set(workflow.attrName, event.to);
          if (workflow.name === 'default') {
            this.model.trigger("transition:to:" + (this.model.get(workflow.attrName)));
          } else {
            this.model.trigger("transition:to:" + workflow.name + ":" + (this.model.get(workflow.attrName)));
          }
          return true;
        } else {
          throw "There is no transition '" + event + "' for state '" + (this.model.get(workflow.attrName)) + "'.";
        }
      } else {
        throw "There is no workflow '" + workflowName + "' defined.";
      }
      return false;
    };
    return Workflow;
  })();
}).call(this);
