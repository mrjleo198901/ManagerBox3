/**
 * Configuración de SystemJS para Angular 2
 */
(function (global) {
  // el map le dice a System dónde buscar las cosas que ha de cargar
  var map = {
    'app': 'app', // 'dist',
    '@angular': 'node_modules/@angular',
    'angular2-in-memory-web-api': 'node_modules/angular2-in-memory-web-api',
    'rxjs': 'node_modules/rxjs',
    '@ngui/ngui': 'https://npmcdn.com/ng2-ui/ngui/dist/ngui.umd.js',
    'angular2-fontawesome': 'node_modules/angular2-fontawesome'
  };
  // los packages le dicen a System cómo cargar un fichero cuando no tiene nombre/extensión
  var packages = {
    'app': { main: 'main.js', defaultExtension: 'js' },
    'rxjs': { defaultExtension: 'js' },
    'angular2-in-memory-web-api': { main: 'index.js', defaultExtension: 'js' },
    'angular2-fontawesome': { defaultExtension: 'js' }
  };
  var ngPackageNames = [
    'common',
    'compiler',
    'core',
    'http',
    'platform-browser',
    'platform-browser-dynamic',
    'router',
    'router-deprecated',
    'upgrade',
  ];
  // Ficheros individuales (te ahorras unas ~300 requests):
  function packIndex(pkgName) {
    packages['@angular/' + pkgName] = { main: 'index.js', defaultExtension: 'js' };
  }
  // Encapsulados (~40 requests):
  function packUmd(pkgName) {
    packages['@angular/' + pkgName] = { main: '/bundles/' + pkgName + '.umd.js', defaultExtension: 'js' };
  }
  // La mayoría de los entornos deberían usar UMD, algunos (Karma) necesitan ficheros index individuales
  var setPackageConfig = System.packageWithIndex ? packIndex : packUmd;
  // Añadir entrada para packages de angular
  ngPackageNames.forEach(setPackageConfig);
  var config = {
    map: map,
    packages: packages
  };
  System.config(config);
})(this);