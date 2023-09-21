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
        side="left"
        icon="account_circle"
      >
        <div>
          <img
            width="80"
            src="https://raw.githubusercontent.com/gluneau/dotsama-channels/master/public/greg-smile-cropped.png"
          />
          Greg is a team member of
          <a target="_blank" href="https://astar.network/"><b>Astar</b></a> and
          the Senior Integrator Developer.<br /><br />Tipping
          <a
            href="https://polkadot.subscan.io/account/5GL86B8xNiWxiSZHxRNh6nrFcBAYe7TTkDkADjLyLMLsvNh4"
            >Address</a
          ><br /><br />
          <i>
            <b>"</b>
            If you have improvement suggestion, please contact me on Telegram as
            @gluneau <b>"</b></i
          ><br /><br />
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
            href="https://github.com/open-web3-stack/token-resources"
            >make a PR!</a
          >
        </div>
      </q-timeline-entry>

      <q-timeline-entry heading>Updates</q-timeline-entry>

      <q-timeline-entry
        title="Updates"
        subtitle="September 27, 2022"
        side="right"
      >
        <div>
          <ul>
            <li>
              URL pattern: /:chain/:para/:action, ex: /polkadot or
              /polkadot/astar or polkadot/astar/assets
            </li>
            <li>Added mouseover animation of edges</li>
            <li>Added Darwinia's icon</li>
          </ul>
        </div>
      </q-timeline-entry>

      <q-timeline-entry title="Updates" subtitle="June 13, 2022" side="left">
        <div>
          <ul>
            <li>Added Basilisk/HydraDX token list api</li>
            <li>Added Litmus/Litentry token list api</li>
            <li>Added Tip Address</li>
            <li>Dark Mode, new color scheme</li>
          </ul>
        </div>
      </q-timeline-entry>

      <q-timeline-entry title="Updates" subtitle="May 31, 2022" side="right">
        <div>
          <ul>
            <li>Added Genshiro/EQ token list libs</li>
            <li>Using Rococo WSS when available</li>
            <li>Refactored chain image URL with exceptions</li>
          </ul>
        </div>
      </q-timeline-entry>

      <q-timeline-entry title="Updates" subtitle="May 24, 2022" side="left">
        <div>
          <ul>
            <li>Added this About page</li>
            <li>Added path to chain and parachain to URL</li>
            <li>Added Click on Parachain Icon for opening token list</li>
            <li>Added mouseover to highlight outgoing connections</li>
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
