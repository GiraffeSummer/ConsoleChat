# How to make a command

Start by copying `./commands/test` or `./lib/template/command.js`.

These files are the baseline of what a command will look like,


You will receive a few parameters with the function:

## server
The server parameter will contain all the users in the server, and all the commands available., the base structure looks like this:
```json
{ 
    commands: { }, 
    users: { } 
}
```
<br>

## msg
The msg parameter will contain the message object.
The message object:
```json
{ 
    user: {
        name:"username",
         color:"hex color"
    },
    message: "message text" 
}
```

Furthermore there are 2 functions you can call from the msg object:

+ ### send:
    send will send a message to all the users in the server.  
    example: `msg.send("message text");`
+ ### reply:
    reply will send a message just to the person who executed the command.  
    example: `msg.reply("message text");`

<br>

## args
Args are the arguments passed to the command, for example if you run  
 `/help a b c` you will receive the array: `['a', 'b', 'c']`

  
<br>    
    

A fun feature to know, it turns out you can use npm packages, you just need to run: `npm i [package]` in `\Documents\cmdChat\commands\`

<br>

This was all there is to know at this moment, I hopefully will add more features, and feel free to suggest features!