(function() {
  var DualPersonalityUser, InitialFlow, NoInitialFlow, NoWorkflow, User;
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
  DualPersonalityUser = (function() {
    __extends(DualPersonalityUser, Backbone.Model);
    function DualPersonalityUser() {
      this.initialize = __bind(this.initialize, this);
      DualPersonalityUser.__super__.constructor.apply(this, arguments);
    }
    DualPersonalityUser.prototype.jekyll_workflow = {
      initial: 'happy',
      events: [
        {
          name: 'stub_toe',
          from: 'happy',
          to: 'hurting'
        }, {
          name: 'get_massage',
          from: 'hurting',
          to: 'happy'
        }
      ]
    };
    DualPersonalityUser.prototype.hyde_workflow = {
      initial: 'catatonic',
      events: [
        {
          name: 'stub_toe',
          from: 'catatonic',
          to: 'ticked'
        }, {
          name: 'get_massage',
          from: 'ticked',
          to: 'catatonic'
        }
      ]
    };
    DualPersonalityUser.prototype.initialize = function() {
      var workflows;
      workflows = [
        {
          name: 'jekyll_workflow',
          attrName: 'jekyll_workflow_state'
        }, {
          name: 'hyde_workflow',
          attrName: 'hyde_workflow_state'
        }
      ];
      return _.extend(this, new Backbone.Workflow(this, {}, workflows));
    };
    return DualPersonalityUser;
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
        return equal(model.get('workflow_state'), null);
      }, this));
    }, this));
    test('error for no initial state', __bind(function() {
      return raises(__bind(function() {
        var model;
        return model = new NoInitialFlow();
      }, this));
    }, this));
    test('user has initial workflow state', __bind(function() {
      return equal(this.user.get('workflow_blate'), 'visitor');
    }, this));
    test('user has custom initial workflow state', __bind(function() {
      var model;
      model = new InitialFlow();
      return equal('user', model.get('workflow_state'));
    }, this));
    test('triggerEvent to new state', __bind(function() {
      equal(this.user.triggerEvent('signUp'), true);
      equal(this.user.get('workflow_blate'), 'user');
      equal(this.user.triggerEvent('closeAccount'), true);
      return equal(this.user.get('workflow_blate'), 'visitor');
    }, this));
    test('error if no event for current state', __bind(function() {
      return raises(__bind(function() {
        return equal(this.user.triggerEvent('closeAccount'), false);
      }, this));
    }, this));
    test('custom attributes name', __bind(function() {
      return equal(this.user.get('workflow_blate'), 'visitor');
    }, this));
    module('triggerEvents', {
      setup: __bind(function() {
        return this.user = new User();
      }, this)
    });
    test('transition:from', __bind(function() {
      var i;
      i = 0;
      this.user.on('transition:from:visitor', function() {
        return i = 1;
      });
      this.user.triggerEvent('signUp');
      return equal(i, 1);
    }, this));
    test('transition:to', __bind(function() {
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
    test('option to persist to server', __bind(function() {
      return this.user.triggerEvent('signUp');
    }, this));
    module('multiple workflows', {
      setup: __bind(function() {
        return this.user = new DualPersonalityUser();
      }, this)
    });
    test('set up two workflows', __bind(function() {
      equal(this.user.get('jekyll_workflow_state'), 'happy');
      return equal(this.user.get('hyde_workflow_state'), 'catatonic');
    }, this));
    test('error on non-existent workflow', __bind(function() {
      return raises(__bind(function() {
        return equal(this.user.triggerEvent('stub_toe', 'fake_workflow'), false);
      }, this));
    }, this));
    test('triggerEvent on two workflows', __bind(function() {
      equal(this.user.triggerEvent('stub_toe', 'jekyll_workflow'), true);
      equal(this.user.get('jekyll_workflow_state'), 'hurting');
      equal(this.user.triggerEvent('stub_toe', 'hyde_workflow'), true);
      return equal(this.user.get('hyde_workflow_state'), 'ticked');
    }, this));
    test('transition:from multiple workflows', __bind(function() {
      var i;
      i = 0;
      this.user.on('transition:from:jekyll_workflow:happy', function() {
        return i = 1;
      });
      this.user.triggerEvent('stub_toe', 'jekyll_workflow');
      return equal(i, 1);
    }, this));
    return test('transition:to multiple workflows', __bind(function() {
      var i;
      i = 0;
      this.user.on('transition:from:jekyll_workflow:happy', function() {
        return i = 1;
      });
      this.user.on('transition:to:jekyll_workflow:hurting', function() {
        return i = 2;
      });
      this.user.triggerEvent('stub_toe', 'jekyll_workflow');
      return equal(i, 2);
    }, this));
  });
}).call(this);
