import {
  Client,
  ListenerEvent,
  ListenerEventData,
  ReadyListener,
  Routes,
} from "@buape/carbon";

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

    // client.rest.put(Routes.applicationCommands(client.options.clientId), {
    //   body: [],
    // })
    //   .then(() => console.log("Successfully deleted all application commands."))
    //   .catch(console.error);
    //
    // for (
    //   const server of [
    //     "743298050222587978",
    //     "1173375132606140476",
    //     "1226186715111227534",
    //     "634618557464051772",
    //   ]
    // ) {
    //   client.rest.put(
    //     Routes.applicationGuildCommands(
    //       client.options.clientId,
    //       server,
    //     ),
    //     { body: [] },
    //   )
    //     .then(() => console.log("Successfully deleted all guild commands."))
    //     .catch(console.error);
    // }
  }
}
