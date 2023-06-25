# Developer Quickstart

In this tutorial we are going to build a simple chat app using XMTP and NextJS. We are going to be chatting to a bot for simplicity. The bot is going to be a simple echo bot that will reply with the same message we send.

### Demo App

[<div class="div-header-github-link"></div> xmtp-quickstart-nextjs](https://github.com/fabriguespe/xmtp-quickstart-nextjs)

```bash
git clone git@github.com:fabriguespe/xmtp-quickstart-nextjs.git
cd xmtp-quickstart-nextjs
npm install
npm run dev
```

### Getting started

The first step involves creating and configuring the Next.js application.

To generate a new Next.js app, execute the following command in your terminal:

```bash
npx create-next-app xmtp-quickstart-nextjs

✔ Would you like to use TypeScript with this project? Yes
✔ Would you like to use ESLint with this project? Yes
✔ Would you like to use Tailwind CSS with this project?  Yes
✔ Would you like to use `src/` directory with this project? No
✔ Use App Router (recommended)? Yes
✔ Would you like to customize the default import alias? No
```

### Learning Objectives:

- Setting up the ConnectWallet button
- Signing in with XMTP
- Loading a conversation
- Sending a message

### Install dependencies

```bash
npm install @xmtp/xmtp-js @thirdweb-dev/react
```

### Configuring the client

First we need to initialize XMTP client using as signer our wallet connection of choice.

```tsx
import Home from "@/components/Home";
import { ThirdwebProvider } from "@thirdweb-dev/react";

export default function Index() {
  return (
    <ThirdwebProvider activeChain="goerli">
      <Home />
    </ThirdwebProvider>
  );
}
```

### Display connect with XMTP

Now that we have the wrapper we can add a button that will sign our user in with XMTP.

```tsx
{
  isConnected && !isOnNetwork && (
    <div className={styles.xmtp}>
      <ConnectWallet theme="light" />
      <button onClick={initXmtp} className={styles.btnXmtp}>
        Connect to XMTP
      </button>
    </div>
  );
}
```

```tsx
// Function to initialize the XMTP client
const initXmtp = async function () {
  // Create the XMTP client
  const xmtp = await Client.create(signer, { env: "production" });
  //Create or load conversation with Gm bot
  newConversation(xmtp, PEER_ADDRESS);
  // Set the XMTP client in state for later use
  setIsOnNetwork(!!xmtp.address);
  //Set the client in the ref
  clientRef.current = xmtp;
};
```

### Load conversation and messages

Now using our hooks we are going to use the state to listen when XMTP is connected.

Later we are going to load our conversations and we are going to simulate starting a conversation with one of our bots

```tsx
useEffect(() => {
  if (isOnNetwork && convRef.current) {
    // Function to stream new messages in the conversation
    const streamMessages = async () => {
      const newStream = await convRef.current.streamMessages();
      for await (const msg of newStream) {
        const exists = messages.find((m) => m.id === msg.id);
        if (!exists) {
          setMessages((prevMessages) => {
            const msgsnew = [...prevMessages, msg];
            return msgsnew;
          });
        }
      }
    };
    streamMessages();
  }
}, [messages, isOnNetwork]);
```

### Listen to conversations

In your component initialize the hook to listen to conversations

```tsx

this.newConversation(xmtp, PEER_ADDRESS);

async newConversation(xmtp_client, addressTo) {
  if (await xmtp_client?.canMessage(PEER_ADDRESS)) {
    const conversation = await xmtp_client.conversations.newConversation(
      addressTo,
    );
    this.convRef = conversation;
    this.streamMessages();
    const messages = await conversation.messages();
    this.messages = messages;
    console.log(this.messages.length);
  } else {
    console.log("cant message because is not on the network.");
  }
},

```

#### Troubleshooting

##### VueCLI

If you are usign older versions of Vue which used vue-cli proceed with these steps:

1. Install the webpack package:

```bash
npm install --save-dev webpack
```

2. Then, in your vue.config.js, add the following:

```jsx
const webpack = require("webpack");

module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ["buffer", "Buffer"],
      }),
    ],
  },
  transpileDependencies: true,
};
```

This configuration tells Webpack to provide Buffer whenever it's used, without having to explicitly import it.

3. Then, in your main.js:

```jsx
import { Buffer } from "buffer";
window.Buffer = window.Buffer || Buffer;
```

##### Buffer polyfill

The Node Buffer API must be polyfilled in some cases. To do so, add the buffer dependency to your project and then polyfill it in your entry file.

1. Create a `polyfills.js` file with the following code

```tsx
import { Buffer } from "buffer";
window.Buffer = window.Buffer ?? Buffer;
```

2. Insert it into your `index.js` on the first line

```tsx
import "./polyfills";
```
