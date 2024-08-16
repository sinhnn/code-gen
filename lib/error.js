class NotImplemented extends Error {
    constructor() { super("NotImplemented"); }
}

class NotSupported extends Error {
    constructor() { super("NotSupported"); }
}

class InterfaceNotImplemented extends Error {
    constructor() { super("InterfaceNotImplemented"); }
}

module.exports = { NotImplemented, NotSupported, InterfaceNotImplemented };