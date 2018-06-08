export class Producto {
    nombre: string;
    precio_costo: number;
    precio_venta: number;
    utilidad: number;
    cant_existente: number;
    cant_minima: number;
    id_tipo_producto: string;
    path: string;
    contenido: number;
    unidad_medida: string;
    impuestosVentaV: any[];
    impuestosCompraV: any[];
    promocion: any[];
    subproductoV: any[];
}
