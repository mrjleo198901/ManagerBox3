import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../services/cliente.service';
import { TipoClienteService } from '../../services/tipo-cliente.service';

@Component({
  selector: 'app-app-loader',
  templateUrl: './app-loader.component.html',
  styleUrls: ['./app-loader.component.css']
})
export class AppLoaderComponent implements OnInit {

  constructor(
    private tipoClienteService: TipoClienteService,
    private clienteService: ClienteService
  ) { }

  ngOnInit() {
  }

}
