
/*
* Title                   : Pinpoint Booking System WordPress Plugin (PRO)
* Version                 : 2.1.1
* File                    : assets/js/settings/backend-settings-notifications.js
* File Version            : 1.0.4
* Created / Last Modified : 25 August 2015
* Author                  : Dot on Paper
* Copyright               : © 2012 Dot on Paper
* Website                 : http://www.dotonpaper.net
* Description             : Back end notifications settings JavaScript class.
*/

var DOPBSPSettingsNotifications = new function(){
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
     * Display notifications settings.
     * 
     * @param id (Number): calendar ID
     */
    this.display = function(id){
        DOPBSP.toggleMessages('active', DOPBSP.text('MESSAGES_LOADING'));
        DOPBSPSettings.toggle(id, 'notifications');

        $.post(ajaxurl, {action: 'dopbsp_settings_notifications_display',
                         id: id}, function(data){
            DOPBSP.toggleMessages('success', DOPBSP.text('MESSAGES_LOADING_SUCCESS'));
            $('#DOPBSP-column2 .dopbsp-column-content').html(data);
        }).fail(function(data){
            DOPBSP.toggleMessages('error', data.status+': '+data.statusText);
        });
    };
    
    /*
     * Test notification method.
     * 
     * @param id (Number): calendar ID
     */
    this.test = function(id){
        DOPBSP.toggleMessages('active', DOPBSP.text('SETTINGS_NOTIFICATIONS_TEST_SENDING'));
        
        $.post(ajaxurl, {action: 'dopbsp_settings_notifications_test',
                         id: id,
                         method: $('#DOPBSP-settings-notifications-test-method').val(),
                         email: $('#DOPBSP-settings-notifications-test-email').val()}, function(data){
            data = $.trim(data);
                         
            if (data === 'success'){
                DOPBSP.toggleMessages('success', DOPBSP.text('SETTINGS_NOTIFICATIONS_TEST_SUCCESS'));
            }             
            else{
                DOPBSP.toggleMessages('error', data);
            }
        }).fail(function(data){
            DOPBSP.toggleMessages('error', data.status+': '+data.statusText);
        });
    };
    
    return this.__construct();
};