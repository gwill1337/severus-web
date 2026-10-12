import type { Metadata } from "next";
import { DocPage, H2, H3, P, B, A, Code, Pre, UL, OL } from "@/components/DocPage";

const DESCRIPTION =
  "Set up Severus: host a server, connect as a client, create rooms, verify safety numbers, and fix common connection problems.";

export const metadata: Metadata = {
  title: "Documentation",
  description: DESCRIPTION,
  alternates: { canonical: "/docs" },
  openGraph: {
    title: "Severus Documentation",
    description: DESCRIPTION,
    url: "/docs",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Severus" }],
  },
};

const TOC = [
  { id: "install", label: "Install" },
  { id: "host", label: "Host a server" },
  { id: "connect", label: "Connect as a client" },
  { id: "chat", label: "Whispers and rooms" },
  { id: "verify", label: "Verify your contact" },
  { id: "monitoring", label: "Connection status" },
  { id: "troubleshooting", label: "Troubleshooting" },
];

export default function DocsPage() {
  return (
    <DocPage
      title="Documentation"
      intro="Everything you need to run Severus: one person hosts, everyone else connects. No accounts and no sign-up."
      toc={TOC}
    >
      <H2 id="install">Install</H2>
      <P>
        Download the latest build from the <A href="/download">download page</A>{" "}
        or the{" "}
        <A href="https://github.com/gwill1337/Severus/releases/latest">
          GitHub releases
        </A>
        . Start the app and choose <B>Host</B> or <B>Client</B>. Everyone in a
        chat should use the same version.
      </P>

      <H2 id="host">Host a server</H2>
      <P>Choose Host, pick a connection type and click Start Host.</P>

      <H3>Direct</H3>
      <P>
        Enter a port and start the host. Inside one local network nothing else is
        needed. To accept connections from the internet, forward that port on
        your router and share your public IP address with your friends.
      </P>

      <H3>QUIC (Iroh)</H3>
      <P>
        Select QUIC and start the host. Severus shows a <B>ticket</B>. Copy it
        and send it to the people who should join. No port forwarding is needed,
        because QUIC handles NAT traversal.
      </P>
      <P>Keep the host app open. When it closes, everyone is disconnected.</P>

      <H2 id="connect">Connect as a client</H2>
      <OL>
        <li>Choose Client and select the connection type the host uses.</li>
        <li>
          For Direct, enter the address as <Code>IP:port</Code>. For QUIC, paste
          the ticket into the same field.
        </li>
        <li>Enter a nickname. It must be unique on that host.</li>
        <li>Click Connect.</li>
      </OL>
      <Pre>{`192.168.1.20:5173`}</Pre>
      <P>
        If you leave out the port, Severus uses <Code>5173</Code>.
      </P>

      <H3>First connection</H3>
      <P>
        You will see a warning with the host’s certificate fingerprint. Ask the
        host owner to confirm it over another channel, then click Trust. Severus
        remembers the host and will warn you again only if the fingerprint
        changes. See{" "}
        <A href="/security#tofu">Trusting the host</A> for details.
      </P>

      <H2 id="chat">Whispers and rooms</H2>

      <H3>Whispers</H3>
      <P>
        Click a name in <B>Online Users</B>, type a message and press Enter.
        Your first message starts the secure session with that person.
      </P>

      <H3>Rooms</H3>
      <UL>
        <li>
          <B>Create:</B> type a room name and click Create room. You join
          automatically.
        </li>
        <li>
          <B>Join:</B> enter the room name or ID and click Join room.
        </li>
        <li>
          <B>Share:</B> click the room ID in the header to copy it.
        </li>
        <li>
          <B>Leave:</B> click Leave Room in the header.
        </li>
      </UL>
      <P>
        Room messages are encrypted separately for each member. Click a member’s
        name to whisper to them.
      </P>

      <H2 id="verify">Verify your contact</H2>
      <P>
        Once a secure session is ready, a safety number appears in the whisper
        window. Compare it with your contact over a different channel, such as a
        call. If it matches, nobody is in the middle. The full explanation is on
        the <A href="/security#verify">security page</A>.
      </P>

      <H2 id="monitoring">Connection status</H2>
      <UL>
        <li>
          <B>Ping</B> appears next to the name in the client’s top corner.
        </li>
        <li>
          <B>Connection state</B> changes to “Connection unstable” and then
          “Disconnected” when several heartbeats in a row get no answer.
        </li>
        <li>
          <B>Monitoring</B> is a switch on the host screen. When on, it shows
          active connections and upload and download speed.
        </li>
      </UL>

      <H2 id="troubleshooting">Troubleshooting</H2>

      <H3>I cannot connect in Direct mode</H3>
      <UL>
        <li>Check that the host is running and the port is correct.</li>
        <li>Allow the port in the host’s firewall.</li>
        <li>
          Over the internet, forward the port on the router and use the host’s
          public IP, not its local address.
        </li>
      </UL>

      <H3>I see an untrusted fingerprint warning for a host I already trust</H3>
      <P>
        The host probably regenerated its certificate. Confirm the new
        fingerprint with the host owner before you trust it.
      </P>

      <H3>Reset trust and keys</H3>
      <P>
        Both files live in the folder the app runs from, next to the executable.
      </P>
      <UL>
        <li>
          <B>Client:</B> delete <Code>known_hosts.json</Code>.
        </li>
        <li>
          <B>Host:</B> delete <Code>cert.pem</Code> and <Code>key.pem</Code>.
          New ones are created on the next start, and clients will be asked to
          trust the host again.
        </li>
      </UL>

      <H3>QUIC is slow or does not connect</H3>
      <P>
        QUIC can add a little latency, and it may fail behind strict NAT or
        complex network setups. Try Direct mode instead.
      </P>

      <H3>Messages do not arrive or no safety number appears</H3>
      <P>
        Make sure the host and all clients run the latest version. Older
        versions do not support end-to-end encryption between clients.
      </P>
    </DocPage>
  );
}