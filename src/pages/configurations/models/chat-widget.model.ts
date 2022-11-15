import { DisplayPosition } from "./display-position.enum";

export interface ChatWidgetModel
{
    displayPosition: DisplayPosition,
    domains: string[],
    autoStartEnabled: boolean,
    autoStartDelay: number
}