import {
  Client,
  ListenerEvent,
  ListenerEventData,
  ReadyListener,
  Routes,
} from "@buape/carbon";

const env = Deno.env.toObject();

export class Ready extends ReadyListener {
  async handle(
    data: ListenerEventData[typeof ListenerEvent.Ready],
    client: Client,
  ) {
    console.log(`Ready! Logged in as ${data.user.username}`);
    console.log(`Serving ${data.guilds.length} servers`);

    const commands = client.commands
      .filter((c) => c.name !== "*")
      .map((c) => c.serialize());

    // await client.rest.put(
    //   Routes.applicationGuildCommands(
    //     env.DISCORD_CLIENT_ID,
    //     "634618557464051772",
    //   ),
    //   { body: commands },
    // );
  }
}
