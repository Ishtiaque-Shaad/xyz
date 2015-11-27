
/*
* Title                   : Pinpoint Booking System WordPress Plugin (PRO)
* Version                 : 2.1.1
* File                    : assets/js/locations/backend-locations.js
* File Version            : 1.0.3
* Created / Last Modified : 25 August 2015
* Author                  : Dot on Paper
* Copyright               : © 2012 Dot on Paper
* Website                 : http://www.dotonpaper.net
* Description             : Back end locations JavaScript class.
*/

var DOPBSPLocations = new function(){
    'use strict';
    
    /*
     * Private variables.
     */
    var $ = jQuery.noConflict();
    
    /*
     * Display locations list.
     */
    this.__construct = function(){
    };
    
    /*
     * Initialize Google Maps before display.
     */
    this.init = function(){
        if (typeof google !== 'object' 
                || typeof google.maps !== 'object'){
            var script = document.createElement('script');

            script.type = 'text/JavaScript';
            script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places&callback=DOPBSPLocations.display';

            $('body').append(script);
        }
        else{
            DOPBSPLocations.display();
        }
    }

    /*
     * Display locations list.
     */
    this.display = function(){
        DOPBSP.clearColumns(1);
        DOPBSP.toggleMessages('active', DOPBSP.text('MESSAGES_LOADING'));

        $.post(ajaxurl, {action: 'dopbsp_locations_display'}, function(data){
            $('#DOPBSP-column1 .dopbsp-column-content').html(data);
            $('.DOPBSP-admin .dopbsp-main').css('display', 'block');
            DOPBSP.toggleMessages('success', DOPBSP.text('LOCATIONS_LOAD_SUCCESS'));
        }).fail(function(data){
            DOPBSP.toggleMessages('error', data.status+': '+data.statusText);
        });
    };
    
    return this.__construct();
};