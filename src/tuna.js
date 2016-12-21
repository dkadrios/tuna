(function tuna_def (g) {
    const init    = [connectify, resolveDependencies];
    const plugins = {};

    Object.defineProperties(Tuna.prototype, {
        currentTime : {get   : getCurrentTime},
        now         : {get   : getCurrentTime},
        destination : {get   : getDestination},
        toString    : {value : help}
    });

    Tuna.plugin   = plugin;
    Tuna.toString = help;

    return define(g);

    // Defininition
    function Tuna (context) {
        const AudioContext = g.AudioContext || g.webkitAudioContext;

        if (prototypeOf(this) === prototypeOf(Tuna)) {
            if (prototypeOf(context) !== prototypeOf(AudioContext)) {
                if (context) {
                    console.warn("Tuna expects an AudioContext but got", context);
                    console.log(help());
                }
                context = null;
            }
            if (context) {
                this.context = context;
            } else {
                this.context = AudioContext ? new AudioContext() : null;
            }
            if (this.context) {
                init.forEach(f => f(this));
            } else {
                nope();
            }
        } else {
            return new Tuna(context);
        }
    }
    // define tuna as a global, commonjs module, or amd
    function define (g, AudioContext) {
        if (typeof g.define === "function") {
            g.define("Tuna", () => Tuna);
        } else {
            (g.module ? module.exports : g).Tuna = Tuna;
        }
        return Tuna;
    }
    // .jpg
    function nope () {
        throw new Error("Tuna can't initialize! This environment does not support web audio");
    }

    // allow tuna nodes to be connect just like regular webaudio nodes
    function connectify (tuna) {
        const gain    = tuna.context.createGain();
        const p       = Object.getPrototypeOf;
        const proto   = p(p(gain));
        const connect = proto.connect;
        proto.connect = tunaConnect;

        function tunaConnect (dest, output, input) {
            return connect.call(this, dest.input ? dest.input : dest, output, input);
        }
    }

    // shortcut to get the current time (in milliseconds)
    function getCurrentTime () {
        return this.context.currentTime * 1000;
    }
    // shortcut to get the context.destination node
    function getDestination () {
        return this.context.destination;
    }
    // register a new plugin with tuna
    function plugin (name, def) {
        plugins[name] = {name, def, deps: parseDependencies(def)};
        return def;
    }
    // (private) resolve the dependencies for a plugin
    function resolveDependencies (tuna) {
        Object.keys(plugins).forEach(name => Tuna[name] = req(name));
    }
    function req (name) {
        return Tuna[name] || res(name);
    }
    // resolve a dmaf module from registered to fulfilled
    function res (name) {
        const {def, deps} = plugins[name];
        return def(...deps.map(req));
    }
    // (private) get module dependencies from a module definition as an array of strings
    function parseDependencies (fn) {
        const fnargs  = /[^\(]*\(\s*([^\)]*)\)/;
        const args    = fnargs.exec(fn);
        const str     = args && args[1] && args[1].replace(/\s/gm, "");

        return str ? str.split(/\,/) : [];
    }
    // (private) get the prototype of an object or function
    function prototypeOf (x) {
        return x ? typeof x === "function" ? x.prototype : Object.getPrototypeOf(x) : null;
    }

    // help
    function help () {
        return "Visit https://github.com/Theodeus/tuna/wiki for instructions on how to use Tuna.js";
    }
})(typeof window === "undefined" ? global : window);
