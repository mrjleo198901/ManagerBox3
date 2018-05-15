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

export var GLOBAL = {
    url: 'http://localhost:3000/api/',
}

export var UM = {
    //Unidades de medida
    onzaEnMl: 29.5735295625,
    litroEnMl: 1000,
    onzaEnGr: 28.3495,
    lbEnGr: 453.592,
    kgEnGr: 1000
}