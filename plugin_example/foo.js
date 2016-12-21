Tuna.plugin("Foo", () => {
    console.log("Plugin Foo was registered");
    return function Foo (a) {
        console.log(`I'm a new foo ${a}`);
    };
});
