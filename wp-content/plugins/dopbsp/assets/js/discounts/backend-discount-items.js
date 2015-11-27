
/*
* Title                   : Pinpoint Booking System WordPress Plugin (PRO)
* Version                 : 2.1.1
* File                    : assets/js/discounts/backend-discount-items.js
* File Version            : 1.0.3
* Created / Last Modified : 25 August 2015
* Author                  : Dot on Paper
* Copyright               : © 2012 Dot on Paper
* Website                 : http://www.dotonpaper.net
* Description             : Back end discount items JavaScript class.
*/


var DOPBSPDiscountItems = new function(){
    'use strict';
    
    /*
     * Private variables
     */
    var $ = jQuery.noConflict();
    
    /*
     * Constructor
     */
    this.__construct = function(){
    };
    
    /*
     * Initialize discount items sort.
     */
    this.init = function(){
        $('#DOPBSP-discount-items').sortable({handle: '.dopbsp-handle',
                                              opacity: 0.75,
                                              placeholder: 'dopbsp-placeholder',
                                              update: function(e, ui){
                                                var ids = new Array();
                                                
                                                DOPBSP.toggleMessages('active-info', DOPBSP.text('MESSAGES_SAVING'));
                                                
                                                $('#'+e.target.id+' li.dopbsp-item-wrapper').each(function(){
                                                    if (!$(this).hasClass('dopbsp-placeholder')){
                                                        ids.push($(this).attr('id').split('DOPBSP-discount-item-')[1]);
                                                    }
                                                });
                                                
                                                $.post(ajaxurl, {action: 'dopbsp_discount_items_sort',
                                                                 ids: ids.join(',')}, function(data){
                                                    DOPBSP.toggleMessages('success', DOPBSP.text('MESSAGES_SAVING_SUCCESS'));
                                                }).fail(function(data){
                                                    DOPBSP.toggleMessages('error', data.status+': '+data.statusText);
                                                });
                                              }});
    };
    
    return this.__construct();
};