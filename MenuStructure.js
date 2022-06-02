const { platforms, tasks, actions } = require('./Enums');


exports.structure = {
    1: {
        id: platforms.UNITY,
        1: {
            id: tasks.WORKSPACE,
            1: {
                id: actions.CREATE
            }
        },
        2: {
            id: tasks.MARKDOWN,
            1: {
                id: actions.ADD
            },
            2: {
                id: actions.TRIM
            },

        },
        3: {
            id: tasks.PROJECTS,
            1: {
                id: actions.ADD
            },
            2: {
                id: actions.FAIL
            },
        }
    },
    2: {
        id: platforms.BLENDER,
        1: {
            id: tasks.WORKSPACE,
            1: {
                id: actions.CREATE
            }
        },
        2: {
            id: tasks.MARKDOWN,
            1: {
                id: actions.ADD
            },
            2: {
                id: actions.TRIM
            },

        },
        3: {
            id: tasks.PROJECTS,
            1: {
                id: actions.ADD
            },
            2: {
                id: actions.FAIL
            },
        }
    },
    3: {
        id: platforms.PHOTOSHOP,
        1: {
            id: tasks.WORKSPACE,
            1: {
                id: actions.CREATE
            }
        },
        2: {
            id: tasks.MARKDOWN,
            1: {
                id: actions.ADD
            },
            2: {
                id: actions.TRIM
            },

        },
        3: {
            id: tasks.PROJECTS,
            1: {
                id: actions.ADD
            },
            2: {
                id: actions.FAIL
            },
        }
    },
    4: {
        id: platforms.MATH,
        1: {
            id: tasks.WORKSPACE,
            1: {
                id: actions.CREATE
            }
        },
        2: {
            id: tasks.MARKDOWN,
            1: {
                id: actions.ADD
            },
            2: {
                id: actions.TRIM
            }
        }
    },
    5: {
        id: platforms.SUBSTANCE_PAINTER,
        1: {
            id: tasks.WORKSPACE,
            1: {
                id: actions.CREATE
            }
        },
        2: {
            id: tasks.MARKDOWN,
            1: {
                id: actions.ADD
            },
            2: {
                id: actions.TRIM
            },

        },
        3: {
            id: tasks.PROJECTS,
            1: {
                id: actions.ADD
            }
        }
    }
}