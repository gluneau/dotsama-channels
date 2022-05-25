<template>
  <div class="q-px-lg q-pb-md">
    <q-timeline :layout="layout" color="secondary">
      <q-timeline-entry heading>
        About the Dotsama Channel App
      </q-timeline-entry>
      <q-timeline-entry side="center" icon="help">
        <div>
          The Dotsama Channel App was born as a tool to visualise the growing
          network of HRMP connection between parachains and manage the different
          steps required to bring each connection project to success.
          <br /><br />
          The HRMP connection are loaded from the relay chains in realtime and
          the token lists are loaded from each parachchain in realtime.
        </div>
      </q-timeline-entry>

      <q-timeline-entry heading>Credits</q-timeline-entry>
      <q-timeline-entry
        title="Author"
        subtitle="Gregory Luneau"
        side="right"
        icon="account_circle"
      >
        <div>
          <img width="80" src="greg-smile-cropped.png" />
          Greg is a team member of
          <a target="_blank" href="https://acala.network/"><b>Acala</b></a> and
          the Lead Integrator.<br /><br /><i>
            <b>"</b>
            If you have improvement suggestion, please contact me on Telegram as
            gluneau <b>"</b></i
          ><br /><br />
        </div>
      </q-timeline-entry>

      <q-timeline-entry
        title="Predictive Parachain Icon Set"
        subtitle="Talisman"
        icon="wallet"
        side="left"
      >
        <div>
          <img
            width="80"
            src="https://raw.githubusercontent.com/TalismanSociety/talisman-web/d835267628aeb79ea132f0f7f1d3366b7a6997cf/src/assets/spin_red.gif"
          />
          <a target="_blank" href="https://talisman.xyz/"><b>Talisman</b></a> is
          a web3 wallet that unlocks a universe of applications in Polkadot and
          Kusama, an alternative to Polkadot.js <br /><br /><i>
            <b>"</b>It was easy for me to use their bank of Parachain icons as
            they have it all in a predictable uri that I can use to identify
            visually each parachain on the network graph.<b>"</b></i
          >
        </div>
      </q-timeline-entry>

      <q-timeline-entry
        title="Predictive Token Asset Registry"
        subtitle="Acala"
        side="right"
        icon="photo_library"
      >
        <div>
          <img
            width="80"
            src="https://resources.acala.network/networks/acala.png"
          />
          <a target="_blank" href="https://acala.network/"><b>Acala</b></a> is a
          decentralized finance network powering the aUSD ecosystem and much
          much more. <br /><br /><i>
            <b>"</b>It was a no brainer for me to use our bank of token icons as
            we onboard parachain and prepare them for listing, the process is
            for the teams to add their tokens to the github repository. It is
            also a way to verify if all token registration details have been
            taken care of. <b>"</b></i
          ><br /><br />

          if you see a missing icon,
          <a
            target="_blank"
            href="https://github.com/AcalaNetwork/token-resources"
            >make a PR!</a
          >
        </div>
      </q-timeline-entry>

      <q-timeline-entry heading>Updates</q-timeline-entry>

      <q-timeline-entry title="Updates" subtitle="May 24, 2022" side="left">
        <div>
          <ul>
            <li>Added this About page</li>
            <li>Added path to chain and parachain to URL</li>
            <li>Added Click on Parachain Icon for opening token list</li>
          </ul>
        </div>
      </q-timeline-entry>

      <q-timeline-entry title="Updates" subtitle="March 1, 2022" side="right">
        <div>
          <ul>
            <li>First release on Vercel</li>
          </ul>
        </div>
      </q-timeline-entry>
    </q-timeline>
  </div>
</template>

<script>
import { useQuasar } from "quasar";
import { computed } from "vue";

export default {
  setup() {
    const $q = useQuasar();

    return {
      layout: computed(() => {
        return $q.screen.lt.sm
          ? "dense"
          : $q.screen.lt.md
          ? "comfortable"
          : "loose";
      }),
    };
  },
};
</script>
