(function() {
  var NoWorkflow, User;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  User = (function() {
    __extends(User, Backbone.Model);
    function User() {
      this.onSignUp = __bind(this.onSignUp, this);
      this.initialize = __bind(this.initialize, this);
      User.__super__.constructor.apply(this, arguments);
    }
    User.prototype.defaults = {
      signed_up_at: null
    };
    User.prototype.workflow = {
      states: {
        visitor: {
          events: {
            signUp: {
              transitionsTo: 'user'
            },
            bail: {
              transitionsTo: 'lostUser'
            }
          }
        },
        user: {
          events: {
            closeAccount: {
              transitionsTo: 'visitor'
            },
            promote: {
              transitionsTo: 'superUser'
            }
          }
        },
        superUser: {},
        lostVisitor: {}
      }
    };
    User.prototype.initialize = function() {
      return _.extend(this, new Backbone.Workflow(this));
    };
    User.prototype.onSignUp = function() {
      return this.set('signed_up_at', new Date());
    };
    return User;
  })();
  NoWorkflow = (function() {
    __extends(NoWorkflow, Backbone.Model);
    function NoWorkflow() {
      NoWorkflow.__super__.constructor.apply(this, arguments);
    }
    return NoWorkflow;
  })();
  $(document).ready(function() {
    module('workflow', {
      setup: __bind(function() {
        return this.user = new User();
      }, this)
    });
    test('do nothing if no workflow state is delcared', __bind(function() {
      return ok(__bind(function() {
        var model;
        model = new NoWorkflow();
        return equal(model.get('workflow_state'), null);
      }, this));
    }, this));
    test('user has initial workflow state', __bind(function() {
      return equal(this.user.get('workflow_state'), 'visitor');
    }, this));
    test('transition to new state', __bind(function() {
      equal(this.user.transition('signUp'), true);
      equal(this.user.workflowState(), 'user');
      equal(this.user.transition('closeAccount'), true);
      return equal(this.user.workflowState(), 'visitor');
    }, this));
    test('throw error if no transition for current state', __bind(function() {
      return equal(this.user.transition('yo'), false);
    }, this));
    return test('call user defined method for transition', __bind(function() {
      equal(this.user.transition('signUp'), true);
      equal(this.user.workflowState(), 'user');
      return notEqual(this.user.get('signed_up_at'), null);
    }, this));
  });
}).call(this);
