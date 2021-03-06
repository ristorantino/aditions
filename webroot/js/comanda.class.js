/*--------------------------------------------------------------------------------------------------- Risto.Adicion.comanda
 *
 *
 * Clase Comanda
 */

Risto.Adition.comanda = function(jsonData){
    return this.initialize( jsonData );
}


Risto.Adition.comanda.prototype = {   
    model           : 'Comanda',
    
    
    initialize: function(jsonData) {
        this.id = ko.observable();
        this.imprimir = ko.observable( true );
        this.observacion = ko.observable( '' );
        this.created = ko.observable();
        this.DetalleComanda = ko.observableArray( [] );
        
        if ( jsonData ) {
            // si aun no fue mappeado
            var mapOps = {
                'DetalleComanda': {
                    create: function(ops) {
                        return new Risto.Adition.detalleComanda(ops.data);
                    },
                    key: function(data) {
                        return ko.utils.unwrapObservable( data.id );
                    }
                }
            }
        } else {
            jsonData = {};
            mapOps = {};
        }
        ko.mapping.fromJS(jsonData, mapOps, this);
        Risto.modelizar(this);
        return this;
    },
    
    productsStringListing: function(){
        var name = '',
            prodName;        
        for (var dc in this.DetalleComanda() ){
            if ( this.DetalleComanda()[dc].realCant() ) {
                if ( name ){
                    name += ', ';
                }
                if ( typeof this.DetalleComanda()[dc].Producto().name == 'function' ) {
                    prodName = this.DetalleComanda()[dc].Producto().name();
                } else {
                    prodName = this.DetalleComanda()[dc].Producto().name;
                }
                name += this.DetalleComanda()[dc].realCant()+' '+prodName;
            }
        }
        return name;
    },


    productsJSONListing: function(){
        var prods = [],
            prodName;        
        for (var dc in this.DetalleComanda() ){
            if ( this.DetalleComanda()[dc].realCant() ) {
                
                prodName = this.DetalleComanda()[dc].nameConSabores();
                prodPrecio = this.DetalleComanda()[dc].precio();
                prodCant = this.DetalleComanda()[dc].realCant();
                

                prods.push({
                    "name": prodName,
                    "precio": prodPrecio,
                    "qty": prodCant
                });                
            }
        }
        return prods;
    },
    
    imprimirComanda: function() {
        if (window.confirm("¿Seguro desea reimprimir comanda?")) {
            if ( Risto.printerComanderaPPal && PrinterDriver.isConnected() ) {
                // imprimir local fiscalberry
                PrinterDriver.printComanda( Risto.Adition.adicionar.currentMesa() , this);
            } else {
                // imprimir con server
                $.get(Risto.URL_DOMAIN + Risto.TENANT + '/comanda/comandas/imprimir/' +this.id());
            }
            
            
        }
    },
    
    
    handleAjaxSuccess: function(data){
        if (data && data.hasOwnProperty('Comanda')) {
            this.id( data.Comanda.Comanda.id );
            this.created( data.Comanda.Comanda.created );    
        }
        return this;
    },
    
     timeCreated: function(){
         if (!this.timeCreated) {
            Risto.modelizar(this);
    }
        return this.timeCreated();
     },
     
     
     borrarObservacionGeneral: function(){
        this.observacion('');
    },
    
    
    agregarTextoAObservacionGeneral: function( textToAdd ){ 
        var txt = this.observacion();
        if ( txt ) {
            txt += ', ';
        }
        txt += textToAdd;
        this.observacion( txt );
        return txt;
    }
    
}