Tuna.plugin("Bar", (Foo) => {
    console.log("Plugin Bar was registered");
    console.log("Bar asked for Foo and got", Foo);

    return function Bar () {
        console.log("I'm a new bar");
        this.foo = new Foo(1);
    };
});

