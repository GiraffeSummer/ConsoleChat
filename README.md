# ConsoleChat

This is a fun project I started working on to teach myself some new techniques and to keep myself busy. 
And just to see if I could get it to work.


start with `npm start`


build with `npm run build`
  

feel free to check out the scripts to see the console arguments.

But some examples of console arguments are:
 - **mode** - used to launch client or server mode (ex: `mode=2` < for server)
 - **port** - used to set server port, if this and mode is set it will auto launch the server (ex: `port=3000`)
 - **uri** - used to set the client connection uri, this will automatically launch and connect the client if mode is also set.


## Issues  
 some known issues are:
 - Receiving a message when typing messes with your input (it does not clear it) I do not know how I would fix this, so this might have to wait.
 - Colors don't work properly on a windows machine from a linux server. (windows based server works best)

## How to make a command?
you can learn how to make a command [Here](HOW_TO_MAKE_COMMAND.md)

## Events?
you can learn custom event triggers [Here](EVENTS.md)