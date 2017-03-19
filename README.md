# bot-context
<a href="https://travis-ci.org/ashubham/bot-context">
  <img src="https://travis-ci.org/ashubham/bot-context.svg?branch=master" class="badge">
</a>
<a href='https://coveralls.io/github/ashubham/bot-context?branch=master'>
    <img src='https://coveralls.io/repos/github/ashubham/bot-context/badge.svg?branch=master' alt='Coverage Status' />
</a>


A easy and powerful way to maintain conversational context in chat bots. Using function closures.
[Blog post](https://medium.com/@ashishshubham/maintaining-context-in-chatbots-2016b6a5b7c6#.z08lc981s)

## Core Concept

![context stack](https://raw.githubusercontent.com/ashubham/bot-context/master/img/context-stack.png)

Here we introduce a reactive approach to maintaining the context of conversations. 

    - Whenever the bot sends a message, set(push) a context(callback) on the stack.
    - Whenever the bot recieves a message, match the message in FIFO order to 
      the items on the stack. And call the callback.

The elegant trick here is that when a callback is pushed on the stack, 
it captures the closure state of the callback function being pushed. 

So when we match the context stack on recieving a message, the closure variables and data
are maintained, allowing time travel!

## Basic usage

```javascript
let context = require('bot-context');

// When Sending message
let userCtx = context.getOrCreate(userId);
userCtx.set(`/yes/`, (match, cb) => {
    console.log('User said yes');
    cb();
});
userCtx.set(`/no/`, (match, cb) => {
    console.log('User said no');
});
sendMessage(userId, 'Do you want to continue ?');

// When recieving message
onMessageRecieved((userId, message) => {
    let userCtx = context.getOrCreate(userId);
    userCtx.match(message, (err, match, contextCb) => {
        if(!err) {
            contextCb(match);
        }
    })
});
```
