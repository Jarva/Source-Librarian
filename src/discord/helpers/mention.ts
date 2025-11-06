import { User } from "@buape/carbon";

export const mention = (user: User<true> | User<false>) => `<@${user.id}>`;

export const channelMention = (channel: string) => `<#${channel}>`;
