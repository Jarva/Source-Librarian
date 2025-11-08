import { TextInput } from "@buape/carbon";

export default class extends TextInput {
    customId: string;

    constructor(customId: string) {
        super();
        this.customId = customId;
    }
}
