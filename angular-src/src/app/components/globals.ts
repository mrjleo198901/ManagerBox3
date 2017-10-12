/*'use strict';
export const sep = '/';
export const version: string = "22.2.2";*/

export let globalClients: any = [];
export let globalTypeClients: any = [];
export let globalPromos: any = [];

export function setValue(newValue: any) {
    globalClients = newValue;
}
export function addElement(newValue: any) {
    globalClients.push(newValue);
}

export function addElementPromo(newValue: any) {
    globalPromos.push(newValue);
}

export function deleteElementsPromo() {
    globalPromos = [];
}

export function sliceElement(newValue: any) {
    globalPromos = globalPromos.filter(function (obj) {
        return obj.nombre !== newValue.nombre;
    });
}
