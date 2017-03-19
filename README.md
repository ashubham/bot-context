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

## Usage

This is a very basic pizza delivery bot, to demonstrate the usage of
bot-context.

```javascript
// The message recieving module.
let context = require('bot-context');

function onMessageRecieved(message, userId) {
  let ctx = botContext.getOrCreate(userId);
  ctx.match(message, function(err, match, contextCb) {
    if(!err) contextCb(userId, match);
  });

  if(!ctx.isSet()) {
      init(userId); // initialize the actions.
  }
}
```

The set of actions to send the message:

```javascript
function init(userId) {
  let ctx = botContext.getOrCreate(userId);
  ctx.set(
      /.*/,  // The base matcher to match anything.
      (match) => getPizzaType(userId));
}

function getPizzaType(userId) {
  let ctx = botContext.getOrCreate(userId);
  ctx.set(
    /(chicken|cheese|veggie)/, 
    (match) => getDeliveryAddress(userId, match)
  );
  sendMessage(userId, "What kind of pizza do you want ?");
}

function getDeliveryAddress(userId, pizzaType) {
  let address = userDataService.getAddress(userID);
  let ctx = botContext.getOrCreate(userId);

  if(address) {
    ctx.set(/(yes|no)/, (reponse) => {
        if(response === 'yes') {
            userDataService.clearAddress(userId);
            getDeliverAddress(userId, pizzaType);
        } else {
            end(userId, pizzaType, address);
        }
    });
    sendMessage(userId, 'Would you like to change your address ?'); 
    return;   
  }

  ctx.set(
    validateAddressUsingGoogleAPI, // Can use some async API method
    (address) => end(userId, pizzaType, address)
  ); // Note that pizzaType is now a closure variable.
  sendMessage(userId, `Please enter the delivery Address.`); 
}

function end(userId, pizzaType, address) {
  sendMessage(userId, `Thank you, a ${pizzaType} pizza, will be` +
    + `delivered to ${address} in 30 mins.`);
} 
```

Now, if a user after putting his address changes his mind to another pizza type, by just typing the type of the pizza.

## API

-   [ContextMap](#contextmap)
    -   [constructor](#constructor)
    -   [getOrCreate](#getorcreate)
-   [Context](#context)
    -   [constructor](#constructor-1)
    -   [set](#set)
    -   [ContextCb](#contextcb)
    -   [matcherFn](#matcherfn)
    -   [isSet](#isset)
    -   [match](#match)
    -   [contextMatchedCb](#contextmatchedcb)

## ContextMap

**Extends Map**

A map to hold contexts for all users/keys

### constructor

Creates an instance of ContextMap.

**Parameters**

-   `args` **any** 

### getOrCreate

Get Or Creates a context given the key.

**Parameters**

-   `uKey` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 

Returns **[Context](#context)** 

## Context

### constructor

Creates an instance of Context.

**Parameters**

-   `key` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 

### set

Set the current context.

**Parameters**

-   `pattern` **([RegExp](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | matcherFn)** 
-   `callback` **ContextCb** 

### ContextCb

Context callback set in the context stack.

Type: [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)

**Parameters**

-   `pattern`  
-   `callback`  

### matcherFn

Matcher method called when matching contexts.

Type: [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)

**Parameters**

-   `text` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** input text
-   `cb` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** Callback resolving to truthy/falsy value.
-   `pattern`  
-   `callback`  

### isSet

Returns whethere there is any context set.

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** 

### match

Match an input text to the collection of currently set contexts.

**Parameters**

-   `input` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** text
-   `callback` **contextMatchedCb** The callback to be called if matched.
-   `text`  
-   `cb`  

Returns **any** 

### contextMatchedCb

Callback when a context is matched.

Type: [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)

**Parameters**

-   `err` **([string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | null)** Error if any
-   `match` **any** the match returned from the matchFn or regex
-   `callback` **ContextCb** the callback set to the context stack.
-   `text`  
-   `cb`  

