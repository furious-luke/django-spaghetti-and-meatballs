$(function() {

    var apps = {};

    function enableApp( nodes, app_nodes ) {
        $.each( app_nodes, function( ii, an ) {
            nodes.add( an );
        });
    }

    function disableApp( nodes, app_nodes ) {
        $.each( app_nodes, function( ii, an ) {
            nodes.remove( an );
        });
    }

    function createAppList( nw, nodes ) {
        var list = $( '#app_list' );
        nodes.forEach( function( node ) {
            var words = node.id.split( '__' );
            var app = words[0];
            if( apps[app] === undefined )
                apps[app] = [];
            apps[app].push( node );
        });
        var ordered_apps = Object.keys( apps ).sort();
        var col;
        $.each( ordered_apps, function( ii, key ) {
            if( ii%7 == 0 ) {
                col = $( '<div class="column"></div>' );
                list.append( col );
            }
            var color = nw.groups.groups[key].color.background;
            var html = '<div class="app-entry"><div class="column color-box" style="background: ' + color + '"></div><div class="column input-box"><input id="id_' + key + '" type="checkbox" name="' + key + '" value="' + key + '" checked>' + key + '</input></div></div>';
            col.append( $( html ) );
            ii += 1;

            $( '#id_' + key ).change( function( val ) {
                var $this = $( this );
                if( this.checked )
                    enableApp( nodes, apps[$this.val()] );
                else
                    disableApp( nodes, apps[$this.val()] );
            });
        });
    }

    var disabled_nodes = {};

    var nodes = new vis.DataSet(
        meatballs
    );

    var edges = new vis.DataSet(
        spaghetti
    );

    var data = {
        nodes: nodes,
        edges: edges
    };

    var container = document.getElementById('visualization');
    var options = {
        /*
          "edges": {
          "smooth": {
          "type": "cubicBezier",
          "roundness": 0.55
          }
          },
          
          "layout": {
          hierarchical: {
          sortMethod: 'hubsize',
          direction: 'LR'
          }
          }
        */
    };

    var nw = new vis.Network(container, data, options);

    createAppList( nw, nodes );

    nw.on('click', function( params ) {
        var id = params.nodes[0];
        // nodes.remove({ id: id });
        console.log( nodes.get( id ) );
    });

    $( '#id_all_apps' ).click( function() {
        $.each( Object.keys( apps ), function( ii, name ) {
            var inp = $( '#id_' + name );
            if( !inp[0].checked ) {
                inp.prop( 'checked', true );
                enableApp( nodes, apps[name] );
            }
        });
    });

    $( '#id_no_apps' ).click( function() {
        $.each( Object.keys( apps ), function( ii, name ) {
            var inp = $( '#id_' + name );
            if( inp[0].checked ) {
                $( '#id_' + name ).prop( 'checked', false );
                disableApp( nodes, apps[name] );
            }
        });
    });

});
