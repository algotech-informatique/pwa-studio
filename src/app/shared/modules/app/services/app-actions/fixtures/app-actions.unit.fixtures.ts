import { SnAppDto, SnPageDto, SnPageWidgetDto } from '@algotech/core';

export const widget: SnPageWidgetDto = {
  id: '1',
  typeKey: 'button',
  name: 'widget',
  box: {
    x: 0,
    y: 0,
    height: 10,
    width: 10,
  },
  isActive: true,
  events: [{
    id: '1',
    eventKey: 'event1',
    pipe: [],
    custom: {},
  }],
  rules: [],
  css: {},
  custom: {},
  locked: false,
  lockedProperties: [],
};

export const shared: SnPageWidgetDto = {
  id: 'shared',
  typeKey: 'button',
  name: 'shared',
  box: {
    x: 0,
    y: 0,
    height: 10,
    width: 10,
  },
  isActive: true,
  events: [{
    id: '1',
    eventKey: 'onMoveMagnet',
    pipe: [],
    custom: {},
  }],
  rules: [{
    id: 'rule1',
    conditions: [],
    operator: 'and',
    name: 'rule1',
    color: 'color',
    css: {
      test: 1,
      test1: 2
    },
    custom: {
      selected: 1,
    },
    events: [],
  }],
  css: {
    test: 5,
    layout: 'bien-ou-bien'
  },
  custom: {
    selected: 1,
  },
  sharedId: 'master1',
  locked: false,
  lockedProperties: ['events.onMoveMagnet', 'selected.tab', 'css.layout', 'rules'],
};

export const sharedGroup: SnPageWidgetDto = {
  id: 'sharedGroup',
  typeKey: 'button',
  name: 'sharedGroup',
  box: {
    x: 0,
    y: 0,
    height: 10,
    width: 10,
  },
  group: {
    widgets: [
      {
        id: 'shared1.1',
        typeKey: 'button',
        name: 'shared',
        box: {
          x: 0,
          y: 0,
          height: 10,
          width: 10,
        },
        isActive: true,
        events: [{
          id: '1',
          eventKey: 'event1',
          pipe: [],
          custom: {},
        }],
        rules: [],
        css: {},
        custom: {},
        sharedId: 'shared1.1',
        locked: true,
        lockedProperties: [],
      },
      {
        id: 'shared1.2',
        typeKey: 'button',
        name: 'shared',
        box: {
          x: 0,
          y: 0,
          height: 10,
          width: 10,
        },
        isActive: true,
        events: [{
          id: '1',
          eventKey: 'event1',
          pipe: [],
          custom: {},
        }],
        rules: [],
        css: {},
        custom: {},
        sharedId: 'shared1.2',
        locked: false,
        lockedProperties: [],
      }
    ]
  },
  isActive: true,
  events: [{
    id: '1',
    eventKey: 'event1',
    pipe: [],
    custom: {},
  }],
  rules: [],
  css: {},
  custom: {},
  sharedId: 'master2',
  locked: false,
  lockedProperties: [],
};

export const master2: SnPageWidgetDto = {
  id: 'master2',
  typeKey: 'button',
  name: 'master2',
  box: {
    x: 0,
    y: 0,
    height: 10,
    width: 10,
  },
  group: {
    widgets: [
      {
        id: 'shared1.3',
        typeKey: 'button',
        name: 'shared',
        box: {
          x: 0,
          y: 0,
          height: 10,
          width: 10,
        },
        isActive: true,
        events: [{
          id: '1',
          eventKey: 'event1',
          pipe: [],
          custom: {},
        }],
        rules: [],
        css: {},
        custom: {},
        sharedId: 'shared1.3',
        locked: false,
        lockedProperties: [],
      },
      {
        id: 'shared1.2',
        typeKey: 'button',
        name: 'shared',
        box: {
          x: 0,
          y: 0,
          height: 10,
          width: 10,
        },
        isActive: true,
        events: [{
          id: '1',
          eventKey: 'event1',
          pipe: [],
          custom: {},
        }],
        rules: [],
        css: {},
        custom: {},
        sharedId: 'shared1.2',
        locked: false,
        lockedProperties: [],
      }
    ]
  },
  isActive: true,
  events: [{
    id: '1',
    eventKey: 'event1',
    pipe: [],
    custom: {},
  }],
  rules: [],
  css: {},
  custom: {},
  sharedId: 'master2',
  locked: false,
  lockedProperties: [],
};

export const master2Shared: SnPageWidgetDto = {
  id: 'sharedGroup',
  typeKey: 'button',
  name: 'master2',
  box: {
    x: 0,
    y: 0,
    height: 10,
    width: 10,
  },
  group: {
    widgets: [
      {
        id: 'shared1.3',
        typeKey: 'button',
        name: 'shared',
        box: {
          x: 0,
          y: 0,
          height: 10,
          width: 10,
        },
        isActive: true,
        events: [{
          id: '1',
          eventKey: 'event1',
          pipe: [],
          custom: {},
        }],
        rules: [],
        css: {},
        custom: {},
        sharedId: 'shared1.3',
        locked: false,
        lockedProperties: [],
      },
      {
        id: 'shared1.2',
        typeKey: 'button',
        name: 'shared',
        box: {
          x: 0,
          y: 0,
          height: 10,
          width: 10,
        },
        isActive: true,
        events: [{
          id: '1',
          eventKey: 'event1',
          pipe: [],
          custom: {},
        }],
        rules: [],
        css: {},
        custom: {},
        sharedId: 'shared1.2',
        locked: false,
        lockedProperties: [],
      }
    ]
  },
  isActive: true,
  events: [{
    id: '1',
    eventKey: 'event1',
    pipe: [],
    custom: {},
  }],
  rules: [],
  css: {},
  custom: {},
  sharedId: 'master2',
  locked: false,
  lockedProperties: [],
};

export const subobj1 = {
  typeKey: 'button',
  name: 'shared',
  box: {
    x: 0,
    y: 0,
    height: 10,
    width: 10
  },
  isActive: true,
  events: [
    {
      id: '1',
      eventKey: 'event1',
      pipe: [],
      custom: {}
    }
  ],
  rules: [],
  css: {},
  custom: {},
  sharedId: 'shared1.3',
  locked: false,
  lockedProperties: [],
};

export const subobj2 = {
  typeKey: 'button',
  name: 'shared',
  box: {
    x: 0,
    y: 0,
    height: 10,
    width: 10
  },
  isActive: true,
  events: [
    {
      id: '1',
      eventKey: 'event1',
      pipe: [],
      custom: {}
    }
  ],
  rules: [],
  css: {},
  custom: {},
  sharedId: 'shared1.1',
  locked: true,
  lockedProperties: [],
};

export const subobj3 = {
  typeKey: 'button',
  name: 'shared',
  box: {
    x: 0,
    y: 0,
    height: 10,
    width: 10
  },
  isActive: true,
  events: [
    {
      id: '1',
      eventKey: 'event1',
      pipe: [],
      custom: {}
    }
  ],
  rules: [],
  css: {},
  custom: {},
  sharedId: 'shared1.2',
  locked: false,
  lockedProperties: [],
};

export const master1: SnPageWidgetDto = {
  id: 'master1',
  typeKey: 'button',
  name: 'master1',
  box: {
    x: 0,
    y: 0,
    height: 10,
    width: 10,
  },
  isActive: true,
  events: [{
    id: '1',
    eventKey: 'event1',
    pipe: [],
    custom: {},
  }],
  rules: [{
    id: 'rule1',
    conditions: [],
    operator: 'and',
    name: 'rule1',
    color: 'color',
    css: {
      test: 1,
      test1: 2
    },
    custom: {
      test: 2
    },
    events: [],
  }],
  css: {
    test: 1,
  },
  custom: {
    selected: 1,
    icon: 'ma-gueule'
  },
  sharedId: 'master1',
  locked: false,
  lockedProperties: [],
};

export const mixedshared: SnPageWidgetDto = {
  id: 'shared',
  typeKey: 'button',
  name: 'master1',
  box: {
    x: 0,
    y: 0,
    height: 10,
    width: 10
  },
  isActive: true,
  events: [
    {
      id: '1',
      eventKey: 'event1',
      pipe: [],
      custom: {}
    },
    {
      id: '1',
      eventKey: 'onMoveMagnet',
      pipe: [],
      custom: {},
    }
  ],
  rules: [
    {
      id: 'rule1',
      conditions: [],
      operator: 'and',
      name: 'rule1',
      color: 'color',
      css: {
        test: 1,
        test1: 2
      },
      custom: {
        selected: 1,
      },
      events: [],
    }
  ],
  css: {
    test: 1,
    layout: 'bien-ou-bien',
  },
  custom: {
    icon: 'ma-gueule',
    selected: 1,
  },
  sharedId: 'master1',
  locked: false,
  lockedProperties: [
    'events.onMoveMagnet',
    'selected.tab',
    'css.layout',
    'rules'

  ],
};

export const master1Shared: SnPageWidgetDto = {
  id: 'shared',
  typeKey: 'button',
  name: 'master1',
  box: {
    x: 0,
    y: 0,
    height: 10,
    width: 10
  },
  isActive: true,
  events: [
    {
      id: '1',
      eventKey: 'event1',
      pipe: [],
      custom: {}
    }
  ],
  rules: [
    {
      id: 'rule1',
      conditions: [],
      operator: 'and',
      name: 'rule1',
      color: 'color',
      css: {
        test: 1,
        test1: 2
      },
      custom: {
        test: 2
      },
      events: []
    }
  ],
  css: {
    test: 1
  },
  custom: {
    selected: 1,
    icon: 'ma-gueule'
  },
  sharedId: 'master1',
  locked: false,
  lockedProperties: [],
};


export const page: SnPageDto = {
  id: 'page1',
  css: {},
  displayName: [],
  canvas: {
    x: 0,
    y: 0,
  },
  widgets: [widget, shared, sharedGroup],
  variables: [],
  dataSources: [],
  events: [],
  pageHeight: 100,
  pageWidth: 100,
};

export const app: SnAppDto = {
  id: 'app1',
  environment: 'web',
  pages: [page],
  icon: '',
  pageHeight: 100,
  pageWidth: 100,
  securityGroups: [],
  shared: [master1, master2],
};


