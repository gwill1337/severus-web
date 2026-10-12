import type { Metadata } from "next";
import { DocPage, H2, H3, P, B, A, Code, UL, OL, Table } from "@/components/DocPage";

const DESCRIPTION =
  "How Severus protects messages: end-to-end encryption with Noise XX, TLS with fingerprint pinning, safety numbers, and an honest list of limitations.";

export const metadata: Metadata = {
  title: "Security",
  description: DESCRIPTION,
  alternates: { canonical: "/security" },
  openGraph: {
    title: "Severus Security",
    description: DESCRIPTION,
    url: "/security",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Severus" }],
  },
};

const TOC = [
  { id: "layers", label: "How a message is protected" },
  { id: "visibility", label: "What each party can see" },
  { id: "verify", label: "Verifying your contact" },
  { id: "tofu", label: "Trusting the host" },
  { id: "crypto", label: "Cryptography" },
  { id: "limits", label: "Limitations" },
  { id: "source", label: "Source code" },
];

export default function SecurityPage() {
  return (
    <DocPage
      title="Security"
      intro="Severus is a self-hosted messenger: one person runs a host, everyone else connects to it. This page explains what is protected, from whom, and where the limits are."
      toc={TOC}
    >
      <H2 id="layers">How a message is protected</H2>
      <P>
        Every message passes through three layers of encryption on its way from
        your device to the recipient’s.
      </P>
      <OL>
        <li>
          <B>End-to-end encryption (client to client).</B> A Noise XX session is
          established directly between you and each person you talk to. The host
          forwards the handshake and the encrypted messages, but it never holds
          the keys.
        </li>
        <li>
          <B>Session encryption (client to host).</B> A separate Noise XX
          session between you and the host protects everything else: user lists,
          room updates and heartbeats.
        </li>
        <li>
          <B>TLS (client to host).</B> The connection to the host is wrapped in
          TLS with a self-signed certificate that your client pins on first use.
        </li>
      </OL>
      <P>
        Someone watching the network, such as your ISP or the owner of a Wi-Fi
        network, sees only encrypted traffic to the host.
      </P>

      <H2 id="visibility">What each party can see</H2>
      <Table
        head={["Party", "Can see", "Cannot see"]}
        rows={[
          [
            "Network observer",
            "Which host you connect to, when, and roughly how much data",
            "Nicknames, messages, rooms",
          ],
          [
            "The host",
            "Nicknames, who writes to whom, room membership, message sizes and timing",
            "Message contents, as long as you verify safety numbers",
          ],
          [
            "Other users on the same host",
            "Your nickname, that you are online, which rooms you join",
            "Messages you send to other people",
          ],
        ]}
      />

      <H2 id="verify">Verifying your contact</H2>
      <P>
        Noise XX encrypts a session, but it does not know who is on the other
        end. A malicious host could sit in the middle, run one session with you
        and another with your contact, and read everything that passes through.
        Safety numbers close this gap.
      </P>

      <H3>How to verify</H3>
      <OL>
        <li>Send a message to your contact. This starts the secure session.</li>
        <li>
          Open the whisper with that person. A line such as{" "}
          <Code>3fa9c 1e704 bd7a5 2e81c 90d4f 7b3a2</Code> appears under the
          header.
        </li>
        <li>
          Compare it with the number your contact sees, using a different
          channel: a voice call, in person, or another messenger.
        </li>
        <li>
          If the numbers match, nobody is in the middle. If they differ, stop
          and do not send anything sensitive.
        </li>
      </OL>
      <P>
        The number is a SHA-256 hash of both parties’ public keys. Keys are
        generated fresh for every session, so the number changes after a
        reconnect. Verify again when the conversation matters.
      </P>

      <H2 id="tofu">Trusting the host</H2>
      <P>
        The first time you connect to a host, Severus shows the SHA-256
        fingerprint of its TLS certificate. Ask the host owner to read the
        fingerprint to you over another channel and trust it only if it matches.
        Trusted fingerprints are saved in <Code>known_hosts.json</Code>.
      </P>
      <P>
        If the certificate changes later, the connection fails and Severus asks
        you to confirm the new fingerprint again. This means either the host
        regenerated its certificate (for example by deleting{" "}
        <Code>cert.pem</Code> and <Code>key.pem</Code>) or someone is
        impersonating it. Confirm with the host owner before you trust it.
      </P>

      <H2 id="crypto">Cryptography</H2>
      <Table
        head={["Used for", "Primitive"]}
        rows={[
          [
            "End-to-end and session encryption",
            <Code key="noise">Noise_XX_25519_ChaChaPoly_SHA256</Code>,
          ],
          ["Transport", "TLS 1.2 / 1.3 (rustls) with a self-signed ECDSA P-256 certificate"],
          ["Fingerprints and safety numbers", "SHA-256"],
          ["Wire format", "Binary (postcard), no JSON"],
        ]}
      />

      <H2 id="limits">Limitations</H2>
      <P>
        Severus is a personal project. Read this list before you rely on it.
      </P>
      <UL>
        <li>
          <B>Not audited.</B> The code has not been reviewed by an independent
          security firm.
        </li>
        <li>
          <B>Metadata is visible to the host.</B> The host knows who talks to
          whom, when, and how large the messages are.
        </li>
        <li>
          <B>The host controls room membership.</B> A malicious host could add a
          hidden participant to a room. Verify the people you rely on through
          their safety numbers.
        </li>
        <li>
          <B>No persistent identity.</B> Keys are not stored, so a safety number
          is only valid for one session.
        </li>
        <li>
          <B>Older versions.</B> Clients that predate end-to-end encryption send
          messages the host can read. Make sure everyone updates.
        </li>
        <li>
          <B>Rooms are encrypted per member.</B> A room message is encrypted
          separately for each participant, so very large rooms cost more.
        </li>
        <li>
          <B>No message history.</B> Severus does not use a database. Messages
          live in memory and disappear when the app closes.
        </li>
        <li>
          <B>A compromised device defeats everything.</B> Malware on your
          computer can read messages before they are encrypted.
        </li>
        <li>
          <B>QUIC mode.</B> Iroh may use relay servers to help two devices find
          each other. Relays handle only encrypted traffic.
        </li>
      </UL>

      <H2 id="source">Source code</H2>
      <P>
        Everything described here is open source. Start with{" "}
        <A href="https://github.com/gwill1337/Severus/blob/main/src-tauri/src/security.rs">
          security.rs
        </A>{" "}
        and the{" "}
        <A href="https://github.com/gwill1337/Severus/tree/main/src-tauri/src/net">
          net module
        </A>
        . To report a vulnerability, open an issue in the{" "}
        <A href="https://github.com/gwill1337/Severus/issues">repository</A>.
      </P>
    </DocPage>
  );
}