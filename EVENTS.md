# Events

You can create custom event triggers. 

<br>

you can have a look at the basic functions in `./lib/template/events.js`

Events are basic functions that can be called on the event trigger.

<br>

You enable events by putting the .js file in the right folder in
`C:\Users\[USER]\Documents\cmdChat\events\`.

So if you want a function to trigger when user switches channel, you put it in folder `/changechannel`
  
  <br>

The events have to be exported in module.exports, for example:
```js
// /ready/example.js
module.exports = (server) => { }
```

Every event has their own set of parameters:

## `ready`
Ready will trigger when the server is ready for users to join.
it only has the `server` parameter.
```js
module.exports = (server) => { }
```
<br>

## `join` / `leave`
the join and leave triggers when a user joins or leaves the server, 
it will have the `server` and the `user` parameter, `type` is a string with 'join' or 'leave'.
```js
module.exports = (server, user, type) => {
    //type == 'join' or 'leave'
}
```

## `message`
The message event will trigger when a user sends a message.
it has the `server` and `message` parameters.

```js
module.exports = (server, message) => { }
```


## `createchannel`
The createchannel event will trigger when a user creates a channel.
it has the `server`, `user` and `newChannel` parameters.  
`newChannel` will be a channel object with the new channel.
```js
module.exports = (server, user, newChannel) => { }
```

## `changechannel`
The changechannel event will trigger when a user switches channel.
it has the `server`, `user`, `newChannel` and `oldChannel` parameters.
`newChannel` will be a channel object with the user's new channel.
`oldChannel` will be a channel object with the user's old channel.

```js
module.exports = (server, user, newChannel, oldChannel) => { }
```



All the other properties that would be available through the commands, are also available through the events.

So on the `changechannel` event you can run the `send` function like:
```js
oldChannel.send(user.name + " left the channel!");
```

this is also true for the `server`, `user` and `message` objects
tip: you can access the `user` object through the `message` object




    

A fun feature to know, you can use npm packages, you just need to run: `npm i [package]` in `\Documents\cmdChat\commands\`

<br>

## Custom events
You can create custom events by subscribing them to the eventManager. (recommended to do in the `ready` event)

You can subscribe an event using the `Subscribe` function

an example from the `ready` event:
```js
module.exports = (server) => {
    const data = { version: server.version, mainChannel: server.mainChannelName };

    server.eventManager.Subscribe('custom', server);

    server.eventManager.Run('custom', { server, ...data })
}
```

So you use `server.eventManager.Subscribe()` to subscribe the event, you need to pass in the event name, as a string, and the server object. You do not need to do anything about the server object!
  
You can trigger an event by using `server.eventManager.Run()` 
you need to pass in the event name as a string again. and then as second parameter, you need to pass in the server object again.
and then any data you'd like to pass with it, you can spread any objects (like in the example), and it should work fine.
  
An example event trigger for this event could be:
```js
module.exports = (server, version, mainChannel) => {
    console.log('Server version: ', version);
}
```




<br>

This was all there is to know at this moment, I hopefully will add more features.
  
If anyone requires more data or functions feel free to suggest it!
