import type { Handler } from "../../util/register";
import { ARS } from "../../util/guilds";
import { wiki } from "./ars/wiki";
import { mana } from "./ars/mana";
import { glyphs } from "./ars/glyphs";
import { claims } from "./ars/claims";
import { spells } from "./ars/spells";
import { enchanting, imbuement } from "./ars/imbuement";
import {ancient} from "./ars/ancient";
import {guide} from "./ars/guide";
import {issues} from "./ars/issues";
import {addons} from "./ars/addons/addons";
import {iframes} from "./ars/iframes";

export default {
    commands: [wiki, mana, glyphs, claims, spells, imbuement, enchanting, ancient, guide, issues, addons, iframes],
    guilds: ARS
} as Handler;
