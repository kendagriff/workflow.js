(function() {
  var InitialFlow, NoInitialFlow, NoWorkflow, User;
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
      this.initialize = __bind(this.initialize, this);
      User.__super__.constructor.apply(this, arguments);
    }
    User.prototype.defaults = {
      signed_up_at: null
    };
    User.prototype.workflow = {
      initial: 'visitor',
      events: [
        {
          name: 'signUp',
          from: 'visitor',
          to: 'user'
        }, {
          name: 'bail',
          from: 'visitor',
          to: 'lostUser'
        }, {
          name: 'closeAccount',
          from: 'user',
          to: 'visitor'
        }, {
          name: 'promote',
          from: 'user',
          to: 'superUser'
        }
      ]
    };
    User.prototype.initialize = function() {
      return _.extend(this, new Backbone.Workflow(this, {
        attrName: 'workflow_blate'
      }));
    };
    return User;
  })();
  InitialFlow = (function() {
    __extends(InitialFlow, Backbone.Model);
    function InitialFlow() {
      this.initialize = __bind(this.initialize, this);
      InitialFlow.__super__.constructor.apply(this, arguments);
    }
    InitialFlow.prototype.workflow = {
      initial: 'visitor'
    };
    InitialFlow.prototype.initialize = function() {
      this.set('workflow_state', 'user', {
        silent: true
      });
      return _.extend(this, new Backbone.Workflow(this));
    };
    return InitialFlow;
  })();
  NoInitialFlow = (function() {
    __extends(NoInitialFlow, Backbone.Model);
    function NoInitialFlow() {
      this.initialize = __bind(this.initialize, this);
      NoInitialFlow.__super__.constructor.apply(this, arguments);
    }
    NoInitialFlow.prototype.workflow = {};
    NoInitialFlow.prototype.initialize = function() {
      return _.extend(this, new Backbone.Workflow(this));
    };
    return NoInitialFlow;
  })();
  NoWorkflow = (function() {
    __extends(NoWorkflow, Backbone.Model);
    function NoWorkflow() {
      NoWorkflow.__super__.constructor.apply(this, arguments);
    }
    return NoWorkflow;
  })();
  $(document).ready(function() {
    module('basic workflow', {
      setup: __bind(function() {
        return this.user = new User();
      }, this)
    });
    test('do nothing if no workflow state is delcared', __bind(function() {
      return ok(__bind(function() {
        var model;
        model = new NoWorkflow();
        return equal(model.workflowState(), null);
      }, this));
    }, this));
    test('error for no initial state', __bind(function() {
      return raises(__bind(function() {
        var model;
        return model = new NoInitialFlow();
      }, this));
    }, this));
    test('user has initial workflow state', __bind(function() {
      return equal(this.user.workflowState(), 'visitor');
    }, this));
    test('user has custom initial workflow state', __bind(function() {
      var model;
      model = new InitialFlow();
      return equal('user', model.workflowState());
    }, this));
    test('triggerEvent to new state', __bind(function() {
      equal(this.user.triggerEvent('signUp'), true);
      equal(this.user.workflowState(), 'user');
      equal(this.user.triggerEvent('closeAccount'), true);
      return equal(this.user.workflowState(), 'visitor');
    }, this));
    test('error if no event for current state', __bind(function() {
      return raises(__bind(function() {
        return equal(this.user.triggerEvent('closeAccount'), false);
      }, this));
    }, this));
    test('custom attributes name', __bind(function() {
      return equal(this.user.get('workflow_blate'), this.user.workflowState());
    }, this));
    module('triggerEvents', {
      setup: __bind(function() {
        return this.user = new User();
      }, this)
    });
    test('triggerEvent:from', __bind(function() {
      var i;
      i = 0;
      this.user.on('transition:from:visitor', function() {
        return i = 1;
      });
      this.user.triggerEvent('signUp');
      return equal(i, 1);
    }, this));
    test('triggerEvent:to', __bind(function() {
      var i;
      i = 0;
      this.user.on('transition:from:visitor', function() {
        return i = 1;
      });
      this.user.on('transition:to:user', function() {
        return i = 2;
      });
      this.user.triggerEvent('signUp');
      return equal(i, 2);
    }, this));
    return test('option to persist to server', __bind(function() {
      return this.user.triggerEvent('signUp');
    }, this));
  });
}).call(this);
