import { User } from "npm:@buape/carbon";

export const mention = (user: User<true> | User<false>) => `<@${user.id}>`;

export const channelMention = (channel: string) => `<#${channel}>`;
