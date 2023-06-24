<template>
  <div class="Home">
    <div v-if="!isConnected" class="thirdWeb">
      <button @click="connectWallet" class="btnXmtp">Connect Wallet</button>
    </div>
    <div v-if="isConnected && !isOnNetwork" class="xmtp">
      <ConnectWallet theme="light" />
      <button @click="initXmtp" class="btnXmtp">Connect to XMTP</button>
    </div>
    <template v-if="isConnected && isOnNetwork && messages">
      entra
      <Chat
        :client="clientRef"
        :conversation="convRef"
        :messageHistory="messages" />
    </template>
  </div>
</template>

<script>
import { Client } from "@xmtp/xmtp-js";
import { ethers } from "ethers";
const PEER_ADDRESS = "0x937C0d4a6294cdfa575de17382c7076b579DC176";

export default {
  data() {
    return {
      clientRef: false,
      isConnected: false,
      isOnNetwork: false,
      messages: null,
      convRef: false,
    };
  },
  mounted() {
    this.connectWallet();
  },
  methods: {
    async streamMessages() {
      const newStream = await this.convRef.streamMessages();
      for await (const msg of newStream) {
        const exists = this.messages.find((m) => m.id === msg.id);
        if (!exists) {
          this.messages.push(msg);
        }
      }
    },
    async connectWallet() {
      if (typeof window.ethereum !== "undefined") {
        try {
          // request account access
          await window.ethereum.enable();

          // we initialize ethers with Metamask provider
          this.provider = new ethers.providers.Web3Provider(window.ethereum);

          // get the signer
          this.signer = this.provider.getSigner();
          this.isConnected = !!this.signer;
          this.initXmtp(this.signer);
        } catch (error) {
          console.error("User rejected request");
        }
      } else {
        console.error("Metamask not found");
      }
    },
    async newConversation(xmtp_client, addressTo) {
      if (await xmtp_client?.canMessage(PEER_ADDRESS)) {
        const conversation = await xmtp_client.conversations.newConversation(
          addressTo,
        );
        this.convRef = conversation;
        const messages = await conversation.messages();
        this.messages = messages;
        console.log(this.messages.length);
      } else {
        console.log("cant message because is not on the network.");
      }
    },
    async initXmtp(signer) {
      const xmtp = await Client.create(signer, { env: "production" });
      this.newConversation(xmtp, PEER_ADDRESS);
      this.isOnNetwork = !!xmtp.address;
      this.clientRef = xmtp;
    },
  },
};
</script>
