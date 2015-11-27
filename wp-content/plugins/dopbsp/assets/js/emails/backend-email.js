
/*
* Title                   : Pinpoint Booking System WordPress Plugin (PRO)
* Version                 : 2.1.1
* File                    : assets/js/emails/backend-email.js
* File Version            : 1.0.5
* Created / Last Modified : 25 August 2015
* Author                  : Dot on Paper
* Copyright               : © 2012 Dot on Paper
* Website                 : http://www.dotonpaper.net
* Description             : Back end email JavaScript class.
*/

var DOPBSPEmail = new function(){
    'use strict';
    
    /*
     * Private variables.
     */
    var $ = jQuery.noConflict();

    /*
     * Public variables
     */
    this.ajaxRequestInProgress;
    this.ajaxRequestTimeout;
    
    /*
     * Constructor
     */
    this.__construct = function(){
    };
    
    /*
     * Display email.
     * 
     * @param id (Number): email ID
     * @param language (String): email current editing language
     * @param template (String): email current editing template
     * @param clearEmail (Boolean): clear email extra data diplay
     */
    this.display = function(id,
                            language,
                            template,
                            clearEmail){
        var HTML = new Array();
        
        language = language === undefined ? ($('#DOPBSP-email-language').val() === undefined ? '':$('#DOPBSP-email-language').val()):language;
        template = template === undefined ? ($('#DOPBSP-email-select-template').val() === undefined ? 'book_admin':$('#DOPBSP-email-select-template').val()):template;
        clearEmail = clearEmail === undefined ? true:false;
        language = clearEmail ? '':language;
        
        if (clearEmail){
            DOPBSP.clearColumns(2);
        }
        DOPBSP.toggleMessages('active', DOPBSP.text('MESSAGES_LOADING'));
        
        $('#DOPBSP-column1 .dopbsp-column-content li').removeClass('dopbsp-selected');
        $('#DOPBSP-email-ID-'+id).addClass('dopbsp-selected');
        $('#DOPBSP-email-ID').val(id);
        
        $.post(ajaxurl, {action: 'dopbsp_email_display', 
                         id: id,
                         language: language,
                         template: template}, function(data){
            HTML.push('<a href="javascript:DOPBSP.confirmation(\'EMAILS_DELETE_EMAIL_CONFIRMATION\', \'DOPBSPEmail.delete('+id+')\')" class="dopbsp-button dopbsp-delete"><span class="dopbsp-info">'+DOPBSP.text('EMAILS_DELETE_EMAIL_SUBMIT')+'</span></a>');
            HTML.push('<a href="'+DOPBSP_CONFIG_HELP_DOCUMENTATION_URL+'" target="_blank" class="dopbsp-button dopbsp-help">');
            HTML.push(' <span class="dopbsp-info dopbsp-help">');
            HTML.push(DOPBSP.text('EMAILS_EMAIL_HELP')+'<br /><br />');
            HTML.push(DOPBSP.text('HELP_VIEW_DOCUMENTATION'));
            HTML.push(' </span>');
            HTML.push('</a>');
            
            $('#DOPBSP-column2 .dopbsp-column-header').html(HTML.join(''));
            $('#DOPBSP-column2 .dopbsp-column-content').html(data);
            
            $('#DOPBSP-email-start_date').datepicker();
            $('#DOPBSP-email-end_date').datepicker();
            
            DOPBSP.toggleMessages('success', DOPBSP.text('EMAILS_EMAIL_LOADED'));
        }).fail(function(data){
            DOPBSP.toggleMessages('error', data.status+': '+data.statusText);
        });
    };

    /*
     * Add email.
     */
    this.add = function(){
        DOPBSP.clearColumns(2);
        DOPBSP.toggleMessages('active', DOPBSP.text('EMAILS_ADD_EMAIL_ADDING'));

        $.post(ajaxurl, {action: 'dopbsp_email_add'}, function(data){
            $('#DOPBSP-column1 .dopbsp-column-content').html(data);
            DOPBSP.toggleMessages('success', DOPBSP.text('EMAILS_ADD_EMAIL_SUCCESS'));
        }).fail(function(data){
            DOPBSP.toggleMessages('error', data.status+': '+data.statusText);
        });
    };

    /*
     * Edit email.
     * 
     * @param id (Number): email ID
     * @param template (String): email template
     * @param type (String): email field type
     * @param field (String): email field
     * @param value (String): email field value
     * @param onBlur (Boolean): true if function has been called on blur event
     */
    this.edit = function(id, 
                         template,
                         type, 
                         field,
                         value, 
                         onBlur){
        onBlur = onBlur === undefined ? false:true;
        
        this.ajaxRequestInProgress !== undefined && !onBlur ? this.ajaxRequestInProgress.abort():'';
        this.ajaxRequestTimeout !== undefined ? clearTimeout(this.ajaxRequestTimeout):'';
        
        switch (field){
            case 'name':
                $('#DOPBSP-email-ID-'+id+' .dopbsp-name').html(value === '' ? '&nbsp;':value);
                break;
        }
        
        if (onBlur){
            $.post(ajaxurl, {action: 'dopbsp_email_edit',
                             id: id,
                             template: template,
                             field: field,
                             value: value,
                             language: $('#DOPBSP-email-language').val()}, function(data){
                if (!onBlur){
                    DOPBSP.toggleMessages('success', DOPBSP.text('MESSAGES_SAVING_SUCCESS'));
                }
            }).fail(function(data){
                DOPBSP.toggleMessages('error', data.status+': '+data.statusText);
            });
        }
        else{
            DOPBSP.toggleMessages('active-info', DOPBSP.text('MESSAGES_SAVING'));

            this.ajaxRequestTimeout = setTimeout(function(){
                clearTimeout(this.ajaxRequestTimeout);

                this.ajaxRequestInProgress = $.post(ajaxurl, {action: 'dopbsp_email_edit',
                                                              id: id,
                                                              template: template,
                                                              field: field,
                                                              value: value,
                                                              language: $('#DOPBSP-email-language').val()}, function(data){
                    DOPBSP.toggleMessages('success', DOPBSP.text('MESSAGES_SAVING_SUCCESS'));
                }).fail(function(data){
                    DOPBSP.toggleMessages('error', data.status+': '+data.statusText);
                });
            }, 600);
        }
    };


    /*
     * Delete email.
     * 
     * @param id (Number): email ID
     */
    this.delete = function(id){
        DOPBSP.toggleMessages('active', DOPBSP.text('EMAILS_DELETE_EMAIL_DELETING'));

        $.post(ajaxurl, {action: 'dopbsp_email_delete', 
                         id: id}, function(data){
            DOPBSP.clearColumns(2);

            $('#DOPBSP-email-ID-'+id).stop(true, true)
                                      .animate({'opacity':0}, 
                                      600, function(){
                $(this).remove();

                if (data === '0'){
                    $('#DOPBSP-column1 .dopbsp-column-content').html('<ul><li class="dopbsp-no-data">'+DOPBSP.text('EMAILS_NO_EMAILS')+'</li></ul>');
                }
                DOPBSP.toggleMessages('success', DOPBSP.text('EMAILS_DELETE_EMAIL_SUCCESS'));
            });
        }).fail(function(data){
            DOPBSP.toggleMessages('error', data.status+': '+data.statusText);
        });
    };

    return this.__construct();
};