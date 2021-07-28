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

As of now I do not expose the eventmanager object yet, so you cannot run custom events yet, but I will hopefully in the future.
I want to figure out how to do this the best way.
I'm considering on putting it in the `server` object, let me know if you like this idea.

<br>

This was all there is to know at this moment, I hopefully will add more features.
  
If anyone requires more data or functions feel free to suggest it!
