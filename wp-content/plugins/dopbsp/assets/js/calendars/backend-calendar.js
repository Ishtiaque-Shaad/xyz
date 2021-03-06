
/*
* Title                   : Pinpoint Booking System WordPress Plugin (PRO)
* Version                 : 2.1.1
* File                    : assets/js/calendars/backend-calendar.js
* File Version            : 1.0.6
* Created / Last Modified : 25 August 2015
* Author                  : Dot on Paper
* Copyright               : © 2012 Dot on Paper
* Website                 : http://www.dotonpaper.net
* Description             : Back end calendar JavaScript class.
*/

var DOPBSPCalendar = new function(){
    'use strict';
    
    /*
     * Private variables
     */
    var $ = jQuery.noConflict();

    /*
     * Public variables
     */
    this.ajaxRequestInProgress;
    this.ajaxRequestTimeout;
    this.calendarSelectedID = 0;
        
    /*
     * Constructor
     */
    this.__construct = function(){
    };
    
    /*
     * Add calendar.
     */
    this.add = function(){// Add calendar.
        $('#DOPBSP-admin-reservations').css('display', 'none');
        DOPBSP.clearColumns(2);
        DOPBSP.toggleMessages('active', DOPBSP.text('CALENDARS_ADD_CALENDAR_ADDING'));
        
        $.post(ajaxurl, {action: 'dopbsp_calendar_add'}, function(data){
            $('#DOPBSP-column1 .dopbsp-column-content').html(data);
            DOPBSP.toggleMessages('success', DOPBSP.text('CALENDARS_ADD_CALENDAR_SUCCESS'));
        }).fail(function(data){
            DOPBSP.toggleMessages('error', data.status+': '+data.statusText);
        });
    };
    
    /*
     * Duplicate calendar.
     */
    this.duplicate = function(){// Duplicate calendar.
        
        if (this.calendarSelectedID > 0) {
            $('#DOPBSP-admin-reservations').css('display', 'none');
            DOPBSP.clearColumns(2);
            DOPBSP.toggleMessages('active', DOPBSP.text('CALENDARS_ADD_CALENDAR_ADDING'));

            $.post(ajaxurl, {action: 'dopbsp_calendar_duplicate',
                             id: this.calendarSelectedID}, function(data){
                $('#DOPBSP-column1 .dopbsp-column-content').html(data);
                DOPBSP.toggleMessages('success', DOPBSP.text('CALENDARS_ADD_CALENDAR_SUCCESS'));
            }).fail(function(data){
                DOPBSP.toggleMessages('error', data.status+': '+data.statusText);
            });
        }
    };
    
    /*
     * Iitialize calendar.
     * 
     * @param id (Number): calendar ID
     * @param userId (Number): user ID
     */
    this.init = function(id,
                         userId){
        var headerHTML = new Array(),
        helpHTML = new Array();
    
        DOPBSP.clearColumns(2);
        
        $('#DOPBSP-column1 .dopbsp-column-content li').removeClass('dopbsp-selected');
        $('#DOPBSP-calendar-ID-'+id).addClass('dopbsp-selected');
        $('#DOPBSP-calendar-ID').val(id);
        $('#DOPBSP-admin-reservations').css('display', 'block');   
        
        headerHTML.push('<a href="javascript:DOPBSPCalendar.display('+id+')" class="dopbsp-button dopbsp-calendar dopbsp-selected"><span class="dopbsp-info">'+DOPBSP.text('CALENDARS_EDIT_CALENDAR')+'</span></a>');
        headerHTML.push('<a href="javascript:DOPBSPSettingsCalendar.display('+id+')" class="dopbsp-button dopbsp-settings"><span class="dopbsp-info">'+DOPBSP.text('CALENDARS_EDIT_CALENDAR_SETTINGS')+'</span></a>');
        headerHTML.push('<a href="javascript:DOPBSPSettingsNotifications.display('+id+')" class="dopbsp-button dopbsp-notifications"><span class="dopbsp-info">'+DOPBSP.text('CALENDARS_EDIT_CALENDAR_NOTIFICATIONS')+'</span></a>');
        headerHTML.push('<a href="javascript:DOPBSPSettingsPaymentGateways.display('+id+')" class="dopbsp-button dopbsp-payments"><span class="dopbsp-info">'+DOPBSP.text('CALENDARS_EDIT_CALENDAR_PAYMENT_GATEWAYS')+'</span></a>');
            
        helpHTML.push(DOPBSP.text('CALENDARS_EDIT_CALENDAR_HELP')+'<br /><br />');
        helpHTML.push(DOPBSP.text('CALENDARS_EDIT_CALENDAR_SETTINGS_HELP')+'<br /><br />');
        helpHTML.push(DOPBSP.text('CALENDARS_EDIT_CALENDAR_EMAILS_HELP')+'<br /><br />');
        helpHTML.push(DOPBSP.text('CALENDARS_EDIT_CALENDAR_PAYMENT_GATEWAYS_HELP')+'<br /><br />');

        if (DOPBSP_user_role === 'administrator'){
            var post_type = DOPPrototypes.$_GET('post_type'),
            post_action =  DOPPrototypes.$_GET('action');

            if (post_action !== 'edit') {
                headerHTML.push('<a href="javascript:DOPBSPSettingsUsers.display('+id+')" class="dopbsp-button dopbsp-users"><span class="dopbsp-info">'+DOPBSP.text('CALENDARS_EDIT_CALENDAR_USERS_PERMISSIONS')+'</span></a>');
                helpHTML.push(DOPBSP.text('CALENDARS_EDIT_CALENDAR_USERS_HELP')+'<br /><br />');
            }
        }
//        headerHTML.push('<a href="javascript:void(0)" class="dopbsp-button dopbsp-notifications"><span class="dopbsp-info"><span id="DOPBSP-calendar-new-reservations">0</span> '+DOPBSP.text('CALENDARS_EDIT_CALENDAR_NEW_RESERVATIONS')+'</span></a>');
        
        if (DOPPrototypes.$_GET('action') !== 'edit'
                && userId === DOPBSP_user_ID){
            headerHTML.push('<a href="javascript:DOPBSP.confirmation(\'CALENDARS_DELETE_CALENDAR_CONFIRMATION\', \'DOPBSPCalendar.delete('+id+')\')" class="dopbsp-button dopbsp-delete"><span class="dopbsp-info">'+DOPBSP.text('CALENDARS_EDIT_CALENDAR_DELETE')+'</span></a>');
        }
        helpHTML.push(DOPBSP.text('CALENDARS_CALENDAR_NOTIFICATIONS_HELP')+'<br /><br />');
        helpHTML.push(DOPBSP.text('HELP_VIEW_DOCUMENTATION'));
        headerHTML.push('<a href="'+DOPBSP_CONFIG_HELP_DOCUMENTATION_URL+'" target="_blank" class="dopbsp-button dopbsp-help"><span class="dopbsp-info dopbsp-help">'+helpHTML.join('')+'</span></a>');

        $('#DOPBSP-col-column2').addClass('dopbsp-calendar');
        $('#DOPBSP-column2 .dopbsp-column-header').html(headerHTML.join(''));
        
        this.calendarSelectedID = id;
        this.display(id);
    };

    /*
     * Display calendar.
     * 
     * @param id (Number): calendar ID
     */
    this.display = function(id){
        DOPBSP.toggleMessages('active', DOPBSP.text('MESSAGES_LOADING'));
        DOPBSPSettings.toggle(id, 'calendar');

        $.post(ajaxurl, {action: 'dopbsp_calendar_get_options',
                         id: id}, function(data){
            $('#DOPBSP-column2 .dopbsp-column-content').html('<div id="DOPBSP-calendar"></div>');
            $('#DOPBSP-calendar').DOPBSPCalendar($.parseJSON(data));

            $.post(ajaxurl, {action: 'dopbsp_get_new_reservations',
                             id: id}, function(data){
                if (parseInt(data) !== 0){
                    $('#DOPBSP-new-reservations').addClass('dopbsp-new');
                    $('#DOPBSP-new-reservations span').html(data);
                }
            });
        }).fail(function(data){
            DOPBSP.toggleMessages('error', data.status+': '+data.statusText);
        });
    };

    /*
     * Edit calendar.
     * 
     * @param id (Number): calendar ID
     * @param type (String): field type
     * @param field (String): field name
     * @param value (String): field value
     * @param onBlur (Boolean): true if function has been called on blur event
     */
    this.edit = function(id, 
                         type,
                         field,
                         value, 
                         onBlur){
        onBlur = onBlur === undefined ? false:true;
        
        this.ajaxRequestInProgress !== undefined && !onBlur ? this.ajaxRequestInProgress.abort():'';
        this.ajaxRequestTimeout !== undefined ? clearTimeout(this.ajaxRequestTimeout):'';
        
        switch (field){
            case 'name':
                $('#DOPBSP-calendar-ID-'+id+' .dopbsp-name').html(value === '' ? '&nbsp;':value);
                break;
        }
        
        if (onBlur){
            $.post(ajaxurl, {action: 'dopbsp_calendar_edit',
                             id: id,
                             field: field,
                             value: value}, function(data){
            }).fail(function(data){
                DOPBSP.toggleMessages('error', data.status+': '+data.statusText);
            });
        }
        else{
            DOPBSP.toggleMessages('active-info', DOPBSP.text('MESSAGES_SAVING'));

            this.ajaxRequestTimeout = setTimeout(function(){
                clearTimeout(this.ajaxRequestTimeout);

                this.ajaxRequestInProgress = $.post(ajaxurl, {action: 'dopbsp_calendar_edit',
                                                              id: id,
                                                              field: field,
                                                              value: value}, function(data){
                    DOPBSP.toggleMessages('success', DOPBSP.text('MESSAGES_SAVING_SUCCESS'));
                }).fail(function(data){
                    DOPBSP.toggleMessages('error', data.status+': '+data.statusText);
                });
            }, 600);
        }
    };

    /*
     * Delete calendar.
     * 
     * @param id (Number): calendar ID
     */
    this.delete = function(id){
        DOPBSP.toggleMessages('show', DOPBSP.text('CALENDARS_DELETE_CALENDAR_DELETING'));

        $.post(ajaxurl, {action:'dopbsp_calendar_delete',
                         id: id}, function(data){
            DOPBSP.clearColumns(2);
            $('#DOPBSP-admin-reservations').css('display', 'none');

            $('#DOPBSP-calendar-ID-'+id).stop(true, true)
                                        .animate({'opacity':0}, 
                                        600, function(){
                $(this).remove();

                if (data === '0'){
                    $('#DOPBSP-column1 .dopbsp-column-content').html('<ul><li class="dopbsp-no-data">'+DOPBSP.text('CALENDARS_NO_CALENDARS')+'</li></ul>');
                }
                DOPBSP.toggleMessages('success', DOPBSP.text('CALENDARS_DELETE_CALENDAR_SUCCESS'));
            });
        });
    };
    
    return this.__construct();
};