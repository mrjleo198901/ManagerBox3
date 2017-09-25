/*'use strict';
export const sep = '/';
export const version: string = "22.2.2";*/

export let globalClients: any = [];
export let globalTypeClients: any = [];

export function setValue(newValue: any) {
    globalClients = newValue;
}
export function addElement(newValue: any) {
    globalClients.push(newValue)
}
